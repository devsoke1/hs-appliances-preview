<?php
/**
 * LOCAL TESTING ONLY: builds a SQLite copy of the database from the real MySQL schema.sql + seed.sql,
 * so the PHP pages and admin can run on PHP's built-in server without MySQL.
 *   npm run dev:db   (→ private/dev.sqlite)
 * Production always uses MySQL (see docs/admin-setup.md).
 */
[$_, $schemaFile, $seedFile, $dbFile] = $argv;
@unlink($dbFile);
$pdo = new PDO('sqlite:' . $dbFile, null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

$sql = file_get_contents($schemaFile);
$sql = preg_replace('/^\s*--.*$/m', '', $sql);
$sql = preg_replace('/--[^\n\']*$/m', '', $sql);           // trailing comments
$sql = preg_replace('/^SET .*;$/m', '', $sql);
$sql = str_replace('INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY', 'INTEGER PRIMARY KEY AUTOINCREMENT', $sql);
$sql = preg_replace('/ENUM\([^)]*\)/', 'TEXT', $sql);
$sql = str_replace(' ON UPDATE CURRENT_TIMESTAMP', '', $sql);
$sql = preg_replace('/\)\s*ENGINE=[^;]*;/', ');', $sql);
$sql = preg_replace('/UNIQUE KEY \w+ \(([^)]*)\)/', 'UNIQUE ($1)', $sql);
$sql = preg_replace('/,\s*KEY \w+ \([^)]*\)/', '', $sql);
$sql = preg_replace('/\b(TINYINT UNSIGNED|INT UNSIGNED|TINYINT\(1\))/', 'INTEGER', $sql);
$sql = preg_replace('/\b(MEDIUMTEXT|JSON)\b/', 'TEXT', $sql);
$pdo->exec($sql);

$seed = file_get_contents($seedFile);
$seed = preg_replace('/^SET .*;$/m', '', $seed);
$pdo->exec($seed);

foreach (['services', 'posts', 'reviews', 'settings', 'admin_users', 'slug_redirects'] as $t) {
    echo str_pad($t, 16), $pdo->query("SELECT COUNT(*) FROM $t")->fetchColumn(), "\n";
}
$row = $pdo->query("SELECT slug, json_array_length(common_faults) f, json_array_length(faqs) q, length(content) c, meta_title FROM services WHERE slug='gas-hob-repair'")->fetch(PDO::FETCH_ASSOC);
echo json_encode($row), "\n";
$faq = $pdo->query("SELECT json_extract(faqs, '$[0].question') FROM services WHERE slug='washing-machine-repair'")->fetchColumn();
echo "first FAQ: $faq\n";
