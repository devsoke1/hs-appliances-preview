<?php
/**
 * Core helpers shared by the form handlers, the JSON API and the admin panel:
 * config loading, private storage, logging, client IP and file-based rate limiting.
 * Requires PHP 8.1+.
 */
declare(strict_types=1);

if (!defined('HS_API')) {
    http_response_code(403);
    exit;
}


const HS_TIMEZONE = 'Europe/London';

function hs_default_config(): array
{
    return [
        // 'smtp' sends real email. 'log' writes .eml files to storage/mail (local testing only).
        'mail_transport' => 'smtp',
        'smtp' => [
            'host' => 'smtp.hostinger.com',
            'port' => 465,
            'secure' => 'ssl',
            'username' => '',
            'password' => '',
            'from_email' => '',
            'from_name' => 'HS Appliances Website',
        ],
        'business' => [
            'name' => 'House & Shop Appliances',
            'to_email' => 'house.shopappliances@gmail.com',
            'to_name' => 'House & Shop Appliances',
            'phone' => '07777 372586',
            'website' => 'https://hsappliances.co.uk',
        ],
        'send_customer_confirmation' => true,
        'recaptcha' => ['secret' => '', 'min_score' => 0.5],
        'allowed_origins' => ['https://hsappliances.co.uk'],
        'rate_limit' => ['max' => 5, 'window' => 600, 'global_max' => 60],
        'storage_dir' => '',
        'hash_salt' => '',
        // MySQL (Hostinger: host is "localhost"). 'dsn' overrides everything (used for local tests).
        'db' => [
            'dsn' => '',
            'host' => 'localhost',
            'port' => 3306,
            'name' => '',
            'user' => '',
            'pass' => '',
            'charset' => 'utf8mb4',
        ],
        'admin' => [
            'install_token' => '',        // required by install.php — remove after installing
            'session_idle_minutes' => 120,
            'max_login_attempts' => 5,
            'lockout_minutes' => 15,
        ],
        'api' => ['cache_seconds' => 300],
        // Where public pages live — used for "View" links in the admin and in API responses.
        'public_paths' => [
            'service' => '/services/{slug}/',
            'post' => '/insights/{slug}/',
        ],
    ];
}

/** Loads config, looking outside public_html first. Throws if none is found. */
function hs_config(): array
{
    static $config = null;
    if ($config !== null) {
        return $config;
    }
    $candidates = array_filter([
        getenv('HS_CONFIG') ?: null,
        dirname(__DIR__, 3) . '/private/config.php', // /home/uXXX/domains/hsappliances.co.uk/private/config.php
        dirname(__DIR__) . '/config.php',            // public_html/api/config.php (blocked by .htaccess)
    ]);
    foreach ($candidates as $path) {
        if (is_file($path)) {
            $loaded = require $path;
            if (is_array($loaded)) {
                $config = array_replace_recursive(hs_default_config(), $loaded);
                if (isset($loaded['allowed_origins']) && is_array($loaded['allowed_origins'])) {
                    $config['allowed_origins'] = array_values($loaded['allowed_origins']);
                }
                return $config;
            }
        }
    }
    error_log('[hs] config.php not found');
    throw new RuntimeException('Configuration file not found');
}

