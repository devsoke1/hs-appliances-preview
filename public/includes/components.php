<?php
/**
 * PHP versions of the React components. Keep class names IDENTICAL to the .tsx files so both halves
 * of the site look the same (one Tailwind build scans both).
 */
declare(strict_types=1);

if (!defined('HS_API')) {
    http_response_code(403);
    exit;
}

const CONTAINER = 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8';
const MOBILE_SCROLLER = '-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden';

function logo_html(bool $light = false): string
{
    return '<a href="/" class="group inline-flex min-h-11 items-center gap-2.5">'
        . '<svg viewBox="0 0 40 40" class="size-10 shrink-0" aria-hidden="true">'
        . '<rect width="40" height="40" rx="9" class="' . ($light ? 'fill-white' : 'fill-navy-900') . '"></rect>'
        . '<path d="M11 11v18M11 20h9M20 11v18" class="' . ($light ? 'stroke-navy-900' : 'stroke-white') . '" stroke-width="3.2" stroke-linecap="round" fill="none"></path>'
        . '<path d="M29.5 13.5c-1.6-1.4-4.6-1.3-5 .9-.5 2.6 5.6 2.6 5.6 6.4 0 3.2-4.3 3.9-6.4 1.9" class="stroke-accent-500" stroke-width="3" stroke-linecap="round" fill="none"></path>'
        . '<rect x="9.5" y="32" width="21" height="2.4" rx="1.2" class="fill-accent-500"></rect></svg>'
        . '<span class="flex flex-col leading-none">'
        . '<span class="font-display text-[1.1875rem] font-extrabold tracking-tight ' . ($light ? 'text-white' : 'text-navy-900') . '">HS Appliances</span>'
        . '<span class="mt-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] ' . ($light ? 'text-white/60' : 'text-muted') . '">House &amp; Shop</span>'
        . '</span></a>';
}

function eyebrow(string $text, string $tone = 'light'): string
{
    return '<p class="mb-3 inline-flex items-center gap-2 font-display text-[0.8125rem] font-bold uppercase tracking-[0.12em] ' . ($tone === 'dark' ? 'text-brand-200' : 'text-brand-600') . '">'
        . '<span aria-hidden="true" class="h-0.5 w-5 rounded-full bg-accent-600"></span>' . e($text) . '</p>';
}

function section_open(string $tone = 'white', string $class = '', string $id = ''): string
{
    $tones = ['white' => 'bg-white', 'mist' => 'bg-mist', 'navy' => 'bg-navy-900 text-white/80 [&_h2]:text-white [&_h3]:text-white'];
    return '<section' . ($id ? ' id="' . e($id) . '"' : '') . ' class="' . e(cn('py-12 sm:py-20 lg:py-24', $tones[$tone] ?? $tones['white'], $class)) . '"><div class="' . CONTAINER . '">';
}

function section_close(): string
{
    return '</div></section>';
}

function section_header(string $eyebrowText, string $title, string $intro = '', string $align = 'left', string $tone = 'light', string $actionHtml = ''): string
{
    $outer = cn('mb-10 flex flex-col gap-6 lg:mb-14', $align === 'center' ? 'items-center text-center' : 'lg:flex-row lg:items-end lg:justify-between');
    return '<div class="' . $outer . '"><div class="' . cn('max-w-2xl', $align === 'center' ? 'mx-auto' : '') . '">'
        . ($eyebrowText !== '' ? eyebrow($eyebrowText, $tone) : '')
        . '<h2 class="text-h2">' . e($title) . '</h2>'
        . ($intro !== '' ? '<p class="text-lead mt-4 ' . ($tone === 'dark' ? 'text-white/70' : 'text-muted') . '">' . e($intro) . '</p>' : '')
        . '</div>' . ($actionHtml !== '' ? '<div class="shrink-0">' . $actionHtml . '</div>' : '') . '</div>';
}

/** @param array<int,array{label:string,href?:string}> $items (Home is prepended) */
function breadcrumb(array $items): string
{
    $all = array_merge([['label' => 'Home', 'href' => '/']], $items);
    $html = '<nav aria-label="Breadcrumb" class="text-sm"><ol class="flex flex-wrap items-center gap-x-1.5 gap-y-1">';
    foreach ($all as $i => $c) {
        $last = $i === count($all) - 1;
        $html .= '<li class="flex items-center gap-1.5">';
        $html .= !empty($c['href']) && !$last
            ? '<a href="' . e($c['href']) . '" class="-my-3 inline-block min-w-11 py-3 text-center transition-colors text-white/75 hover:text-white">' . e($c['label']) . '</a>'
            : '<span' . ($last ? ' aria-current="page"' : '') . ' class="font-semibold text-white">' . e($c['label']) . '</span>';
        if (!$last) {
            $html .= icon('ChevronRight', 'size-3.5 text-white/40');
        }
        $html .= '</li>';
    }
    return $html . '</ol></nav>' . json_ld(breadcrumb_schema($all));
}

