<?php
declare(strict_types=1);
require __DIR__ . '/_inc/bootstrap.php';
require_admin();

$keys = ['homepage_services_limit', 'google_rating', 'google_review_count', 'google_reviews_url', 'phone', 'email', 'address', 'booking_days', 'booking_days_ahead', 'booking_lead_minutes'];
$values = array_merge(array_fill_keys($keys, ''), ['booking_days' => '1,2,3,4,5,6', 'booking_days_ahead' => '30', 'booking_lead_minutes' => '120'], array_intersect_key(settings_all(), array_flip($keys)));
const WEEKDAYS = [1 => 'Mon', 2 => 'Tue', 3 => 'Wed', 4 => 'Thu', 5 => 'Fri', 6 => 'Sat', 7 => 'Sun'];
$errors = [];

if (is_post()) {
    csrf_check();
    foreach ($keys as $k) {
        if ($k !== 'booking_days') {
            $values[$k] = post_str($k, $k === 'address' ? 300 : 255);
        }
    }
    $days = array_values(array_intersect(array_keys(WEEKDAYS), array_map('intval', (array) ($_POST['booking_days'] ?? []))));
    $values['booking_days'] = implode(',', $days);
    if (!$days) {
        $errors['booking_days'] = 'Choose at least one day.';
    }
    foreach (['booking_days_ahead' => [1, 365], 'booking_lead_minutes' => [0, 10080]] as $k => [$min, $max]) {
        $n = filter_var($values[$k], FILTER_VALIDATE_INT, ['options' => ['min_range' => $min, 'max_range' => $max]]);
        if ($n === false) {
            $errors[$k] = "Enter a number from {$min} to {$max}.";
        } else {
            $values[$k] = (string) $n;
        }
    }
    $limit = filter_var($values['homepage_services_limit'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 50]]);
    if ($limit === false) {
        $errors['homepage_services_limit'] = 'Enter a number from 1 to 50.';
    } else {
        $values['homepage_services_limit'] = (string) $limit;
    }
    if ($values['google_rating'] !== '') {
        $rating = filter_var($values['google_rating'], FILTER_VALIDATE_FLOAT);
        if ($rating === false || $rating < 1 || $rating > 5) {
            $errors['google_rating'] = 'Enter your Google rating between 1.0 and 5.0, e.g. 4.9.';
        } else {
            $values['google_rating'] = number_format($rating, 1, '.', '');
        }
    }
    if ($values['google_review_count'] !== '' && filter_var($values['google_review_count'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 0]]) === false) {
        $errors['google_review_count'] = 'Enter a whole number.';
    }
    if ($values['google_reviews_url'] !== '' && (!filter_var($values['google_reviews_url'], FILTER_VALIDATE_URL) || !str_starts_with($values['google_reviews_url'], 'https://'))) {
        $errors['google_reviews_url'] = 'Enter a full https:// link.';
    }
    if ($values['email'] !== '' && !filter_var($values['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Enter a valid email address.';
    }
    if ($values['phone'] !== '' && !preg_match('/^[0-9 +()\-]{10,20}$/', $values['phone'])) {
        $errors['phone'] = 'Enter a valid phone number.';
    }

    if (!$errors) {
        db()->beginTransaction();
        foreach ($keys as $k) {
            // REPLACE INTO works on MySQL, MariaDB and SQLite
            db_exec('REPLACE INTO settings (setting_key, setting_value, updated_at) VALUES (?, ?, ?)', [$k, $values[$k], db_now()]);
        }
        db()->commit();
        flash('success', 'Settings saved.');
        redirect('settings.php');
    }
}

admin_header('Settings', 'settings');
page_head('Settings');
if ($errors) {
    echo '<div class="alert alert-error" role="alert">Please fix the highlighted fields.</div>';
}
$field = static function (string $key, string $label, string $type = 'text', string $hint = '', array $attrs = []) use ($values, $errors): void {
    $extra = '';
    foreach ($attrs as $a => $v) {
        $extra .= ' ' . $a . '="' . e($v) . '"';
    }
    echo '<div class="field"><label for="' . e($key) . '">' . e($label) . '</label>'
        . '<input id="' . e($key) . '" name="' . e($key) . '" type="' . e($type) . '" value="' . e($values[$key]) . '"' . $extra . invalid_attr($errors, $key) . '>'
        . field_error($errors, $key) . ($hint !== '' ? '<p class="hint">' . e($hint) . '</p>' : '') . '</div>';
};
?>
<form method="post" class="narrow stack">
  <?= csrf_field() ?>
  <section class="card stack">
    <h2>Homepage</h2>
    <?php $field('homepage_services_limit', 'Number of services on the homepage', 'number', 'Featured services are shown first.', ['min' => '1', 'max' => '50']); ?>
  </section>
  <section class="card stack">
    <h2>Online booking</h2>
    <fieldset class="field">
      <legend>Days customers can book</legend>
      <div class="toggles">
        <?php $on = array_map('intval', explode(',', $values['booking_days'])); foreach (WEEKDAYS as $n => $label): ?>
          <label class="check"><input type="checkbox" name="booking_days[]" value="<?= $n ?>" <?= in_array($n, $on, true) ? 'checked' : '' ?>> <?= e($label) ?></label>
        <?php endforeach; ?>
      </div>
      <?= field_error($errors, 'booking_days') ?>
    </fieldset>
    <div class="field-row">
      <?php $field('booking_days_ahead', 'How many days ahead', 'number', 'e.g. 30', ['min' => '1', 'max' => '365']); ?>
      <?php $field('booking_lead_minutes', 'Minimum notice (minutes)', 'number', 'e.g. 120 = slots starting within 2 hours can’t be booked.', ['min' => '0', 'max' => '10080']); ?>
    </div>
    <p class="hint">Slots are 09:00–11:00, 11:00–13:00, 13:00–15:00, 15:00–17:00 and 17:00–19:00. Block holidays or single slots in <a href="<?= e(admin_url('bookings.php')) ?>">Bookings</a>.</p>
  </section>
  <section class="card stack">
    <h2>Google reviews</h2>
    <p class="muted small">Copy these from your Google Business Profile. Leave empty until they’re real — nothing is shown while empty.</p>
    <div class="field-row">
      <?php $field('google_rating', 'Google rating', 'text', 'e.g. 4.9', ['inputmode' => 'decimal']); ?>
      <?php $field('google_review_count', 'Number of reviews', 'number', '', ['min' => '0']); ?>
    </div>
    <?php $field('google_reviews_url', 'Google reviews link', 'url', 'The “read reviews” link from Google Maps.'); ?>
  </section>
  <section class="card stack">
    <h2>Contact details</h2>
    <?php $field('phone', 'Phone', 'tel'); ?>
    <?php $field('email', 'Email', 'email'); ?>
    <?php $field('address', 'Address'); ?>
    <p class="hint">Keep these identical to your Google Business Profile.</p>
  </section>
  <div class="form-actions"><button class="btn btn-primary" type="submit">Save settings</button></div>
</form>
<?php admin_footer(); ?>
