<?php
/**
 * /insights/ — published posts: featured post on top (unfiltered first page), category filter,
 * 3 / 2 / 1 column grid, pagination (9 per page). Scheduled and draft posts never appear.
 */
declare(strict_types=1);
require dirname(__DIR__) . '/includes/bootstrap.php';

const PER_PAGE = 9;

if (current_path() !== '/insights/') {
    redirect_301('/insights/' . (($q = parse_url((string) $_SERVER['REQUEST_URI'], PHP_URL_QUERY)) ? '?' . $q : ''));
}
$now = db_now();
$category = is_string($_GET['category'] ?? null) ? mb_substr(trim($_GET['category']), 0, 80) : '';
$pageNo = max(1, (int) filter_var($_GET['page'] ?? 1, FILTER_VALIDATE_INT, ['options' => ['default' => 1]]));

$categories = array_column(db_all("SELECT category, COUNT(*) AS n FROM posts WHERE status = 'published' AND published_at <= ? AND category <> '' GROUP BY category ORDER BY category", [$now]), 'category');
if ($category !== '' && !in_array($category, $categories, true)) {
    not_found();
}

$where = "status = 'published' AND published_at <= ?" . ($category !== '' ? ' AND category = ?' : '');
$params = $category !== '' ? [$now, $category] : [$now];
$total = (int) db_value("SELECT COUNT(*) FROM posts WHERE $where", $params);

// Unfiltered: newest post is featured, the rest are paginated. Filtered: everything paginated.
$featured = null;
$offsetBase = 0;
if ($category === '' && $total > 0) {
    $featured = $pageNo === 1 ? db_one("SELECT * FROM posts WHERE $where ORDER BY published_at DESC, id DESC LIMIT 1", $params) : null;
    $offsetBase = 1;
}
$gridTotal = max(0, $total - $offsetBase);
$pages = max(1, (int) ceil($gridTotal / PER_PAGE));
if ($pageNo > $pages) {
    not_found();
}
$posts = db_all(
    "SELECT * FROM posts WHERE $where ORDER BY published_at DESC, id DESC LIMIT ? OFFSET ?",
    [...$params, PER_PAGE, $offsetBase + ($pageNo - 1) * PER_PAGE]
);

$qs = static function (array $over) use ($category, $pageNo): string {
    $q = array_filter(array_merge(['category' => $category, 'page' => $pageNo > 1 ? $pageNo : null], $over), static fn ($v) => $v !== null && $v !== '' && $v !== 1);
    return '/insights/' . ($q ? '?' . http_build_query($q) : '');
};

$seo = site()['seo']['pages']['insights'] ?? ['title' => 'Insights | HS Appliances', 'description' => ''];
$brand = biz()['shortName'];
$title = $category !== '' ? "$category Insights | $brand" : $seo['title'];
if ($pageNo > 1) {
    $title = mb_strlen("$title (Page $pageNo)") <= 60 ? "$title (Page $pageNo)" : str_replace(" | $brand", " – Page $pageNo | $brand", $title);
}
page([
    'title' => $title,
    'description' => $category !== '' ? meta_description("Guides about $category from our Feltham appliance engineers: common faults, what to check yourself and when to call a pro.") : $seo['description'],
    'path' => $qs([]),
]);
if ($featured && $featured['featured_image']) {
    preload_image($featured['featured_image'], '(min-width: 1024px) 55vw, 100vw');
}

require dirname(__DIR__) . '/includes/head.php';
require dirname(__DIR__) . '/includes/header.php';

