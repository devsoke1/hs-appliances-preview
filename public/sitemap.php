<?php
/**
 * /sitemap.xml (rewritten here by .htaccess): static pages + active services + published Insights,
 * with lastmod. Generated live, so admin changes appear immediately. Drafts, scheduled posts and
 * inactive services are never listed. The 404 page is never listed.
 */
declare(strict_types=1);
require __DIR__ . '/includes/bootstrap.php';

$now = db_now();
$built = substr((string) (site()['generatedAt'] ?? gmdate('c')), 0, 10);
$services = active_services();
$posts = db_all("SELECT slug, published_at, updated_at FROM posts WHERE status = 'published' AND published_at <= ? ORDER BY published_at DESC", [$now]);

$day = static fn (?string $utc): string => $utc ? substr($utc, 0, 10) : '';
$latestService = max(array_map(static fn ($s) => $day($s['updated_at']), $services) ?: [$built]);
$latestPost = max(array_map(static fn ($p) => max($day($p['updated_at']), $day($p['published_at'])), $posts) ?: [$built]);

$urls = [
    ['/', max($built, $latestService), 'weekly', '1.0'],
    ['/services/', $latestService, 'weekly', '0.9'],
];
foreach ($services as $s) {
    $urls[] = [service_url($s['slug']), $day($s['updated_at']) ?: $built, 'monthly', '0.9'];
}
$urls[] = ['/areas/', $built, 'monthly', '0.8'];
foreach (site()['areas'] ?? [] as $a) {
    $urls[] = ["/areas/{$a['slug']}/", $built, 'monthly', '0.8'];
}
$urls[] = ['/insights/', $latestPost, 'weekly', '0.7'];
foreach ($posts as $p) {
    $urls[] = [post_url($p['slug']), max($day($p['updated_at']), $day($p['published_at'])), 'monthly', '0.6'];
}
foreach ([['/about/', '0.5'], ['/contact/', '0.6'], ['/faq/', '0.5'], ['/book/', '0.7'], ['/privacy-policy/', '0.2'], ['/terms/', '0.2']] as [$path, $prio]) {
    $urls[] = [$path, $built, $prio === '0.2' ? 'yearly' : 'monthly', $prio];
}

header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: public, max-age=900');
header('X-Robots-Tag: noindex');
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
foreach ($urls as [$path, $lastmod, $freq, $prio]) {
    echo '<url><loc>' . e(site_url($path)) . '</loc><lastmod>' . e($lastmod) . '</lastmod><changefreq>' . $freq . '</changefreq><priority>' . $prio . "</priority></url>\n";
}
echo '</urlset>' . "\n";
