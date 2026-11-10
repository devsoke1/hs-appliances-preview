<?php
/**
 * <head> for PHP pages. Set page([...]) before including. Mirrors the Next.js metadata
 * (title, description, absolute canonical, Open Graph, Twitter, icons, JSON-LD).
 * CSS is inlined (like the Next.js pages) so there's no render-blocking stylesheet request.
 */
declare(strict_types=1);

(static function (): void {

$p = page();
$b = biz();
$canonical = site_url($p['path']);
$image = $p['image'] ?? null;
$ogImage = $image ? site_url($image['url']) : site_url('/og/default.png');
$ogAlt = $image['alt'] ?? ($b['name'] . ' — appliance repair in Feltham & West London');
$css = @file_get_contents(PUBLIC_ROOT . '/assets/css/site.css') ?: '';
$gsc = site()['analytics']['gscVerification'] ?? '';

header('Content-Type: text/html; charset=utf-8');
if (!headers_sent() && http_response_code() === 200) {
    header('Cache-Control: public, max-age=0, must-revalidate');
}
?><!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= e($p['title']) ?></title>
<meta name="description" content="<?= e($p['description']) ?>">
<link rel="canonical" href="<?= e($canonical) ?>">
<?php if ($p['noindex']): ?><meta name="robots" content="noindex, follow">
<?php endif; ?>
<meta name="theme-color" content="#00243a">
<meta property="og:title" content="<?= e($p['title']) ?>">
<meta property="og:description" content="<?= e($p['description']) ?>">
<meta property="og:url" content="<?= e($canonical) ?>">
<meta property="og:site_name" content="<?= e($b['name']) ?>">
<meta property="og:locale" content="en_GB">
<meta property="og:image" content="<?= e($ogImage) ?>">
<meta property="og:image:alt" content="<?= e($ogAlt) ?>">
<meta property="og:type" content="<?= e($p['type']) ?>">
<?php if ($p['type'] === 'article' && $p['article']): ?>
<meta property="article:published_time" content="<?= e($p['article']['published']) ?>">
<meta property="article:modified_time" content="<?= e($p['article']['modified']) ?>">
<?php endif; ?>
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<?= e($p['title']) ?>">
<meta name="twitter:description" content="<?= e($p['description']) ?>">
<meta name="twitter:image" content="<?= e($ogImage) ?>">
<?php if ($gsc): ?><meta name="google-site-verification" content="<?= e($gsc) ?>">
<?php endif; ?>
<link rel="icon" href="/icon.svg" type="image/svg+xml" sizes="any">
<link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="preload" href="/fonts/plus-jakarta-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/source-sans-3-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<?php foreach ($p['preload'] as $pl): ?>
<link rel="preload" as="image" href="<?= e($pl['href']) ?>"<?= $pl['srcset'] ? ' imagesrcset="' . e($pl['srcset']) . '" imagesizes="' . e($pl['sizes']) . '"' : '' ?> fetchpriority="high">
<?php endforeach; ?>
<style><?= $css /* our own compiled Tailwind CSS */ ?></style>
<?= json_ld(site_graph()) ?>
<?php foreach ($p['jsonld'] as $ld): ?>
<?= json_ld($ld) ?>
<?php endforeach; ?>
</head>
<body class="pb-mobile-bar"<?= !empty(site()['analytics']['ga4']) ? ' data-ga4="' . e(site()['analytics']['ga4']) . '"' : '' ?>>
<a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-lg focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
<?php })();
