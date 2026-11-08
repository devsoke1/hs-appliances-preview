<?php
/**
 * Shared helpers for the form endpoints (contact.php, booking.php).
 * Requires PHP 8.1+, ext-mbstring, ext-fileinfo, ext-openssl (all enabled on Hostinger by default).
 *
 * This folder is blocked from the web by _lib/.htaccess and the root .htaccess.
 */
declare(strict_types=1);

if (!defined('HS_API')) {
    http_response_code(403);
    exit;
}

require_once __DIR__ . '/core.php';
require __DIR__ . '/PHPMailer/Exception.php';
require __DIR__ . '/PHPMailer/PHPMailer.php';
require __DIR__ . '/PHPMailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;

const HS_MAX_BODY_BYTES = 20 * 1024 * 1024; // whole request, incl. up to 3 x 5MB photos

/* ───────────────────────────── Config ───────────────────────────── */



function hs_fallback_message(): string
{
    return 'Sorry, something went wrong sending your request. Please call us on ' . hs_default_config()['business']['phone'] . '.';
}

/* ───────────────────────────── Request / response ───────────────────────────── */

function hs_json(int $status, bool $success, string $message, array $extra = []): never
{
    if (!headers_sent()) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        header('X-Content-Type-Options: nosniff');
        header('X-Robots-Tag: noindex, nofollow');
    }
    echo json_encode(['success' => $success, 'message' => $message] + $extra, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/** Common setup: error handling, method, origin and size checks. */
function hs_boot(): void
{
    ini_set('display_errors', '0');
    error_reporting(E_ALL);
    if (function_exists('header_remove')) {
        header_remove('X-Powered-By');
    }
    set_error_handler(static function (int $severity, string $msg, string $file, int $line): bool {
        if (!(error_reporting() & $severity)) {
            return false; // respects @-suppression
        }
        throw new ErrorException($msg, 0, $severity, $file, $line);
    });
    set_exception_handler(static function (Throwable $e): void {
        hs_log('Unhandled ' . get_class($e) . ': ' . $e->getMessage() . ' @ ' . basename($e->getFile()) . ':' . $e->getLine());
        hs_json(500, false, hs_fallback_message());
    });

    hs_config();

    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        header('Allow: POST');
        hs_json(405, false, 'Method not allowed.');
    }
    hs_check_origin();

    $length = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($length > HS_MAX_BODY_BYTES) {
        hs_json(413, false, 'Your submission is too large. Please use smaller photos (max 5MB each).');
    }
}

/** Same-origin check: blocks cross-site form posts and most direct bot posts. */
function hs_check_origin(): void
{
    $allowed = array_map(static fn ($o) => rtrim(strtolower((string) $o), '/'), hs_config()['allowed_origins']);
    $origin = strtolower(trim((string) ($_SERVER['HTTP_ORIGIN'] ?? '')));
    if ($origin === '' && !empty($_SERVER['HTTP_REFERER'])) {
        $p = parse_url((string) $_SERVER['HTTP_REFERER']);
        if (is_array($p) && isset($p['scheme'], $p['host'])) {
            $origin = strtolower($p['scheme'] . '://' . $p['host'] . (isset($p['port']) ? ':' . $p['port'] : ''));
        }
    }
    if ($origin === '' || !in_array($origin, $allowed, true)) {
        hs_log('Blocked origin: ' . substr($origin, 0, 100));
        hs_json(403, false, 'Forbidden.');
    }
}

/** Reads JSON or form-data input into an array. */
function hs_input(): array
{
    $type = strtolower((string) ($_SERVER['CONTENT_TYPE'] ?? ''));
    if (str_contains($type, 'application/json')) {
        $raw = file_get_contents('php://input', false, null, 0, 1024 * 1024);
        $data = json_decode((string) $raw, true);
        if (!is_array($data)) {
            hs_json(400, false, 'Invalid request.');
        }
        return $data;
    }
    // PHP silently drops the body when it exceeds post_max_size
    if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 0 && empty($_POST) && empty($_FILES)) {
        hs_json(413, false, 'Your submission is too large. Please use smaller photos (max 5MB each).');
    }
    return $_POST;
}

