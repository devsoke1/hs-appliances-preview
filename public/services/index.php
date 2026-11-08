<?php
/**
 * /services/ — all active services grouped Domestic / Commercial (live from the database).
 */
declare(strict_types=1);
require dirname(__DIR__) . '/includes/bootstrap.php';

canonical_redirect('/services/');
$seo = site()['seo']['pages']['services'] ?? ['title' => 'Appliance Repair Services | HS Appliances', 'description' => ''];
page(['title' => $seo['title'], 'description' => $seo['description'], 'path' => '/services/']);

require dirname(__DIR__) . '/includes/head.php';
require dirname(__DIR__) . '/includes/header.php';

echo page_hero(
    [['label' => 'Services']],
    'Our services',
    'Appliance repair, installation & maintenance',
    "From the washing machine at home to the cold room your business depends on — choose an appliance below to see common faults, what's involved and answers to frequent questions.",
    hero_actions()
);

$groups = [
    'domestic' => ['For your home', 'Domestic appliance repair', 'Repairs for the appliances you use every day, plus installation of new washing machines, dishwashers and more.', 'white'],
    'commercial' => ['For your business', 'Commercial refrigeration repair', 'Repair and maintenance for shops, restaurants, pubs, hotels and food businesses — where downtime means lost stock.', 'mist'],
];
foreach ($groups as $cat => [$eyebrowText, $title, $intro, $tone]) {
    $list = services_by_category($cat);
    if (!$list) {
        continue;
    }
    echo section_open($tone, '', $cat) . section_header($eyebrowText, $title, $intro) . service_grid($list) . section_close();
}

echo section_open() . section_header('How it works', 'Straightforward from first call to fixed', '', 'center') . process_steps() . section_close();
echo cta_band('Not sure which service you need?', "Call us and describe the problem — we'll point you in the right direction.");

require dirname(__DIR__) . '/includes/footer.php';