function page_hero(array $crumbs, string $eyebrowText, string $title, string $intro = '', string $childrenHtml = '', string $asideHtml = ''): string
{
    return '<section class="relative overflow-hidden bg-navy-900 bg-blueprint text-white">'
        . '<div aria-hidden="true" class="pointer-events-none absolute -top-48 -right-32 size-[30rem] rounded-full bg-brand-600/20 blur-3xl"></div>'
        . '<div class="' . CONTAINER . ' relative py-8 sm:py-14 lg:py-16">' . breadcrumb($crumbs)
        . '<div class="' . cn('mt-6 grid gap-8 sm:mt-8 lg:gap-10', $asideHtml !== '' ? 'lg:grid-cols-12 lg:items-center' : '') . '">'
        . '<div class="' . ($asideHtml !== '' ? 'lg:col-span-7' : 'max-w-3xl') . '">'
        . ($eyebrowText !== '' ? eyebrow($eyebrowText, 'dark') : '')
        . '<h1 class="text-h1 text-white">' . e($title) . '</h1>'
        . ($intro !== '' ? '<p class="text-lead mt-5 max-w-2xl text-white/75">' . e($intro) . '</p>' : '')
        . ($childrenHtml !== '' ? '<div class="mt-8">' . $childrenHtml . '</div>' : '')
        . '</div>' . ($asideHtml !== '' ? '<div class="lg:col-span-5">' . $asideHtml . '</div>' : '') . '</div></div></section>';
}

function trust_list(string $tone = 'dark', string $class = ''): string
{
    $html = '<ul class="' . e(cn('grid grid-cols-2 gap-x-4 gap-y-2.5 text-[0.9375rem] sm:gap-x-6 sm:text-base', $class)) . '">';
    foreach (site()['trustPoints'] ?? [] as $t) {
        $html .= '<li class="flex items-center gap-2 font-semibold sm:gap-2.5 ' . ($tone === 'dark' ? 'text-white/90' : 'text-ink') . '">'
            . '<span class="grid size-5 shrink-0 place-items-center rounded-full ' . ($tone === 'dark' ? 'bg-accent-600 text-white' : 'bg-accent-50 text-accent-600') . '">' . icon('Check', 'size-3.5', 3) . '</span>' . e($t) . '</li>';
    }
    return $html . '</ul>';
}

function hero_actions(string $bookHref = '/book/', string $bookLabel = 'Book Now'): string
{
    return '<div class="flex flex-col gap-3 sm:flex-row">'
        . '<a href="' . e($bookHref) . '" class="' . e(btn_class('primary', 'lg')) . '">' . e($bookLabel) . ' ' . icon('ArrowRight', 'size-5') . '</a>'
        . '<a href="' . e(tel_href()) . '" class="' . e(btn_class('outline-light', 'lg')) . '">' . icon('Phone', 'size-5') . ' ' . e(biz()['phone']['display']) . '</a></div>';
}

function process_steps(): string
{
    $steps = site()['processSteps'] ?? [];
    $html = '<ol class="grid gap-5 md:grid-cols-3">';
    foreach ($steps as $i => $s) {
        $html .= '<li class="relative"><div class="rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-card)] h-full">'
            . '<span class="font-display text-5xl font-extrabold text-accent-600">0' . ($i + 1) . '</span>'
            . '<h3 class="text-h3 mt-3">' . e($s['title']) . '</h3><p class="mt-2 text-muted">' . e($s['body']) . '</p></div>'
            . ($i < count($steps) - 1 ? icon('ArrowRight', 'absolute top-1/2 -right-4 z-10 hidden size-6 -translate-y-1/2 rounded-full bg-white p-1 text-accent-500 shadow md:block') : '')
            . '</li>';
    }
    return $html . '</ol>';
}

/* ── Service cards (same as src/components/ServiceCard.tsx) ── */

