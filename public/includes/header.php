<?php
/**
 * Site header — same markup/classes as src/components/layout/Header.tsx.
 * Domestic / Commercial / Air Conditioning drop-downs; services come live from the database.
 * Behaviour (drop-downs, drawer, scroll shadow) is in /assets/js/site.js.
 */
declare(strict_types=1);

(static function (): void {

$b = biz();
$path = current_path();
$isActive = static fn (string $href): bool => $path === $href || str_starts_with($path, $href);
$isAc = static fn (array $s): bool => str_starts_with((string) $s['slug'], 'air-conditioning');
$serviceItem = static fn (array $s): array => ['key' => $s['slug'], 'label' => service_label($s), 'href' => service_url($s['slug']), 'icon' => $s['icon'] ?: 'Wrench', 'sub' => null];

$items = [
    'domestic' => array_map($serviceItem, array_values(array_filter(services_by_category('domestic'), static fn ($s) => !$isAc($s)))),
    'commercial' => array_map($serviceItem, services_by_category('commercial')),
    'ac' => array_map(static fn ($o) => ['key' => $o['key'], 'label' => $o['menu'], 'href' => '/air-conditioning/?service=' . rawurlencode($o['key']) . '#book', 'icon' => $o['icon'], 'sub' => $o['title']], site()['booking']['acOptions']),
];
$categories = site()['nav']['categories'];
?>
<div class="hidden bg-navy-950 text-[0.8125rem] text-white/70 md:block">
  <div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex h-11 items-center justify-between gap-6">
    <div class="flex min-w-0 items-center gap-6">
      <span class="inline-flex items-center gap-1.5 truncate"><?= icon('MapPin', 'size-3.5 shrink-0 text-accent-500') ?><?= e($b['fullAddress']) ?></span>
      <span class="hidden items-center gap-1.5 xl:inline-flex"><?= icon('Clock', 'size-3.5 text-accent-500') ?><?= e(implode(' · ', array_map(static fn ($h) => $h['label'] . ' ' . $h['value'], $b['hoursGrouped']))) ?></span>
    </div>
    <nav aria-label="Company" class="flex shrink-0 items-center">
      <?php foreach (site()['nav']['main'] as $l): $active = $isActive($l['href']); ?>
        <a href="<?= e($l['href']) ?>"<?= $active ? ' aria-current="page"' : '' ?> class="inline-flex min-h-11 min-w-11 items-center justify-center px-2.5 font-semibold transition-colors hover:text-white<?= $active ? ' text-white' : '' ?>"><?= e($l['label']) ?></a>
      <?php endforeach; ?>
      <a href="<?= e(mail_href()) ?>" class="ml-2 hidden min-h-11 items-center gap-1.5 hover:text-white 2xl:inline-flex"><?= icon('Mail', 'size-3.5 text-accent-500') ?><?= e($b['email']) ?></a>
    </nav>
  </div>
</div>

<header id="site-header" class="sticky top-0 z-50 border-b bg-white transition-shadow border-transparent" data-scrolled-class="border-line shadow-[0_6px_24px_-12px_rgb(0_36_58/0.25)]">
  <div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between gap-4 lg:h-20">
    <?= logo_html() ?>

    <nav aria-label="Main" class="hidden lg:block">
      <ul class="flex items-center gap-0.5 xl:gap-1">
        <?php foreach ($categories as $c): $key = $c['key']; $wide = $key === 'domestic'; $pageActive = $isActive($c['href']); ?>
          <li class="relative" data-dd>
            <div class="flex items-center">
              <a href="<?= e($c['href']) ?>"<?= $pageActive ? ' aria-current="page"' : '' ?> data-dd-link class="inline-flex h-11 items-center rounded-lg pr-1 pl-3 font-display text-[0.9375rem] font-semibold transition-colors xl:pl-3.5 <?= $pageActive ? 'text-brand-600' : 'text-navy-900 hover:text-brand-600' ?>"><?= e($c['label']) ?></a>
              <button type="button" data-dd-button aria-expanded="false" aria-controls="menu-<?= e($key) ?>" aria-label="Show <?= e(strtolower($c['title'])) ?> menu" class="grid h-11 w-8 place-items-center rounded-lg transition-colors text-navy-900 hover:text-brand-600"><?= icon('ChevronDown', 'size-4 transition-transform') ?></button>
            </div>
            <div id="menu-<?= e($key) ?>" hidden data-dd-panel class="absolute top-full z-50 pt-2 <?= $key === 'ac' ? 'right-0' : 'left-0' ?>">
              <div class="animate-fade-down rounded-[var(--radius-card)] border border-line bg-white p-4 shadow-[0_24px_48px_-16px_rgb(0_36_58/0.3)] <?= $wide ? 'w-[34rem]' : ($key === 'ac' ? 'w-[22rem]' : 'w-[20rem]') ?>">
                <p class="mb-2 px-2 font-display text-xs font-bold tracking-[0.12em] text-muted uppercase"><?= e($c['title']) ?></p>
                <ul class="grid gap-x-3 gap-y-0.5 <?= $wide ? 'grid-cols-2' : 'grid-cols-1' ?>">
                  <?php foreach ($items[$key] as $it): ?>
                    <li>
                      <a href="<?= e($it['href']) ?>" class="group flex items-center gap-3 rounded-lg px-2 py-2 font-semibold text-navy-900 transition-colors hover:bg-mist hover:text-brand-600">
                        <span class="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600 transition-colors group-hover:bg-white"><?= icon($it['icon'], 'size-[1.125rem]', 1.75) ?></span>
                        <span class="flex flex-col leading-tight">
                          <span class="text-[0.9375rem]"><?= e($it['label']) ?></span>
                          <?php if ($it['sub'] && $it['sub'] !== $it['label']): ?><span class="text-xs font-semibold text-muted"><?= e($it['sub']) ?></span><?php endif; ?>
                        </span>
                      </a>
                    </li>
                  <?php endforeach; ?>
                </ul>
                <div class="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
                  <a href="<?= e($c['href']) ?>" class="inline-flex min-h-11 items-center gap-1 px-2 text-sm font-bold text-brand-600 hover:text-brand-700"><?= e($c['all']) ?> <?= icon('ArrowRight', 'size-4') ?></a>
                  <a href="<?= e($c['href']) ?>#book" class="<?= e(btn_class('primary', 'sm')) ?>">Book Now</a>
                </div>
              </div>
            </div>
          </li>
        <?php endforeach; ?>
      </ul>
    </nav>

    <div class="flex items-center gap-2 sm:gap-3">
      <a href="<?= e(tel_href()) ?>" class="<?= e(btn_class('outline', 'md', 'max-lg:hidden')) ?>" aria-label="Call <?= e($b['phone']['display']) ?>"><?= icon('Phone', 'size-4') ?><span class="xl:hidden">Call</span><span class="hidden xl:inline"><?= e($b['phone']['display']) ?></span></a>
      <a href="/book/" class="<?= e(btn_class('primary', 'md', 'max-sm:hidden')) ?>">Book Now</a>
      <a href="<?= e(tel_href()) ?>" class="grid size-11 place-items-center rounded-lg bg-brand-50 text-brand-600 lg:hidden" aria-label="Call <?= e($b['phone']['display']) ?>"><?= icon('Phone', 'size-5') ?></a>
      <button type="button" data-menu-button aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu" class="grid size-11 place-items-center rounded-lg bg-navy-900 text-white lg:hidden">
        <span data-icon-open><?= icon('Menu', 'size-5') ?></span>
        <span data-icon-close hidden><?= icon('X', 'size-5') ?></span>
      </button>
    </div>
  </div>

  <div id="mobile-menu" hidden class="absolute inset-x-0 top-full z-50 h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-line bg-white lg:hidden">
    <nav aria-label="Mobile" class="px-4 pt-4 pb-32">
      <?php foreach ($categories as $c): $key = $c['key']; ?>
        <div class="border-b border-line">
          <button type="button" data-accordion-button aria-expanded="false" aria-controls="mm-<?= e($key) ?>" class="flex min-h-14 w-full items-center justify-between px-2 py-3 font-display text-lg font-bold text-navy-900">
            <?= e($c['label']) ?> <?= icon('ChevronDown', 'size-5 transition-transform') ?>
          </button>
          <ul id="mm-<?= e($key) ?>" hidden class="grid grid-cols-1 gap-0.5 pb-3 sm:grid-cols-2">
            <li class="sm:col-span-2"><a href="<?= e($c['href']) ?>" class="flex min-h-11 items-center gap-1 px-2 py-2 font-bold text-brand-600"><?= e($c['all']) ?> <?= icon('ArrowRight', 'size-4') ?></a></li>
            <?php foreach ($items[$key] as $it): ?>
              <li><a href="<?= e($it['href']) ?>" class="flex min-h-11 items-center gap-3 rounded-lg px-2 py-2 font-semibold text-body active:bg-mist"><span class="text-brand-600"><?= icon($it['icon'], 'size-[1.125rem]', 1.75) ?></span><?= e($it['sub'] ?? $it['label']) ?></a></li>
            <?php endforeach; ?>
          </ul>
        </div>
      <?php endforeach; ?>
      <div class="mt-5 grid grid-cols-2 gap-3">
        <a href="/book/" class="<?= e(btn_class('primary', 'lg', 'w-full')) ?>">Book Now</a>
        <a href="<?= e(tel_href()) ?>" class="<?= e(btn_class('secondary', 'lg', 'w-full')) ?>" aria-label="Call <?= e($b['phone']['display']) ?>"><?= icon('Phone', 'size-5') ?> Call</a>
      </div>
      <ul class="mt-4">
        <?php foreach (site()['nav']['main'] as $l): ?>
          <li class="border-b border-line"><a href="<?= e($l['href']) ?>" class="flex min-h-14 items-center px-2 font-display text-lg font-bold text-navy-900"><?= e($l['label']) ?></a></li>
        <?php endforeach; ?>
      </ul>
      <div class="mt-6 space-y-3 rounded-[var(--radius-card)] bg-mist p-5 text-[0.9375rem]">
        <p class="flex items-start gap-2"><?= icon('MapPin', 'mt-1 size-4 shrink-0 text-brand-600') ?> <?= e($b['fullAddress']) ?></p>
        <a href="<?= e(mail_href()) ?>" class="flex min-h-11 items-center gap-2 break-all"><?= icon('Mail', 'size-4 shrink-0 text-brand-600') ?> <?= e($b['email']) ?></a>
      </div>
    </nav>
  </div>
</header>
<main id="main">
<?php })();
