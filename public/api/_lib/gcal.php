<?php
/**
 * Google Calendar two-way sync, with no Composer dependencies (service account + JWT signed with OpenSSL).
 *
 *  - Website → calendar: every online booking is added as an event (gcal_insert_booking).
 *  - Calendar → website: EVERY event in the calendar (timed or all-day, "busy" or "free") blocks the
 *    booking slots it overlaps (gcal_busy). So anything the business adds to the calendar removes those
 *    slots from the booking form.
 *
 * Setup: docs/google-calendar.md. Config (config.php):
 *   'google_calendar' => ['calendar_id' => 'house.shopappliances@gmail.com', 'credentials_file' => '/home/…/private/google-service-account.json']
 * When it isn't configured, bookings still work and slots are managed from /hs-admin/ → Bookings.
 */
declare(strict_types=1);

if (!defined('HS_API')) {
    http_response_code(403);
    exit;
}

require_once __DIR__ . '/core.php';

const GCAL_SCOPE = 'https://www.googleapis.com/auth/calendar.events';
const GCAL_BUSY_CACHE_SECONDS = 60;

/** Resolved settings, or null when the calendar isn't configured. */
function gcal_settings(): ?array
{
    static $resolved = false;
    static $settings = null;
    if ($resolved) {
        return $settings;
    }
    $resolved = true;
    $c = hs_config()['google_calendar'] ?? [];
    $calendarId = trim((string) ($c['calendar_id'] ?? ''));
    $file = trim((string) ($c['credentials_file'] ?? ''));
    if ($calendarId === '' || $file === '') {
        return null;
    }
    if (!is_file($file) || !is_readable($file)) {
        hs_log('Google Calendar: credentials_file not found or not readable');
        return null;
    }
    $cred = json_decode((string) file_get_contents($file), true);
    if (!is_array($cred) || empty($cred['client_email']) || empty($cred['private_key'])) {
        hs_log('Google Calendar: credentials_file is not a service-account JSON key');
        return null;
    }
    $settings = [
        'calendar_id' => $calendarId,
        'client_email' => (string) $cred['client_email'],
        'private_key' => (string) $cred['private_key'],
        'token_uri' => (string) ($cred['token_uri'] ?? 'https://oauth2.googleapis.com/token'),
        'api_base' => rtrim((string) ($c['api_base'] ?? '') ?: 'https://www.googleapis.com/calendar/v3', '/'),
    ];
    return $settings;
}

function gcal_enabled(): bool
{
    return gcal_settings() !== null;
}

function gcal_b64url(string $s): string
{
    return rtrim(strtr(base64_encode($s), '+/', '-_'), '=');
}

/** @return array{0:int,1:string} [status, body] */
function gcal_http(string $method, string $url, array $headers = [], ?string $body = null): array
{
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_FOLLOWLOCATION => false,
        ]);
        if ($body !== null) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
        }
        $out = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        $err = curl_error($ch);
        curl_close($ch);
        if ($out === false) {
            throw new RuntimeException('Google Calendar request failed: ' . $err);
        }
        return [$status, (string) $out];
    }
    $ctx = stream_context_create(['http' => [
        'method' => $method,
        'header' => implode("\r\n", $headers),
        'content' => $body ?? '',
        'timeout' => 10,
        'ignore_errors' => true,
        'follow_location' => 0,
    ]]);
    $out = @file_get_contents($url, false, $ctx);
    if ($out === false) {
        throw new RuntimeException('Google Calendar request failed');
    }
    $status = 0;
    foreach ($http_response_header ?? [] as $h) {
        if (preg_match('#^HTTP/\S+\s+(\d{3})#', $h, $m)) {
            $status = (int) $m[1];
        }
    }
    return [$status, $out];
}

function gcal_token_file(): string
{
    return hs_storage('cache') . '/gcal-token.json';
}

