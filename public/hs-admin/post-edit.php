<?php
declare(strict_types=1);
require __DIR__ . '/_inc/bootstrap.php';
require __DIR__ . '/_inc/image.php';
require __DIR__ . '/_inc/purifier.php';
require_admin();

$id = get_int('id');
$existing = $id ? db_one('SELECT * FROM posts WHERE id = ?', [$id]) : null;
if ($id && !$existing) {
    flash('error', 'Insight not found.');
    redirect('posts.php');
}
$p = $existing ?? [
    'slug' => '', 'title' => '', 'excerpt' => '', 'content' => '', 'featured_image' => '', 'image_alt' => '', 'category' => '',
    'tags' => '', 'author' => setting('author_default', 'HS Appliances'), 'meta_title' => '', 'meta_description' => '',
    'status' => 'draft', 'published_at' => null,
];
$errors = [];
$publishLocal = to_local_input($p['published_at']);
$categories = array_column(db_all("SELECT DISTINCT category FROM posts WHERE category <> '' ORDER BY category"), 'category');

if (is_post()) {
    csrf_check();
    $action = in_array($_POST['action'] ?? '', ['draft', 'publish', 'schedule', 'update'], true) ? $_POST['action'] : 'draft';
    $p = array_merge($p, [
        'title' => post_str('title', 200),
        'slug' => slugify(post_str('slug', 160)),
        'excerpt' => post_str('excerpt', 400, true),
        'content' => purify_html(is_string($_POST['content'] ?? null) ? $_POST['content'] : ''),
        'image_alt' => post_str('image_alt', 255),
        'category' => post_str('category', 80),
        'tags' => normalise_tags(post_str('tags', 300)),
        'author' => post_str('author', 100) ?: 'HS Appliances',
        'meta_title' => post_str('meta_title', 70),
        'meta_description' => post_str('meta_description', 170),
    ]);
    $publishLocal = post_str('published_at', 16);

    if ($p['title'] === '') {
        $errors['title'] = 'Enter a title.';
    }
    if ($p['slug'] === '') {
        $p['slug'] = slugify($p['title']);
    }
    if (!valid_slug($p['slug'])) {
        $errors['slug'] = 'Use lowercase letters, numbers and hyphens only.';
    } elseif (db_value('SELECT COUNT(*) FROM posts WHERE slug = ? AND id <> ?', [$p['slug'], $id]) > 0) {
        $errors['slug'] = 'Another insight already uses this slug.';
    }

    // Status / date from the button pressed
    $now = db_now();
    $chosenUtc = $publishLocal !== '' ? from_local_input($publishLocal) : null;
    if ($publishLocal !== '' && $chosenUtc === null) {
        $errors['published_at'] = 'Enter a valid date and time.';
    }
    switch ($action) {
        case 'draft':
            $p['status'] = 'draft';
            $p['published_at'] = $chosenUtc; // remembered for later
            break;
        case 'publish':
            $p['status'] = 'published';
            $p['published_at'] = $now;
            break;
        case 'schedule':
            if ($chosenUtc === null) {
                $errors['published_at'] ??= 'Choose the date and time to publish.';
            } elseif ($chosenUtc <= $now) {
                $errors['published_at'] = 'Pick a time in the future (or use “Publish now”).';
            }
            $p['status'] = 'published';
            $p['published_at'] = $chosenUtc;
            break;
        case 'update': // already published: keep status, allow back-dating/editing the date
            $p['status'] = 'published';
            $p['published_at'] = $chosenUtc ?? ($existing['published_at'] ?? $now);
            break;
    }
    if ($p['status'] === 'published') {
        if (trim(strip_tags($p['content'])) === '') {
            $errors['content'] = 'Add some content before publishing.';
        }
        if ($p['excerpt'] === '') {
            $errors['excerpt'] = 'Add an excerpt before publishing (used on cards and in search results).';
        }
    }

    $oldImage = $existing['featured_image'] ?? '';
    $newImage = null;
    if (!$errors && upload_present('featured_image')) {
        try {
            $newImage = process_image_upload('featured_image');
        } catch (UploadError $ex) {
            $errors['featured_image'] = $ex->getMessage();
        }
    }
    $p['featured_image'] = $newImage ?? (post_bool('remove_image') ? '' : $oldImage);
    if ($p['featured_image'] !== '' && $p['image_alt'] === '') {
        $errors['image_alt'] = 'Alt text is required for the featured image.';
    }

    if ($errors) {
        if ($newImage) {
            delete_upload($newImage);
            $p['featured_image'] = $oldImage;
        }
    } else {
        $data = [
            $p['slug'], $p['title'], $p['excerpt'], $p['content'], $p['featured_image'] ?: null,
            $p['featured_image'] ? $p['image_alt'] : null, $p['category'], $p['tags'], $p['author'],
            $p['meta_title'] ?: null, $p['meta_description'] ?: null, $p['status'], $p['published_at'], db_now(),
        ];
        db()->beginTransaction();
        try {
            if ($existing) {
                db_exec('UPDATE posts SET slug = ?, title = ?, excerpt = ?, content = ?, featured_image = ?, image_alt = ?, category = ?, tags = ?, author = ?,
                         meta_title = ?, meta_description = ?, status = ?, published_at = ?, updated_at = ? WHERE id = ?', [...$data, $id]);
                record_slug_change('post', $existing['slug'], $p['slug']);
            } else {
                db_exec('INSERT INTO posts (slug, title, excerpt, content, featured_image, image_alt, category, tags, author, meta_title, meta_description, status, published_at, updated_at, created_at)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [...$data, db_now()]);
                $id = (int) db()->lastInsertId();
                db_exec("DELETE FROM slug_redirects WHERE type = 'post' AND old_slug = ?", [$p['slug']]);
            }
            db()->commit();
        } catch (Throwable $ex) {
            db()->rollBack();
            if ($newImage) {
                delete_upload($newImage);
            }
            throw $ex;
        }
        if ($oldImage && $oldImage !== $p['featured_image']) {
            delete_upload($oldImage);
        }
        $msg = match ($action) {
            'publish' => 'Published.',
            'schedule' => 'Scheduled for ' . fmt_dt($p['published_at']) . '.',
            'update' => 'Changes saved.',
            default => 'Draft saved.',
        };
        flash('success', $msg);
        if ($existing && $existing['slug'] !== $p['slug']) {
            flash('info', "URL changed: /{$existing['slug']}/ now redirects to /{$p['slug']}/.");
        }
        redirect('post-edit.php?id=' . $id);
    }
}

$now = db_now();
$isLive = $p['status'] === 'published' && $p['published_at'] && $p['published_at'] <= $now;
$isScheduled = $p['status'] === 'published' && $p['published_at'] && $p['published_at'] > $now;
$title = $existing ? 'Edit insight' : 'New insight';

admin_header($title, 'posts', ['head' => '<link rel="stylesheet" href="' . e(admin_url('assets/vendor/quill/quill.snow.css')) . '">']);
$actions = $existing ? '<a class="btn btn-ghost" href="' . e(admin_url('post-preview.php?id=' . $id)) . '" target="_blank" rel="noopener">Preview ↗</a>' : '';
page_head($title, $actions, $existing ? ($isLive ? 'Published ' . fmt_dt($p['published_at']) : ($isScheduled ? 'Scheduled for ' . fmt_dt($p['published_at']) : 'Draft')) : '');
if ($errors) {
    echo '<div class="alert alert-error" role="alert">Please fix the highlighted fields.</div>';
}
?>
<form method="post" enctype="multipart/form-data" class="edit-form" data-unsaved-warning>
  <?= csrf_field() ?>
  <div class="edit-grid">
    <div class="edit-main">
      <section class="card">
        <div class="field">
          <label for="title">Title <span class="req">*</span></label>
          <input id="title" name="title" required maxlength="200" value="<?= e($p['title']) ?>" data-slug-source="#slug" class="input-lg"<?= invalid_attr($errors, 'title') ?>>
          <?= field_error($errors, 'title') ?>
        </div>
        <div class="field">
          <label for="slug">URL slug</label>
          <div class="input-prefix"><span>/insights/</span><input id="slug" name="slug" maxlength="160" value="<?= e($p['slug']) ?>" pattern="[a-z0-9]+(-[a-z0-9]+)*" data-slug-target<?= $existing ? ' data-slug-locked' : '' ?><?= invalid_attr($errors, 'slug') ?>></div>
          <?= field_error($errors, 'slug') ?>
        </div>
        <div class="field">
          <label for="excerpt">Excerpt</label>
          <textarea id="excerpt" name="excerpt" rows="3" maxlength="400" data-counter="160"<?= invalid_attr($errors, 'excerpt') ?>><?= e($p['excerpt']) ?></textarea>
          <?= field_error($errors, 'excerpt') ?>
          <p class="hint">One or two sentences shown on cards. Required to publish.</p>
        </div>
        <div class="field">
          <label for="content">Content</label>
          <textarea id="content" name="content" rows="18" data-editor data-upload-url="<?= e(admin_url('upload.php')) ?>"<?= invalid_attr($errors, 'content') ?>><?= e($p['content']) ?></textarea>
          <?= field_error($errors, 'content') ?>
          <p class="hint">Use Heading 2 / Heading 3 for sections. Images you insert are uploaded and need alt text.</p>
        </div>
      </section>
    </div>

    <aside class="edit-side">
      <section class="card">
        <h2>Publish</h2>
        <div class="field">
          <label for="published_at">Publish date &amp; time <span class="muted">(UK)</span></label>
          <input id="published_at" name="published_at" type="datetime-local" value="<?= e($publishLocal) ?>"<?= invalid_attr($errors, 'published_at') ?>>
          <?= field_error($errors, 'published_at') ?>
          <p class="hint">Only needed to schedule (or to change the date of a published post).</p>
        </div>
        <div class="stack-sm">
          <?php if ($isLive): ?>
            <button class="btn btn-primary btn-block" type="submit" name="action" value="update">Update</button>
            <button class="btn btn-block" type="submit" name="action" value="draft" data-confirm="Unpublish and move back to drafts?">Unpublish (to draft)</button>
          <?php else: ?>
            <button class="btn btn-primary btn-block" type="submit" name="action" value="publish">Publish now</button>
            <button class="btn btn-block" type="submit" name="action" value="schedule">Schedule</button>
            <button class="btn btn-ghost btn-block" type="submit" name="action" value="draft">Save draft</button>
          <?php endif; ?>
        </div>
      </section>

      <section class="card">
        <h2>Featured image</h2>
        <?php if ($p['featured_image']): ?>
          <img class="preview-img" src="<?= e($p['featured_image']) ?>" alt="">
          <label class="check"><input type="checkbox" name="remove_image" value="1"> Remove image</label>
        <?php endif; ?>
        <div class="field">
          <label for="featured_image"><?= $p['featured_image'] ? 'Replace image' : 'Upload image' ?></label>
          <input id="featured_image" name="featured_image" type="file" accept="image/jpeg,image/png,image/webp" data-max-bytes="3145728"<?= invalid_attr($errors, 'featured_image') ?>>
          <?= field_error($errors, 'featured_image') ?>
          <p class="hint">JPG, PNG or WebP, max 3MB.</p>
        </div>
        <div class="field">
          <label for="image_alt">Alt text <span class="req">*</span> <span class="muted">(if image)</span></label>
          <input id="image_alt" name="image_alt" maxlength="255" value="<?= e($p['image_alt']) ?>"<?= invalid_attr($errors, 'image_alt') ?>>
          <?= field_error($errors, 'image_alt') ?>
        </div>
      </section>

      <section class="card">
        <h2>Organise</h2>
        <div class="field">
          <label for="category">Category</label>
          <input id="category" name="category" maxlength="80" value="<?= e($p['category']) ?>" list="category-list">
          <datalist id="category-list"><?php foreach ($categories as $c): ?><option value="<?= e($c) ?>"><?php endforeach; ?></datalist>
        </div>
        <div class="field">
          <label for="tags">Tags</label>
          <input id="tags" name="tags" maxlength="300" value="<?= e($p['tags']) ?>" placeholder="e.g. Washing Machine, Feltham">
          <p class="hint">Separate with commas.</p>
        </div>
        <div class="field">
          <label for="author">Author</label>
          <input id="author" name="author" maxlength="100" value="<?= e($p['author']) ?>">
        </div>
      </section>

      <section class="card">
        <h2>SEO</h2>
        <div class="field">
          <label for="meta_title">Meta title</label>
          <input id="meta_title" name="meta_title" maxlength="70" value="<?= e($p['meta_title']) ?>" data-counter="60">
        </div>
        <div class="field">
          <label for="meta_description">Meta description</label>
          <textarea id="meta_description" name="meta_description" rows="3" maxlength="170" data-counter="155"><?= e($p['meta_description']) ?></textarea>
        </div>
        <p class="hint">Leave empty to use the title and excerpt.</p>
      </section>
    </aside>
  </div>
</form>
<?php admin_footer([admin_url('assets/vendor/quill/quill.js'), admin_url('assets/editor.js')]); ?>
