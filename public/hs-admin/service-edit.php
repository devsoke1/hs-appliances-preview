<?php
declare(strict_types=1);
require __DIR__ . '/_inc/bootstrap.php';
require __DIR__ . '/_inc/image.php';
require __DIR__ . '/_inc/purifier.php';
require_admin();

$id = get_int('id');
$existing = $id ? db_one('SELECT * FROM services WHERE id = ?', [$id]) : null;
if ($id && !$existing) {
    flash('error', 'Service not found.');
    redirect('services.php');
}

$blank = [
    'slug' => '', 'name' => '', 'menu_label' => '', 'category' => 'domestic', 'short_description' => '', 'content' => '',
    'common_faults' => '[]', 'faqs' => '[]', 'compliance_note' => '', 'image' => '', 'image_alt' => '', 'icon' => 'Wrench',
    'meta_title' => '', 'meta_description' => '', 'sort_order' => (int) db_value('SELECT COALESCE(MAX(sort_order), 0) + 10 FROM services'),
    'is_featured' => 0, 'is_active' => 1,
];
$s = $existing ?? $blank;
$faults = json_list($s['common_faults']);
$faqs = json_list($s['faqs']);
$errors = [];

/** Repeatable rows from POST: rows[i][k] → list of non-empty rows, trimmed. */
function posted_rows(string $field, array $keys, int $maxLen): array
{
    $out = [];
    foreach ((is_array($_POST[$field] ?? null) ? $_POST[$field] : []) as $row) {
        if (!is_array($row)) {
            continue;
        }
        $clean = [];
        foreach ($keys as $k) {
            $v = is_string($row[$k] ?? null) ? trim(mb_substr(mb_scrub($row[$k], 'UTF-8'), 0, $maxLen)) : '';
            $clean[$k] = (string) preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v);
        }
        if (implode('', $clean) !== '') {
            $out[] = $clean;
        }
    }
    return array_slice($out, 0, 30);
}