function hs_client_ip(): string
{
    // REMOTE_ADDR only: X-Forwarded-For is client-controlled and trivially spoofed.
    return (string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
}

function hs_ip_hash(): string
{
    return substr(hash('sha256', hs_client_ip() . '|' . hs_config()['hash_salt']), 0, 12);
}

function hs_is_https(): bool
{
    return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || strtolower((string) ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')) === 'https'
        || (string) ($_SERVER['SERVER_PORT'] ?? '') === '443';
}

/* ───────────────────────────── Storage / logging ───────────────────────────── */

/** Private writable directory (outside public_html when possible). */
function hs_storage(string $sub): string
{
    static $base = null;
    if ($base === null) {
        $configured = (string) hs_config()['storage_dir'];
        $private = dirname(__DIR__, 3) . '/private/hs-data';
        $fallback = dirname(__DIR__) . '/_data';
        foreach ($configured !== '' ? [$configured] : [$private, $fallback] as $dir) {
            if ((is_dir($dir) || @mkdir($dir, 0750, true)) && is_writable($dir)) {
                $base = $dir;
                break;
            }
        }
        if ($base === null) {
            throw new RuntimeException('No writable storage directory');
        }
        if ($base === $fallback && !is_file($base . '/.htaccess')) {
            @file_put_contents($base . '/.htaccess', "Require all denied\n<IfModule !mod_authz_core.c>\n  Deny from all\n</IfModule>\n");
        }
    }
    $dir = $base . '/' . $sub;
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
    }
    return $dir;
}

/** Logs operational events. Never log message content, passwords or contact details. */
function hs_log(string $message, string $file = 'api.log'): void
{
    $line = '[' . gmdate('Y-m-d H:i:s') . '] ' . preg_replace('/[\r\n]+/', ' ', $message) . "\n";
    try {
        @file_put_contents(hs_storage('logs') . '/' . $file, $line, FILE_APPEND | LOCK_EX);
    } catch (Throwable) {
        error_log('[hs] ' . $message);
    }
}

/* ───────────────────────────── Rate limiting ───────────────────────────── */

/**
 * Atomically updates a sliding-window counter file.
 * $mutate receives the in-window timestamps and returns [newTimestamps, result].
 */
function hs_counter(string $key, int $window, callable $mutate): mixed
{
    $dir = hs_storage('ratelimit');
    $file = $dir . '/' . hash('sha256', $key . '|' . hs_config()['hash_salt']) . '.json';
    $fh = @fopen($file, 'c+');
    if ($fh === false) {
        hs_log('Rate limit storage unavailable');
        return null;
    }
    try {
        flock($fh, LOCK_EX);
        $times = json_decode((string) stream_get_contents($fh), true);
        $now = time();
        $times = array_values(array_filter(is_array($times) ? $times : [], static fn ($t) => is_int($t) && $t > $now - $window));
        [$next, $result] = $mutate($times, $now);
        if ($next !== $times) {
            ftruncate($fh, 0);
            rewind($fh);
            fwrite($fh, json_encode($next));
            fflush($fh);
        }
        return $result;
    } finally {
        flock($fh, LOCK_UN);
        fclose($fh);
    }
}

/** Records a hit if under the limit. Returns true if allowed. Fails open if storage is unavailable. */
function hs_rate_hit(string $key, int $max, int $window): bool
{
    if ($max <= 0) {
        return true;
    }
    $allowed = hs_counter($key, $window, static function (array $t, int $now) use ($max) {
        if (count($t) >= $max) {
            return [$t, false];
        }
        $t[] = $now;
        return [$t, true];
    });
    if (random_int(1, 50) === 1) {
        hs_rate_cleanup(max($window, 3600));
    }
    return $allowed ?? true;
}

/** Number of attempts in the window (no change). */
function hs_attempts(string $key, int $window): int
{
    return (int) (hs_counter($key, $window, static fn (array $t) => [$t, count($t)]) ?? 0);
}

/** Seconds until the oldest attempt leaves the window. */
function hs_attempts_retry_after(string $key, int $window): int
{
    return (int) (hs_counter($key, $window, static fn (array $t, int $now) => [$t, $t ? max(1, $window - ($now - min($t))) : 0]) ?? 0);
}

function hs_attempts_add(string $key, int $window): void
{
    hs_counter($key, $window, static function (array $t, int $now) {
        $t[] = $now;
        return [$t, null];
    });
}

function hs_attempts_clear(string $key, int $window): void
{
    hs_counter($key, $window, static fn (array $t) => [[], null]);
}

function hs_rate_cleanup(int $maxAge): void
{
    foreach (glob(hs_storage('ratelimit') . '/*.json') ?: [] as $f) {
        if (@filemtime($f) < time() - 2 * $maxAge) {
            @unlink($f);
        }
    }
}

