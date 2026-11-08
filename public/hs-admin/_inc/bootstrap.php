<?php
/**
 * Admin bootstrap — every admin page starts with:  require __DIR__ . '/_inc/bootstrap.php';
 * Sets security headers, error handling, the session, and loads helpers.
 * This folder is denied to the web by _inc/.htaccess.
 */
declare(strict_types=1);

define('HS_API', true);
define('HS_ADMIN', true);
define('ADMIN_ROOT', dirname(__DIR__));          // public_html/hs-admin
define('PUBLIC_ROOT', dirname(__DIR__, 2));      // public_html

require PUBLIC_ROOT . '/api/db.php';
require __DIR__ . '/helpers.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/layout.php';

ini_set('display_errors', '0');
error_reporting(E_ALL);
header_remove('X-Powered-By');
header('X-Robots-Tag: noindex, nofollow, noarchive');
header('Cache-Control: no-store, max-age=0');
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');

set_exception_handler(static function (Throwable $e): void {
    hs_log('Admin error ' . get_class($e) . ': ' . $e->getMessage() . ' @ ' . basename($e->getFile()) . ':' . $e->getLine(), 'admin.log');
    if (!headers_sent()) {
        http_response_code(500);
    }
    $msg = $e instanceof PDOException || str_contains($e->getMessage(), 'Database')
        ? 'Could not connect to the database. Check the db settings in config.php.'
        : 'Something went wrong. The error has been logged.';
    if (str_contains((string) ($_SERVER['HTTP_ACCEPT'] ?? ''), 'application/json')) {
        header('Content-Type: application/json');
        echo json_encode(['error' => $msg]);
        return;
    }
    echo '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Error</title>'
        . '<link rel="stylesheet" href="' . e(admin_url('assets/admin.css')) . '"><main class="auth"><div class="card"><h1>Error</h1><p>' . e($msg)
        . '</p><p><a href="' . e(admin_url('')) . '">Back to dashboard</a></p></div></main>';
});

admin_session_start();
