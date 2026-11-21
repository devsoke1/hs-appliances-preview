<?php
/**
 * /services/{slug}/ — service detail, rendered from the database (admin edits are live instantly).
 * Same design as the former Next.js service page. Inactive/missing → 404; renamed slug → 301.
 */
declare(strict_types=1);
require dirname(__DIR__) . '/includes/bootstrap.php';

$slug = is_string($_GET['slug'] ?? null) ? $_GET['slug'] : '';
if (!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug)) {
    not_found();
}
$s = db_one('SELECT * FROM services WHERE slug = ? AND is_active = 1', [$slug]);
if (!$s) {
    $new = db_value("SELECT new_slug FROM slug_redirects WHERE type = 'service' AND old_slug = ?", [$slug]);
    if (is_string($new) && db_value('SELECT COUNT(*) FROM services WHERE slug = ? AND is_active = 1', [$new])) {
        redirect_301(service_url($new));
    }
    not_found();
}
$path = service_url($s['slug']);
canonical_redirect($path);

$b = biz();
$label = service_label($s);
$lower = mb_strtolower($label);
$aLower = (preg_match('/^[aeiou]/i', $lower) ? 'an ' : 'a ') . $lower;
$faults = json_list($s['common_faults']);
$faqs = json_list($s['faqs']);
$bookHref = '/book/?service=' . rawurlencode($s['slug']);
$brands = array_values(array_filter(site()['brands'] ?? [], static fn ($br) => in_array($s['slug'], $br['services'], true)));
$related = array_slice(array_values(array_filter(active_services(), static fn ($x) => $x['category'] === $s['category'] && $x['slug'] !== $s['slug'])), 0, 4);
$reviews = db_all(
    'SELECT r.*, NULL AS service_name FROM reviews r WHERE r.is_active = 1 AND r.service_id = ? ORDER BY r.sort_order ASC, r.review_date DESC LIMIT 12',
    [(int) $s['id']]
);
$guides = db_all(
    "SELECT * FROM posts WHERE status = 'published' AND published_at <= ? AND (tags LIKE ? ESCAPE '!' OR tags LIKE ? ESCAPE '!') ORDER BY published_at DESC LIMIT 3",
    [db_now(), str_replace(['!', '%', '_'], ['!!', '!%', '!_'], $label) . '%', '%, ' . str_replace(['!', '%', '_'], ['!!', '!%', '!_'], $label) . '%']
);

page([
    'title' => service_meta_title($s),
    'description' => meta_description($s['meta_description'] ?: $s['short_description']),
    'path' => $path,
    'image' => $s['image'] ? ['url' => $s['image'], 'alt' => $s['image_alt'] ?: $s['name']] : null,
]);
add_jsonld(service_schema($s));
if ($faqs) {
    add_jsonld(faq_schema($faqs)); // must be added before head.php is sent
}
if ($s['image']) {
    preload_image($s['image'], '(min-width: 1024px) 40vw, 100vw');
}

require dirname(__DIR__) . '/includes/head.php';
require dirname(__DIR__) . '/includes/header.php';

$aside = $s['image']
    ? '<div class="aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] ring-1 ring-white/15">' . img($s['image'], (string) $s['image_alt'], '(min-width: 1024px) 40vw, 100vw', true) . '</div>'
    : '<div class="hidden justify-end lg:flex"><span class="grid size-40 place-items-center rounded-3xl bg-white/[0.06] ring-1 ring-white/15">' . icon($s['icon'] ?: 'Wrench', 'size-20 text-accent-400', 1.25) . '</span></div>';