function service_card(array $s, int $headingLevel = 3): string
{
    $h = $headingLevel === 2 ? 'h2' : 'h3';
    $iconName = $s['icon'] ?: 'Wrench';
    $media = !empty($s['image'])
        ? img($s['image'], (string) ($s['image_alt'] ?? ''), '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw', false, 'transition-transform duration-300 group-hover:scale-[1.03]')
        : '<div class="grid h-full place-items-center bg-brand-50 text-brand-600">' . icon($iconName, 'size-10', 1.75) . '</div>';
    return '<a href="' . e(service_url($s['slug'])) . '" class="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)] transition-[box-shadow,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[var(--shadow-lift)]">'
        . '<div class="relative aspect-[4/3] overflow-hidden bg-mist">' . $media
        . '<span class="absolute bottom-2 left-2 grid size-9 place-items-center rounded-lg bg-white/95 text-brand-600 shadow-sm sm:bottom-3 sm:left-3 sm:size-10">' . icon($iconName, 'size-5', 1.75) . '</span></div>'
        . '<div class="flex flex-1 flex-col p-3 sm:p-5">'
        . "<$h class=\"font-display text-base leading-snug font-bold text-ink sm:text-lg\">" . e(service_label($s)) . "</$h>"
        . '<p class="mt-1 line-clamp-1 text-base text-muted sm:line-clamp-2">' . e($s['short_description']) . '</p>'
        . '<span class="mt-auto inline-flex items-center gap-1 pt-3 font-display text-sm font-bold text-brand-600"><span class="hidden sm:inline">View service</span><span class="sm:hidden">View</span>'
        . icon('ArrowRight', 'size-4 transition-transform group-hover:translate-x-1') . '</span></div></a>';
}

function service_grid(array $services): string
{
    $html = '<ul class="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">';
    foreach ($services as $s) {
        $html .= '<li>' . service_card($s) . '</li>';
    }
    return $html . '</ul>';
}

/* ── Insight cards (same as src/components/PostCards.tsx) ── */

function post_card(array $p, int $headingLevel = 3, bool $priority = false): string
{
    $h = $headingLevel === 2 ? 'h2' : 'h3';
    $media = !empty($p['featured_image'])
        ? img($p['featured_image'], (string) ($p['image_alt'] ?? ''), '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw', $priority, 'transition-transform duration-300 group-hover:scale-[1.03]')
        : '<div class="h-full bg-navy-900 bg-blueprint"></div>';
    $meta = [];
    if ($p['category'] !== '') {
        $meta[] = '<span class="font-semibold text-brand-600">' . e($p['category']) . '</span>';
    }
    if (!empty($p['published_at'])) {
        $meta[] = '<time datetime="' . e(iso_date($p['published_at'])) . '">' . e(fmt_date($p['published_at'])) . '</time>';
    }
    return '<a href="' . e(post_url($p['slug'])) . '" class="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)] transition-[box-shadow,border-color] hover:border-brand-200 hover:shadow-[var(--shadow-lift)]">'
        . '<div class="aspect-[16/9] overflow-hidden bg-mist">' . $media . '</div>'
        . '<div class="flex flex-1 flex-col p-5 sm:p-6">'
        . '<p class="flex flex-wrap items-center gap-x-2 text-sm text-muted">' . implode('<span aria-hidden="true">·</span>', $meta) . '</p>'
        . "<$h class=\"mt-2 font-display text-lg leading-snug font-bold text-ink group-hover:text-brand-600\">" . e($p['title']) . "</$h>"
        . '<p class="mt-2 line-clamp-3 text-base text-muted">' . e($p['excerpt']) . '</p>'
        . '<span class="mt-auto inline-flex items-center gap-1.5 pt-5 font-display text-sm font-bold text-brand-600">Read the guide ' . icon('ArrowRight', 'size-4 transition-transform group-hover:translate-x-1') . '</span>'
        . '</div></a>';
}

function post_grid(array $posts, int $headingLevel = 3): string
{
    $html = '<ul class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">';
    foreach ($posts as $p) {
        $html .= '<li>' . post_card($p, $headingLevel) . '</li>';
    }
    return $html . '</ul>';
}

/* ── FAQ accordion (native <details>, same as FaqAccordion.tsx) ── */

