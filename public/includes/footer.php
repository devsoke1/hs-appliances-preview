<?php
/**
 * Site footer + mobile Call/Book bar — same markup/classes as Footer.tsx / MobileBottomBar.tsx.
 * Service links come live from the database.
 */
declare(strict_types=1);

(static function (): void {

$b = biz();
$fl = 'inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-white lg:min-h-0 lg:min-w-0';
?>
</main>
<footer class="bg-navy-950 text-[0.9375rem] text-white/65">
  <div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:py-14 lg:grid-cols-12 lg:gap-8">
    <div class="col-span-2 lg:col-span-4">
      <?= logo_html(true) ?>
      <p class="mt-5 max-w-sm text-base">Repair, installation and maintenance for domestic appliances and commercial refrigeration across <?= e($b['serviceAreaSummary']) ?>.</p>
      <address class="mt-6 space-y-1 not-italic">
        <p class="flex items-start gap-3 py-1"><?= icon('MapPin', 'mt-1 size-4 shrink-0 text-accent-400') ?><span><?= e($b['name']) ?><br><?= e($b['fullAddress']) ?></span></p>
        <a href="<?= e(tel_href()) ?>" class="flex min-h-11 items-center gap-3 font-semibold text-white hover:text-accent-400"><?= icon('Phone', 'size-4 shrink-0 text-accent-400') ?> <?= e($b['phone']['display']) ?></a>
        <a href="<?= e(mail_href()) ?>" class="flex min-h-11 items-center gap-3 break-all hover:text-white"><?= icon('Mail', 'size-4 shrink-0 text-accent-400') ?> <?= e($b['email']) ?></a>
      </address>
      <div class="mt-4 flex items-start gap-3">
        <?= icon('Clock', 'mt-1 size-4 shrink-0 text-accent-400') ?>
        <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
          <?php foreach ($b['hoursGrouped'] as $h): ?>
            <div class="contents"><dt class="text-white/60"><?= e($h['label']) ?></dt><dd class="text-white/85"><?= e($h['value']) ?></dd></div>
          <?php endforeach; ?>
        </dl>
      </div>
      <?php if (empty($b['hoursConfirmed'])): ?><p class="mt-2 pl-7 font-mono text-[0.6875rem] tracking-wide text-accent-400 uppercase">[CONFIRM HOURS]</p><?php endif; ?>
    </div>

    <?php foreach (['domestic' => 'Domestic', 'commercial' => 'Commercial'] as $cat => $title): ?>
      <div class="lg:col-span-2">
        <p class="mb-2 font-display text-sm font-bold tracking-[0.12em] text-white uppercase lg:mb-4"><?= e($title) ?></p>
        <ul class="lg:space-y-2.5">
          <?php foreach (services_by_category($cat) as $s): ?>
            <li><a href="<?= e(service_url($s['slug'])) ?>" class="<?= $fl ?>"><?= e(service_label($s)) ?> Repair</a></li>
          <?php endforeach; ?>
        </ul>
      </div>
    <?php endforeach; ?>

    <div class="lg:col-span-2">
      <p class="mb-2 font-display text-sm font-bold tracking-[0.12em] text-white uppercase lg:mb-4">Areas</p>
      <ul class="lg:space-y-2.5">
        <?php foreach (site()['areas'] as $a): ?>
          <li><a href="/areas/<?= e($a['slug']) ?>/" class="<?= $fl ?>"><?= e($a['name']) ?></a></li>
        <?php endforeach; ?>
      </ul>
    </div>

    <div class="lg:col-span-2">
      <p class="mb-2 font-display text-sm font-bold tracking-[0.12em] text-white uppercase lg:mb-4">Company</p>
      <ul class="lg:space-y-2.5">
        <?php foreach (site()['nav']['company'] as $l): ?>
          <li><a href="<?= e($l['href']) ?>" class="<?= $fl ?>"><?= e($l['label']) ?></a></li>
        <?php endforeach; ?>
      </ul>
    </div>
  </div>

  <div class="border-t border-white/10">
    <div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-4 py-6 text-[0.8125rem] lg:flex-row lg:items-start lg:justify-between">
      <div class="space-y-1.5">
        <p>© <?= date('Y') ?> <?= e($b['name']) ?>. <?= e($b['legalName']) ?> · <?= e($b['companyNumber']) ?></p>
        <p class="max-w-3xl text-white/60"><?= e(site()['brandDisclaimer']) ?></p>
      </div>
      <ul class="flex flex-wrap gap-x-5">
        <?php foreach (site()['nav']['legal'] as $l): ?>
          <li><a href="<?= e($l['href']) ?>" class="<?= $fl ?>"><?= e($l['label']) ?></a></li>
        <?php endforeach; ?>
        <?php if (!empty(site()['analytics']['ga4'])): ?><li><button type="button" data-cookie-settings class="<?= $fl ?>">Cookie settings</button></li><?php endif; ?>
      </ul>
    </div>
  </div>
</footer>

<div class="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgb(11_29_58/0.08)] backdrop-blur lg:hidden">
  <div class="grid grid-cols-2 gap-2">
    <a href="<?= e(tel_href()) ?>" class="flex h-12 items-center justify-center gap-2 rounded-lg bg-navy-900 font-display font-bold text-white active:bg-navy-700"><?= icon('Phone', 'size-5') ?> Call now</a>
    <a href="/book/" class="flex h-12 items-center justify-center gap-2 rounded-lg bg-accent-600 font-display font-bold text-white active:bg-accent-700"><?= icon('CalendarCheck', 'size-5') ?> Book a repair</a>
  </div>
</div>
<script src="/assets/js/site.js?v=<?= (int) @filemtime(PUBLIC_ROOT . '/assets/js/site.js') ?>" defer></script>
</body>
</html>
<?php })();