/** OAuth access token for the service account (cached until shortly before it expires). */
function gcal_token(bool $refresh = false): string
{
    $g = gcal_settings() ?? throw new RuntimeException('Google Calendar is not configured');
    $file = gcal_token_file();
    if (!$refresh && is_file($file)) {
        $cached = json_decode((string) @file_get_contents($file), true);
        if (is_array($cached) && ($cached['sub'] ?? '') === $g['client_email'] && ($cached['exp'] ?? 0) > time() + 60) {
            return (string) $cached['token'];
        }
    }
    $now = time();
    $unsigned = gcal_b64url((string) json_encode(['alg' => 'RS256', 'typ' => 'JWT']))
        . '.' . gcal_b64url((string) json_encode([
            'iss' => $g['client_email'],
            'scope' => GCAL_SCOPE,
            'aud' => $g['token_uri'],
            'iat' => $now,
            'exp' => $now + 3600,
        ]));
    $key = openssl_pkey_get_private($g['private_key']);
    if ($key === false || !openssl_sign($unsigned, $sig, $key, OPENSSL_ALGO_SHA256)) {
        throw new RuntimeException('Google Calendar: could not sign the token request (check private_key)');
    }
    [$status, $body] = gcal_http('POST', $g['token_uri'], ['Content-Type: application/x-www-form-urlencoded'], http_build_query([
        'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        'assertion' => $unsigned . '.' . gcal_b64url($sig),
    ]));
    $data = json_decode($body, true);
    if ($status !== 200 || !is_array($data) || empty($data['access_token'])) {
        throw new RuntimeException('Google Calendar: token request failed (HTTP ' . $status . ') ' . substr(preg_replace('/\s+/', ' ', $body) ?? '', 0, 160));
    }
    $exp = $now + (int) ($data['expires_in'] ?? 3600);
    @file_put_contents($file, json_encode(['token' => $data['access_token'], 'exp' => $exp, 'sub' => $g['client_email']]), LOCK_EX);
    return (string) $data['access_token'];
}

/** Calls the Calendar API. Retries once with a fresh token on 401. */
function gcal_api(string $method, string $path, array $query = [], ?array $body = null): array
{
    $g = gcal_settings() ?? throw new RuntimeException('Google Calendar is not configured');
    $url = $g['api_base'] . $path . ($query ? '?' . http_build_query($query) : '');
    $payload = $body === null ? null : (string) json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    for ($attempt = 0; $attempt < 2; $attempt++) {
        $headers = ['Authorization: Bearer ' . gcal_token($attempt > 0), 'Accept: application/json'];
        if ($payload !== null) {
            $headers[] = 'Content-Type: application/json; charset=utf-8';
        }
        [$status, $resp] = gcal_http($method, $url, $headers, $payload);
        if ($status === 401 && $attempt === 0) {
            continue;
        }
        if ($status >= 200 && $status < 300) {
            $data = json_decode($resp, true);
            return is_array($data) ? $data : [];
        }
        $e = new RuntimeException('Google Calendar HTTP ' . $status . ': ' . substr(preg_replace('/\s+/', ' ', $resp) ?? '', 0, 160), $status);
        throw $e;
    }
    throw new RuntimeException('Google Calendar: unauthorised');
}

function gcal_events_path(): string
{
    return '/calendars/' . rawurlencode(gcal_settings()['calendar_id'] ?? '') . '/events';
}

/**
 * Busy periods between $from and $to as [startTimestamp, endTimestamp) pairs.
 * Every non-cancelled event counts — including all-day events and events marked "free" —
 * except invitations the calendar owner declined.
 *
 * @return array<int,array{0:int,1:int}>
 */