/** Bots fill hidden fields. Pretend success so they don't adapt; send nothing. */
function hs_honeypot(array $in, string $form): void
{
    $trap = $in['company_website'] ?? '';
    if (!is_string($trap) || trim($trap) !== '') {
        hs_log("Honeypot triggered on {$form} from " . hs_ip_hash());
        hs_json(200, true, 'Thank you — your message has been sent.');
    }
}



/* ───────────────────────────── Storage / logging ───────────────────────────── */



/* ───────────────────────────── Rate limiting ───────────────────────────── */



function hs_rate_limit(string $form): void
{
    $c = hs_config()['rate_limit'];
    $phone = hs_config()['business']['phone'];
    if (!hs_rate_hit("ip|{$form}|" . hs_client_ip(), (int) $c['max'], (int) $c['window'])) {
        header('Retry-After: ' . (int) $c['window']);
        hs_log("Rate limited ({$form}) " . hs_ip_hash());
        hs_json(429, false, "You've sent several requests in a short time. Please wait a few minutes, or call us on {$phone}.");
    }
    if (!hs_rate_hit("global|{$form}", (int) $c['global_max'], 3600)) {
        hs_log("Global rate limit reached ({$form})");
        hs_json(429, false, "We're receiving a lot of requests right now. Please call us on {$phone}.");
    }
}

/* ───────────────────────────── reCAPTCHA v3 (optional) ───────────────────────────── */

function hs_verify_recaptcha(array $in, string $action): void
{
    $rc = hs_config()['recaptcha'];
    $secret = (string) ($rc['secret'] ?? '');
    if ($secret === '') {
        return; // disabled
    }
    $phone = hs_config()['business']['phone'];
    $failMsg = "Our spam check couldn't verify your request. Please refresh the page and try again, or call us on {$phone}.";
    $token = $in['recaptcha_token'] ?? '';
    if (!is_string($token) || $token === '' || strlen($token) > 4000) {
        hs_json(400, false, $failMsg);
    }
    $response = hs_http_post('https://www.google.com/recaptcha/api/siteverify', [
        'secret' => $secret,
        'response' => $token,
        'remoteip' => hs_client_ip(),
    ]);
    if ($response === null) {
        hs_log('reCAPTCHA unreachable — allowing request');
        return; // fail open: don't lose genuine enquiries if Google is unreachable
    }
    $data = json_decode($response, true);
    $ok = is_array($data)
        && !empty($data['success'])
        && ($data['action'] ?? '') === $action
        && (float) ($data['score'] ?? 0) >= (float) $rc['min_score'];
    if (!$ok) {
        hs_log('reCAPTCHA rejected: score=' . ($data['score'] ?? 'n/a') . ' action=' . ($data['action'] ?? 'n/a'));
        hs_json(400, false, $failMsg);
    }
}

function hs_http_post(string $url, array $fields): ?string
{
    $body = http_build_query($fields);
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 8,
            CURLOPT_CONNECTTIMEOUT => 4,
        ]);
        $out = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        return (is_string($out) && $code === 200) ? $out : null;
    }
    $ctx = stream_context_create(['http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
        'content' => $body,
        'timeout' => 8,
    ]]);
    $out = @file_get_contents($url, false, $ctx);
    return is_string($out) ? $out : null;
}

/* ───────────────────────────── Validation ───────────────────────────── */

final class HsValidator
{
    /** @var array<string,string> field name => message */
    public array $errors = [];

    public function __construct(private readonly array $in)
    {
    }

    private function raw(string $key): string
    {
        $v = $this->in[$key] ?? '';
        if (is_int($v) || is_float($v)) {
            $v = (string) $v;
        }
        if (!is_string($v)) {
            return ''; // arrays/objects are never valid for scalar fields
        }
        return mb_scrub($v, 'UTF-8');
    }