echo page_hero(
    $category !== '' ? [['label' => 'Insights', 'href' => '/insights/'], ['label' => $category]] : [['label' => 'Insights']],
    'Insights & guides',
    $category !== '' ? "$category guides" : 'Appliance repair insights from our engineers',
    "Practical guides to common faults — what you can safely check yourself, and when it's time to call an engineer."
);
?>
<section class="py-12 sm:py-16 lg:py-20">
  <div class="<?= CONTAINER ?>">
    <?php if ($categories): ?>
      <nav aria-label="Filter by category" class="mb-8 sm:mb-10">
        <ul class="<?= MOBILE_SCROLLER ?> sm:flex-wrap sm:gap-2">
          <?php foreach (array_merge([''], $categories) as $c): $active = $c === $category; ?>
            <li class="shrink-0 snap-start">
              <a href="<?= e($c === '' ? '/insights/' : '/insights/?' . http_build_query(['category' => $c])) ?>"<?= $active ? ' aria-current="page"' : '' ?>
                 class="inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-[0.9375rem] font-semibold whitespace-nowrap transition-colors <?= $active ? 'border-navy-900 bg-navy-900 text-white' : 'border-line bg-white text-navy-900 hover:border-brand-500 hover:text-brand-600' ?>"><?= e($c === '' ? 'All' : $c) ?></a>
            </li>
          <?php endforeach; ?>
        </ul>
      </nav>
    <?php endif; ?>

    <?php if ($featured): ?>
      <a href="<?= e(post_url($featured['slug'])) ?>" class="group mb-10 grid overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)] transition-[box-shadow,border-color] hover:border-brand-200 hover:shadow-[var(--shadow-lift)] lg:mb-14 lg:grid-cols-12">
        <div class="aspect-[16/9] overflow-hidden bg-mist lg:col-span-7 lg:aspect-auto lg:min-h-80">
          <?= $featured['featured_image'] ? img($featured['featured_image'], (string) $featured['image_alt'], '(min-width: 1024px) 55vw, 100vw', true, 'transition-transform duration-300 group-hover:scale-[1.03]') : '<div class="h-full bg-navy-900 bg-blueprint"></div>' ?>
        </div>
        <div class="flex flex-col justify-center p-6 sm:p-8 lg:col-span-5 lg:p-10">
          <p class="flex flex-wrap items-center gap-x-2 text-sm text-muted">
            <span class="rounded-full bg-accent-50 px-2.5 py-0.5 text-xs font-bold tracking-wide text-accent-700 uppercase">Latest</span>
            <?php if ($featured['category']): ?><span class="font-semibold text-brand-600"><?= e($featured['category']) ?></span><?php endif; ?>
            <span aria-hidden="true">·</span><time datetime="<?= e(iso_date($featured['published_at'])) ?>"><?= e(fmt_date($featured['published_at'])) ?></time>
          </p>
          <h2 class="mt-3 font-display text-2xl leading-tight font-extrabold text-ink group-hover:text-brand-600 sm:text-3xl"><?= e($featured['title']) ?></h2>
          <p class="mt-3 text-base text-muted sm:text-lg"><?= e($featured['excerpt']) ?></p>
          <span class="mt-6 inline-flex items-center gap-1.5 font-display font-bold text-brand-600">Read the guide <?= icon('ArrowRight', 'size-4 transition-transform group-hover:translate-x-1') ?></span>
        </div>
      </a>
    <?php endif; ?>

    <?php if ($posts): ?>
      <?= post_grid($posts, $featured ? 3 : 2) ?>
    <?php elseif (!$featured): ?>
      <p class="text-lead text-muted">New guides are on the way. In the meantime, <a class="font-semibold text-brand-600 underline" href="/contact/">ask us your question</a>.</p>
    <?php endif; ?>

    <?php if ($pages > 1): ?>
      <nav aria-label="Pagination" class="mt-12 flex flex-wrap items-center justify-center gap-2">
        <?php if ($pageNo > 1): ?>
          <a href="<?= e($qs(['page' => $pageNo - 1])) ?>" rel="prev" class="<?= e(btn_class('outline', 'md')) ?>"><?= icon('ArrowLeft', 'size-4') ?> Newer</a>
        <?php endif; ?>
        <?php for ($i = 1; $i <= $pages; $i++): ?>
          <a href="<?= e($qs(['page' => $i])) ?>"<?= $i === $pageNo ? ' aria-current="page"' : '' ?> class="grid size-12 place-items-center rounded-lg font-display font-bold <?= $i === $pageNo ? 'bg-navy-900 text-white' : 'border border-line bg-white text-navy-900 hover:border-brand-500' ?>"><?= $i ?></a>
        <?php endfor; ?>
        <?php if ($pageNo < $pages): ?>
          <a href="<?= e($qs(['page' => $pageNo + 1])) ?>" rel="next" class="<?= e(btn_class('outline', 'md')) ?>">Older <?= icon('ArrowRight', 'size-4') ?></a>
        <?php endif; ?>
      </nav>
    <?php endif; ?>
  </div>
</section>
<?= cta_band() ?>
<?php require dirname(__DIR__) . '/includes/footer.php'; ?>
