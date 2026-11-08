<?php
/**
 * LOCAL TESTING ONLY — router for PHP's built-in server that emulates public/.htaccess, so the whole
 * site (static export + PHP pages + API + admin) runs locally:
 *   npm run build && npm run serve:php        → http://localhost:8080
 * Adds gzip like the real host so Lighthouse numbers are realistic.
 */
declare(strict_types=1);

$root = rtrim((string) $_SERVER['DOCUMENT_ROOT'], '/\\');
$uri = (string) parse_url((string) $_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = rawurldecode($uri);
$query = (string) parse_url((string) $_SERVER['REQUEST_URI'], PHP_URL_QUERY);

$send404 = static function () use ($root): never {
    http_response_code(404);
    header('Content-Type: text/html; charset=utf-8');
    readfile($root . '/404.html');
    exit;
};
$redirect = static function (string $to): never {
    header('Location: ' . $to, true, 301);
    exit;
};
$gzipOk = str_contains((string) ($_SERVER['HTTP_ACCEPT_ENCODING'] ?? ''), 'gzip');

/* 1. Blocked paths (same as .htaccess section 1) */
if (preg_match('#(^|/)\.(?!well-known/)#', $uri)
    || preg_match('#^/(api/_(lib|data)|hs-admin/_inc|includes)(/|$)#', $uri)
    || preg_match('#^/api/db\.php$#', $uri)
    || preg_match('#(^|/)config(\.example)?\.php$#', $uri)
    || preg_match('#\.(env|ini|log|sh|sql|bak|md|ts|tsx|map)$#i', $uri)
    || (str_starts_with($uri, '/uploads/') && !preg_match('#\.(webp|jpe?g|png)$#i', $uri))) {
    http_response_code(403);
    exit('Forbidden');
}

/* 2. Renamed pages */
if (preg_match('#^/faqs/?$#', $uri)) {
    $redirect('/faq/');
}
if (preg_match('#^/blog/?$#', $uri)) {
    $redirect('/insights/');
}
if (preg_match('#^/blog/(.+?)/?$#', $uri, $m)) {
    $redirect('/insights/' . $m[1] . '/');
}

/* 3. PHP-rendered pages */
$runPhp = static function (string $script, array $get = []) use ($root, $gzipOk): void {
    $_GET = array_merge($_GET, $get);
    $_SERVER['SCRIPT_NAME'] = '/' . ltrim(str_replace('\\', '/', substr($script, strlen($root))), '/');
    $_SERVER['SCRIPT_FILENAME'] = $script;
    chdir(dirname($script));
    if ($gzipOk) {
        ob_start('ob_gzhandler');
    }
    require $script;
    exit;
};
if ($uri === '/sitemap.xml') {
    $runPhp($root . '/sitemap.php');
}
if (preg_match('#^/(services|insights)$#', $uri)) {
    $redirect($uri . '/');
}
if (preg_match('#^/(services|insights)/([a-z0-9-]+)$#', $uri)) {
    $redirect($uri . '/' . ($query !== '' ? '?' . $query : ''));
}
if ($uri === '/services/') {
    $runPhp($root . '/services/index.php');
}
if (preg_match('#^/services/([a-z0-9-]+)/$#', $uri, $m)) {
    $runPhp($root . '/services/service.php', ['slug' => $m[1]]);
}
if ($uri === '/insights/') {
    $runPhp($root . '/insights/index.php');
}
if (preg_match('#^/insights/([a-z0-9-]+)/$#', $uri, $m)) {
    $runPhp($root . '/insights/post.php', ['slug' => $m[1]]);
}

/* 4. Static files and folders */
$path = $root . $uri;
if (is_dir($path)) {
    if (!str_ends_with($uri, '/')) {
        if (is_file($path . '/index.html') || is_file($path . '/index.php')) {
            $redirect($uri . '/');
        }
        $send404();
    }
    if (is_file($path . 'index.php')) {
        $runPhp($path . 'index.php');
    }
    $path .= 'index.html';
}
if (!is_file($path)) {
    $send404();
}
if (str_ends_with($path, '.php')) {
    $runPhp($path);
}

$types = [
    'html' => 'text/html; charset=utf-8', 'txt' => 'text/plain; charset=utf-8', 'css' => 'text/css', 'js' => 'application/javascript',
    'json' => 'application/json', 'xml' => 'application/xml', 'svg' => 'image/svg+xml', 'webmanifest' => 'application/manifest+json',
    'webp' => 'image/webp', 'png' => 'image/png', 'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'ico' => 'image/x-icon', 'woff2' => 'font/woff2',
];
$ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
header('Content-Type: ' . ($types[$ext] ?? 'application/octet-stream'));
header('Cache-Control: ' . (in_array($ext, ['js', 'css', 'woff2'], true) ? 'public, max-age=31536000, immutable' : (in_array($ext, ['webp', 'png', 'jpg', 'jpeg'], true) ? 'public, max-age=2592000' : 'no-cache')));
if ($gzipOk && in_array($ext, ['html', 'txt', 'css', 'js', 'json', 'xml', 'svg', 'webmanifest'], true)) {
    $body = gzencode((string) file_get_contents($path), 6);
    header('Content-Encoding: gzip');
    header('Content-Length: ' . strlen($body));
    echo $body;
} else {
    header('Content-Length: ' . filesize($path));
    readfile($path);
}
