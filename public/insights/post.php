<?php
/**
 * /insights/{slug}/ — one published post, rendered from the database.
 * Breadcrumb, featured image, author/date/read time, table of contents (from H2s), content,
 * share buttons, "Need a repair?" CTA, 3 related posts. JSON-LD BlogPosting + BreadcrumbList.
 * Draft / scheduled / missing → 404; renamed slug → 301.
 */
declare(strict_types=1);
require dirname(__DIR__) . '/includes/bootstrap.php';

$slug = is_string($_GET['slug'] ?? null) ? $_GET['slug'] : '';
if (!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug)) {
    not_found();
}
$now = db_now();
$p = db_one("SELECT * FROM posts WHERE slug = ? AND status = 'published' AND published_at <= ?", [$slug, $now]);
if (!$p) {
    $new = db_value("SELECT new_slug FROM slug_redirects WHERE type = 'post' AND old_slug = ?", [$slug]);
    if (is_string($new) && db_value("SELECT COUNT(*) FROM posts WHERE slug = ? AND status = 'published' AND published_at <= ?", [$new, $now])) {
        redirect_301(post_url($new));
    }
    not_found();
}
$path = post_url($p['slug']);
canonical_redirect($path);
$b = biz();

/* Table of contents: give each <h2> an id */
$toc = [];
$used = [];
$content = preg_replace_callback('#<h2>(.*?)</h2>#s', static function (array $m) use (&$toc, &$used): string {
    $text = trim(html_entity_decode(strip_tags($m[1]), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
    $id = trim(preg_replace('/[^a-z0-9]+/', '-', strtolower($text)) ?? '', '-') ?: 'section';
    $base = $id;
    for ($n = 2; isset($used[$id]); $n++) {
        $id = "$base-$n";
    }
    $used[$id] = true;
    $toc[] = ['id' => $id, 'text' => $text];
    return '<h2 id="' . e($id) . '">' . $m[1] . '</h2>';
}, (string) $p['content']) ?? (string) $p['content'];

$minutes = reading_minutes($content);
$tags = array_values(array_filter(array_map('trim', explode(',', (string) $p['tags']))));

/* Related service for the CTA: first service whose short name or full name is one of the tags */
$service = null;
foreach (active_services() as $s) {
    foreach ($tags as $t) {
        if (strcasecmp($t, service_label($s)) === 0 || strcasecmp($t, $s['name']) === 0) {
            $service = $s;
            break 2;
        }
    }
}

/* Related posts: same category first, then most recent */
$related = db_all(
    "SELECT * FROM posts WHERE status = 'published' AND published_at <= ? AND id <> ?
     ORDER BY CASE WHEN category = ? THEN 0 ELSE 1 END, published_at DESC LIMIT 3",
    [$now, (int) $p['id'], (string) $p['category']]
);

page([
    'title' => $p['meta_title'] ?: mb_substr($p['title'] . ' | ' . $b['shortName'], 0, 60),
    'description' => meta_description($p['meta_description'] ?: $p['excerpt']),
    'path' => $path,
    'type' => 'article',
    'article' => ['published' => iso_date($p['published_at']), 'modified' => iso_date($p['updated_at'] ?: $p['published_at'])],
    'image' => $p['featured_image'] ? ['url' => $p['featured_image'], 'alt' => $p['image_alt'] ?: $p['title']] : null,
]);
add_jsonld(blogposting_schema($p));
if ($p['featured_image']) {
    preload_image($p['featured_image'], '(min-width: 1024px) 66vw, 100vw');
}

$url = site_url($path);
$share = [
    ['WhatsApp', 'MessageCircle', 'https://wa.me/?text=' . rawurlencode($p['title'] . ' ' . $url)],
    ['Facebook', 'Share2', 'https://www.facebook.com/sharer/sharer.php?u=' . rawurlencode($url)],
    ['X', 'Send', 'https://twitter.com/intent/tweet?url=' . rawurlencode($url) . '&text=' . rawurlencode($p['title'])],
    ['LinkedIn', 'Share2', 'https://www.linkedin.com/sharing/share-offsite/?url=' . rawurlencode($url)],
    ['Email', 'Mail', 'mailto:?subject=' . rawurlencode($p['title']) . '&body=' . rawurlencode($url)],
];

require dirname(__DIR__) . '/includes/head.php';
require dirname(__DIR__) . '/includes/header.php';

$meta = '<p class="flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-white/80">'
    . '<span>By ' . e($p['author'] ?: $b['name']) . ' · <time datetime="' . e(iso_date($p['published_at'])) . '">' . e(fmt_date($p['published_at'])) . '</time></span>'
    . ($p['updated_at'] && substr($p['updated_at'], 0, 10) > substr($p['published_at'], 0, 10) ? '<span>Updated <time datetime="' . e(iso_date($p['updated_at'])) . '">' . e(fmt_date($p['updated_at'])) . '</time></span>' : '')
    . '<span class="inline-flex items-center gap-1">' . icon('Clock', 'size-4') . ' ' . $minutes . ' min read</span></p>';

echo page_hero([['label' => 'Insights', 'href' => '/insights/'], ['label' => $p['title']]], $p['category'] ?: 'Guide', $p['title'], $p['excerpt'], $meta);

$tocHtml = '';
if (count($toc) >= 2) {
    $items = '';
    foreach ($toc as $t) {
        $items .= '<li><a href="#' . e($t['id']) . '" class="flex min-h-11 items-center border-l-2 border-line py-1.5 pl-3 text-[0.9375rem] text-body hover:border-brand-500 hover:text-brand-600 lg:min-h-0">' . e($t['text']) . '</a></li>';
    }
    $tocHtml = $items;
}
?>
<div class="<?= CONTAINER ?> grid gap-10 py-10 sm:py-14 lg:grid-cols-12 lg:gap-12 lg:py-16">
  <article class="min-w-0 lg:col-span-8">
    <?php if ($p['featured_image']): ?>
      <div class="mb-8 aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] bg-mist">
        <?= img($p['featured_image'], (string) $p['image_alt'], '(min-width: 1024px) 66vw, 100vw', true) ?>
      </div>
    <?php endif; ?>

    <?php if ($tocHtml): ?>
      <details class="group mb-8 rounded-[var(--radius-card)] border border-line bg-mist lg:hidden">
        <summary class="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-5 font-display font-bold text-ink [&::-webkit-details-marker]:hidden">
          <span class="inline-flex items-center gap-2"><?= icon('List', 'size-5 text-brand-600') ?> On this page</span><?= icon('ChevronDown', 'size-5 transition-transform group-open:rotate-180') ?>
        </summary>
        <ol class="space-y-0.5 px-5 pb-4"><?= $tocHtml ?></ol>
      </details>
    <?php endif; ?>

    <div class="max-w-3xl text-[1.0625rem] [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:scroll-mt-28 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-ink [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-ink [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_li]:marker:text-brand-600 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-6 [&_ol_li]:marker:font-bold [&_a]:font-semibold [&_a]:text-brand-600 [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-ink [&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-[var(--radius-card)] [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-accent-600 [&_blockquote]:bg-mist [&_blockquote]:px-5 [&_blockquote]:py-3 [&_blockquote]:text-ink">
      <?= $content /* sanitised with HTMLPurifier when saved in the admin */ ?>
    </div>

    <div class="mt-10 border-t border-line pt-6">
      <p class="font-display font-bold text-ink">Share this guide</p>
      <ul class="mt-3 flex flex-wrap gap-2">
        <?php foreach ($share as [$label, $ico, $href]): ?>
          <li><a href="<?= e($href) ?>" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-white px-3.5 text-sm font-semibold text-navy-900 hover:border-brand-500 hover:text-brand-600"><?= icon($ico, 'size-4') ?> <?= e($label) ?></a></li>
        <?php endforeach; ?>
        <li><button type="button" data-copy-link="<?= e($url) ?>" class="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-white px-3.5 text-sm font-semibold text-navy-900 hover:border-brand-500 hover:text-brand-600"><?= icon('Link', 'size-4') ?> <span data-copy-label>Copy link</span></button></li>
      </ul>
    </div>

    <p class="mt-10 rounded-lg bg-mist p-4 text-base text-muted">
      This guide is general advice. If you&rsquo;re ever unsure, or an appliance is sparking, smoking, leaking or smells of gas, stop using it and call a professional.
      For a suspected gas leak, call the National Gas Emergency Service on 0800 111 999.
    </p>
  </article>

  <aside class="lg:col-span-4">
    <div class="space-y-5 lg:sticky lg:top-28">
      <?php if ($tocHtml): ?>
        <nav aria-label="On this page" class="hidden rounded-[var(--radius-card)] border border-line bg-white p-6 lg:block">
          <p class="mb-3 flex items-center gap-2 font-display font-bold text-ink"><?= icon('List', 'size-5 text-brand-600') ?> On this page</p>
          <ol class="space-y-0.5"><?= $tocHtml ?></ol>
        </nav>
      <?php endif; ?>
      <div class="rounded-[var(--radius-card)] bg-navy-900 bg-blueprint p-6 text-white">
        <?= icon($service['icon'] ?? 'Wrench', 'size-8 text-accent-400', 1.75) ?>
        <p class="mt-3 font-display text-xl font-extrabold">Need a repair?</p>
        <p class="mt-2 text-white/80"><?= e($service ? $service['short_description'] : 'Our engineers repair domestic appliances and commercial refrigeration across ' . $b['serviceAreaSummary'] . '.') ?></p>
        <div class="mt-5 space-y-2.5">
          <a href="<?= e('/book/' . ($service ? '?service=' . rawurlencode($service['slug']) : '')) ?>" class="<?= e(btn_class('primary', 'md', 'w-full')) ?>"><?= icon('CalendarCheck', 'size-5') ?> Book a repair</a>
          <a href="<?= e(tel_href()) ?>" class="<?= e(btn_class('outline-light', 'md', 'w-full')) ?>"><?= icon('Phone', 'size-5') ?> <?= e($b['phone']['display']) ?></a>
          <?php if ($service): ?>
            <a href="<?= e(service_url($service['slug'])) ?>" class="flex min-h-11 items-center justify-center gap-1 text-sm font-semibold text-white/85 hover:text-white">About our <?= e(mb_strtolower($service['name'])) ?> <?= icon('ArrowRight', 'size-4') ?></a>
          <?php endif; ?>
        </div>
      </div>
    </div>
  </aside>
</div>

<?php if ($related): ?>
  <?= section_open('mist') ?>
  <?= section_header('More insights', 'Related guides') ?>
  <?= post_grid($related) ?>
  <?= section_close() ?>
<?php endif; ?>

<?= cta_band('Need a repair?', "Call us or book online — tell us the make, model and what it's doing.", '/book/' . ($service ? '?service=' . rawurlencode($service['slug']) : '')) ?>
<?php require dirname(__DIR__) . '/includes/footer.php'; ?>