    private function length(string $key, string $label, string $v, int $max, bool $required, int $min): string
    {
        if ($v === '') {
            if ($required) {
                $this->errors[$key] = "Please enter your {$label}.";
            }
        } elseif (mb_strlen($v) > $max) {
            $this->errors[$key] = ucfirst($label) . " must be {$max} characters or fewer.";
        } elseif (mb_strlen($v) < $min) {
            $this->errors[$key] = ucfirst($label) . " must be at least {$min} characters.";
        }
        return $v;
    }

    /** Single-line text: all control characters (incl. CR/LF — header injection) become spaces. */
    public function line(string $key, string $label, int $max, bool $required = true, int $min = 0): string
    {
        $v = preg_replace('/[\p{Cc}\p{Zl}\p{Zp}]+/u', ' ', $this->raw($key)) ?? '';
        $v = trim(preg_replace('/\s{2,}/u', ' ', $v) ?? '');
        return $this->length($key, $label, $v, $max, $required, $min);
    }

    /** Multi-line text: keeps newlines, strips other control characters. */
    public function text(string $key, string $label, int $max, bool $required = true, int $min = 0): string
    {
        $v = str_replace(["\r\n", "\r"], "\n", $this->raw($key));
        $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $v) ?? '';
        $v = trim(preg_replace("/\n{3,}/", "\n\n", $v) ?? '');
        return $this->length($key, $label, $v, $max, $required, $min);
    }

    public function email(string $key, bool $required = true): string
    {
        $v = $this->line($key, 'email address', 150, $required);
        if ($v !== '' && !isset($this->errors[$key]) && filter_var($v, FILTER_VALIDATE_EMAIL) === false) {
            $this->errors[$key] = 'Please enter a valid email address.';
        }
        return $v;
    }

    public function phone(string $key, bool $required = true): string
    {
        $v = $this->line($key, 'phone number', 20, $required);
        if ($v !== '' && !isset($this->errors[$key])) {
            $digits = preg_replace('/\D/', '', $v) ?? '';
            if (!preg_match('/^[0-9 +()\-]+$/', $v) || strlen($digits) < 10 || strlen($digits) > 13) {
                $this->errors[$key] = 'Please enter a valid phone number.';
            }
        }
        return $v;
    }

    /** UK postcode. $full=false also accepts an outward code only (e.g. "TW13"). */
    public function postcode(string $key, bool $required = true, bool $full = true): string
    {
        $v = strtoupper(preg_replace('/\s+/', '', $this->line($key, 'postcode', 10, $required)) ?? '');
        if ($v === '' || isset($this->errors[$key])) {
            return $v;
        }
        if (preg_match('/^([A-Z]{1,2}\d[A-Z\d]?)(\d[A-Z]{2})$/', $v, $m)) {
            return $m[1] . ' ' . $m[2];
        }
        if (!$full && preg_match('/^[A-Z]{1,2}\d[A-Z\d]?$/', $v)) {
            return $v;
        }
        $this->errors[$key] = 'Please enter a valid UK postcode, e.g. TW13 6AD.';
        return $v;
    }

    /**
     * @param string $label noun phrase without article, e.g. "appliance type"
     * @param array<string,string> $allowed value => label
     */
    public function oneOf(string $key, string $label, array $allowed, bool $required = true): string
    {
        $v = $this->line($key, $label, 100, false);
        if ($v === '') {
            if ($required) {
                $article = preg_match('/^[aeiou]/i', $label) ? 'an' : 'a';
                $this->errors[$key] = "Please choose {$article} {$label}.";
            }
        } elseif (!array_key_exists($v, $allowed)) {
            $this->errors[$key] = "Please choose a valid {$label}.";
        }
        return $v;
    }

    public function pattern(string $key, string $label, string $regex, int $max, bool $required = true): string
    {
        $v = $this->line($key, $label, $max, $required);
        if ($v !== '' && !isset($this->errors[$key]) && !preg_match($regex, $v)) {
            $this->errors[$key] = "Please enter a valid {$label}.";
        }
        return $v;
    }

    /** Date in Y-m-d, from today up to $maxDays ahead (UK time). */
    public function futureDate(string $key, string $label, int $maxDays = 365, bool $required = true): ?DateTimeImmutable
    {
        $v = $this->line($key, $label, 10, $required);
        if ($v === '' || isset($this->errors[$key])) {
            return null;
        }
        $tz = new DateTimeZone(HS_TIMEZONE);
        $d = DateTimeImmutable::createFromFormat('!Y-m-d', $v, $tz);
        $today = new DateTimeImmutable('today', $tz);
        if (!$d || $d->format('Y-m-d') !== $v) {
            $this->errors[$key] = "Please choose a valid {$label}.";
        } elseif ($d < $today) {
            $this->errors[$key] = ucfirst($label) . ' cannot be in the past.';
        } elseif ($d > $today->modify("+{$maxDays} days")) {
            $this->errors[$key] = ucfirst($label) . ' must be within the next 12 months.';
        } else {
            return $d;
        }
        return null;
    }

    public function checked(string $key, string $message): bool
    {
        $v = $this->in[$key] ?? null;
        $ok = $v === true || (is_string($v) && in_array(strtolower($v), ['yes', 'on', '1', 'true'], true));
        if (!$ok) {
            $this->errors[$key] = $message;
        }
        return $ok;
    }

    public function failIfErrors(): void
    {
        if ($this->errors) {
            hs_json(422, false, 'Please check the highlighted fields and try again.', ['errors' => $this->errors]);
        }
    }
}

