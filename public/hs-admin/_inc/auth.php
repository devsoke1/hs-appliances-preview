<?php
/**
 * Sessions, login/logout, CSRF.
 *
 * - Session cookie: HttpOnly, Secure (on HTTPS), SameSite=Lax, path /hs-admin/, strict mode
 * - Session ID regenerated on login and every 15 minutes; idle timeout from config
 * - Login rate limit: N failures (default 5) per IP OR per email → locked for M minutes (default 15)
 * - CSRF token required on every POST (forms and fetch uploads)
 */
declare(strict_types=1);

if (!defined('HS_ADMIN')) {
    http_response_code(403);
    exit;
}

function admin_session_start(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    $idle = max(5, (int) hs_config()['admin']['session_idle_minutes']) * 60;
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.use_trans_sid', '0');
    ini_set('session.cookie_httponly', '1');
    ini_set('session.gc_maxlifetime', (string) $idle);
    ini_set('session.gc_probability', '1');
    ini_set('session.gc_divisor', '100');
    // Keep admin sessions in private storage, away from the shared temp directory
    session_save_path(hs_storage('sessions'));
    session_name('hs_admin');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/hs-admin/',
        'secure' => hs_is_https(),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();

    $now = time();
    if (isset($_SESSION['last_seen']) && $now - (int) $_SESSION['last_seen'] > $idle) {
        $_SESSION = [];
        session_regenerate_id(true);
        $_SESSION['flash'][] = ['type' => 'info', 'message' => 'You were signed out after a period of inactivity.'];
    }
    $_SESSION['last_seen'] = $now;
    if (!isset($_SESSION['regenerated_at']) || $now - (int) $_SESSION['regenerated_at'] > 900) {
        session_regenerate_id(true);
        $_SESSION['regenerated_at'] = $now;
    }
}

/* ───────────── CSRF ───────────── */

function csrf_token(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function csrf_field(): string
{
    return '<input type="hidden" name="csrf" value="' . e(csrf_token()) . '">';
}

/** Validates the CSRF token (form field or X-CSRF-Token header) and same-origin. Call on every POST. */
function csrf_check(): void
{
    $sent = $_POST['csrf'] ?? ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
    $ok = is_string($sent) && !empty($_SESSION['csrf']) && hash_equals($_SESSION['csrf'], $sent);

    // Defence in depth: reject cross-site Origin headers
    $origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
    if ($ok && $origin !== '') {
        $host = parse_url($origin, PHP_URL_HOST);
        $ok = is_string($host) && strcasecmp($host, (string) parse_url('//' . ($_SERVER['HTTP_HOST'] ?? ''), PHP_URL_HOST)) === 0;
    }
    if (!$ok) {
        hs_log('CSRF check failed from ' . hs_ip_hash(), 'admin.log');
        http_response_code(400);
        if (str_contains((string) ($_SERVER['HTTP_ACCEPT'] ?? ''), 'application/json')) {
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Your session expired. Reload the page and try again.']);
            exit;
        }
        echo '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Session expired</title>'
            . '<link rel="stylesheet" href="/hs-admin/assets/admin.css"><main class="auth"><div class="card"><h1>Session expired</h1>'
            . '<p>For your security, this form expired. Go back, reload the page and try again.</p><p><a href="/hs-admin/">Dashboard</a></p></div></main>';
        exit;
    }
}

/* ───────────── Auth ───────────── */

function current_admin(): ?array
{
    static $user = false;
    if ($user !== false) {
        return $user;
    }
    $id = (int) ($_SESSION['admin_id'] ?? 0);
    $user = $id ? db_one('SELECT id, email, last_login FROM admin_users WHERE id = ?', [$id]) : null;
    return $user;
}

function require_admin(): array
{
    $u = current_admin();
    if (!$u) {
        $next = (string) ($_SERVER['REQUEST_URI'] ?? '/hs-admin/');
        redirect('login.php' . (str_starts_with($next, '/hs-admin/') ? '?next=' . rawurlencode($next) : ''));
    }
    return $u;
}

function login_window(): int
{
    return max(1, (int) hs_config()['admin']['lockout_minutes']) * 60;
}

/** Minutes remaining if locked out, else 0. */
function login_locked_minutes(string $email): int
{
    $max = max(1, (int) hs_config()['admin']['max_login_attempts']);
    $w = login_window();
    $wait = 0;
    foreach (login_keys($email) as $key) {
        if (hs_attempts($key, $w) >= $max) {
            $wait = max($wait, hs_attempts_retry_after($key, $w));
        }
    }
    return (int) ceil($wait / 60);
}

function login_keys(string $email): array
{
    return ['admin-login|ip|' . hs_client_ip(), 'admin-login|email|' . mb_strtolower(trim($email))];
}

/** Returns null on success, or an error message. */
function attempt_login(string $email, string $password): ?string
{
    $email = mb_strtolower(trim($email));
    if ($locked = login_locked_minutes($email)) {
        return "Too many failed attempts. Try again in {$locked} minute" . ($locked === 1 ? '' : 's') . '.';
    }
    $user = db_one('SELECT id, password_hash FROM admin_users WHERE email = ?', [$email]);
    // Verify against a dummy hash when the user doesn't exist, so timing doesn't reveal valid emails
    $hash = $user['password_hash'] ?? password_hash(bin2hex(random_bytes(16)), PASSWORD_DEFAULT);
    $ok = password_verify($password, $hash) && $user !== null;

    if (!$ok) {
        foreach (login_keys($email) as $key) {
            hs_attempts_add($key, login_window());
        }
        hs_log('Failed admin login from ' . hs_ip_hash(), 'admin.log');
        $left = login_locked_minutes($email);
        return $left ? "Too many failed attempts. Try again in {$left} minutes." : 'Incorrect email or password.';
    }

    foreach (login_keys($email) as $key) {
        hs_attempts_clear($key, login_window());
    }
    if (password_needs_rehash($user['password_hash'], PASSWORD_DEFAULT)) {
        db_exec('UPDATE admin_users SET password_hash = ? WHERE id = ?', [password_hash($password, PASSWORD_DEFAULT), $user['id']]);
    }
    session_regenerate_id(true);
    $_SESSION = ['admin_id' => (int) $user['id'], 'last_seen' => time(), 'regenerated_at' => time()];
    csrf_token();
    db_exec('UPDATE admin_users SET last_login = ? WHERE id = ?', [db_now(), $user['id']]);
    hs_log('Admin login ok from ' . hs_ip_hash(), 'admin.log');
    return null;
}

function logout(): void
{
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', ['expires' => time() - 3600, 'path' => $p['path'], 'secure' => $p['secure'], 'httponly' => true, 'samesite' => 'Lax']);
    }
    session_destroy();
}
