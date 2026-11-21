<?php
/**
 * Online booking: references, postcode coverage, time slots and availability.
 * Shared by api/availability.php, api/booking.php and the admin Bookings page.
 *
 * Rules (coverage lists, AC options, slots) come from includes/generated/booking.json, which the build
 * writes from src/data/coverage.json and src/lib/booking.ts — the same source the booking form uses.
 */
declare(strict_types=1);

if (!defined('HS_API')) {
    http_response_code(403);
    exit;
}

require_once dirname(__DIR__) . '/db.php';
require_once __DIR__ . '/gcal.php';

function booking_rules(): array
{
    static $rules = null;
    if ($rules === null) {
        $file = dirname(__DIR__, 2) . '/includes/generated/booking.json';
        $rules = is_file($file) ? json_decode((string) file_get_contents($file), true) : null;
        if (!is_array($rules)) {
            throw new RuntimeException('includes/generated/booking.json is missing — run npm run build and upload out/');
        }
    }
    return $rules;
}

function booking_tz(): DateTimeZone
{
    return new DateTimeZone(HS_TIMEZONE);
}

/** @return array<string,string> start => end, e.g. "09:00" => "11:00" */
function booking_slots(): array
{
    $out = [];
    foreach (booking_rules()['slots'] as $s) {
        $out[(string) $s['start']] = (string) $s['end'];
    }
    return $out;
}

function booking_slot_label(string $start): string
{
    $end = booking_slots()[$start] ?? '';
    return $end !== '' ? "{$start}–{$end}" : $start;
}

/** Booking settings from the admin (with safe defaults). */
function booking_settings(): array
{
    $days = array_values(array_unique(array_filter(
        array_map('intval', explode(',', setting('booking_days', '1,2,3,4,5,6,7'))),
        static fn (int $d): bool => $d >= 1 && $d <= 7
    )));
    return [
        'days' => $days,
        'ahead' => max(1, min(365, (int) setting('booking_days_ahead', '30'))),
        'lead' => max(0, min(10080, (int) setting('booking_lead_minutes', '120'))),
    ];
}

function booking_is_ac_slug(string $slug): bool
{
    return str_starts_with($slug, 'air-conditioning');
}

/**
 * Every valid booking reference => its category ('domestic' | 'commercial' | 'ac').
 * Built from the active services in the database, so a service added in the admin can be booked straight away.
 *
 * @return array<string,string>
 */
function booking_refs(): array
{
    static $refs = null;
    if ($refs !== null) {
        return $refs;
    }
    $refs = [];
    $other = booking_rules()['otherRefs'];
    foreach (['domestic' => 'Domestic', 'commercial' => 'Commercial'] as $cat => $prefix) {
        $rows = db_all('SELECT slug, name, menu_label FROM services WHERE is_active = 1 AND category = ? ORDER BY sort_order, name', [$cat]);
        foreach ($rows as $s) {
            if (!booking_is_ac_slug((string) $s['slug'])) {
                $refs[$prefix . ' - ' . ((string) $s['menu_label'] !== '' ? $s['menu_label'] : $s['name'])] = $cat;
            }
        }
        $refs[(string) $other[$cat]] = $cat;
    }
    foreach (booking_rules()['acOptions'] as $o) {
        $refs[(string) $o['ref']] = 'ac';
    }
    return $refs;
}

/** "TW13 6AD" → "TW13" */
function booking_outward(string $postcode): string
{
    $pc = strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $postcode) ?? '');
    return strlen($pc) > 3 ? substr($pc, 0, -3) : $pc;
}

/** Postcode coverage for a booking category (commercial: no restriction). Exact outward-code match or whole area. */
function booking_covered(string $outward, string $category): bool
{
    $list = booking_rules()['coverage'][$category] ?? null;
    if (!is_array($list)) {
        return true;
    }
    preg_match('/^[A-Z]+/', $outward, $m);
    return in_array($outward, $list['districts'] ?? [], true) || in_array($m[0] ?? '', $list['areas'] ?? [], true);
}

/** @return array{0:DateTimeImmutable,1:DateTimeImmutable} first and last bookable dates (UK) */
function booking_window(): array
{
    $today = new DateTimeImmutable('today', booking_tz());
    return [$today, $today->modify('+' . booking_settings()['ahead'] . ' days')];
}

function booking_parse_date(string $ymd): ?DateTimeImmutable
{
    $d = DateTimeImmutable::createFromFormat('!Y-m-d', $ymd, booking_tz());
    return $d && $d->format('Y-m-d') === $ymd ? $d : null;
}

/**
 * Availability for $days days from $from (Y-m-d).
 * A slot is available when the day takes bookings, it starts after the minimum notice, and it isn't
 * booked, blocked in the admin, or overlapped by any event in the Google Calendar.
 *
 * @return array{days: array<string,array{open:bool,slots:array<string,bool>}>, calendar: string}
 */
