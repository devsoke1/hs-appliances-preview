<?php
declare(strict_types=1);
require __DIR__ . '/_inc/bootstrap.php';
require_admin();

/* ── Actions (one form, several buttons — no nested forms) ── */
if (is_post()) {
    csrf_check();
    $back = 'services.php' . (($q = post_str('return_query', 300)) !== '' ? '?' . $q : '');

    if (($id = post_int('toggle_active')) > 0) {
        db_exec('UPDATE services SET is_active = 1 - is_active, updated_at = ? WHERE id = ?', [db_now(), $id]);
        flash('success', 'Visibility updated.');
    } elseif (($id = post_int('toggle_featured')) > 0) {
        db_exec('UPDATE services SET is_featured = 1 - is_featured, updated_at = ? WHERE id = ?', [db_now(), $id]);
        flash('success', 'Featured status updated.');
    } elseif (($id = post_int('delete')) > 0) {
        $s = db_one('SELECT slug, name, image FROM services WHERE id = ?', [$id]);
        if ($s) {
            db_exec('DELETE FROM services WHERE id = ?', [$id]);
            db_exec("DELETE FROM slug_redirects WHERE type = 'service' AND new_slug = ?", [$s['slug']]);
            delete_upload($s['image']);
            flash('success', 'Deleted “' . $s['name'] . '”.');
        }
    } elseif (isset($_POST['save_order']) && is_array($_POST['order'] ?? null)) {
        $n = 0;
        foreach ($_POST['order'] as $id => $order) {
            $id = filter_var($id, FILTER_VALIDATE_INT);
            $order = filter_var($order, FILTER_VALIDATE_INT);
            if ($id && $order !== false) {
                $n += db_exec('UPDATE services SET sort_order = ? WHERE id = ? AND sort_order <> ?', [$order, $id, $order]);
            }
        }
        flash('success', $n ? "Sort order saved ($n changed)." : 'Sort order unchanged.');
    }
    redirect($back);
}

/* ── List ── */
$q = get_str('q', 100);
$cat = get_str('category', 20);
$where = [];
$params = [];
if ($q !== '') {
    $where[] = '(name LIKE ? ESCAPE \'!\' OR slug LIKE ? ESCAPE \'!\' OR menu_label LIKE ? ESCAPE \'!\')';
    $like = '%' . str_replace(['!', '%', '_'], ['!!', '!%', '!_'], $q) . '%';
    array_push($params, $like, $like, $like);
}
if (in_array($cat, ['domestic', 'commercial'], true)) {
    $where[] = 'category = ?';
    $params[] = $cat;
}
$rows = db_all('SELECT id, slug, name, category, sort_order, is_featured, is_active, image, updated_at FROM services'
    . ($where ? ' WHERE ' . implode(' AND ', $where) : '') . ' ORDER BY sort_order ASC, name ASC', $params);
$returnQuery = http_build_query(array_filter(['q' => $q, 'category' => $cat]));

admin_header('Services', 'services');
page_head('Services', '<a class="btn btn-primary" href="' . e(admin_url('service-edit.php')) . '">+ Add service</a>', count($rows) . ' shown');
?>
<form class="filters" method="get">
  <label class="sr-only" for="q">Search</label>
  <input id="q" type="search" name="q" value="<?= e($q) ?>" placeholder="Search services…">
  <label class="sr-only" for="category">Category</label>
  <select id="category" name="category">
    <option value="">All categories</option>
    <option value="domestic" <?= $cat === 'domestic' ? 'selected' : '' ?>>Domestic</option>
    <option value="commercial" <?= $cat === 'commercial' ? 'selected' : '' ?>>Commercial</option>
  </select>
  <button class="btn" type="submit">Filter</button>
  <?php if ($q !== '' || $cat !== ''): ?><a class="btn btn-ghost" href="<?= e(admin_url('services.php')) ?>">Clear</a><?php endif; ?>
</form>

<?php if (!$rows): ?>
  <div class="card empty">No services found.</div>
<?php else: ?>
<form method="post">
  <?= csrf_field() ?>
  <input type="hidden" name="return_query" value="<?= e($returnQuery) ?>">
  <table class="table responsive">
    <thead>
      <tr><th class="col-order">Order</th><th>Service</th><th>Category</th><th>Status</th><th class="col-actions"><span class="sr-only">Actions</span></th></tr>
    </thead>
    <tbody>
    <?php foreach ($rows as $s): ?>
      <tr>
        <td data-label="Order"><input class="order-input" type="number" name="order[<?= (int) $s['id'] ?>]" value="<?= (int) $s['sort_order'] ?>" step="1" aria-label="Sort order for <?= e($s['name']) ?>"></td>
        <td data-label="Service">
          <a class="row-title" href="<?= e(admin_url('service-edit.php?id=' . (int) $s['id'])) ?>"><?= e($s['name']) ?></a>
          <div class="muted small">/<?= e($s['slug']) ?>/</div>
        </td>
        <td data-label="Category"><span class="badge badge-muted"><?= e(ucfirst($s['category'])) ?></span></td>
        <td data-label="Status"><div class="toggles"><button class="pill <?= $s['is_active'] ? 'pill-on' : '' ?>" name="toggle_active" value="<?= (int) $s['id'] ?>" type="submit" aria-pressed="<?= $s['is_active'] ? 'true' : 'false' ?>"><?= $s['is_active'] ? 'Active' : 'Hidden' ?></button>
          <button class="pill <?= $s['is_featured'] ? 'pill-star' : '' ?>" name="toggle_featured" value="<?= (int) $s['id'] ?>" type="submit" aria-pressed="<?= $s['is_featured'] ? 'true' : 'false' ?>"><?= $s['is_featured'] ? '★ Featured' : '☆ Feature' ?></button></div></td>
        <td data-label="Actions" class="actions-cell"><div class="row-actions">
          <a class="btn btn-sm" href="<?= e(admin_url('service-edit.php?id=' . (int) $s['id'])) ?>">Edit</a>
          <a class="btn btn-sm btn-ghost" href="<?= e(public_path('service', $s['slug'])) ?>" target="_blank" rel="noopener">View</a>
          <button class="btn btn-sm btn-danger" name="delete" value="<?= (int) $s['id'] ?>" type="submit" data-confirm="Delete “<?= e($s['name']) ?>”? This can’t be undone.">Delete</button>
        </div></td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
  <div class="form-actions sticky-actions">
    <button class="btn btn-primary" type="submit" name="save_order" value="1">Save sort order</button>
    <span class="muted small">Lower numbers appear first.</span>
  </div>
</form>
<?php endif; ?>
<?php admin_footer(); ?>