/* ───────────────────────────── Uploads ───────────────────────────── */

/**
 * Validates uploaded photos (input name="photos[]"). Files are NEVER stored: they stay in PHP's
 * temp dir, get attached to the business email, and are deleted at the end of the request.
 *
 * @return array<int,array{path:string,name:string,mime:string}>
 */
function hs_collect_photos(HsValidator $v, string $field = 'photos', int $maxFiles = 3, int $maxBytes = 5 * 1024 * 1024): array
{
    if (empty($_FILES[$field]) || !is_array($_FILES[$field]['name'] ?? null)) {
        if (!empty($_FILES[$field])) {
            $v->errors[$field] = 'Please upload photos using the form.';
        }
        return [];
    }
    $allowed = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
        'image/heic' => 'heic',
        'image/heif' => 'heif',
    ];
    $f = $_FILES[$field];
    $out = [];
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $count = count($f['name']);

    for ($i = 0; $i < $count; $i++) {
        $err = (int) ($f['error'][$i] ?? UPLOAD_ERR_NO_FILE);
        if ($err === UPLOAD_ERR_NO_FILE) {
            continue;
        }
        if (count($out) >= $maxFiles) {
            $v->errors[$field] = "Please upload no more than {$maxFiles} photos.";
            return [];
        }
        if ($err === UPLOAD_ERR_INI_SIZE || $err === UPLOAD_ERR_FORM_SIZE) {
            $v->errors[$field] = 'Each photo must be 5MB or smaller.';
            return [];
        }
        $tmp = (string) ($f['tmp_name'][$i] ?? '');
        if ($err !== UPLOAD_ERR_OK || !is_uploaded_file($tmp)) {
            $v->errors[$field] = 'One of your photos failed to upload. Please try again.';
            return [];
        }
        if ((int) filesize($tmp) > $maxBytes) {
            $v->errors[$field] = 'Each photo must be 5MB or smaller.';
            return [];
        }
        // Detect type from the file's bytes — never trust the browser-supplied type or extension.
        $mime = (string) $finfo->file($tmp);
        if (!isset($allowed[$mime])) {
            $v->errors[$field] = 'Photos must be JPG, PNG, WEBP or HEIC images.';
            return [];
        }
        if (in_array($mime, ['image/jpeg', 'image/png', 'image/webp'], true) && @getimagesize($tmp) === false) {
            $v->errors[$field] = 'One of your files is not a valid image.';
            return [];
        }
        $out[] = ['path' => $tmp, 'name' => 'photo-' . (count($out) + 1) . '.' . $allowed[$mime], 'mime' => $mime];
    }
    return $out;
}

/* ───────────────────────────── Email ───────────────────────────── */

