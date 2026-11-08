<?php
/**
 * Secure image uploads.
 *  - max 3MB, JPG / PNG / WebP only
 *  - real type detected from the file bytes (finfo) + decoded by GD (rejects disguised files)
 *  - pixel limit to stop decompression bombs
 *  - EXIF orientation applied, metadata stripped (GD re-encode)
 *  - resized to max 1600px and converted to WebP
 *  - random filename in /uploads/YYYY/MM/ (that folder's .htaccess blocks script execution)
 */
declare(strict_types=1);

if (!defined('HS_ADMIN')) {
    http_response_code(403);
    exit;
}

const UPLOAD_MAX_BYTES = 3 * 1024 * 1024;
const UPLOAD_MAX_SIDE = 1600;
const UPLOAD_MAX_PIXELS = 40_000_000; // ~ 7700 × 5200
const UPLOAD_WEBP_QUALITY = 80;

final class UploadError extends RuntimeException
{
}

/** True if a file was submitted in $_FILES[$field]. */
function upload_present(string $field): bool
{
    return isset($_FILES[$field]) && is_array($_FILES[$field]) && (int) ($_FILES[$field]['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE;
}

/**
 * Processes $_FILES[$field] and returns the public path, e.g. "/uploads/2026/11/3f9c….webp".
 * @throws UploadError with a user-friendly message
 */
function process_image_upload(string $field): string
{
    if (!function_exists('imagewebp') || !function_exists('imagecreatefromstring')) {
        throw new UploadError('Image processing (PHP GD with WebP) is not available on this server.');
    }
    $f = $_FILES[$field] ?? null;
    if (!is_array($f) || is_array($f['name'] ?? null)) {
        throw new UploadError('Please upload one image.');
    }
    $err = (int) ($f['error'] ?? UPLOAD_ERR_NO_FILE);
    if ($err === UPLOAD_ERR_INI_SIZE || $err === UPLOAD_ERR_FORM_SIZE) {
        throw new UploadError('The image is too large (max 3MB).');
    }
    if ($err !== UPLOAD_ERR_OK || !is_uploaded_file((string) $f['tmp_name'])) {
        throw new UploadError('The upload failed. Please try again.');
    }
    $tmp = (string) $f['tmp_name'];
    if (filesize($tmp) > UPLOAD_MAX_BYTES) {
        throw new UploadError('The image is too large (max 3MB).');
    }

    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($tmp);
    $allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!in_array($mime, $allowed, true)) {
        throw new UploadError('Only JPG, PNG or WebP images are allowed.');
    }
    $info = @getimagesize($tmp);
    if ($info === false || !in_array($info['mime'] ?? '', $allowed, true)) {
        throw new UploadError('That file is not a valid image.');
    }
    [$w, $h] = $info;
    if ($w < 1 || $h < 1 || $w * $h > UPLOAD_MAX_PIXELS) {
        throw new UploadError('The image dimensions are too large.');
    }

    $src = match ($mime) {
        'image/jpeg' => @imagecreatefromjpeg($tmp),
        'image/png' => @imagecreatefrompng($tmp),
        'image/webp' => @imagecreatefromwebp($tmp),
    };
    if (!$src) {
        throw new UploadError('That image could not be read.');
    }

    // Apply EXIF orientation from phone cameras
    if ($mime === 'image/jpeg' && function_exists('exif_read_data')) {
        $exif = @exif_read_data($tmp);
        $rot = match ((int) ($exif['Orientation'] ?? 1)) { 3 => 180, 6 => -90, 8 => 90, default => 0 };
        if ($rot !== 0 && ($r = imagerotate($src, $rot, 0))) {
            $src = $r;
        }
    }

    $w = imagesx($src);
    $h = imagesy($src);
    $scale = min(1, UPLOAD_MAX_SIDE / max($w, $h));
    $nw = max(1, (int) round($w * $scale));
    $nh = max(1, (int) round($h * $scale));

    $dst = imagecreatetruecolor($nw, $nh);
    imagealphablending($dst, false);
    imagesavealpha($dst, true);
    imagefill($dst, 0, 0, imagecolorallocatealpha($dst, 0, 0, 0, 127));
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $nw, $nh, $w, $h);

    $sub = gmdate('Y/m');
    $dir = PUBLIC_ROOT . '/uploads/' . $sub;
    if (!is_dir($dir) && !@mkdir($dir, 0755, true)) {
        throw new UploadError('The uploads folder is not writable.');
    }
    $name = bin2hex(random_bytes(16)) . '.webp';
    $ok = imagewebp($dst, $dir . '/' . $name, UPLOAD_WEBP_QUALITY);
    if (!$ok) {
        throw new UploadError('Could not save the image.');
    }
    return '/uploads/' . $sub . '/' . $name;
}
