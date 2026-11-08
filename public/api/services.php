<?php
/**
 * GET /api/services.php                 → active services (summary fields), ordered by sort_order
 *     ?category=domestic|commercial      → filter
 *     ?featured=1                        → featured only
 *     ?homepage=1                        → featured first, limited by settings.homepage_services_limit
 *     ?full=1                            → include content, faults, FAQs and SEO fields in the list
 * GET /api/services.php?slug=…           → one active service (all fields)
 *     unknown slug that was renamed      → 404 with {"redirect": "new-slug", "url": "/services/new-slug/"}
 */
declare(strict_types=1);

define('HS_API', true);
require __DIR__ . '/_lib/api.php';

api_boot();

function service_out(array $s, bool $full): array
{
    $out = [
        'id' => (int) $s['id'],
        'slug' => $s['slug'],
        'name' => $s['name'],
        'menu_label' => $s['menu_label'],
        'category' => $s['category'],
        'short_description' => $s['short_description'],
        'image' => $s['image'] ?: null,
        'image_alt' => $s['image_alt'] ?: null,
        'icon' => $s['icon'] ?: null,
        'is_featured' => (bool) $s['is_featured'],
        'sort_order' => (int) $s['sort_order'],
        'url' => public_path('service', $s['slug']),
    ];
    if ($full) {
        $out += [
            'content' => $s['content'] ?? '',
            'common_faults' => json_list($s['common_faults']),
            'faqs' => json_list($s['faqs']),
            'compliance_note' => $s['compliance_note'] ?: null,
            'meta_title' => $s['meta_title'] ?: null,
            'meta_description' => $s['meta_description'] ?: null,
            'updated_at' => $s['updated_at'],
        ];
    }
    return $out;
}

$slug = api_slug();
if ($slug !== null) {
    $s = db_one('SELECT * FROM services WHERE slug = ? AND is_active = 1', [$slug]);
    if (!$s) {
        $new = api_redirect_for('service', $slug);
        if ($new !== null) {
            api_error(404, 'Moved', ['redirect' => $new, 'url' => public_path('service', $new)]);
        }
        api_error(404, 'Not found');
    }
    api_respond(['service' => service_out($s, true)]);
}

$where = ['is_active = 1'];
$params = [];
$category = $_GET['category'] ?? null;
if ($category !== null) {
    if (!in_array($category, ['domestic', 'commercial'], true)) {
        api_error(400, 'Invalid category');
    }
    $where[] = 'category = ?';
    $params[] = $category;
}
if (($_GET['featured'] ?? '') === '1') {
    $where[] = 'is_featured = 1';
}
$homepage = ($_GET['homepage'] ?? '') === '1';
$full = ($_GET['full'] ?? '') === '1';

$order = $homepage ? 'is_featured DESC, sort_order ASC, name ASC' : 'sort_order ASC, name ASC';
$sql = 'SELECT * FROM services WHERE ' . implode(' AND ', $where) . ' ORDER BY ' . $order;
if ($homepage) {
    $sql .= ' LIMIT ?';
    $params[] = max(1, min(50, (int) setting('homepage_services_limit', '8')));
}
$rows = db_all($sql, $params);

api_respond([
    'services' => array_map(static fn ($s) => service_out($s, $full), $rows),
    'count' => count($rows),
]);
