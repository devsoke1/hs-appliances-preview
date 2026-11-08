<?php
/**
 * Helpers for the read-only JSON API (services.php, reviews.php, posts.php).
 */
declare(strict_types=1);

if (!defined('HS_API')) {
    http_response_code(403);
    exit;
}

require_once dirname(__DIR__) . '/db.php';

function api_boot(): void
{
    ini_set('display_errors', '0');
    error_reporting(E_ALL);
    header_remove('X-Powered-By');
    set_exception_handler(static function (Throwable $e): void {
        hs_log('API error ' . get_class($e) . ': ' . $e->getMessage() . ' @ ' . basename($e->getFile()) . ':' . $e->getLine());
        api_error(500, 'Server error');
    });
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if ($method !== 'GET' && $method !== 'HEAD') {
        header('Allow: GET, HEAD');
        api_error(405, 'Method not allowed');
    }
}

function api_error(int $status, string $message, array $extra = []): never
{
    if (!headers_sent()) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        header('X-Content-Type-Options: nosniff');
        header('X-Robots-Tag: noindex');
    }
    echo json_encode(['error' => $message] + $extra, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Sends JSON with caching: Cache-Control (public, short max-age + stale-while-revalidate)
 * and a strong ETag so unchanged responses come back as 304 Not Modified.
 */
function api_respond(array $data, ?int $maxAge = null): never
{
    $maxAge ??= (int) hs_config()['api']['cache_seconds'];
    $body = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    $etag = '"' . substr(hash('sha256', (string) $body), 0, 32) . '"';

    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: public, max-age=' . $maxAge . ', stale-while-revalidate=' . ($maxAge * 2));
    header('ETag: ' . $etag);
    header('Vary: Accept-Encoding');
    header('X-Content-Type-Options: nosniff');
    header('X-Robots-Tag: noindex');

    $ifNoneMatch = trim((string) ($_SERVER['HTTP_IF_NONE_MATCH'] ?? ''));
    if ($ifNoneMatch !== '' && in_array($etag, array_map('trim', explode(',', $ifNoneMatch)), true)) {
        http_response_code(304);
        exit;
    }
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'HEAD') {
        echo $body;
    }
    exit;
}

function api_int(string $key, int $default, int $min, int $max): int
{
    $v = filter_input(INPUT_GET, $key, FILTER_VALIDATE_INT);
    if ($v === null || $v === false) {
        return $default;
    }
    return max($min, min($max, $v));
}

function api_slug(string $key = 'slug'): ?string
{
    $v = $_GET[$key] ?? null;
    if (!is_string($v) || $v === '') {
        return null;
    }
    if (!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $v) || strlen($v) > 160) {
        api_error(400, 'Invalid slug');
    }
    return $v;
}

/** Looks up an old slug → new slug (after a rename). */
function api_redirect_for(string $type, string $slug): ?string
{
    $new = db_value('SELECT new_slug FROM slug_redirects WHERE type = ? AND old_slug = ?', [$type, $slug]);
    return is_string($new) ? $new : null;
}
