<?php
declare(strict_types=1);
require __DIR__ . '/_inc/bootstrap.php';
require_admin();

if (is_post()) {
    csrf_check();
    $back = 'posts.php' . (($q = post_str('return_query', 300)) !== '' ? '?' . $q : '');
    if (($id = post_int('delete')) > 0) {
        $p = db_one('SELECT slug, title, featured_image FROM posts WHERE id = ?', [$id]);
        if ($p) {
            db_exec('DELETE FROM posts WHERE id = ?', [$id]);
            db_exec("DELETE FROM slug_redirects WHERE type = 'post' AND new_slug = ?", [$p['slug']]);
            delete_upload($p['featured_image']);
            flash('success', 'Deleted “' . $p['title'] . '”.');
        }
    }
    redirect($back);
}

$now = db_now();
$status = get_str('status', 20);
$q = get_str('q', 100);
$where = [];
$params = [];
switch ($status) {
    case 'draft':
        $where[] = "status = 'draft'";
        break;
    case 'published':
        $where[] = "status = 'published' AND published_at <= ?";
        $params[] = $now;
        break;
    case 'scheduled':
        $where[] = "status = 'published' AND published_at > ?";
        $params[] = $now;
        break;
    default:
        $status = '';
}
if ($q !== '') {
    $like = '%' . str_replace(['!', '%', '_'], ['!!', '!%', '!_'], $q) . '%';
    $where[] = "(title LIKE ? ESCAPE '!' OR slug LIKE ? ESCAPE '!' OR tags LIKE ? ESCAPE '!')";
    array_push($params, $like, $like, $like);
}
$rows = db_all('SELECT id, slug, title, category, status, published_at, updated_at FROM posts'
    . ($where ? ' WHERE ' . implode(' AND ', $where) : '') . ' ORDER BY COALESCE(published_at, updated_at) DESC, id DESC', $params);
$returnQuery = http_build_query(array_filter(['status' => $status, 'q' => $q]));

admin_header('Insights', 'posts');
page_head('Insights', '<a class="btn btn-primary" href="' . e(admin_url('post-edit.php')) . '">+ New insight</a>', count($rows) . ' shown');
?>
<nav class="tabs" aria-label="Filter by status">
  <?php foreach (['' => 'All', 'published' => 'Published', 'scheduled' => 'Scheduled', 'draft' => 'Drafts'] as $k => $label): ?>
    <a href="<?= e(admin_url('posts.php' . ($k !== '' ? '?status=' . $k : ''))) ?>" class="<?= $status === $k ? 'active' : '' ?>" <?= $status === $k ? 'aria-current="page"' : '' ?>><?= e($label) ?></a>
  <?php endforeach; ?>
</nav>
<form class="filters" method="get">
  <?php if ($status !== ''): ?><input type="hidden" name="status" value="<?= e($status) ?>"><?php endif; ?>
  <label class="sr-only" for="q">Search</label>
  <input id="q" type="search" name="q" value="<?= e($q) ?>" placeholder="Search title, slug or tags…">
  <button class="btn" type="submit">Search</button>
</form>

<?php if (!$rows): ?>
  <div class="card empty">No insights found. <a href="<?= e(admin_url('post-edit.php')) ?>">Write one</a>.</div>
<?php else: ?>
<form method="post">
  <?= csrf_field() ?>
  <input type="hidden" name="return_query" value="<?= e($returnQuery) ?>">
  <table class="table responsive">
    <thead><tr><th>Title</th><th>Status</th><th>Date</th><th class="col-actions"><span class="sr-only">Actions</span></th></tr></thead>
    <tbody>
    <?php foreach ($rows as $p):
        $scheduled = $p['status'] === 'published' && $p['published_at'] > $now;
        $live = $p['status'] === 'published' && !$scheduled; ?>
      <tr>
        <td data-label="Title">
          <a class="row-title" href="<?= e(admin_url('post-edit.php?id=' . (int) $p['id'])) ?>"><?= e($p['title']) ?></a>
          <div class="muted small"><?= e($p['category'] ?: 'Uncategorised') ?> · /<?= e($p['slug']) ?>/</div>
        </td>
        <td data-label="Status"><span class="badge <?= $live ? 'badge-ok' : ($scheduled ? 'badge-warn' : 'badge-muted') ?>"><?= $live ? 'Published' : ($scheduled ? 'Scheduled' : 'Draft') ?></span></td>
        <td data-label="Date" class="small"><?= $p['published_at'] ? e(fmt_dt($p['published_at'])) : '<span class="muted">—</span>' ?></td>
        <td data-label="Actions" class="actions-cell"><div class="row-actions">
          <a class="btn btn-sm" href="<?= e(admin_url('post-edit.php?id=' . (int) $p['id'])) ?>">Edit</a>
          <a class="btn btn-sm btn-ghost" href="<?= e(admin_url('post-preview.php?id=' . (int) $p['id'])) ?>" target="_blank" rel="noopener">Preview</a>
          <button class="btn btn-sm btn-danger" name="delete" value="<?= (int) $p['id'] ?>" type="submit" data-confirm="Delete “<?= e($p['title']) ?>”? This can’t be undone.">Delete</button>
        </div></td>
      </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
</form>
<?php endif; ?>
<?php admin_footer(); ?>
