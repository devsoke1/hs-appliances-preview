<?php
/**
 * POST /api/booking.php — online booking.
 * Accepts multipart/form-data (with optional photos[]) or application/json (no photos).
 * Returns JSON: { success, message, errors?, booking? }.
 *
 * Flow: validate → postcode coverage (Domestic list / AC list / Commercial anywhere) → re-check the slot
 * (database + admin blocks + Google Calendar, uncached) → store the booking (a UNIQUE key makes the
 * slot first-come-first-served) → add it to Google Calendar → email the business and the customer.
 */
declare(strict_types=1);

define('HS_API', true);
require __DIR__ . '/_lib/bootstrap.php';
require __DIR__ . '/_lib/booking.php';

hs_boot();
$in = hs_input();
hs_honeypot($in, 'booking');

$cfg = hs_config();
$biz = $cfg['business'];
$refs = booking_refs();
$slots = booking_slots();

$v = new HsValidator($in);
$bookingRef = $v->line('booking_ref', 'booking reference', 150, false);
if ($bookingRef === '') {
    $v->errors['booking_ref'] = 'Please choose what you are booking.';
} elseif (!isset($refs[$bookingRef])) {
    $v->errors['booking_ref'] = 'Please choose a valid service from the list.';
}
$first = $v->line('first_name', 'first name', 60, true, 1);
$last = $v->line('last_name', 'last name', 60, true, 1);
$email = $v->email('email');
$phone = $v->phone('phone');
$addr1 = $v->line('address_line1', 'address', 150, true, 3);
$addr2 = $v->line('address_line2', 'address line 2', 150, false);
$town = $v->line('town', 'town', 80, true, 2);
$city = $v->line('city', 'city', 80, false);
$postcode = $v->postcode('postcode');
$note = $v->text('note', 'description of the problem', 3000, true, 10);
$dateStr = $v->line('slot_date', 'date', 10, false);
$slotStart = $v->line('slot_start', 'time slot', 5, false);
$v->checked('consent', 'Please tick to agree so we can process your booking.');
$photos = hs_collect_photos($v);

$category = $refs[$bookingRef] ?? null;

// Postcode coverage (outward code: "TW3 1AB" → TW3; "SW1A 1AA" → SW1A, which is not SW1)
if ($category !== null && $postcode !== '' && !isset($v->errors['postcode'])) {
    $outward = booking_outward($postcode);
    if (!booking_covered($outward, $category)) {
        $v->errors['postcode'] = $category === 'ac'
            ? "Sorry, {$outward} is outside our air conditioning area (London, Berkshire and Reading). Please call us on {$biz['phone']}."
            : "Sorry, we can't take online domestic bookings for {$outward}. Please call us directly on {$biz['phone']}.";
    }
}

// Date + slot
$date = $dateStr !== '' ? booking_parse_date($dateStr) : null;
[$firstDay, $lastDay] = booking_window();
if ($dateStr === '' || $slotStart === '') {
    $v->errors['slot_start'] = 'Please choose a date and time slot.';
} elseif (!$date || $date < $firstDay || $date > $lastDay || !isset($slots[$slotStart])) {
    $v->errors['slot_start'] = 'Please choose a valid date and time slot.';
}
$v->failIfErrors();

hs_verify_recaptcha($in, 'booking');
hs_rate_limit('booking');

$ymd = $date->format('Y-m-d');
$slotTaken = static function (): never {
    hs_json(409, false, 'Sorry, that time slot has just been taken. Please choose another one.', [
        'errors' => ['slot_start' => 'This slot is no longer available. Please choose another.'],
        'slot_taken' => true,
    ]);
};

// Fresh check (bypasses the 60-second calendar cache)
$avail = booking_availability($ymd, 1, true);
if (empty($avail['days'][$ymd]['slots'][$slotStart])) {
    $slotTaken();
}

// Store — the UNIQUE slot_key means only the first of two simultaneous bookings succeeds.
$booking = [
    'booking_ref' => $bookingRef,
    'category' => $category,
    'first_name' => $first,
    'last_name' => $last,
    'email' => $email,
    'phone' => $phone,
    'address_line1' => $addr1,
    'address_line2' => $addr2,
    'town' => $town,
    'city' => $city,
    'postcode' => $postcode,
    'note' => $note,
    'slot_date' => $ymd,
    'slot_start' => $slotStart,
];
for ($attempt = 0; ; $attempt++) {
    $booking['reference'] = booking_reference();
    try {
        db_exec(
            'INSERT INTO bookings (reference, booking_ref, category, first_name, last_name, email, phone, address_line1, address_line2, town, city, postcode, note, slot_date, slot_start, slot_key, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [$booking['reference'], $bookingRef, $category, $first, $last, $email, $phone, $addr1, $addr2, $town, $city, $postcode, $note, $ymd, $slotStart, "$ymd $slotStart", db_now(), db_now()]
        );
        break;
    } catch (PDOException $e) {
        $taken = db_value("SELECT COUNT(*) FROM bookings WHERE slot_key = ?", ["$ymd $slotStart"]);
        if ((int) $taken > 0) {
            $slotTaken();
        }
        if ($attempt >= 3) {
            throw $e; // not a reference collision — let the error handler respond
        }
    }
}
$booking['id'] = (int) db()->lastInsertId();