if (is_post()) {
    csrf_check();
    $s = array_merge($s, [
        'name' => post_str('name', 150),
        'menu_label' => post_str('menu_label', 80),
        'slug' => slugify(post_str('slug', 160)),
        'category' => in_array($_POST['category'] ?? '', ['domestic', 'commercial'], true) ? $_POST['category'] : 'domestic',
        'short_description' => post_str('short_description', 300),
        'content' => purify_html(is_string($_POST['content'] ?? null) ? $_POST['content'] : ''),
        'compliance_note' => post_str('compliance_note', 1000, true),
        'image_alt' => post_str('image_alt', 255),
        'icon' => in_array($_POST['icon'] ?? '', service_icons(), true) ? $_POST['icon'] : 'Wrench',
        'meta_title' => post_str('meta_title', 70),
        'meta_description' => post_str('meta_description', 170),
        'sort_order' => post_int('sort_order'),
        'is_featured' => post_bool('is_featured'),
        'is_active' => post_bool('is_active'),
    ]);
    $faults = posted_rows('faults', ['name', 'detail'], 600);
    $faqs = posted_rows('faqs', ['question', 'answer'], 1500);

    if ($s['name'] === '') {
        $errors['name'] = 'Enter the service name.';
    }
    if ($s['slug'] === '') {
        $s['slug'] = slugify($s['name']);
    }
    if (!valid_slug($s['slug'])) {
        $errors['slug'] = 'Use lowercase letters, numbers and hyphens only.';
    } elseif (db_value('SELECT COUNT(*) FROM services WHERE slug = ? AND id <> ?', [$s['slug'], $id]) > 0) {
        $errors['slug'] = 'Another service already uses this slug.';
    }
    if ($s['short_description'] === '') {
        $errors['short_description'] = 'Add a short description (used on cards and in search results).';
    }
    foreach ($faults as $f) {
        if ($f['name'] === '') {
            $errors['faults'] = 'Each fault needs a name.';
        }
    }
    foreach ($faqs as $f) {
        if ($f['question'] === '' || $f['answer'] === '') {
            $errors['faqs'] = 'Each FAQ needs a question and an answer.';
        }
    }

    // Image: remove / replace
    $oldImage = $existing['image'] ?? '';
    $newImage = null;
    if (!$errors && upload_present('image')) {
        try {
            $newImage = process_image_upload('image');
        } catch (UploadError $ex) {
            $errors['image'] = $ex->getMessage();
        }
    }
    $s['image'] = $newImage ?? (post_bool('remove_image') ? '' : $oldImage);
    if ($s['image'] !== '' && $s['image_alt'] === '') {
        $errors['image_alt'] = 'Describe the image for screen readers and Google (alt text is required).';
    }

    if ($errors) {
        if ($newImage) {
            delete_upload($newImage); // don't leave orphans when the form is re-shown
            $s['image'] = $oldImage;
        }
    } else {
        $data = [
            $s['slug'], $s['name'], $s['menu_label'] !== '' ? $s['menu_label'] : $s['name'], $s['category'], $s['short_description'],
            $s['content'], json_encode($faults, JSON_UNESCAPED_UNICODE), json_encode($faqs, JSON_UNESCAPED_UNICODE),
            $s['compliance_note'] ?: null, $s['image'] ?: null, $s['image'] ? $s['image_alt'] : null, $s['icon'],
            $s['meta_title'] ?: null, $s['meta_description'] ?: null, $s['sort_order'], $s['is_featured'], $s['is_active'], db_now(),
        ];
        $cols = 'slug = ?, name = ?, menu_label = ?, category = ?, short_description = ?, content = ?, common_faults = ?, faqs = ?, '
            . 'compliance_note = ?, image = ?, image_alt = ?, icon = ?, meta_title = ?, meta_description = ?, sort_order = ?, '
            . 'is_featured = ?, is_active = ?, updated_at = ?';
        db()->beginTransaction();
        try {
            if ($existing) {
                db_exec("UPDATE services SET $cols WHERE id = ?", [...$data, $id]);
                record_slug_change('service', $existing['slug'], $s['slug']);
            } else {
                db_exec("INSERT INTO services (slug, name, menu_label, category, short_description, content, common_faults, faqs, compliance_note, image, image_alt, icon, meta_title, meta_description, sort_order, is_featured, is_active, updated_at, created_at)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [...$data, db_now()]);
                $id = (int) db()->lastInsertId();
                // A new live slug must not be an old redirect source
                db_exec("DELETE FROM slug_redirects WHERE type = 'service' AND old_slug = ?", [$s['slug']]);
            }
            db()->commit();
        } catch (Throwable $ex) {
            db()->rollBack();
            if ($newImage) {
                delete_upload($newImage);
            }
            throw $ex;
        }
        if ($oldImage && $oldImage !== $s['image']) {
            delete_upload($oldImage);
        }
        flash('success', $existing ? 'Service saved.' : 'Service created.');
        if ($existing && $existing['slug'] !== $s['slug']) {
            flash('info', "URL changed: /{$existing['slug']}/ now redirects to /{$s['slug']}/.");
        }
        redirect('service-edit.php?id=' . $id);
    }
}

$title = $existing ? 'Edit service' : 'New service';
admin_header($title, 'services', ['head' => '<link rel="stylesheet" href="' . e(admin_url('assets/vendor/quill/quill.snow.css')) . '">']);
page_head($title, $existing ? '<a class="btn btn-ghost" href="' . e(public_path('service', $existing['slug'])) . '" target="_blank" rel="noopener">View on site ↗</a>' : '');
if ($errors) {
    echo '<div class="alert alert-error" role="alert">Please fix the highlighted fields.</div>';
}
?>
<form method="post" enctype="multipart/form-data" class="edit-form" data-unsaved-warning>
  <?= csrf_field() ?>
  <div class="edit-grid">
    <div class="edit-main">
      <section class="card">
        <h2>Details</h2>
        <div class="field">
          <label for="name">Service name <span class="req">*</span></label>
          <input id="name" name="name" required maxlength="150" value="<?= e($s['name']) ?>" data-slug-source="#slug" placeholder="e.g. Washing Machine Repair"<?= invalid_attr($errors, 'name') ?>>
          <?= field_error($errors, 'name') ?>
        </div>
        <div class="field-row">
          <div class="field">
            <label for="slug">URL slug</label>
            <div class="input-prefix"><span>/services/</span><input id="slug" name="slug" maxlength="120" value="<?= e($s['slug']) ?>" pattern="[a-z0-9]+(-[a-z0-9]+)*" data-slug-target<?= $existing ? ' data-slug-locked' : '' ?><?= invalid_attr($errors, 'slug') ?>></div>
            <?= field_error($errors, 'slug') ?>
            <?php if ($existing): ?><p class="hint">Changing this keeps the old URL working (automatic 301 redirect).</p><?php endif; ?>
          </div>
          <div class="field">
            <label for="menu_label">Short label</label>
            <input id="menu_label" name="menu_label" maxlength="80" value="<?= e($s['menu_label']) ?>" placeholder="e.g. Washing Machine">
            <p class="hint">Used in menus and cards. Defaults to the name.</p>
          </div>
        </div>
        <div class="field-row">
          <div class="field">
            <label for="category">Category</label>
            <select id="category" name="category">
              <option value="domestic" <?= $s['category'] === 'domestic' ? 'selected' : '' ?>>Domestic</option>
              <option value="commercial" <?= $s['category'] === 'commercial' ? 'selected' : '' ?>>Commercial</option>
            </select>
          </div>
          <div class="field">
            <label for="icon">Icon</label>
            <select id="icon" name="icon">
              <?php foreach (service_icons() as $ic): ?><option value="<?= e($ic) ?>" <?= $s['icon'] === $ic ? 'selected' : '' ?>><?= e($ic) ?></option><?php endforeach; ?>
            </select>
          </div>
        </div>
        <div class="field">
          <label for="short_description">Short description <span class="req">*</span></label>
          <textarea id="short_description" name="short_description" rows="2" maxlength="300" data-counter="160"<?= invalid_attr($errors, 'short_description') ?>><?= e($s['short_description']) ?></textarea>
          <?= field_error($errors, 'short_description') ?>
        </div>
      </section>

      <section class="card">
        <h2>Page content</h2>
        <div class="field">
          <label for="content">Main content</label>
          <textarea id="content" name="content" rows="14" data-editor><?= e($s['content']) ?></textarea>
          <p class="hint">Use Heading 2 for section titles. Pasted formatting is cleaned automatically.</p>
        </div>
        <div class="field">
          <label for="compliance_note">Compliance note</label>
          <textarea id="compliance_note" name="compliance_note" rows="2" maxlength="1000"><?= e($s['compliance_note']) ?></textarea>
          <p class="hint">E.g. Gas Safe / F-Gas registration. Shown as a notice on the page.</p>
        </div>
      </section>

      <section class="card">
        <h2>Common faults</h2>
        <?= field_error($errors, 'faults') ?>
        <div class="repeater" data-repeater="faults">
          <?php foreach ($faults ?: [['name' => '', 'detail' => '']] as $i => $f): ?>
            <div class="repeater-row">
              <div class="field"><label>Fault</label><input name="faults[<?= $i ?>][name]" maxlength="120" value="<?= e($f['name'] ?? '') ?>"></div>
              <div class="field"><label>Explanation</label><textarea name="faults[<?= $i ?>][detail]" rows="2" maxlength="600"><?= e($f['detail'] ?? '') ?></textarea></div>
              <div class="repeater-tools">
                <button type="button" class="btn btn-sm btn-ghost" data-move="up" aria-label="Move up">↑</button>
                <button type="button" class="btn btn-sm btn-ghost" data-move="down" aria-label="Move down">↓</button>
                <button type="button" class="btn btn-sm btn-danger" data-remove>Remove</button>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
        <button type="button" class="btn btn-sm" data-add="faults">+ Add fault</button>
      </section>

      <section class="card">
        <h2>FAQs</h2>
        <?= field_error($errors, 'faqs') ?>
        <div class="repeater" data-repeater="faqs">
          <?php foreach ($faqs ?: [['question' => '', 'answer' => '']] as $i => $f): ?>
            <div class="repeater-row">
              <div class="field"><label>Question</label><input name="faqs[<?= $i ?>][question]" maxlength="300" value="<?= e($f['question'] ?? '') ?>"></div>
              <div class="field"><label>Answer</label><textarea name="faqs[<?= $i ?>][answer]" rows="3" maxlength="1500"><?= e($f['answer'] ?? '') ?></textarea></div>
              <div class="repeater-tools">
                <button type="button" class="btn btn-sm btn-ghost" data-move="up" aria-label="Move up">↑</button>
                <button type="button" class="btn btn-sm btn-ghost" data-move="down" aria-label="Move down">↓</button>
                <button type="button" class="btn btn-sm btn-danger" data-remove>Remove</button>
              </div>
            </div>
          <?php endforeach; ?>
        </div>
        <button type="button" class="btn btn-sm" data-add="faqs">+ Add FAQ</button>
      </section>
    </div>

    <aside class="edit-side">
      <section class="card">
        <h2>Visibility</h2>
        <label class="check"><input type="checkbox" name="is_active" value="1" <?= $s['is_active'] ? 'checked' : '' ?>> Active (shown on the site)</label>
        <label class="check"><input type="checkbox" name="is_featured" value="1" <?= $s['is_featured'] ? 'checked' : '' ?>> Featured on homepage</label>
        <div class="field">
          <label for="sort_order">Sort order</label>
          <input id="sort_order" name="sort_order" type="number" step="1" value="<?= (int) $s['sort_order'] ?>">
        </div>
      </section>

      <section class="card">
        <h2>Image</h2>
        <?php if ($s['image']): ?>
          <img class="preview-img" src="<?= e($s['image']) ?>" alt="">
          <label class="check"><input type="checkbox" name="remove_image" value="1"> Remove image</label>
        <?php endif; ?>
        <div class="field">
          <label for="image"><?= $s['image'] ? 'Replace image' : 'Upload image' ?></label>
          <input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp" data-max-bytes="3145728"<?= invalid_attr($errors, 'image') ?>>
          <p class="hint">JPG, PNG or WebP, max 3MB. Converted to WebP, max 1600px.</p>
          <?= field_error($errors, 'image') ?>
        </div>
        <div class="field">
          <label for="image_alt">Alt text <span class="req">*</span> <span class="muted">(if image)</span></label>
          <input id="image_alt" name="image_alt" maxlength="255" value="<?= e($s['image_alt']) ?>" placeholder="e.g. Engineer replacing a washing machine pump"<?= invalid_attr($errors, 'image_alt') ?>>
          <?= field_error($errors, 'image_alt') ?>
        </div>
      </section>

      <section class="card">
        <h2>SEO</h2>
        <div class="field">
          <label for="meta_title">Meta title</label>
          <input id="meta_title" name="meta_title" maxlength="70" value="<?= e($s['meta_title']) ?>" data-counter="60">
        </div>
        <div class="field">
          <label for="meta_description">Meta description</label>
          <textarea id="meta_description" name="meta_description" rows="3" maxlength="170" data-counter="155"><?= e($s['meta_description']) ?></textarea>
        </div>
        <p class="hint">Leave empty to use the name and short description.</p>
      </section>
    </aside>
  </div>

  <div class="form-actions sticky-actions">
    <button class="btn btn-primary" type="submit">Save service</button>
    <a class="btn btn-ghost" href="<?= e(admin_url('services.php')) ?>">Cancel</a>
  </div>
</form>

<template id="tpl-faults">
  <div class="repeater-row">
    <div class="field"><label>Fault</label><input name="faults[__i__][name]" maxlength="120"></div>
    <div class="field"><label>Explanation</label><textarea name="faults[__i__][detail]" rows="2" maxlength="600"></textarea></div>
    <div class="repeater-tools">
      <button type="button" class="btn btn-sm btn-ghost" data-move="up" aria-label="Move up">↑</button>
      <button type="button" class="btn btn-sm btn-ghost" data-move="down" aria-label="Move down">↓</button>
      <button type="button" class="btn btn-sm btn-danger" data-remove>Remove</button>
    </div>
  </div>
</template>
<template id="tpl-faqs">
  <div class="repeater-row">
    <div class="field"><label>Question</label><input name="faqs[__i__][question]" maxlength="300"></div>
    <div class="field"><label>Answer</label><textarea name="faqs[__i__][answer]" rows="3" maxlength="1500"></textarea></div>
    <div class="repeater-tools">
      <button type="button" class="btn btn-sm btn-ghost" data-move="up" aria-label="Move up">↑</button>
      <button type="button" class="btn btn-sm btn-ghost" data-move="down" aria-label="Move down">↓</button>
      <button type="button" class="btn btn-sm btn-danger" data-remove>Remove</button>
    </div>
  </div>
</template>
<?php admin_footer([admin_url('assets/vendor/quill/quill.js'), admin_url('assets/editor.js')]); ?>
