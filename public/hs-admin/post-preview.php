<?php
declare(strict_types=1);
require __DIR__ . '/_inc/bootstrap.php';
require_admin();

$p = db_one('SELECT * FROM posts WHERE id = ?', [get_int('id')]);
if (!$p) {
    http_response_code(404);
    exit('Not found');
}
$now = db_now();
$state = $p['status'] === 'draft' ? 'Draft' : ($p['published_at'] > $now ? 'Scheduled for ' . fmt_dt($p['published_at']) : 'Published');
?>
<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Preview: <?= e($p['title']) ?></title>
  <link rel="stylesheet" href="<?= e(admin_url('assets/admin.css')) ?>?v=1">
</head>
<body class="preview">
  <div class="preview-bar">Preview — <?= e($state) ?> · <a href="<?= e(admin_url('post-edit.php?id=' . (int) $p['id'])) ?>">Back to editor</a></div>
  <header class="preview-hero">
    <div class="preview-wrap">
      <p class="preview-eyebrow"><?= e($p['category'] ?: 'Insight') ?></p>
      <h1><?= e($p['title']) ?></h1>
      <?php if ($p['excerpt']): ?><p class="preview-lead"><?= e($p['excerpt']) ?></p><?php endif; ?>
      <p class="preview-meta">By <?= e($p['author']) ?><?= $p['published_at'] ? ' · ' . e(fmt_dt($p['published_at'], 'j F Y')) : '' ?></p>
    </div>
  </header>
  <article class="preview-wrap prose">
    <?php if ($p['featured_image']): ?><img src="<?= e($p['featured_image']) ?>" alt="<?= e($p['image_alt']) ?>" class="preview-feature"><?php endif; ?>
    <?= $p['content'] /* sanitised by HTMLPurifier on save */ ?>
  </article>
</body>
</html>
