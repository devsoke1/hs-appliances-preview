<?php
/**
 * POST /api/contact.php — contact form handler.
 * Accepts application/json or form-data. Returns JSON: { success, message, errors? }.
 */
declare(strict_types=1);

define('HS_API', true);
require __DIR__ . '/_lib/bootstrap.php';

hs_boot();
$in = hs_input();
hs_honeypot($in, 'contact');

$v = new HsValidator($in);
$name = $v->line('name', 'name', 100, true, 2);
$phone = $v->phone('phone');
$email = $v->email('email');
$postcode = $v->postcode('postcode', required: false, full: false);
$message = $v->text('message', 'message', 3000, true, 10);
$v->checked('consent', 'Please tick to agree so we can respond to your enquiry.');
$v->failIfErrors();

hs_verify_recaptcha($in, 'contact');
hs_rate_limit('contact');

$cfg = hs_config();
$biz = $cfg['business'];
$received = (new DateTimeImmutable('now', new DateTimeZone(HS_TIMEZONE)))->format('D j M Y, H:i');

// ── 1. Email to the business ──
try {
    $body = hs_email_body(
        'New website enquiry',
        "A new message was sent from the contact form on {$biz['website']}. Reply to this email to respond to the customer.",
        [
            'Name' => $name,
            'Phone' => $phone,
            'Email' => $email,
            'Postcode' => $postcode,
            'Message' => $message,
            'Received' => $received,
        ]
    );
    $m = hs_mailer();
    $m->addAddress($biz['to_email'], $biz['to_name']);
    $m->addReplyTo($email, hs_header_safe($name, 80));
    $m->Subject = hs_header_safe("Website enquiry from {$name}" . ($postcode !== '' ? " ({$postcode})" : ''));
    $m->isHTML(true);
    $m->Body = $body['html'];
    $m->AltBody = $body['text'];
    hs_deliver($m);
} catch (Throwable $e) {
    hs_log('Contact: business email failed: ' . $e->getMessage());
    hs_json(502, false, "Sorry, we couldn't send your message just now. Please call us on {$biz['phone']} or email {$biz['to_email']}.");
}

// ── 2. Confirmation to the customer (failure here doesn't fail the request) ──
if ($cfg['send_customer_confirmation']) {
    try {
        $first = hs_safe_first_name($name);
        // Deliberately does NOT echo the customer's free-text message: stops the form being used to relay spam.
        $body = hs_email_body(
            'Thanks for getting in touch',
            "Hi {$first},\n\nThanks for contacting {$biz['name']}. We've received your message and will get back to you as soon as we can.\n\nIf your enquiry is urgent, please call us on {$biz['phone']}.",
            ['Received' => $received],
            "{$biz['name']} · {$biz['phone']} · {$biz['website']}\nYou're receiving this because this email address was entered on our contact form. If that wasn't you, please ignore this email."
        );
        $m = hs_mailer();
        $m->addAddress($email);
        $m->addReplyTo($biz['to_email'], $biz['to_name']);
        $m->Subject = "We've received your message — {$biz['name']}";
        $m->isHTML(true);
        $m->Body = $body['html'];
        $m->AltBody = $body['text'];
        hs_deliver($m);
    } catch (Throwable $e) {
        hs_log('Contact: confirmation email failed: ' . $e->getMessage());
    }
}

hs_log('Contact: sent from ' . hs_ip_hash());
hs_json(200, true, "Thanks — your message has been sent. We'll be in touch soon.");
