<?php
/**
 * POST /api/booking.php — booking request handler.
 * Accepts multipart/form-data (with optional photos[]) or application/json (no photos).
 * Returns JSON: { success, message, errors? }.
 */
declare(strict_types=1);

define('HS_API', true);
require __DIR__ . '/_lib/bootstrap.php';

hs_boot();
$in = hs_input();
hs_honeypot($in, 'booking');

$appliances = require __DIR__ . '/_lib/options.php';
$slots = ['AM' => 'Morning (AM)', 'PM' => 'Afternoon (PM)'];

$v = new HsValidator($in);
$name = $v->line('name', 'name', 100, true, 2);
$phone = $v->phone('phone');
$email = $v->email('email');
$postcode = $v->postcode('postcode');
$address = $v->line('address', 'address', 200, true, 5);
$appliance = $v->oneOf('appliance', 'appliance type', $appliances);
$brand = $v->pattern('brand', 'brand', "/^[\\p{L}\\p{N} &'().\\/\\-]+$/u", 60);
$fault = $v->text('fault', 'fault description', 3000, true, 10);
$date = $v->futureDate('preferred_date', 'preferred date');
$slot = $v->oneOf('time_slot', 'time slot', $slots);
$v->checked('consent', 'Please tick to agree so we can process your booking.');
$photos = hs_collect_photos($v);
$v->failIfErrors();

hs_verify_recaptcha($in, 'booking');
hs_rate_limit('booking');

$cfg = hs_config();
$biz = $cfg['business'];
$applianceLabel = $appliances[$appliance] ?? $appliance;
$slotLabel = $slots[$slot] ?? $slot;
$dateLabel = $date ? $date->format('l j F Y') : '';
$received = (new DateTimeImmutable('now', new DateTimeZone(HS_TIMEZONE)))->format('D j M Y, H:i');

// ── 1. Email to the business (photos attached) ──
try {
    $body = hs_email_body(
        'New booking request',
        "A booking request was submitted on {$biz['website']}. Call the customer to confirm the appointment. Reply to this email to contact them.",
        [
            'Name' => $name,
            'Phone' => $phone,
            'Email' => $email,
            'Address' => $address,
            'Postcode' => $postcode,
            'Appliance' => $applianceLabel,
            'Brand' => $brand,
            'Fault' => $fault,
            'Preferred date' => $dateLabel,
            'Time slot' => $slotLabel,
            'Photos' => $photos ? count($photos) . ' attached' : 'None',
            'Received' => $received,
        ]
    );
    $m = hs_mailer();
    $m->addAddress($biz['to_email'], $biz['to_name']);
    $m->addReplyTo($email, hs_header_safe($name, 80));
    $m->Subject = hs_header_safe("Booking request: {$applianceLabel} — {$postcode} — " . ($date ? $date->format('D j M') : '') . " {$slot}");
    $m->isHTML(true);
    $m->Body = $body['html'];
    $m->AltBody = $body['text'];
    foreach ($photos as $p) {
        $m->addAttachment($p['path'], $p['name'], PHPMailer\PHPMailer\PHPMailer::ENCODING_BASE64, $p['mime']);
    }
    hs_deliver($m);
} catch (Throwable $e) {
    hs_log('Booking: business email failed: ' . $e->getMessage());
    hs_json(502, false, "Sorry, we couldn't send your booking just now. Please call us on {$biz['phone']} to book.");
} finally {
    // Photos are never kept: remove the temp files now (PHP would also delete them at request end).
    foreach ($photos as $p) {
        if (is_file($p['path'])) {
            @unlink($p['path']);
        }
    }
}

// ── 2. Confirmation to the customer ──
if ($cfg['send_customer_confirmation']) {
    try {
        $first = hs_safe_first_name($name);
        // Only fixed/allow-listed values are echoed (no free text) so the form can't relay spam.
        $body = hs_email_body(
            'Booking request received',
            "Hi {$first},\n\nThanks for booking with {$biz['name']}. This is a booking request — we'll call or email you shortly to confirm your appointment and the call-out charge.\n\nIf you need us sooner, please call {$biz['phone']}.",
            [
                'Appliance' => $applianceLabel,
                'Preferred date' => $dateLabel,
                'Time slot' => $slotLabel,
                'Postcode' => $postcode,
            ],
            "{$biz['name']} · {$biz['phone']} · {$biz['website']}\nYou're receiving this because this email address was entered on our booking form. If that wasn't you, please ignore this email."
        );
        $m = hs_mailer();
        $m->addAddress($email);
        $m->addReplyTo($biz['to_email'], $biz['to_name']);
        $m->Subject = "Booking request received — {$biz['name']}";
        $m->isHTML(true);
        $m->Body = $body['html'];
        $m->AltBody = $body['text'];
        hs_deliver($m);
    } catch (Throwable $e) {
        hs_log('Booking: confirmation email failed: ' . $e->getMessage());
    }
}

hs_log('Booking: sent from ' . hs_ip_hash() . ' (' . count($photos) . ' photos)');
hs_json(200, true, "Thanks — your booking request has been sent. We'll call or email you shortly to confirm your appointment.");