function faq_accordion(array $faqs, bool $schema = false): string
{
    $html = '<div class="divide-y divide-line overflow-hidden rounded-[var(--radius-card)] border border-line bg-white">';
    foreach ($faqs as $f) {
        $html .= '<details class="group"><summary class="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 font-display text-[1.0625rem] font-bold text-ink transition-colors hover:bg-mist sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">'
            . e($f['question']) . '<span class="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 transition-transform group-open:rotate-45">' . icon('Plus', 'size-4') . '</span></summary>'
            . '<p class="px-5 pb-5 text-body sm:px-6">' . e($f['answer']) . '</p></details>';
    }
    $html .= '</div>';
    if ($schema && $faqs) {
        add_jsonld(faq_schema($faqs));
    }
    return $html;
}

/* ── Reviews (same as ReviewsSection.tsx; behaviour in site.js) ── */

function stars(int $n): string
{
    $html = '<span class="flex gap-0.5" role="img" aria-label="' . $n . ' out of 5 stars">';
    for ($i = 0; $i < 5; $i++) {
        $html .= icon('Star', 'size-4 ' . ($i < $n ? 'fill-[#e8a200] text-[#e8a200]' : 'fill-line text-line'));
    }
    return $html . '</span>';
}

function reviews_section(array $reviews, string $title = 'What our customers say', string $tone = 'white'): string
{
    $rating = setting('google_rating');
    $count = setting('google_review_count');
    $url = setting('google_reviews_url');
    if (!$reviews && $url === '') {
        return '';
    }
    $badge = '';
    if ($rating !== '' || $url !== '') {
        $badge = '<div class="flex flex-col gap-2 rounded-[var(--radius-card)] border border-line bg-white p-4 sm:flex-row sm:items-center sm:gap-5">';
        if ($rating !== '') {
            $badge .= '<div class="flex items-center gap-3"><span class="font-display text-3xl font-extrabold text-ink">' . e(number_format((float) $rating, 1)) . '</span><span>'
                . stars((int) round((float) $rating)) . '<span class="mt-0.5 block text-sm text-muted">' . ($count !== '' ? e($count) . ' Google reviews' : 'Google rating') . '</span></span></div>';
        }
        if ($url !== '') {
            $badge .= '<a href="' . e($url) . '" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 items-center gap-1.5 font-display text-[0.9375rem] font-bold text-brand-600 hover:underline">See all reviews on Google ' . icon('ExternalLink', 'size-4') . '</a>';
        }
        $badge .= '</div>';
    }
    $html = section_open($tone)
        . '<div class="mb-8 flex flex-col gap-5 lg:mb-12 lg:flex-row lg:items-end lg:justify-between"><div>' . eyebrow('Reviews') . '<h2 class="text-h2">' . e($title) . '</h2></div>' . $badge . '</div>';
    if (!$reviews) {
        return $html . '<p class="text-lead text-muted">Read what our customers say on Google.</p>' . section_close();
    }
    $total = count($reviews);
    $html .= '<div role="region" aria-roledescription="carousel" aria-label="Customer reviews" data-review-carousel>'
        . '<div data-track tabindex="0" aria-label="Reviews — scroll or swipe for more" class="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:px-0 [&::-webkit-scrollbar]:hidden">';
    foreach (array_values($reviews) as $i => $r) {
        $long = mb_strlen($r['review_text']) > 220;
        $date = $r['review_date'] ? (new DateTimeImmutable($r['review_date']))->format('M Y') : '';
        $meta = implode(' · ', array_filter([$r['location'], $r['service_name'] ?? '', $date]));
        $html .= '<article aria-roledescription="slide" aria-label="Review ' . ($i + 1) . ' of ' . $total . '" data-slide class="flex shrink-0 basis-[85%] snap-start flex-col rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-[var(--shadow-card)] sm:basis-[calc(50%-0.625rem)] sm:p-6 lg:basis-[calc((100%-2.5rem)/3)]">'
            . '<div class="flex items-center justify-between gap-3">' . stars((int) $r['rating'])
            . ($r['source'] === 'Google' ? '<span class="rounded-full border border-line bg-mist px-2.5 py-0.5 text-xs font-bold text-muted">Google review</span>' : '') . '</div>'
            . '<p data-review-text class="mt-4 text-base whitespace-pre-line text-body line-clamp-5">' . e($r['review_text']) . '</p>'
            . ($long ? '<button type="button" data-read-more aria-expanded="false" class="mt-1 inline-flex min-h-11 items-center self-start font-display text-sm font-bold text-brand-600 hover:underline">Read more</button>' : '')
            . '<footer class="mt-auto border-t border-line pt-4"><p class="font-display font-bold text-ink">' . e($r['customer_name']) . '</p>'
            . ($meta !== '' ? '<p class="text-sm text-muted">' . e($meta) . '</p>' : '') . '</footer></article>';
    }
    $html .= '</div><div data-controls hidden class="mt-5 flex items-center justify-center gap-3">'
        . '<button type="button" data-prev aria-label="Previous review" class="grid size-11 place-items-center rounded-full border border-line bg-white text-navy-900 transition-colors hover:border-brand-500 disabled:opacity-40">' . icon('ChevronLeft', 'size-5') . '</button>'
        . '<div data-dots class="flex items-center"></div>'
        . '<button type="button" data-next aria-label="Next review" class="grid size-11 place-items-center rounded-full border border-line bg-white text-navy-900 transition-colors hover:border-brand-500 disabled:opacity-40">' . icon('ChevronRight', 'size-5') . '</button>'
        . '</div></div>';
    return $html . section_close();
}