// Add to Google Calendar (a failure is logged and shown in the admin; the booking still stands)
$calendar = booking_sync_calendar($booking);

$dateLabel = $date->format('l j F Y');
$slotLabel = booking_slot_label($slotStart);
$address = implode(', ', array_filter([$addr1, $addr2, $town, $city, $postcode]));
$received = (new DateTimeImmutable('now', booking_tz()))->format('D j M Y, H:i');

// ── 1. Email to the business (photos attached) ──
try {
    $body = hs_email_body(
        'New booking: ' . $bookingRef,
        "A booking was made on {$biz['website']} and the slot is now reserved." . ($calendar === 'synced' ? ' It has been added to your Google Calendar.' : '') . ' Reply to this email to contact the customer.',
        [
            'Reference' => $booking['reference'],
            'Booking for' => $bookingRef,
            'Date' => $dateLabel,
            'Time slot' => $slotLabel,
            'Name' => "$first $last",
            'Phone' => $phone,
            'Email' => $email,
            'Address' => $address,
            'Problem' => $note,
            'Photos' => $photos ? count($photos) . ' attached' : 'None',
            'Calendar' => ['synced' => 'Added to Google Calendar', 'failed' => 'NOT added to the calendar — see /hs-admin/ → Bookings', 'off' => 'Google Calendar not connected'][$calendar] ?? $calendar,
            'Received' => $received,
        ]
    );
    $m = hs_mailer();
    $m->addAddress($biz['to_email'], $biz['to_name']);
    $m->addReplyTo($email, hs_header_safe("$first $last", 80));
    $m->Subject = hs_header_safe("Booking {$booking['reference']}: {$bookingRef} — " . $date->format('D j M') . " {$slotLabel} — {$postcode}");
    $m->isHTML(true);
    $m->Body = $body['html'];
    $m->AltBody = $body['text'];
    foreach ($photos as $p) {
        $m->addAttachment($p['path'], $p['name'], PHPMailer\PHPMailer\PHPMailer::ENCODING_BASE64, $p['mime']);
    }
    hs_deliver($m);
} catch (Throwable $e) {
    // The booking is already stored (and in the calendar), so don't tell the customer it failed.
    hs_log('Booking: business email failed for ' . $booking['reference'] . ': ' . $e->getMessage());
} finally {
    foreach ($photos as $p) {
        if (is_file($p['path'])) {
            @unlink($p['path']);
        }
    }
}

// ── 2. Confirmation to the customer ──
$emailed = false;
if ($cfg['send_customer_confirmation']) {
    try {
        $firstSafe = hs_safe_first_name($first);
        // Only fixed/allow-listed values are echoed (no free text) so the form can't relay spam.
        $body = hs_email_body(
            'Your booking is confirmed',
            "Hi {$firstSafe},\n\nThanks for booking with {$biz['name']}. Your appointment is booked — the details are below. Our engineer will arrive within the 2-hour slot.\n\nNeed to change or cancel? Call us on {$biz['phone']} and quote your booking reference.",
            [
                'Booking reference' => $booking['reference'],
                'Booking for' => $bookingRef,
                'Date' => $dateLabel,
                'Arrival window' => $slotLabel,
                'Postcode' => $postcode,
            ],
            "{$biz['name']} · {$biz['phone']} · {$biz['website']}\nYou're receiving this because this email address was entered on our booking form. If that wasn't you, please call us."
        );
        $m = hs_mailer();
        $m->addAddress($email);
        $m->addReplyTo($biz['to_email'], $biz['to_name']);
        $m->Subject = "Booking confirmed — {$date->format('D j M')}, {$slotLabel} — {$biz['name']}";
        $m->isHTML(true);
        $m->Body = $body['html'];
        $m->AltBody = $body['text'];
        hs_deliver($m);
        $emailed = true;
    } catch (Throwable $e) {
        hs_log('Booking: confirmation email failed for ' . $booking['reference'] . ': ' . $e->getMessage());
    }
}

hs_log('Booking ' . $booking['reference'] . ' stored (' . $category . ', calendar ' . $calendar . ', ' . count($photos) . ' photos) from ' . hs_ip_hash());
hs_json(200, true, "Your booking is confirmed for {$dateLabel}, {$slotLabel}." . ($emailed ? " We've emailed a confirmation to {$email}." : ''), [
    'booking' => [
        'reference' => $booking['reference'],
        'booking_ref' => $bookingRef,
        'date' => $ymd,
        'date_label' => $dateLabel,
        'slot' => $slotStart,
        'slot_label' => $slotLabel,
    ],
]);
