<?php
declare(strict_types=1);
require __DIR__ . '/_inc/bootstrap.php';
$user = require_admin();

$now = db_now();
$counts = [
    'services' => (int) db_value('SELECT COUNT(*) FROM services'),
    'services_active' => (int) db_value('SELECT COUNT(*) FROM services WHERE is_active = 1'),
    'published' => (int) db_value("SELECT COUNT(*) FROM posts WHERE status = 'published' AND published_at <= ?", [$now]),
    'scheduled' => (int) db_value("SELECT COUNT(*) FROM posts WHERE status = 'published' AND published_at > ?", [$now]),
    'drafts' => (int) db_value("SELECT COUNT(*) FROM posts WHERE status = 'draft'"),
    'reviews' => (int) db_value('SELECT COUNT(*) FROM reviews'),
    'reviews_active' => (int) db_value('SELECT COUNT(*) FROM reviews WHERE is_active = 1'),
];
$todayUk = (new DateTimeImmutable('today', uk_tz()))->format('Y-m-d');
$counts['bookings'] = (int) db_value("SELECT COUNT(*) FROM bookings WHERE status = 'confirmed' AND slot_date >= ?", [$todayUk]);
$counts['bookings_today'] = (int) db_value("SELECT COUNT(*) FROM bookings WHERE status = 'confirmed' AND slot_date = ?", [$todayUk]);
$recent = db_all('SELECT id, title, status, published_at, updated_at FROM posts ORDER BY updated_at DESC, id DESC LIMIT 5');
$installLeft = is_file(__DIR__ . '/install.php');

admin_header('Dashboard', 'dashboard');
page_head('Dashboard', '', 'Signed in as ' . $user['email']);
?>
<?php if ($installLeft): ?>
  <div class="alert alert-error" role="alert"><strong>Security:</strong> delete <code>hs-admin/install.php</code> from the server now.</div>
<?php endif; ?>

<div class="stat-grid">
  <a class="stat" href="<?= e(admin_url('bookings.php')) ?>">
    <span class="stat-label">Upcoming bookings</span><span class="stat-value"><?= $counts['bookings'] ?></span>
    <span class="stat-sub"><?= $counts['bookings_today'] ?> today</span>
  </a>
  <a class="stat" href="<?= e(admin_url('services.php')) ?>">
    <span class="stat-label">Services</span><span class="stat-value"><?= $counts['services'] ?></span>
    <span class="stat-sub"><?= $counts['services_active'] ?> active</span>
  </a>
  <a class="stat" href="<?= e(admin_url('posts.php?status=published')) ?>">
    <span class="stat-label">Published insights</span><span class="stat-value"><?= $counts['published'] ?></span>
    <span class="stat-sub"><?= $counts['scheduled'] ?> scheduled</span>
  </a>
  <a class="stat" href="<?= e(admin_url('posts.php?status=draft')) ?>">
    <span class="stat-label">Drafts</span><span class="stat-value"><?= $counts['drafts'] ?></span>
    <span class="stat-sub">not public</span>
  </a>
  <a class="stat" href="<?= e(admin_url('reviews.php')) ?>">
    <span class="stat-label">Reviews</span><span class="stat-value"><?= $counts['reviews'] ?></span>
    <span class="stat-sub"><?= $counts['reviews_active'] ?> shown</span>
  </a>
</div>

<section class="card">
  <h2>Quick add</h2>
  <div class="quick-actions">
    <a class="btn btn-primary" href="<?= e(admin_url('post-edit.php')) ?>">+ New insight</a>
    <a class="btn" href="<?= e(admin_url('service-edit.php')) ?>">+ New service</a>
    <a class="btn" href="<?= e(admin_url('review-edit.php')) ?>">+ New review</a>
    <a class="btn btn-ghost" href="<?= e(admin_url('settings.php')) ?>">Settings</a>
  </div>
</section>

<section class="card">
  <h2>Recently edited insights</h2>
  <?php if (!$recent): ?>
    <p class="muted">No insights yet.</p>
  <?php else: ?>
    <ul class="simple-list">
      <?php foreach ($recent as $p):
          $scheduled = $p['status'] === 'published' && $p['published_at'] > $now; ?>
        <li>
          <a href="<?= e(admin_url('post-edit.php?id=' . (int) $p['id'])) ?>"><?= e($p['title']) ?></a>
          <span class="badge <?= $p['status'] === 'draft' ? 'badge-muted' : ($scheduled ? 'badge-warn' : 'badge-ok') ?>"><?= $p['status'] === 'draft' ? 'Draft' : ($scheduled ? 'Scheduled' : 'Published') ?></span>
          <span class="muted small">edited <?= e(fmt_dt($p['updated_at'])) ?></span>
        </li>
      <?php endforeach; ?>
    </ul>
  <?php endif; ?>
</section>
<?php admin_footer(); ?>