function gcal_busy(DateTimeImmutable $from, DateTimeImmutable $to, bool $fresh = false): array
{
    $cache = hs_storage('cache') . '/gcal-busy-' . substr(hash('sha256', $from->format('c') . '|' . $to->format('c')), 0, 16) . '.json';
    if (!$fresh && is_file($cache) && filemtime($cache) > time() - GCAL_BUSY_CACHE_SECONDS) {
        $cached = json_decode((string) @file_get_contents($cache), true);
        if (is_array($cached)) {
            return $cached;
        }
    }
    $tz = new DateTimeZone(HS_TIMEZONE);
    $busy = [];
    $pageToken = null;
    $pages = 0;
    do {
        $query = [
            'timeMin' => $from->format(DATE_RFC3339),
            'timeMax' => $to->format(DATE_RFC3339),
            'singleEvents' => 'true',
            'showDeleted' => 'false',
            'maxResults' => 2500,
            'fields' => 'items(id,status,start,end,attendees(self,responseStatus)),nextPageToken',
        ];
        if ($pageToken) {
            $query['pageToken'] = $pageToken;
        }
        $data = gcal_api('GET', gcal_events_path(), $query);
        foreach ($data['items'] ?? [] as $ev) {
            if (($ev['status'] ?? '') === 'cancelled') {
                continue;
            }
            foreach ($ev['attendees'] ?? [] as $a) {
                if (!empty($a['self']) && ($a['responseStatus'] ?? '') === 'declined') {
                    continue 2;
                }
            }
            $s = gcal_event_time($ev['start'] ?? [], $tz);
            $e = gcal_event_time($ev['end'] ?? [], $tz);
            if ($s !== null && $e !== null && $e > $s) {
                $busy[] = [$s, $e];
            }
        }
        $pageToken = $data['nextPageToken'] ?? null;
    } while ($pageToken && ++$pages < 10);
    @file_put_contents($cache, json_encode($busy), LOCK_EX);
    return $busy;
}

/** Event start/end → Unix timestamp. All-day events ("date") are midnight UK time (end date is exclusive). */
function gcal_event_time(array $t, DateTimeZone $tz): ?int
{
    try {
        if (!empty($t['dateTime'])) {
            return (new DateTimeImmutable((string) $t['dateTime']))->getTimestamp();
        }
        if (!empty($t['date'])) {
            return (new DateTimeImmutable((string) $t['date'] . ' 00:00:00', $tz))->getTimestamp();
        }
    } catch (Throwable) {
    }
    return null;
}

/** Clears cached busy periods (after a booking is added or cancelled). */
function gcal_clear_busy_cache(): void
{
    foreach (glob(hs_storage('cache') . '/gcal-busy-*.json') ?: [] as $f) {
        @unlink($f);
    }
}

/** Adds a booking to the calendar. Returns the event id. */
function gcal_insert_booking(array $b, string $end): string
{
    $address = implode(', ', array_filter([$b['address_line1'], $b['address_line2'], $b['town'], $b['city'], $b['postcode']]));
    $description = implode("\n", [
        'Booking reference: ' . $b['reference'],
        'Booked for: ' . $b['booking_ref'],
        'Customer: ' . $b['first_name'] . ' ' . $b['last_name'],
        'Phone: ' . $b['phone'],
        'Email: ' . $b['email'],
        'Address: ' . $address,
        '',
        'Problem:',
        $b['note'],
        '',
        'Booked online at ' . (hs_config()['business']['website'] ?? ''),
    ]);
    $event = gcal_api('POST', gcal_events_path(), [], [
        'summary' => $b['booking_ref'] . ' — ' . $b['first_name'] . ' ' . $b['last_name'] . ' (' . $b['postcode'] . ')',
        'location' => $address,
        'description' => $description,
        'start' => ['dateTime' => $b['slot_date'] . 'T' . $b['slot_start'] . ':00', 'timeZone' => HS_TIMEZONE],
        'end' => ['dateTime' => $b['slot_date'] . 'T' . $end . ':00', 'timeZone' => HS_TIMEZONE],
        'extendedProperties' => ['private' => ['hs_booking' => $b['reference']]],
    ]);
    gcal_clear_busy_cache();
    if (empty($event['id'])) {
        throw new RuntimeException('Google Calendar: no event id returned');
    }
    return (string) $event['id'];
}

/** Removes a booking's event (already-deleted events are fine). */
function gcal_delete_event(string $eventId): void
{
    try {
        gcal_api('DELETE', gcal_events_path() . '/' . rawurlencode($eventId));
    } catch (RuntimeException $e) {
        if (!in_array($e->getCode(), [404, 410], true)) {
            throw $e;
        }
    }
    gcal_clear_busy_cache();
}
