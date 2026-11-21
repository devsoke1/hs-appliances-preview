<?php
/**
 * Bootstrap for PHP-rendered public pages (/services/, /insights/, /sitemap.xml).
 * Every page starts with:  require dirname(__DIR__) . '/includes/bootstrap.php';
 * This folder is denied to the web by includes/.htaccess and the root .htaccess.
 */
declare(strict_types=1);

if (!defined('HS_API')) {
    define('HS_API', true);
}
if (!defined('PUBLIC_ROOT')) {
    define('PUBLIC_ROOT', dirname(__DIR__));
}

require_once PUBLIC_ROOT . '/api/db.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/schema.php';
require_once __DIR__ . '/components.php';

ini_set('display_errors', '0');
error_reporting(E_ALL);
header_remove('X-Powered-By');

set_exception_handler(static function (Throwable $e): void {
    hs_log('Site error ' . get_class($e) . ': ' . $e->getMessage() . ' @ ' . basename($e->getFile()) . ':' . $e->getLine(), 'site.log');
    if (!headers_sent()) {
        http_response_code(503);
        header('Retry-After: 120');
    }
    // Keep it simple and dependency-free: the database may be the thing that's down.
    $b = site()['business'] ?? ['name' => 'HS Appliances', 'phone' => ['display' => '07777 372586', 'e164' => '+447777372586']];
    echo '<!doctype html><html lang="en-GB"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">'
        . '<title>Temporarily unavailable</title><body style="font-family:system-ui,sans-serif;max-width:40rem;margin:4rem auto;padding:0 1rem;line-height:1.6;color:#0f1a2e">'
        . '<h1>Sorry — this page is temporarily unavailable</h1><p>Please try again in a few minutes, or call us on <a href="tel:' . e($b['phone']['e164']) . '">' . e($b['phone']['display']) . '</a>.</p>'
        . '<p><a href="/">Go to the homepage</a></p></body></html>';
});
