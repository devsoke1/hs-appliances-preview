<?php
/**
 * GET /api/availability.php?from=YYYY-MM-DD&days=14
 * Free/taken 2-hour slots for the booking form. Taken = booked online, blocked in the admin,
 * or covered by any event in the business's Google Calendar.
 *
 * { timezone, first_date, last_date, slots: [{start, end}], days: [{date, open, slots: {"09:00": true, …}}] }
 */
declare(strict_types=1);

define('HS_API', true);
require __DIR__ . '/_lib/api.php';
require __DIR__ . '/_lib/booking.php';

api_boot();

[$first, $last] = booking_window();
$from = (string) ($_GET['from'] ?? '');
$fromDate = booking_parse_date($from) ?? $first;
if ($fromDate < $first) {
    $fromDate = $first;
}
if ($fromDate > $last) {
    api_error(400, 'Date is too far ahead');
}
$days = api_int('days', 14, 1, 31);

$result = booking_availability($fromDate->format('Y-m-d'), $days);
$daysOut = [];
foreach ($result['days'] as $date => $d) {
    $daysOut[] = ['date' => $date, 'open' => $d['open'], 'closed' => $d['closed'], 'slots' => $d['slots']];
}
$slots = [];
foreach (booking_slots() as $s => $e) {
    $slots[] = ['start' => $s, 'end' => $e];
}

// Never cache: a slot can be taken at any moment.
api_respond([
    'timezone' => HS_TIMEZONE,
    'first_date' => $first->format('Y-m-d'),
    'last_date' => $last->format('Y-m-d'),
    'slots' => $slots,
    'days' => $daysOut,
], 0);
