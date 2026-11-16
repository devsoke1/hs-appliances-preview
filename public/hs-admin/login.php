<?php
declare(strict_types=1);
require __DIR__ . '/_inc/bootstrap.php';

if (current_admin()) {
    redirect('');
}

$error = '';
$email = '';
$next = get_str('next', 300);
if (!str_starts_with($next, '/hs-admin/') || str_contains($next, '//') || str_contains($next, '\\')) {
    $next = '/hs-admin/';
}

if (is_post()) {
    csrf_check();
    $email = post_str('email', 190);
    $password = is_string($_POST['password'] ?? null) ? (string) $_POST['password'] : '';
    $error = attempt_login($email, $password) ?? '';
    if ($error === '') {
        header('Location: ' . $next, true, 303);
        exit;
    }
}

admin_header('Log in');
?>
<div class="card auth-card">
  <div class="auth-brand"><img class="auth-logo" src="/images/logo.png" alt="HS Appliances" width="2411" height="395"></div>
  <h1>Log in</h1>
  <?php if ($error): ?><div class="alert alert-error" role="alert"><?= e($error) ?></div><?php endif; ?>
  <form method="post" class="stack" novalidate>
    <?= csrf_field() ?>
    <div class="field">
      <label for="email">Email</label>
      <input id="email" name="email" type="email" autocomplete="username" required value="<?= e($email) ?>" autofocus>
    </div>
    <div class="field">
      <label for="password">Password</label>
      <input id="password" name="password" type="password" autocomplete="current-password" required>
    </div>
    <button class="btn btn-primary btn-block" type="submit">Log in</button>
  </form>
</div>
<?php admin_footer(); ?>
