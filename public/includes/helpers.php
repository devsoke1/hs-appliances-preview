<?php
declare(strict_types=1);

if (!defined('HS_API')) {
    http_response_code(403);
    exit;
}

/* ───────────── Shared data (exported from the TypeScript sources at build time) ───────────── */

function site(): array
{
    static $site = null;
    if ($site === null) {
        $file = __DIR__ . '/generated/site.json';
        $site = is_file($file) ? (json_decode((string) file_get_contents($file), true) ?: []) : [];
    }
    return $site;
}

function biz(): array
{
    return site()['business'] ?? [];
}

/** Escape for HTML. Use on everything except HTML already sanitised by HTMLPurifier. */
function e(mixed $v): string
{
    return htmlspecialchars((string) ($v ?? ''), ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5, 'UTF-8');
}

function cn(string ...$classes): string
{
    return trim(implode(' ', array_filter($classes, static fn ($c) => $c !== '')));
}

function tel_href(): string
{
    return 'tel:' . (biz()['phone']['e164'] ?? '');
}

function mail_href(): string
{
    return 'mailto:' . (biz()['email'] ?? '');
}

function site_url(string $path = '/'): string
{
    return rtrim((string) (biz()['url'] ?? 'https://hsappliances.co.uk'), '/') . $path;
}

/** Lucide icon (inner SVG exported from lucide-react at build time). */
function icon(string $name, string $class = 'size-5', float $stroke = 2): string
{
    static $icons = null;
    if ($icons === null) {
        $file = __DIR__ . '/generated/icons.json';
        $icons = is_file($file) ? (json_decode((string) file_get_contents($file), true) ?: []) : [];
    }
    $inner = $icons[$name] ?? $icons['Wrench'] ?? '';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' . $stroke
        . '" stroke-linecap="round" stroke-linejoin="round" class="' . e($class) . '" aria-hidden="true">' . $inner . '</svg>';
}

/* ───────────── Buttons (identical to src/components/ui/Button.tsx) ───────────── */

function btn_class(string $variant = 'primary', string $size = 'md', string $extra = ''): string
{
    $base = 'inline-flex items-center justify-center gap-2 rounded-lg font-display font-bold whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-50';
    $variants = [
        'primary' => 'bg-accent-600 text-white shadow-[0_1px_0_rgb(0_0_0/0.08),0_6px_16px_-6px_rgb(255_106_31/0.6)] hover:bg-accent-700',
        'secondary' => 'bg-navy-900 text-white hover:bg-navy-700',
        'outline' => 'border-2 border-navy-900/15 bg-white text-navy-900 hover:border-navy-900/40',
        'outline-light' => 'border-2 border-white/25 text-white hover:border-white/60 hover:bg-white/5',
        'ghost' => 'text-navy-900 hover:bg-navy-900/5',
    ];
    $sizes = ['sm' => 'h-10 px-4 text-sm', 'md' => 'h-12 px-5 text-[0.9375rem]', 'lg' => 'h-14 px-7 text-base'];
    return cn($base, $variants[$variant] ?? $variants['primary'], $sizes[$size] ?? $sizes['md'], $extra);
}

/* ───────────── Images ───────────── */

/** Path of the closest generated width for a pipeline image name. */
function img_path(string $name, int $want = 800): string
{
    $m = site()['images'][$name] ?? null;
    if (!$m) {
        return '';
    }
    foreach ($m['widths'] as $w) {
        if ($w >= $want) {
            return "/images/{$name}-{$w}.webp";
        }
    }
    return "/images/{$name}-" . end($m['widths']) . '.webp';
}

/**
 * <img> for a path from the DB/pipeline. "/images/{name}-{w}.webp" gets a full srcset + intrinsic size;
 * admin uploads ("/uploads/…") render as a plain lazy image. Parent sets the aspect ratio (no layout shift).
 */
function img(string $src, string $alt, string $sizes = '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw', bool $priority = false, string $class = ''): string
{
    $attrs = '';
    if (preg_match('#^/images/(.+)-(\d+)\.webp$#', $src, $m) && ($entry = site()['images'][$m[1]] ?? null)) {
        $set = implode(', ', array_map(static fn ($w) => "/images/{$m[1]}-{$w}.webp {$w}w", $entry['widths']));
        $attrs = ' srcset="' . e($set) . '" sizes="' . e($sizes) . '" width="' . (int) $entry['width'] . '" height="' . (int) $entry['height'] . '"';
    }
    return '<img src="' . e($src) . '"' . $attrs . ' alt="' . e($alt) . '" loading="' . ($priority ? 'eager' : 'lazy') . '" decoding="async"'
        . ($priority ? ' fetchpriority="high"' : '') . ' class="' . e(cn('h-full w-full object-cover', $class)) . '">';
}

/* ───────────── Data ───────────── */

/** Active services (summary + content), sort order — cached per request. */
function active_services(): array
{
    static $rows = null;
    return $rows ??= db_all('SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC, name ASC');
}

