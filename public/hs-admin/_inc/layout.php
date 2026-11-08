<?php
declare(strict_types=1);

if (!defined('HS_ADMIN')) {
    http_response_code(403);
    exit;
}

const ADMIN_NAV = [
    'dashboard' => ['Dashboard', '', 'M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z'],
    'services' => ['Services', 'services.php', 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z'],
    'posts' => ['Insights', 'posts.php', 'M4 4h16v16H4zM8 8h8M8 12h8M8 16h5'],
    'reviews' => ['Reviews', 'reviews.php', 'm12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z'],
    'settings' => ['Settings', 'settings.php', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3a7.4 7.4 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7.6 7.6 0 0 0-2-1.2L14.5 3h-5l-.4 2.6a7.6 7.6 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7.6 7.6 0 0 0 2 1.2l.4 2.6h5l.4-2.6a7.6 7.6 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z'],
];

function icon_svg(string $path, string $class = 'ico'): string
{
    return '<svg class="' . e($class) . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' . e($path) . '"/></svg>';
}

function admin_header(string $title, string $active = '', array $opts = []): void
{
    $user = current_admin();
    $flashes = take_flashes();
    $extraHead = $opts['head'] ?? '';
    ?>
<!doctype html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="robots" content="noindex, nofollow">
  <meta name="theme-color" content="#0b1d3a">
  <title><?= e($title) ?> · HS Admin</title>
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="<?= e(admin_url('assets/admin.css')) ?>?v=1">
  <?= $extraHead ?>
</head>
<body class="<?= $user ? 'has-nav' : '' ?>">
<?php if ($user): ?>
  <header class="topbar">
    <a class="brand" href="<?= e(admin_url('')) ?>"><span class="brand-mark">HS</span><span>Admin</span></a>
    <div class="topbar-actions">
      <a class="btn btn-ghost btn-sm hide-sm" href="/" target="_blank" rel="noopener">View site ↗</a>
      <form method="post" action="<?= e(admin_url('logout.php')) ?>">
        <?= csrf_field() ?>
        <button class="btn btn-ghost btn-sm" type="submit">Log out</button>
      </form>
    </div>
  </header>
  <nav class="sidenav" aria-label="Admin">
    <?php foreach (ADMIN_NAV as $key => [$label, $href, $path]): ?>
      <a href="<?= e(admin_url($href)) ?>" class="<?= $active === $key ? 'active' : '' ?>" <?= $active === $key ? 'aria-current="page"' : '' ?>>
        <?= icon_svg($path) ?><span><?= e($label) ?></span>
      </a>
    <?php endforeach; ?>
  </nav>
<?php endif; ?>
  <main class="<?= $user ? 'content' : 'auth' ?>" id="main">
    <?php foreach ($flashes as $f): ?>
      <div class="alert alert-<?= e($f['type']) ?>" role="<?= $f['type'] === 'error' ? 'alert' : 'status' ?>"><?= e($f['message']) ?></div>
    <?php endforeach; ?>
<?php
}

function admin_footer(array $scripts = []): void
{
    ?>
  </main>
  <script src="<?= e(admin_url('assets/admin.js')) ?>?v=1" defer></script>
  <?php foreach ($scripts as $s): ?>
  <script src="<?= e($s) ?>" defer></script>
  <?php endforeach; ?>
</body>
</html>
<?php
}

/** Page heading with optional action buttons (raw HTML, caller escapes). */
function page_head(string $title, string $actionsHtml = '', string $subtitle = ''): void
{
    echo '<div class="page-head"><div><h1>' . e($title) . '</h1>' . ($subtitle !== '' ? '<p class="muted">' . e($subtitle) . '</p>' : '') . '</div>'
        . ($actionsHtml !== '' ? '<div class="page-actions">' . $actionsHtml . '</div>' : '') . '</div>';
}

/** Inline field error. */
function field_error(array $errors, string $key): string
{
    return isset($errors[$key]) ? '<p class="field-error" id="err-' . e($key) . '">' . e($errors[$key]) . '</p>' : '';
}

function invalid_attr(array $errors, string $key): string
{
    return isset($errors[$key]) ? ' aria-invalid="true" aria-describedby="err-' . e($key) . '"' : '';
}

function stars(int $n): string
{
    $n = max(0, min(5, $n));
    return '<span class="stars" aria-label="' . $n . ' out of 5 stars">' . str_repeat('★', $n) . '<span class="stars-off">' . str_repeat('★', 5 - $n) . '</span></span>';
}