function booking_availability(string $from, int $days, bool $fresh = false): array
{
    $tz = booking_tz();
    $cfg = booking_settings();
    [$first, $last] = booking_window();
    $start = booking_parse_date($from) ?? $first;
    if ($start < $first) {
        $start = $first;
    }
    $end = $start->modify('+' . max(1, $days) . ' days'); // exclusive
    $fromYmd = $start->format('Y-m-d');
    $toYmd = $end->modify('-1 day')->format('Y-m-d');

    $booked = [];
    foreach (db_all("SELECT slot_date, slot_start FROM bookings WHERE status = 'confirmed' AND slot_date BETWEEN ? AND ?", [$fromYmd, $toYmd]) as $r) {
        $booked[$r['slot_date'] . ' ' . $r['slot_start']] = true;
    }
    $blocked = [];
    foreach (db_all('SELECT slot_date, slot_start FROM blocked_slots WHERE slot_date BETWEEN ? AND ?', [$fromYmd, $toYmd]) as $r) {
        $blocked[$r['slot_date'] . ' ' . $r['slot_start']] = true;
    }

    $busy = [];
    $calendar = 'off';
    if (gcal_enabled()) {
        try {
            $busy = gcal_busy($start, $end, $fresh);
            $calendar = 'ok';
        } catch (Throwable $e) {
            // Bookings keep working (the database still prevents double-booking); the problem is logged.
            $calendar = 'error';
            hs_log('Google Calendar availability failed: ' . $e->getMessage());
        }
    }

    $earliest = time() + $cfg['lead'] * 60;
    $out = [];
    for ($d = $start; $d < $end; $d = $d->modify('+1 day')) {
        $ymd = $d->format('Y-m-d');
        $open = $d <= $last && in_array((int) $d->format('N'), $cfg['days'], true) && !isset($blocked["$ymd "]);
        $slots = [];
        foreach (booking_slots() as $s => $e) {
            $sTs = (new DateTimeImmutable("$ymd $s:00", $tz))->getTimestamp();
            $eTs = (new DateTimeImmutable("$ymd $e:00", $tz))->getTimestamp();
            $ok = $open && $sTs >= $earliest && !isset($booked["$ymd $s"]) && !isset($blocked["$ymd $s"]);
            if ($ok) {
                foreach ($busy as [$bs, $be]) {
                    if ($bs < $eTs && $be > $sTs) {
                        $ok = false;
                        break;
                    }
                }
            }
            $slots[$s] = $ok;
        }
        $out[$ymd] = ['open' => $open && in_array(true, $slots, true), 'closed' => !$open, 'slots' => $slots];
    }
    return ['days' => $out, 'calendar' => $calendar];
}

/** Random public reference, e.g. HS-7K3M9Q (no 0/O/1/I to avoid confusion on the phone). */
function booking_reference(): string
{
    $alphabet = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
    $s = 'HS-';
    for ($i = 0; $i < 6; $i++) {
        $s .= $alphabet[random_int(0, strlen($alphabet) - 1)];
    }
    return $s;
}

/** Pushes a booking to Google Calendar and records the result. Returns the new calendar_status. */
function booking_sync_calendar(array $b): string
{
    if (!gcal_enabled()) {
        db_exec("UPDATE bookings SET calendar_status = 'off', updated_at = ? WHERE id = ?", [db_now(), $b['id']]);
        return 'off';
    }
    try {
        $id = gcal_insert_booking($b, booking_slots()[$b['slot_start']] ?? $b['slot_start']);
        db_exec("UPDATE bookings SET calendar_status = 'synced', calendar_event_id = ?, calendar_error = NULL, updated_at = ? WHERE id = ?", [$id, db_now(), $b['id']]);
        return 'synced';
    } catch (Throwable $e) {
        hs_log('Google Calendar insert failed for ' . $b['reference'] . ': ' . $e->getMessage());
        db_exec("UPDATE bookings SET calendar_status = 'failed', calendar_error = ?, updated_at = ? WHERE id = ?", [mb_substr($e->getMessage(), 0, 250), db_now(), $b['id']]);
        return 'failed';
    }
}

/** Cancels a booking: frees the slot and removes the calendar event. */
function booking_cancel(int $id): bool
{
    $b = db_one('SELECT * FROM bookings WHERE id = ?', [$id]);
    if (!$b || $b['status'] === 'cancelled') {
        return false;
    }
    db_exec("UPDATE bookings SET status = 'cancelled', slot_key = NULL, updated_at = ? WHERE id = ?", [db_now(), $id]);
    if (!empty($b['calendar_event_id']) && gcal_enabled()) {
        try {
            gcal_delete_event((string) $b['calendar_event_id']);
            db_exec('UPDATE bookings SET calendar_event_id = NULL WHERE id = ?', [$id]);
        } catch (Throwable $e) {
            hs_log('Google Calendar delete failed for ' . $b['reference'] . ': ' . $e->getMessage());
        }
    }
    return true;
}