function services_by_category(string $category): array
{
    return array_values(array_filter(active_services(), static fn ($s) => $s['category'] === $category));
}

function service_label(array $s): string
{
    return (string) ($s['menu_label'] ?: $s['name']);
}

function service_url(string $slug): string
{
    return public_path('service', $slug);
}

function post_url(string $slug): string
{
    return public_path('post', $slug);
}

/** UTC "Y-m-d H:i:s" → UK-formatted date. */
function fmt_date(?string $utc, string $format = 'j F Y'): string
{
    if (!$utc) {
        return '';
    }
    return (new DateTimeImmutable($utc, new DateTimeZone('UTC')))->setTimezone(new DateTimeZone(HS_TIMEZONE))->format($format);
}

function iso_date(?string $utc): string
{
    return $utc ? str_replace(' ', 'T', $utc) . 'Z' : '';
}

function reading_minutes(string $html): int
{
    return max(1, (int) round(str_word_count(strip_tags($html)) / 220));
}

/** Matches src/data/seo.ts → serviceTitle(): first candidate ≤ 60 chars. */
function service_meta_title(array $s): string
{
    if (!empty($s['meta_title'])) {
        return (string) $s['meta_title'];
    }
    $brand = site()['business']['shortName'] ?? 'HS Appliances';
    $base = service_label($s) . ' Repair ' . (site()['business']['address']['locality'] ?? 'Feltham');
    $candidates = array_filter([
        !empty(site()['seo']['sameDayInTitles']) ? "$base | Same-Day | $brand" : null,
        "$base | $brand",
        service_label($s) . " Repair | $brand",
    ]);
    foreach ($candidates as $c) {
        if (mb_strlen($c) <= 60) {
            return $c;
        }
    }
    return end($candidates);
}

function meta_description(string $text, int $max = 155): string
{
    $text = trim(preg_replace('/\s+/', ' ', strip_tags($text)) ?? '');
    return mb_strlen($text) <= $max ? $text : rtrim(mb_substr($text, 0, $max - 1), " ,.;:") . '…';
}

/* ───────────── Responses ───────────── */

function redirect_301(string $location): never
{
    header('Location: ' . $location, true, 301);
    header('Cache-Control: public, max-age=3600');
    exit;
}

/** Real 404 status + the site's 404 page. */
function not_found(): never
{
    http_response_code(404);
    header('Cache-Control: no-cache');
    page([
        'title' => 'Page Not Found | ' . (biz()['shortName'] ?? 'HS Appliances'),
        'description' => 'The page you were looking for could not be found.',
        'path' => (string) parse_url((string) ($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH),
        'noindex' => true,
    ]);
    require __DIR__ . '/head.php';
    require __DIR__ . '/header.php';
    render_404_body();
    require __DIR__ . '/footer.php';
    exit;
}

/** Ensures the request uses the pretty URL (e.g. not /services/service.php?slug=x). */
function canonical_redirect(string $prettyPath): void
{
    $uri = (string) ($_SERVER['REQUEST_URI'] ?? '');
    $path = (string) parse_url($uri, PHP_URL_PATH);
    if ($path !== $prettyPath) {
        $q = parse_url($uri, PHP_URL_QUERY);
        parse_str((string) $q, $params);
        unset($params['slug']);
        redirect_301($prettyPath . ($params ? '?' . http_build_query($params) : ''));
    }
}

/* ───────────── Page state for <head> ───────────── */

function page(?array $set = null): array
{
    static $page = [
        'title' => '',
        'description' => '',
        'path' => '/',
        'image' => null,          // ['url' => '/images/x.webp', 'alt' => '…', 'width' => 1200, 'height' => 630]
        'type' => 'website',
        'article' => null,        // ['published' => ISO, 'modified' => ISO]
        'noindex' => false,
        'jsonld' => [],
        'preload' => [],          // [['href' => …, 'srcset' => …, 'sizes' => …]]
    ];
    if ($set !== null) {
        $page = array_merge($page, $set);
    }
    return $page;
}

/** Adds a JSON-LD block to the page head. */
function add_jsonld(array $data): void
{
    $p = page();
    $p['jsonld'][] = $data;
    page(['jsonld' => $p['jsonld']]);
}

/** Preloads the LCP image (pipeline images get srcset/sizes). */
function preload_image(string $src, string $sizes): void
{
    $item = ['href' => $src, 'srcset' => '', 'sizes' => ''];
    if (preg_match('#^/images/(.+)-(\d+)\.webp$#', $src, $m) && ($entry = site()['images'][$m[1]] ?? null)) {
        $item['srcset'] = implode(', ', array_map(static fn ($w) => "/images/{$m[1]}-{$w}.webp {$w}w", $entry['widths']));
        $item['sizes'] = $sizes;
    }
    $p = page();
    $p['preload'][] = $item;
    page(['preload' => $p['preload']]);
}

function current_path(): string
{
    return (string) parse_url((string) ($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH);
}
