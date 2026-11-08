<?php
/**
 * schema.org JSON-LD for PHP pages — same shapes as src/lib/schema.ts (validated there with schema-dts).
 */
declare(strict_types=1);

if (!defined('HS_API')) {
    http_response_code(403);
    exit;
}

function business_id(): string
{
    return site_url('/#business');
}

function area_served(): array
{
    return array_map(static fn ($a) => ['@type' => 'Place', 'name' => $a['name']], site()['areas'] ?? []);
}

/** Site-wide graph: HomeAndConstructionBusiness + WebSite (services listed live from the DB). */
function site_graph(): array
{
    $b = biz();
    $groups = [];
    foreach ($b['hours'] ?? [] as $h) {
        if (!$h['opens'] || !$h['closes']) {
            continue;
        }
        $groups["{$h['opens']}-{$h['closes']}"][] = 'https://schema.org/' . $h['day'];
    }
    $hours = [];
    foreach ($groups as $k => $days) {
        [$opens, $closes] = explode('-', $k);
        $hours[] = ['@type' => 'OpeningHoursSpecification', 'dayOfWeek' => $days, 'opens' => $opens, 'closes' => $closes];
    }
    $sameAs = array_values(array_filter($b['social'] ?? [], static fn ($u) => is_string($u) && str_starts_with($u, 'https://')));

    $org = [
        '@type' => 'HomeAndConstructionBusiness',
        '@id' => business_id(),
        'name' => $b['name'],
        'alternateName' => $b['shortName'],
        'description' => 'Repair, installation and maintenance of domestic appliances and commercial refrigeration in Feltham, Hounslow and West London.',
        'url' => site_url('/'),
        'logo' => site_url('/icon-512.png'),
        'image' => site_url('/og/default.png'),
        'telephone' => $b['phone']['e164'],
        'email' => $b['email'],
        'address' => [
            '@type' => 'PostalAddress',
            'streetAddress' => $b['address']['street'],
            'addressLocality' => $b['address']['locality'],
            'addressRegion' => $b['address']['region'],
            'postalCode' => $b['address']['postcode'],
            'addressCountry' => $b['address']['country'],
        ],
        'hasMap' => $b['mapLinkUrl'],
        'openingHoursSpecification' => $hours,
        'areaServed' => area_served(),
        'hasOfferCatalog' => [
            '@type' => 'OfferCatalog',
            'name' => 'Appliance repair services',
            'itemListElement' => array_map(static fn ($s) => [
                '@type' => 'Offer',
                'itemOffered' => ['@type' => 'Service', '@id' => site_url(service_url($s['slug'])) . '#service', 'name' => $s['name']],
            ], active_services()),
        ],
    ];
    if (isset($b['geo']['lat'], $b['geo']['lng']) && $b['geo']['lat'] !== null) {
        $org['geo'] = ['@type' => 'GeoCoordinates', 'latitude' => $b['geo']['lat'], 'longitude' => $b['geo']['lng']];
    }
    if ($sameAs) {
        $org['sameAs'] = $sameAs;
    }
    $site = [
        '@type' => 'WebSite',
        '@id' => site_url('/#website'),
        'url' => site_url('/'),
        'name' => $b['name'],
        'alternateName' => $b['shortName'],
        'inLanguage' => 'en-GB',
        'publisher' => ['@id' => business_id()],
    ];
    return ['@context' => 'https://schema.org', '@graph' => [$org, $site]];
}

function service_schema(array $s): array
{
    $url = site_url(service_url($s['slug']));
    $out = [
        '@context' => 'https://schema.org',
        '@type' => 'Service',
        '@id' => $url . '#service',
        'name' => $s['name'],
        'serviceType' => $s['name'],
        'description' => $s['short_description'],
        'url' => $url,
        'category' => $s['category'] === 'domestic' ? 'Domestic appliance repair' : 'Commercial refrigeration repair',
        'provider' => ['@id' => business_id()],
        'areaServed' => area_served(),
    ];
    if (!empty($s['image'])) {
        $out['image'] = site_url($s['image']);
    }
    if ($s['category'] === 'commercial') {
        $out['audience'] = ['@type' => 'BusinessAudience', 'name' => 'Shops, pubs, restaurants, hotels and food businesses'];
    }
    return $out;
}

function faq_schema(array $faqs): array
{
    return [
        '@context' => 'https://schema.org',
        '@type' => 'FAQPage',
        'mainEntity' => array_map(static fn ($f) => [
            '@type' => 'Question',
            'name' => $f['question'],
            'acceptedAnswer' => ['@type' => 'Answer', 'text' => $f['answer']],
        ], $faqs),
    ];
}

/** @param array<int,array{label:string,href?:string}> $items including Home */
function breadcrumb_schema(array $items): array
{
    $list = [];
    foreach ($items as $i => $c) {
        $el = ['@type' => 'ListItem', 'position' => $i + 1, 'name' => $c['label']];
        if (!empty($c['href'])) {
            $el['item'] = site_url($c['href']);
        }
        $list[] = $el;
    }
    return ['@context' => 'https://schema.org', '@type' => 'BreadcrumbList', 'itemListElement' => $list];
}

function blogposting_schema(array $p): array
{
    $url = site_url(post_url($p['slug']));
    $out = [
        '@context' => 'https://schema.org',
        '@type' => 'BlogPosting',
        '@id' => $url . '#article',
        'headline' => mb_substr($p['title'], 0, 110),
        'description' => $p['excerpt'],
        'url' => $url,
        'mainEntityOfPage' => $url,
        'datePublished' => iso_date($p['published_at']),
        'dateModified' => iso_date($p['updated_at'] ?: $p['published_at']),
        'inLanguage' => 'en-GB',
        'image' => site_url($p['featured_image'] ?: '/og/default.png'),
        'author' => ['@type' => 'Organization', 'name' => $p['author'] ?: biz()['name'], 'url' => site_url('/')],
        'publisher' => ['@id' => business_id()],
    ];
    if (!empty($p['category'])) {
        $out['articleSection'] = $p['category'];
    }
    if (!empty($p['tags'])) {
        $out['keywords'] = $p['tags'];
    }
    return $out;
}

function json_ld(array $data): string
{
    return '<script type="application/ld+json">' . str_replace('<', '<', (string) json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)) . '</script>';
}
