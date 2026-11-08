<?php
/**
 * Database access — PDO with prepared statements ONLY (real server-side prepares, no emulation).
 * Never interpolate values into SQL: always pass them as parameters.
 *
 * Credentials come from config.php (outside public_html; see docs/admin-setup.md).
 * Not web-accessible: guarded below and denied by api/.htaccess.
 */
declare(strict_types=1);

if (!defined('HS_API')) {
    http_response_code(403);
    exit;
}

require_once __DIR__ . '/_lib/core.php';

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }
    $c = hs_config()['db'];
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_STRINGIFY_FETCHES => false,
    ];
    if ((string) $c['dsn'] !== '') {
        // Explicit DSN (e.g. SQLite for local tests)
        $pdo = new PDO((string) $c['dsn'], $c['user'] !== '' ? (string) $c['user'] : null, $c['pass'] !== '' ? (string) $c['pass'] : null, $options);
    } else {
        if ((string) $c['name'] === '' || (string) $c['user'] === '') {
            throw new RuntimeException('Database is not configured (db.name / db.user in config.php)');
        }
        $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=%s', $c['host'], (int) $c['port'], $c['name'], $c['charset']);
        $pdo = new PDO($dsn, (string) $c['user'], (string) $c['pass'], $options);
        // All timestamps are stored in UTC and converted to UK time for display
        $pdo->exec("SET time_zone = '+00:00'");
    }
    if ($pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite') {
        $pdo->exec('PRAGMA foreign_keys = ON');
    }
    return $pdo;
}

/** Prepares and executes with typed bindings (ints → PARAM_INT so LIMIT ? works). */
function db_query(string $sql, array $params = []): PDOStatement
{
    $stmt = db()->prepare($sql);
    foreach (array_values(array_is_list($params) ? $params : []) as $i => $v) {
        $stmt->bindValue($i + 1, $v, db_param_type($v));
    }
    if (!array_is_list($params)) {
        foreach ($params as $k => $v) {
            $stmt->bindValue(is_string($k) && $k[0] !== ':' ? ":$k" : $k, $v, db_param_type($v));
        }
    }
    $stmt->execute();
    return $stmt;
}

function db_param_type(mixed $v): int
{
    return match (true) {
        is_int($v) => PDO::PARAM_INT,
        is_bool($v) => PDO::PARAM_INT,
        $v === null => PDO::PARAM_NULL,
        default => PDO::PARAM_STR,
    };
}

function db_all(string $sql, array $params = []): array
{
    return db_query($sql, $params)->fetchAll();
}

function db_one(string $sql, array $params = []): ?array
{
    $row = db_query($sql, $params)->fetch();
    return $row === false ? null : $row;
}

function db_value(string $sql, array $params = []): mixed
{
    $v = db_query($sql, $params)->fetchColumn();
    return $v === false ? null : $v;
}

function db_exec(string $sql, array $params = []): int
{
    return db_query($sql, $params)->rowCount();
}

/** Current time in UTC as a DATETIME string (we pass "now" from PHP so SQL stays portable). */
function db_now(): string
{
    return gmdate('Y-m-d H:i:s');
}

/** All settings as key => value. */
function settings_all(): array
{
    static $cache = null;
    if ($cache === null) {
        $cache = [];
        foreach (db_all('SELECT setting_key, setting_value FROM settings') as $r) {
            $cache[$r['setting_key']] = (string) $r['setting_value'];
        }
    }
    return $cache;
}

function setting(string $key, string $default = ''): string
{
    return settings_all()[$key] ?? $default;
}

/** Public URL path for a service/post, from config public_paths. */
function public_path(string $type, string $slug): string
{
    $pattern = hs_config()['public_paths'][$type] ?? '/{slug}/';
    return str_replace('{slug}', rawurlencode($slug), $pattern);
}

function json_list(?string $json): array
{
    if ($json === null || $json === '') {
        return [];
    }
    $v = json_decode($json, true);
    return is_array($v) ? $v : [];
}