echo page_hero(
    [['label' => 'Services', 'href' => '/services/'], ['label' => $s['name']]],
    $s['category'] === 'domestic' ? 'Domestic appliances' : 'Commercial refrigeration',
    $s['name'] . ' in ' . $b['mainArea'],
    $s['short_description'],
    hero_actions($bookHref, 'Book this repair') . trust_list('dark', 'mt-8 max-w-lg'),
    $aside
);
?>
<div class="<?= CONTAINER ?> grid gap-12 py-12 sm:py-16 lg:grid-cols-12 lg:py-20">
  <article class="min-w-0 lg:col-span-8">
    <div class="service-content prose-content space-y-4 [&_h2]:text-h2 [&_h2]:mt-14 [&_h2]:mb-5 [&_h3]:text-h3 [&_h3]:mt-8 [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-6 [&_a]:font-semibold [&_a]:text-brand-600 [&_a]:underline [&>p:first-child]:text-lead [&>p:first-child]:text-ink">
      <?= $s['content'] /* sanitised with HTMLPurifier when saved in the admin */ ?>
    </div>

    <?php if (!empty($s['compliance_note'])): ?>
      <aside class="mt-8 flex gap-3 rounded-[var(--radius-card)] border-2 border-dashed border-accent-400/70 bg-accent-50 p-5 text-[0.9375rem] text-accent-700">
        <?= icon('AlertTriangle', 'mt-0.5 size-5 shrink-0') ?>
        <p class="font-semibold"><?= e($s['compliance_note']) ?></p>
      </aside>
    <?php endif; ?>

    <?php if ($faults): ?>
      <h2 class="text-h2 mt-14 mb-6">Common <?= e($lower) ?> faults we fix</h2>
      <ul class="grid gap-4 sm:grid-cols-2">
        <?php foreach ($faults as $f): ?>
          <li class="rounded-[var(--radius-card)] border border-line bg-white p-5">
            <h3 class="flex items-center gap-2.5 font-display text-[1.0625rem] font-bold text-ink"><?= icon('Wrench', 'size-4 shrink-0 text-accent-500') ?><?= e($f['name'] ?? '') ?></h3>
            <?php if (!empty($f['detail'])): ?><p class="mt-2 text-base text-muted"><?= e($f['detail']) ?></p><?php endif; ?>
          </li>
        <?php endforeach; ?>
      </ul>
    <?php endif; ?>

    <section class="mt-14">
      <h2 class="text-h2 mb-5">Prices and call-out</h2>
      <?php if (!empty($b['callOutPrice'])): ?>
        <p class="text-lead text-ink">Our call-out charge is <strong><?= e($b['callOutPrice']) ?></strong>. It can differ by area.</p>
      <?php endif; ?>
      <p class="text-sm leading-relaxed text-muted"><?= e($b['callOutNote'] ?? 'The call-out fee depends on your area. You pay it only if you decide not to go ahead with the repair. If you go ahead, you pay for the parts and the labour only.') ?></p>
    </section>

    <?php if ($faqs): ?>
      <section class="mt-14" id="faqs">
        <h2 class="text-h2 mb-6"><?= e($label) ?> repair FAQs</h2>
        <?= faq_accordion($faqs) ?>
      </section>
    <?php endif; ?>
  </article>

  <aside class="lg:col-span-4">
    <div class="space-y-5 lg:sticky lg:top-28">
      <div class="rounded-[var(--radius-card)] bg-navy-900 bg-blueprint p-6 text-white">
        <p class="font-display text-xl font-extrabold">Book <?= e($aLower) ?> repair</p>
        <p class="mt-2 text-white/75">Tell us the make, model and fault — we&rsquo;ll confirm a slot that suits you.</p>
        <div class="mt-5 space-y-2.5">
          <a href="<?= e($bookHref) ?>" class="<?= e(btn_class('primary', 'md', 'w-full')) ?>"><?= icon('CalendarCheck', 'size-5') ?> Book online</a>
          <a href="<?= e(tel_href()) ?>" class="<?= e(btn_class('outline-light', 'md', 'w-full')) ?>"><?= icon('Phone', 'size-5') ?> <?= e($b['phone']['display']) ?></a>
        </div>
      </div>
      <div class="rounded-[var(--radius-card)] border border-line bg-white p-6">
        <p class="flex items-center gap-2 font-display font-bold text-ink"><?= icon('Clock', 'size-4 text-brand-600') ?> Opening hours</p>
        <dl class="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[0.9375rem]">
          <?php foreach ($b['hoursGrouped'] as $h): ?><div class="contents"><dt class="text-muted"><?= e($h['label']) ?></dt><dd class="font-semibold text-ink"><?= e($h['value']) ?></dd></div><?php endforeach; ?>
        </dl>
      </div>
    </div>
  </aside>
</div>

<?= reviews_section($reviews, "What customers say about our {$lower} repairs", 'mist') ?>

<?php if ($brands): ?>
  <?= section_open($reviews ? 'white' : 'mist') ?>
  <?= section_header('Brands', $label . ' brands we repair', 'Including, but not limited to, the makes below. Not listed? Call us with the make and model.') ?>
  <?= brand_strip($brands) ?>
  <?= section_close() ?>
<?php endif; ?>

<?= section_open() ?>
<?= section_header('How it works', 'From booking to fixed', '', 'center') ?>
<?= process_steps() ?>
<?= section_close() ?>

<?= section_open('mist') ?>
<?= section_header('Areas covered', $s['name'] . ' across West London', 'Based in Feltham, we cover ' . $b['serviceAreaSummary'] . ', including:') ?>
<ul class="<?= MOBILE_SCROLLER ?> sm:grid sm:grid-cols-2 sm:gap-2 lg:grid-cols-3">
  <?php foreach (site()['areas'] as $a): ?>
    <li class="w-[72%] shrink-0 snap-start sm:w-auto">
      <a href="/areas/<?= e($a['slug']) ?>/" class="flex min-h-11 h-full items-center gap-2.5 rounded-lg border border-line bg-white px-4 py-3 font-semibold text-navy-900 transition-colors hover:border-brand-500 hover:text-brand-600">
        <?= icon('MapPin', 'size-4 shrink-0 text-brand-600') ?>
        <span><?= e($label) ?> repair in <?= e($a['name']) ?><span class="ml-1.5 text-sm font-normal text-muted"><?= e(implode(', ', $a['postcodes'])) ?></span></span>
      </a>
    </li>
  <?php endforeach; ?>
</ul>
<?= section_close() ?>

<?php if ($guides): ?>
  <?= section_open() ?>
  <?= section_header('Insights', $label . ' guides') ?>
  <?= post_grid($guides) ?>
  <?= section_close() ?>
<?php endif; ?>

<?php if ($related): ?>
  <?= section_open($guides ? 'mist' : 'white') ?>
  <?= section_header('Related services', $s['category'] === 'domestic' ? 'Other household appliances we repair' : 'Other commercial refrigeration we repair', '', 'left', 'light', '<a href="/services/" class="' . e(btn_class('outline')) . '">All services ' . icon('ArrowRight', 'size-4') . '</a>') ?>
  <?= service_grid($related) ?>
  <?= section_close() ?>
<?php endif; ?>

<?= cta_band('Need ' . $aLower . ' repair?', "Call us or book online — tell us the make, model and what it's doing.", $bookHref) ?>
<?php require dirname(__DIR__) . '/includes/footer.php'; ?>