function hs_mailer(): PHPMailer
{
    $c = hs_config();
    $m = new PHPMailer(true);
    $m->CharSet = PHPMailer::CHARSET_UTF8;
    $m->XMailer = ' '; // don't advertise the mailer version

    if ($c['mail_transport'] === 'smtp') {
        $s = $c['smtp'];
        if ($s['username'] === '' || $s['password'] === '') {
            throw new RuntimeException('SMTP credentials are not configured');
        }
        $m->isSMTP();
        $m->Host = (string) $s['host'];
        $m->Port = (int) $s['port'];
        $m->SMTPAuth = true;
        $m->Username = (string) $s['username'];
        $m->Password = (string) $s['password'];
        $m->SMTPSecure = $s['secure'] === 'tls' ? PHPMailer::ENCRYPTION_STARTTLS : PHPMailer::ENCRYPTION_SMTPS;
        $m->Timeout = 20;
    }
    $from = $c['smtp']['from_email'] ?: ($c['smtp']['username'] ?: 'no-reply@hsappliances.co.uk');
    $m->setFrom($from, (string) $c['smtp']['from_name']);
    return $m;
}

function hs_deliver(PHPMailer $m): void
{
    if (hs_config()['mail_transport'] === 'log') {
        $m->preSend();
        $file = hs_storage('mail') . '/' . gmdate('Ymd-His') . '-' . bin2hex(random_bytes(3)) . '.eml';
        file_put_contents($file, $m->getSentMIMEMessage());
        return;
    }
    $m->send();
}

function hs_e(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5, 'UTF-8');
}

/**
 * Builds a simple, robust HTML email (inline styles only). All values are escaped here.
 *
 * @param array<string,string> $rows label => value
 * @return array{html:string,text:string}
 */
function hs_email_body(string $heading, string $intro, array $rows, string $footer = ''): array
{
    $tr = '';
    $txt = $heading . "\n" . str_repeat('=', mb_strlen($heading)) . "\n\n" . $intro . "\n\n";
    foreach ($rows as $label => $value) {
        if ($value === '') {
            continue;
        }
        $tr .= '<tr><td style="padding:10px 12px;border-bottom:1px solid #dfe5ee;color:#66748a;font-size:14px;width:160px;vertical-align:top">'
            . hs_e($label) . '</td><td style="padding:10px 12px;border-bottom:1px solid #dfe5ee;color:#0f1a2e;font-size:15px;vertical-align:top">'
            . nl2br(hs_e($value)) . '</td></tr>';
        $txt .= $label . ': ' . $value . "\n";
    }
    if ($footer !== '') {
        $txt .= "\n" . $footer . "\n";
    }
    $html = '<!doctype html><html><body style="margin:0;padding:24px;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif">'
        . '<table role="presentation" width="100%" style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #dfe5ee">'
        . '<tr><td style="background:#0b1d3a;padding:20px 24px;color:#ffffff;font-size:20px;font-weight:bold">' . hs_e($heading) . '</td></tr>'
        . '<tr><td style="padding:20px 24px 8px;color:#3b4759;font-size:15px;line-height:1.6">' . nl2br(hs_e($intro)) . '</td></tr>'
        . '<tr><td style="padding:8px 12px 16px"><table role="presentation" width="100%" style="border-collapse:collapse">' . $tr . '</table></td></tr>'
        . ($footer !== '' ? '<tr><td style="padding:0 24px 24px;color:#66748a;font-size:13px;line-height:1.6">' . nl2br(hs_e($footer)) . '</td></tr>' : '')
        . '</table></body></html>';
    return ['html' => $html, 'text' => $txt];
}

/**
 * First name for greetings in customer emails — letters only, so the (attacker-controlled)
 * name field can't be used to put links or spam into emails we send to third parties.
 */
function hs_safe_first_name(string $name): string
{
    $first = explode(' ', trim($name))[0] ?? '';
    return preg_match("/^[\\p{L}'\\-]{1,30}$/u", $first) ? $first : 'there';
}

/** Strips anything that could break a header line (subject etc.). */
function hs_header_safe(string $s, int $max = 120): string
{
    return mb_substr(trim(preg_replace('/[\p{Cc}]+/u', ' ', $s) ?? ''), 0, $max);
}
