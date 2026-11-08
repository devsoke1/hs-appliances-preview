<?php
/**
 * Site header — same markup/classes as src/components/layout/Header.tsx.
 * Services in the mega menu and mobile drawer come live from the database.
 * Behaviour (mega menu, drawer, scroll shadow) is in /assets/js/site.js.
 */
declare(strict_types=1);

(static function (): void {

$b = biz();
$domestic = services_by_category('domestic');
$commercial = services_by_category('commercial');
$path = current_path();
$isActive = static fn (string $href): bool => $path === $href || str_starts_with($path, $href);


$megaColumn = static function (string $title, array $items, string $class, int $cols): void {
    ?>
    <div class="<?= e($class) ?>">
      <p class="mb-3 border-b border-line pb-3 font-display text-xs font-bold tracking-[0.12em] text-muted uppercase"><?= e($title) ?></p>
      <ul class="grid gap-x-4 gap-y-0.5 <?= $cols === 2 ? 'grid-cols-2' : 'grid-cols-1' ?>">
        <?php foreach ($items as $s): ?>
          <li>
            <a href="<?= e(service_url($s['slug'])) ?>" class="group flex items-center gap-3 rounded-lg px-2 py-2 font-semibold text-navy-900 transition-colors hover:bg-mist hover:text-brand-600">
              <span class="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600 transition-colors group-hover:bg-white"><?= icon($s['icon'] ?: 'Wrench', 'size-[1.125rem]', 1.75) ?></span>
              <span class="text-[0.9375rem]"><?= e(service_label($s)) ?></span>
            </a>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
    <?php
};
?>
<div class="hidden bg-navy-950 text-[0.8125rem] text-white/70 md:block">
  <div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex h-11 items-center justify-between gap-6">
    <div class="flex items-center gap-6">
      <span class="inline-flex items-center gap-1.5"><?= icon('MapPin', 'size-3.5 text-accent-400') ?><?= e($b['fullAddress']) ?></span>
      <span class="hidden items-center gap-1.5 lg:inline-flex"><?= icon('Clock', 'size-3.5 text-accent-400') ?><?= e(implode(' · ', array_map(static fn ($h) => $h['label'] . ' ' . $h['value'], $b['hoursGrouped']))) ?></span>
    </div>
    <a href="<?= e(mail_href()) ?>" class="inline-flex min-h-11 items-center gap-1.5 hover:text-white"><?= icon('Mail', 'size-3.5 text-accent-400') ?><?= e($b['email']) ?></a>
  </div>
</div>

<header id="site-header" class="sticky top-0 z-50 border-b bg-white transition-shadow border-transparent" data-scrolled-class="border-line shadow-[0_6px_24px_-12px_rgb(11_29_58/0.25)]">
  <div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between gap-4 lg:h-20">
    <?= logo_html() ?>

    <nav aria-label="Main" class="hidden lg:block">
      <ul class="flex items-center gap-1">
        <li data-mega-trigger>
          <button type="button" aria-expanded="false" aria-controls="mega-menu" data-mega-button class="inline-flex h-11 items-center gap-1 rounded-lg px-3.5 font-display text-[0.9375rem] font-semibold transition-colors <?= str_starts_with($path, '/services') ? 'text-brand-600' : 'text-navy-900 hover:text-brand-600' ?>">
            Services <?= icon('ChevronDown', 'size-4 transition-transform') ?>
          </button>
        </li>
        <?php foreach (site()['nav']['main'] as $l): $active = $isActive($l['href']); ?>
          <li>
            <a href="<?= e($l['href']) ?>"<?= $active ? ' aria-current="page"' : '' ?> class="inline-flex h-11 items-center rounded-lg px-3.5 font-display text-[0.9375rem] font-semibold transition-colors <?= $active ? 'text-brand-600' : 'text-navy-900 hover:text-brand-600' ?>"><?= e($l['label']) ?></a>
          </li>
        <?php endforeach; ?>
      </ul>
    </nav>

    <div class="flex items-center gap-2 sm:gap-3">
      <a href="<?= e(tel_href()) ?>" class="group hidden items-center gap-2.5 lg:flex" aria-label="Call <?= e($b['phone']['display']) ?>">
        <span class="grid size-10 place-items-center rounded-full bg-brand-50 text-brand-600 transition-colors group-hover:bg-navy-900 group-hover:text-white"><?= icon('Phone', 'size-[1.125rem]') ?></span>
        <span class="hidden flex-col leading-tight xl:flex">
          <span class="text-xs font-semibold text-muted">Call us</span>
          <span class="font-display text-[1.0625rem] font-extrabold text-navy-900"><?= e($b['phone']['display']) ?></span>
        </span>
      </a>
      <a href="/book/" class="<?= e(btn_class('primary', 'md', 'max-sm:hidden')) ?>">Book a Repair</a>
      <a href="<?= e(tel_href()) ?>" class="grid size-11 place-items-center rounded-lg bg-brand-50 text-brand-600 lg:hidden" aria-label="Call <?= e($b['phone']['display']) ?>"><?= icon('Phone', 'size-5') ?></a>
      <button type="button" data-menu-button aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu" class="grid size-11 place-items-center rounded-lg bg-navy-900 text-white lg:hidden">
        <span data-icon-open><?= icon('Menu', 'size-5') ?></span>
        <span data-icon-close hidden><?= icon('X', 'size-5') ?></span>
      </button>
    </div>
  </div>

  <div id="mega-menu" hidden data-mega-panel class="absolute inset-x-0 top-full hidden animate-fade-down border-t border-line bg-white shadow-[0_24px_48px_-16px_rgb(11_29_58/0.25)] lg:block">
    <div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-12 gap-8 py-8">
      <?php $megaColumn('Domestic appliances', $domestic, 'col-span-5', 2); ?>
      <?php $megaColumn('Commercial refrigeration', $commercial, 'col-span-4', 1); ?>
      <div class="col-span-3 flex flex-col justify-between rounded-[var(--radius-card)] bg-navy-900 bg-blueprint p-6 text-white">
        <div>
          <p class="font-display text-lg font-bold">Not sure what&rsquo;s wrong?</p>
          <p class="mt-2 text-sm text-white/70">Describe the fault and the appliance make &amp; model — we&rsquo;ll talk you through the next step.</p>
        </div>
        <div class="mt-6 space-y-2">
          <a href="<?= e(tel_href()) ?>" class="<?= e(btn_class('primary', 'md', 'w-full')) ?>"><?= icon('Phone', 'size-4') ?> <?= e($b['phone']['display']) ?></a>
          <a href="/services/" class="flex items-center justify-center gap-1 py-2 text-sm font-semibold text-white/80 hover:text-white">All services <?= icon('ArrowRight', 'size-4') ?></a>
        </div>
      </div>
    </div>
  </div>

  <div id="mobile-menu" hidden class="absolute inset-x-0 top-full z-50 h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-line bg-white lg:hidden">
    <nav aria-label="Mobile" class="px-4 pt-4 pb-32">
      <p class="px-2 pb-2 font-display text-xs font-bold tracking-[0.12em] text-muted uppercase">Services</p>
      <?php foreach (['domestic' => ['Domestic appliances', $domestic], 'commercial' => ['Commercial refrigeration', $commercial]] as $key => [$title, $items]): ?>
        <div class="border-b border-line">
          <button type="button" data-accordion-button aria-expanded="false" aria-controls="mm-<?= $key ?>" class="flex min-h-14 w-full items-center justify-between px-2 py-3 font-display text-lg font-bold text-navy-900">
            <?= e($title) ?> <?= icon('ChevronDown', 'size-5 transition-transform') ?>
          </button>
          <ul id="mm-<?= $key ?>" hidden class="grid grid-cols-1 gap-0.5 pb-3 sm:grid-cols-2">
            <?php foreach ($items as $s): ?>
              <li><a href="<?= e(service_url($s['slug'])) ?>" class="flex min-h-11 items-center gap-3 rounded-lg px-2 py-2 font-semibold text-body active:bg-mist"><?= icon($s['icon'] ?: 'Wrench', 'size-5 text-brand-600', 1.75) ?><?= e($s['name']) ?></a></li>
            <?php endforeach; ?>
            <li><a href="/services/" class="flex min-h-11 items-center gap-1 px-2 py-2 font-semibold text-brand-600">All services <?= icon('ArrowRight', 'size-4') ?></a></li>
          </ul>
        </div>
      <?php endforeach; ?>
      <ul class="mt-2">
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
