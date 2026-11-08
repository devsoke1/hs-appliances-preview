<?php
/**
 * POST /hs-admin/upload.php — image upload for the rich-text editor.
 * Requires a logged-in admin + CSRF token (X-CSRF-Token header). Returns JSON {url} or {error}.
 */
declare(strict_types=1);
require __DIR__ . '/_inc/bootstrap.php';
require __DIR__ . '/_inc/image.php';

header('Content-Type: application/json; charset=utf-8');

if (!current_admin()) {
    http_response_code(401);
    echo json_encode(['error' => 'Please log in again.']);
    exit;
}
if (!is_post()) {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}
csrf_check();

try {
    if (!upload_present('file')) {
        throw new UploadError('No file received.');
    }
    $url = process_image_upload('file');
    hs_log('Editor image uploaded ' . $url, 'admin.log');
    echo json_encode(['url' => $url]);
} catch (UploadError $e) {
    http_response_code(422);
    echo json_encode(['error' => $e->getMessage()]);
}
