<?php
declare(strict_types=1);

if (!defined('HS_ADMIN')) {
    http_response_code(403);
    exit;
}

/** Escape for HTML output. Use on EVERYTHING printed that didn't come from purify_html(). */
function e(mixed $v): string
{
    return htmlspecialchars((string) ($v ?? ''), ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5, 'UTF-8');
}

function admin_url(string $path = ''): string
{
    return '/hs-admin/' . ltrim($path, '/');
}

function redirect(string $path): never
{
    header('Location: ' . (str_starts_with($path, '/') ? $path : admin_url($path)), true, 303);
    exit;
}

function is_post(): bool
{
    return ($_SERVER['REQUEST_METHOD'] ?? '') === 'POST';
}

/** Trimmed string from POST (arrays rejected), control characters removed except newlines in multi-line fields. */
function post_str(string $key, int $max = 1000, bool $multiline = false): string
{
    $v = $_POST[$key] ?? '';
    if (!is_string($v)) {
        return '';
    }
    $v = mb_scrub($v, 'UTF-8');
    $v = $multiline
        ? preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', str_replace(["\r\n", "\r"], "\n", $v))
        : preg_replace('/[\p{Cc}]+/u', ' ', $v);
    return mb_substr(trim((string) $v), 0, $max);
}

function post_int(string $key, int $default = 0): int
{
    $v = filter_var($_POST[$key] ?? null, FILTER_VALIDATE_INT);
    return $v === false || $v === null ? $default : $v;
}

function post_bool(string $key): int
{
    return !empty($_POST[$key]) ? 1 : 0;
}

function get_str(string $key, int $max = 200): string
{
    $v = $_GET[$key] ?? '';
    return is_string($v) ? mb_substr(trim($v), 0, $max) : '';
}

function get_int(string $key, int $default = 0): int
{
    $v = filter_var($_GET[$key] ?? null, FILTER_VALIDATE_INT);
    return $v === false || $v === null ? $default : $v;
}

/* ───────────── Flash messages ───────────── */

function flash(string $type, string $message): void
{
    $_SESSION['flash'][] = ['type' => $type, 'message' => $message];
}

function take_flashes(): array
{
    $f = $_SESSION['flash'] ?? [];
    unset($_SESSION['flash']);
    return $f;
}

/* ───────────── Slugs ───────────── */

function slugify(string $s): string
{
    $s = mb_strtolower(trim($s));
    $s = strtr($s, ['&' => ' and ', '£' => '', "'" => '', '’' => '']);
    if (function_exists('iconv')) {
        $t = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $s);
        if ($t !== false) {
            $s = $t;
        }
    }
    $s = preg_replace('/[^a-z0-9]+/', '-', $s) ?? '';
    return trim(substr(trim($s, '-'), 0, 120), '-');
}

function valid_slug(string $s): bool
{
    return (bool) preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $s) && strlen($s) <= 160;
}

/** Ensures a slug is unique in $table (excluding $id); appends -2, -3… if taken. */
function unique_slug(string $table, string $slug, int $id = 0): string
{
    if (!in_array($table, ['services', 'posts'], true)) {
        throw new InvalidArgumentException('bad table');
    }
    $base = $slug;
    for ($n = 2; db_value("SELECT COUNT(*) FROM $table WHERE slug = ? AND id <> ?", [$slug, $id]) > 0; $n++) {
        $slug = "$base-$n";
    }
    return $slug;
}

/**
 * Keeps slug_redirects consistent when a slug changes, so old URLs 301 instead of 404:
 *  - the new slug is live, so it must not redirect anywhere
 *  - existing redirects that pointed at the old slug now point at the new one (no chains)
 *  - old → new is recorded
 */
function record_slug_change(string $type, string $old, string $new): void
{
    if ($old === $new || $old === '') {
        return;
    }
    db_exec('DELETE FROM slug_redirects WHERE type = ? AND old_slug = ?', [$type, $new]);
    db_exec('UPDATE slug_redirects SET new_slug = ? WHERE type = ? AND new_slug = ?', [$new, $type, $old]);
    db_exec('DELETE FROM slug_redirects WHERE type = ? AND old_slug = ?', [$type, $old]);
    db_exec('INSERT INTO slug_redirects (type, old_slug, new_slug, created_at) VALUES (?, ?, ?, ?)', [$type, $old, $new, db_now()]);
}

/* ───────────── Dates (stored UTC, shown UK time) ───────────── */

function uk_tz(): DateTimeZone
{
    static $tz = null;
    return $tz ??= new DateTimeZone(HS_TIMEZONE);
}

/** UTC "Y-m-d H:i:s" → UK display string. */
function fmt_dt(?string $utc, string $format = 'j M Y, H:i'): string
{
    if (!$utc) {
        return '—';
    }
    return (new DateTimeImmutable($utc, new DateTimeZone('UTC')))->setTimezone(uk_tz())->format($format);
}

/** UTC → value for <input type="datetime-local"> in UK time. */
function to_local_input(?string $utc): string
{
    return $utc ? fmt_dt($utc, 'Y-m-d\TH:i') : '';
}

/** <input type="datetime-local"> (UK time) → UTC "Y-m-d H:i:s", or null if invalid. */
function from_local_input(string $v): ?string
{
    $d = DateTimeImmutable::createFromFormat('Y-m-d\TH:i', $v, uk_tz());
    if (!$d || $d->format('Y-m-d\TH:i') !== $v) {
        return null;
    }
    return $d->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d H:i:s');
}

/* ───────────── Misc ───────────── */

/** Normalises tags to "tag one, tag two" (dedupe, trim, max 12). */
function normalise_tags(string $tags): string
{
    $out = [];
    foreach (explode(',', $tags) as $t) {
        $t = trim(preg_replace('/\s+/', ' ', $t) ?? '');
        if ($t !== '' && !in_array(mb_strtolower($t), array_map('mb_strtolower', $out), true)) {
            $out[] = mb_substr($t, 0, 40);
        }
    }
    return implode(', ', array_slice($out, 0, 12));
}

/** Icon keys offered in the service form (lucide icon names used by the site). */
function service_icons(): array
{
    return ['WashingMachine', 'Refrigerator', 'Container', 'UtensilsCrossed', 'CookingPot', 'Zap', 'Flame', 'Microwave', 'AirVent', 'Warehouse', 'Milk', 'Store', 'Beer', 'Thermometer', 'Snowflake', 'Wrench'];
}

/** Deletes a previously uploaded file (only inside /uploads/). */
function delete_upload(?string $webPath): void
{
    if (!$webPath || !str_starts_with($webPath, '/uploads/') || str_contains($webPath, '..')) {
        return;
    }
    $file = PUBLIC_ROOT . $webPath;
    if (is_file($file)) {
        @unlink($file);
    }
}
