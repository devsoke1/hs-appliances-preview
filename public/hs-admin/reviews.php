<?php
declare(strict_types=1);
require __DIR__ . '/_inc/bootstrap.php';
require_admin();

if (is_post()) {
    csrf_check();
    if (($id = post_int('toggle_active')) > 0) {
        db_exec('UPDATE reviews SET is_active = 1 - is_active, updated_at = ? WHERE id = ?', [db_now(), $id]);
        flash('success', 'Visibility updated.');
    } elseif (($id = post_int('delete')) > 0) {
        db_exec('DELETE FROM reviews WHERE id = ?', [$id]);
        flash('success', 'Review deleted.');
    } elseif (isset($_POST['save_order']) && is_array($_POST['order'] ?? null)) {
        $n = 0;
        foreach ($_POST['order'] as $id => $order) {
            $id = filter_var($id, FILTER_VALIDATE_INT);
            $order = filter_var($order, FILTER_VALIDATE_INT);
            if ($id && $order !== false) {
                $n += db_exec('UPDATE reviews SET sort_order = ? WHERE id = ? AND sort_order <> ?', [$order, $id, $order]);
            }
        }
        flash('success', $n ? "Sort order saved ($n changed)." : 'Sort order unchanged.');
    }
    redirect('reviews.php');
}

$rows = db_all('SELECT r.*, s.name AS service_name FROM reviews r LEFT JOIN services s ON s.id = r.service_id ORDER BY r.sort_order ASC, r.review_date DESC, r.id DESC');

admin_header('Reviews', 'reviews');
page_head('Reviews', '<a class="btn btn-primary" href="' . e(admin_url('review-edit.php')) . '">+ Add review</a>', 'Only add genuine reviews from real customers.');
?>
<?php if (!$rows): ?>
  <div class="card empty">No reviews yet. Copy your real Google reviews in with <a href="<?= e(admin_url('review-edit.php')) ?>">Add review</a>.</div>
<?php else: ?>
<form method="post">
  <?= csrf_field() ?>
  <table class="table responsive">
    <thead><tr><th class="col-order">Order</th><th>Customer</th><th>Rating</th><th>Review</th><th>Status</th><th class="col-actions"><span class="sr-only">Actions</span></th></tr></thead>
    <tbody>
    <?php foreach ($rows as $r): ?>
      <tr>
        <td data-label="Order"><input class="order-input" type="number" name="order[<?= (int) $r['id'] ?>]" value="<?= (int) $r['sort_order'] ?>" aria-label="Sort order"></td>
        <td data-label="Customer">
          <a class="row-title" href="<?= e(admin_url('review-edit.php?id=' . (int) $r['id'])) ?>"><?= e($r['customer_name']) ?></a>
          <div class="muted small"><?= e(implode(' · ', array_filter([$r['location'], $r['source'], $r['review_date'] ? fmt_dt($r['review_date'] . ' 12:00:00', 'j M Y') : '']))) ?></div>
        </td>
        <td data-label="Rating"><?= stars((int) $r['rating']) ?></td>
        <td data-label="Review" class="clamp"><?= e(mb_strimwidth($r['review_text'], 0, 140, '…')) ?><?= $r['service_name'] ? '<div class="muted small">' . e($r['service_name']) . '</div>' : '' ?></td>
        <td data-label="Status"><button class="pill <?= $r['is_active'] ? 'pill-on' : '' ?>" name="toggle_active" value="<?= (int) $r['id'] ?>" type="submit" aria-pressed="<?= $r['is_active'] ? 'true' : 'false' ?>"><?= $r['is_active'] ? 'Shown' : 'Hidden' ?></button></td>
        <td data-label="Actions" class="actions-cell"><div class="row-actions">
          <a class="btn btn-sm" href="<?= e(admin_url('review-edit.php?id=' . (int) $r['id'])) ?>">Edit</a>
          <button class="btn btn-sm btn-danger" name="delete" value="<?= (int) $r['id'] ?>" type="submit" data-confirm="Delete this review?">Delete</button>
        </div></td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
  <div class="form-actions sticky-actions"><button class="btn btn-primary" type="submit" name="save_order" value="1">Save sort order</button></div>
</form>
<?php endif; ?>
<?php admin_footer(); ?>
