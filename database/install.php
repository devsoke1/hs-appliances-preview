<?php
/**
 * ONE-TIME installer: creates the first admin account.
 *  - Lives in database/ so it is NOT deployed with the site. To use it, upload it into
 *    public_html/hs-admin/ (next to index.php), run it once, and it deletes itself.
 *  - Requires the install token from config.php (admin.install_token), so nobody else can
 *    create an admin between uploading the site and running this.
 *  - Refuses to run once any admin exists.
 *  - DELETE THIS FILE from the server after use (it tries to delete itself).
 */
declare(strict_types=1);
require __DIR__ . '/_inc/bootstrap.php';

$errors = [];
$done = false;
$selfDeleted = false;
$email = '';

$tableOk = true;
try {
    $existing = (int) db_value('SELECT COUNT(*) FROM admin_users');
} catch (PDOException) {
    $tableOk = false;
    $existing = 0;
}
$token = (string) hs_config()['admin']['install_token'];

if ($tableOk && $existing === 0 && $token !== '' && is_post()) {
    csrf_check();
    if (!hs_rate_hit('admin-install|' . hs_client_ip(), 10, 3600)) {
        $errors['form'] = 'Too many attempts. Try again in an hour.';
    } else {
        $email = mb_strtolower(post_str('email', 190));
        $pass = is_string($_POST['password'] ?? null) ? (string) $_POST['password'] : '';
        $pass2 = is_string($_POST['password_confirm'] ?? null) ? (string) $_POST['password_confirm'] : '';
        $sentToken = is_string($_POST['install_token'] ?? null) ? (string) $_POST['install_token'] : '';

        if (!hash_equals($token, $sentToken)) {
            $errors['install_token'] = 'The install token does not match config.php.';
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Enter a valid email address.';
        }
        if (mb_strlen($pass) < 12) {
            $errors['password'] = 'Use at least 12 characters.';
        } elseif (strlen($pass) > 72) {
            $errors['password'] = 'Use 72 characters or fewer.';
        } elseif ($pass !== $pass2) {
            $errors['password_confirm'] = 'The passwords do not match.';
        }
        if (!$errors) {
            db_exec('INSERT INTO admin_users (email, password_hash, created_at) VALUES (?, ?, ?)', [$email, password_hash($pass, PASSWORD_DEFAULT), db_now()]);
            hs_log('Admin account created via install.php', 'admin.log');
            $done = true;
            $selfDeleted = @unlink(__FILE__);
        }
    }
}

admin_header('Install');
?>
<div class="card auth-card">
  <div class="auth-brand"><span class="brand-mark">HS</span> <strong>HS Appliances Admin — setup</strong></div>
  <?php if ($done): ?>
    <h1>Admin account created ✓</h1>
    <?php if ($selfDeleted): ?>
      <div class="alert alert-success">install.php has deleted itself. Check in File Manager that <code>hs-admin/install.php</code> is gone.</div>
    <?php else: ?>
      <div class="alert alert-error" role="alert"><strong>Now delete <code>hs-admin/install.php</code></strong> from the server (File Manager → right-click → Delete).</div>
    <?php endif; ?>
    <p>Also remove <code>install_token</code> from config.php.</p>
    <p><a class="btn btn-primary" href="<?= e(admin_url('login.php')) ?>">Go to login</a></p>
  <?php elseif (!$tableOk): ?>
    <h1>Database not ready</h1>
    <p>The <code>admin_users</code> table wasn't found. Import <code>database/schema.sql</code> and <code>seed.sql</code> in phpMyAdmin first (see docs/admin-setup.md).</p>
  <?php elseif ($existing > 0): ?>
    <h1>Already installed</h1>
    <div class="alert alert-error" role="alert">An admin account already exists. <strong>Delete <code>hs-admin/install.php</code></strong> from the server.</div>
    <p><a href="<?= e(admin_url('login.php')) ?>">Go to login</a></p>
  <?php elseif ($token === ''): ?>
    <h1>Install token missing</h1>
    <p>Add a long random <code>'install_token'</code> under <code>'admin'</code> in config.php, then reload this page.</p>
  <?php else: ?>
    <h1>Create the first admin</h1>
    <?php if (isset($errors['form'])): ?><div class="alert alert-error" role="alert"><?= e($errors['form']) ?></div><?php endif; ?>
    <form method="post" class="stack" novalidate>
      <?= csrf_field() ?>
      <div class="field">
        <label for="install_token">Install token <span class="muted">(from config.php)</span></label>
        <input id="install_token" name="install_token" type="password" required autocomplete="off"<?= invalid_attr($errors, 'install_token') ?>>
        <?= field_error($errors, 'install_token') ?>
      </div>
      <div class="field">
        <label for="email">Admin email</label>
        <input id="email" name="email" type="email" required autocomplete="username" value="<?= e($email) ?>"<?= invalid_attr($errors, 'email') ?>>
        <?= field_error($errors, 'email') ?>
      </div>
      <div class="field">
        <label for="password">Password <span class="muted">(12+ characters)</span></label>
        <input id="password" name="password" type="password" required minlength="12" autocomplete="new-password"<?= invalid_attr($errors, 'password') ?>>
        <?= field_error($errors, 'password') ?>
      </div>
      <div class="field">
        <label for="password_confirm">Confirm password</label>
        <input id="password_confirm" name="password_confirm" type="password" required autocomplete="new-password"<?= invalid_attr($errors, 'password_confirm') ?>>
        <?= field_error($errors, 'password_confirm') ?>
      </div>
      <button class="btn btn-primary btn-block" type="submit">Create admin</button>
    </form>
  <?php endif; ?>
</div>
<?php admin_footer(); ?>