/* ── Misc blocks ── */

function brand_strip(array $brands): string
{
    $featured = site()['featuredBrandSlugs'] ?? [];
    $html = '<ul class="' . MOBILE_SCROLLER . ' sm:grid sm:grid-cols-3 lg:grid-cols-6">';
    foreach ($brands as $b) {
        $html .= '<li class="grid h-16 w-36 shrink-0 snap-start place-items-center rounded-xl border bg-white px-3 text-center font-display text-lg font-extrabold tracking-tight sm:w-auto '
            . (in_array($b['slug'], $featured, true) ? 'border-navy-900/15 text-navy-900' : 'border-line text-muted') . '">' . e($b['name']) . '</li>';
    }
    return $html . '</ul>';
}

function cta_band(string $title = 'Appliance playing up?', string $text = "Call us or book online — tell us the make, model and what it's doing.", string $bookHref = '/book/'): string
{
    $img = site()['siteImages']['cta'] ?? null;
    $media = $img ? '<div class="hidden aspect-[4/3] w-44 shrink-0 overflow-hidden rounded-[var(--radius-card)] ring-4 ring-white/20 lg:block">' . img(img_path($img['name'], 400), '', '176px') . '</div>' : '';
    return '<section class="overflow-hidden bg-accent-600"><div class="' . CONTAINER . ' flex flex-col items-start justify-between gap-6 py-10 sm:py-12 md:flex-row md:items-center">'
        . '<div class="flex items-center gap-8">' . $media . '<div><p class="font-display text-2xl font-extrabold text-white sm:text-[1.875rem]">' . e($title) . '</p>'
        . '<p class="mt-1 text-lg text-white">' . e($text) . '</p></div></div>'
        . '<div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">'
        . '<a href="' . e(tel_href()) . '" class="' . e(btn_class('secondary', 'lg')) . '">' . icon('Phone', 'size-5') . ' ' . e(biz()['phone']['display']) . '</a>'
        . '<a href="' . e($bookHref) . '" class="' . e(btn_class('outline-light', 'lg', 'border-white/70 hover:border-white hover:bg-white/10')) . '">Book Now</a>'
        . '</div></div></section>';
}

function render_404_body(): void
{
    echo page_hero([['label' => 'Page not found']], 'Error 404', "Sorry, we can't find that page", 'It may have moved or been removed. Try one of the links below, or give us a call.',
        '<div class="flex flex-col gap-3 sm:flex-row"><a href="/" class="' . e(btn_class('primary', 'lg')) . '">Go to homepage</a><a href="' . e(tel_href()) . '" class="' . e(btn_class('outline-light', 'lg')) . '">' . icon('Phone', 'size-5') . ' ' . e(biz()['phone']['display']) . '</a></div>');
    echo section_open() . '<div class="grid gap-10 md:grid-cols-2">';
    foreach (['domestic' => 'Domestic repairs', 'commercial' => 'Commercial refrigeration'] as $cat => $title) {
        echo '<div><h2 class="text-h3 mb-4">' . e($title) . '</h2><ul class="grid gap-x-6 gap-y-2 sm:grid-cols-2">';
        foreach (services_by_category($cat) as $s) {
            echo '<li><a href="' . e(service_url($s['slug'])) . '" class="inline-flex min-h-11 items-center font-semibold text-brand-600 hover:underline">' . e($s['name']) . '</a></li>';
        }
        echo '</ul></div>';
    }
    echo '</div>' . section_close();
}
