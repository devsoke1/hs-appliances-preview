<?php
/**
 * GET /api/posts.php                      → published Insights (published_at ≤ now), newest first, paginated
 *     ?page=1&per_page=10 (max 50)         → pagination
 *     ?category=…  ?tag=…                  → filters
 * GET /api/posts.php?slug=…               → one published post (full content)
 *     renamed slug                         → 404 with {"redirect": "new-slug", "url": "…"}
 * Drafts and scheduled (future) posts are never returned.
 */
declare(strict_types=1);

define('HS_API', true);
require __DIR__ . '/_lib/api.php';

api_boot();

function post_out(array $p, bool $full): array
{
    $out = [
        'id' => (int) $p['id'],
        'slug' => $p['slug'],
        'title' => $p['title'],
        'excerpt' => $p['excerpt'],
        'featured_image' => $p['featured_image'] ?: null,
        'image_alt' => $p['image_alt'] ?: null,
        'category' => $p['category'],
        'tags' => array_values(array_filter(array_map('trim', explode(',', (string) $p['tags'])))),
        'author' => $p['author'],
        'published_at' => $p['published_at'] ? str_replace(' ', 'T', $p['published_at']) . 'Z' : null,
        'updated_at' => $p['updated_at'] ? str_replace(' ', 'T', $p['updated_at']) . 'Z' : null,
        'url' => public_path('post', $p['slug']),
    ];
    if ($full) {
        $out += [
            'content' => $p['content'] ?? '', // sanitised with HTMLPurifier when saved in the admin
            'meta_title' => $p['meta_title'] ?: null,
            'meta_description' => $p['meta_description'] ?: null,
        ];
    }
    return $out;
}

$now = db_now();
$slug = api_slug();
if ($slug !== null) {
    $p = db_one("SELECT * FROM posts WHERE slug = ? AND status = 'published' AND published_at <= ?", [$slug, $now]);
    if (!$p) {
        $new = api_redirect_for('post', $slug);
        if ($new !== null) {
            api_error(404, 'Moved', ['redirect' => $new, 'url' => public_path('post', $new)]);
        }
        api_error(404, 'Not found');
    }
    api_respond(['post' => post_out($p, true)]);
}

$where = ["status = 'published'", 'published_at <= ?'];
$params = [$now];
$category = $_GET['category'] ?? null;
if (is_string($category) && $category !== '') {
    $where[] = 'category = ?';
    $params[] = mb_substr($category, 0, 80);
}
$tag = $_GET['tag'] ?? null;
if (is_string($tag) && $tag !== '') {
    // Tags are stored normalised as "a, b, c". Match whole tags only, with portable SQL
    // (no string concatenation — `||` means OR in MySQL) and an explicit ESCAPE character.
    $t = str_replace(['!', '%', '_'], ['!!', '!%', '!_'], mb_substr(trim($tag), 0, 60));
    $where[] = "(tags = ? OR tags LIKE ? ESCAPE '!' OR tags LIKE ? ESCAPE '!' OR tags LIKE ? ESCAPE '!')";
    array_push($params, trim($tag), "$t, %", "%, $t, %", "%, $t");
}
$whereSql = implode(' AND ', $where);

$perPage = api_int('per_page', 10, 1, 50);
$page = api_int('page', 1, 1, 10000);
$total = (int) db_value("SELECT COUNT(*) FROM posts WHERE $whereSql", $params);
$rows = db_all(
    "SELECT * FROM posts WHERE $whereSql ORDER BY published_at DESC, id DESC LIMIT ? OFFSET ?",
    [...$params, $perPage, ($page - 1) * $perPage]
);

api_respond([
    'posts' => array_map(static fn ($p) => post_out($p, false), $rows),
    'page' => $page,
    'per_page' => $perPage,
    'total' => $total,
    'total_pages' => (int) ceil($total / $perPage),
]);
