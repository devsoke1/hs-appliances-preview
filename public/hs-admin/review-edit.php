<?php
declare(strict_types=1);
require __DIR__ . '/_inc/bootstrap.php';
require_admin();

$id = get_int('id');
$existing = $id ? db_one('SELECT * FROM reviews WHERE id = ?', [$id]) : null;
if ($id && !$existing) {
    flash('error', 'Review not found.');
    redirect('reviews.php');
}
$r = $existing ?? ['customer_name' => '', 'location' => '', 'rating' => 5, 'review_text' => '', 'service_id' => null, 'source' => 'Google', 'review_date' => '', 'is_active' => 1, 'sort_order' => 0];
$services = db_all('SELECT id, name FROM services ORDER BY sort_order, name');
$sources = ['Google', 'Facebook', 'Direct'];
$errors = [];

if (is_post()) {
    csrf_check();
    $serviceId = post_int('service_id');
    $r = array_merge($r, [
        'customer_name' => post_str('customer_name', 100),
        'location' => post_str('location', 100),
        'rating' => post_int('rating'),
        'review_text' => post_str('review_text', 3000, true),
        'service_id' => $serviceId > 0 ? $serviceId : null,
        'source' => in_array($_POST['source'] ?? '', $sources, true) ? $_POST['source'] : 'Google',
        'review_date' => post_str('review_date', 10),
        'is_active' => post_bool('is_active'),
        'sort_order' => post_int('sort_order'),
    ]);
    if ($r['customer_name'] === '') {
        $errors['customer_name'] = 'Enter the customer’s name as shown on the review.';
    }
    if ($r['rating'] < 1 || $r['rating'] > 5) {
        $errors['rating'] = 'Choose a rating from 1 to 5.';
    }
    if ($r['review_text'] === '') {
        $errors['review_text'] = 'Paste the review text.';
    }
    if ($r['service_id'] !== null && !db_value('SELECT COUNT(*) FROM services WHERE id = ?', [$r['service_id']])) {
        $r['service_id'] = null;
    }
    if ($r['review_date'] !== '') {
        $d = DateTimeImmutable::createFromFormat('!Y-m-d', $r['review_date']);
        if (!$d || $d->format('Y-m-d') !== $r['review_date'] || $d > new DateTimeImmutable('tomorrow')) {
            $errors['review_date'] = 'Enter a valid date (not in the future).';
        }
    }

    if (!$errors) {
        $data = [$r['customer_name'], $r['location'], $r['rating'], $r['review_text'], $r['service_id'], $r['source'], $r['review_date'] ?: null, $r['is_active'], $r['sort_order'], db_now()];
        if ($existing) {
            db_exec('UPDATE reviews SET customer_name = ?, location = ?, rating = ?, review_text = ?, service_id = ?, source = ?, review_date = ?, is_active = ?, sort_order = ?, updated_at = ? WHERE id = ?', [...$data, $id]);
        } else {
            db_exec('INSERT INTO reviews (customer_name, location, rating, review_text, service_id, source, review_date, is_active, sort_order, updated_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [...$data, db_now()]);
            $id = (int) db()->lastInsertId();
        }
        flash('success', $existing ? 'Review saved.' : 'Review added.');
        redirect('reviews.php');
    }
}

$title = $existing ? 'Edit review' : 'Add review';
admin_header($title, 'reviews');
page_head($title, '', 'Copy genuine reviews exactly as written. Never write or edit reviews yourself.');
if ($errors) {
    echo '<div class="alert alert-error" role="alert">Please fix the highlighted fields.</div>';
}
?>
<form method="post" class="card narrow stack">
  <?= csrf_field() ?>
  <div class="field-row">
    <div class="field">
      <label for="customer_name">Customer name <span class="req">*</span></label>
      <input id="customer_name" name="customer_name" maxlength="100" required value="<?= e($r['customer_name']) ?>"<?= invalid_attr($errors, 'customer_name') ?>>
      <?= field_error($errors, 'customer_name') ?>
    </div>
    <div class="field">
      <label for="location">Location</label>
      <input id="location" name="location" maxlength="100" value="<?= e($r['location']) ?>" placeholder="e.g. Feltham">
    </div>
  </div>

  <fieldset class="field">
    <legend>Rating <span class="req">*</span></legend>
    <div class="star-picker"<?= invalid_attr($errors, 'rating') ?>>
      <?php for ($i = 5; $i >= 1; $i--): ?>
        <input type="radio" id="rating-<?= $i ?>" name="rating" value="<?= $i ?>" <?= (int) $r['rating'] === $i ? 'checked' : '' ?>>
        <label for="rating-<?= $i ?>" title="<?= $i ?> star<?= $i > 1 ? 's' : '' ?>"><span class="sr-only"><?= $i ?> star<?= $i > 1 ? 's' : '' ?></span>★</label>
      <?php endfor; ?>
    </div>
    <?= field_error($errors, 'rating') ?>
  </fieldset>

  <div class="field">
    <label for="review_text">Review text <span class="req">*</span></label>
    <textarea id="review_text" name="review_text" rows="5" maxlength="3000" required<?= invalid_attr($errors, 'review_text') ?>><?= e($r['review_text']) ?></textarea>
    <?= field_error($errors, 'review_text') ?>
  </div>

  <div class="field-row">
    <div class="field">
      <label for="source">Source</label>
      <select id="source" name="source"><?php foreach ($sources as $src): ?><option <?= $r['source'] === $src ? 'selected' : '' ?>><?= e($src) ?></option><?php endforeach; ?></select>
    </div>
    <div class="field">
      <label for="review_date">Review date</label>
      <input id="review_date" name="review_date" type="date" value="<?= e($r['review_date']) ?>"<?= invalid_attr($errors, 'review_date') ?>>
      <?= field_error($errors, 'review_date') ?>
    </div>
  </div>

  <div class="field-row">
    <div class="field">
      <label for="service_id">Related service <span class="muted">(optional)</span></label>
      <select id="service_id" name="service_id">
        <option value="0">— None —</option>
        <?php foreach ($services as $s): ?><option value="<?= (int) $s['id'] ?>" <?= (int) $r['service_id'] === (int) $s['id'] ? 'selected' : '' ?>><?= e($s['name']) ?></option><?php endforeach; ?>
      </select>
    </div>
    <div class="field">
      <label for="sort_order">Sort order</label>
      <input id="sort_order" name="sort_order" type="number" value="<?= (int) $r['sort_order'] ?>">
    </div>
  </div>

  <label class="check"><input type="checkbox" name="is_active" value="1" <?= $r['is_active'] ? 'checked' : '' ?>> Show on the website</label>

  <div class="form-actions">
    <button class="btn btn-primary" type="submit">Save review</button>
    <a class="btn btn-ghost" href="<?= e(admin_url('reviews.php')) ?>">Cancel</a>
  </div>
</form>
<?php admin_footer(); ?>
