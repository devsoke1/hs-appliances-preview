<?php
/**
 * GET /api/reviews.php                 → active reviews (sort_order, newest first) + Google rating summary
 *     ?service=washing-machine-repair   → reviews linked to that service
 *     ?limit=6 (max 50)
 */
declare(strict_types=1);

define('HS_API', true);
require __DIR__ . '/_lib/api.php';

api_boot();

$params = [];
$where = ['r.is_active = 1'];
$service = api_slug('service');
if ($service !== null) {
    $where[] = 's.slug = ?';
    $params[] = $service;
}
$limit = api_int('limit', 20, 1, 50);
$params[] = $limit;

$rows = db_all(
    'SELECT r.id, r.customer_name, r.location, r.rating, r.review_text, r.source, r.review_date,
            s.slug AS service_slug, s.name AS service_name
       FROM reviews r
       LEFT JOIN services s ON s.id = r.service_id AND s.is_active = 1
      WHERE ' . implode(' AND ', $where) . '
      ORDER BY r.sort_order ASC, r.review_date DESC, r.id DESC
      LIMIT ?',
    $params
);

$rating = setting('google_rating');
$count = setting('google_review_count');

api_respond([
    'summary' => [
        'google_rating' => $rating !== '' ? (float) $rating : null,
        'google_review_count' => $count !== '' ? (int) $count : null,
        'google_reviews_url' => setting('google_reviews_url') ?: null,
    ],
    'reviews' => array_map(static fn ($r) => [
        'id' => (int) $r['id'],
        'customer_name' => $r['customer_name'],
        'location' => $r['location'] ?: null,
        'rating' => (int) $r['rating'],
        'review_text' => $r['review_text'],
        'source' => $r['source'],
        'review_date' => $r['review_date'] ?: null,
        'service' => $r['service_slug'] ? ['slug' => $r['service_slug'], 'name' => $r['service_name'], 'url' => public_path('service', $r['service_slug'])] : null,
    ], $rows),
]);
