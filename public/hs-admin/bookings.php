<?php
/**
 * Bookings: online bookings (upcoming / past / cancelled), cancel a booking (frees the slot and removes
 * the Google Calendar event), block days or slots, and the Google Calendar connection status.
 */
declare(strict_types=1);
require __DIR__ . '/_inc/bootstrap.php';
require PUBLIC_ROOT . '/api/_lib/booking.php';
require_admin();

$tz = uk_tz();
$today = (new DateTimeImmutable('today', $tz))->format('Y-m-d');
$slots = booking_slots();
$view = in_array(get_str('view'), ['upcoming', 'past', 'cancelled'], true) ? get_str('view') : 'upcoming';

if (is_post()) {
    csrf_check();
    if (($id = post_int('cancel')) > 0) {
        flash(booking_cancel($id) ? 'success' : 'error', booking_cancel_message($id));
    } elseif (($id = post_int('retry')) > 0) {
        $b = db_one("SELECT * FROM bookings WHERE id = ? AND status = 'confirmed'", [$id]);
        if ($b) {
            $status = booking_sync_calendar($b);
            flash($status === 'synced' ? 'success' : 'error', $status === 'synced' ? 'Added to Google Calendar.' : 'Could not add it to Google Calendar — see the error on the booking.');
        }
    } elseif (isset($_POST['block'])) {
        $date = booking_parse_date(post_str('block_date', 10));
        $start = post_str('block_slot', 5);
        $reason = post_str('block_reason', 150);
        if (!$date || ($start !== '' && !isset($slots[$start]))) {
            flash('error', 'Choose a valid date and slot to block.');
        } else {
            db_exec('REPLACE INTO blocked_slots (slot_date, slot_start, reason, created_at) VALUES (?, ?, ?, ?)', [$date->format('Y-m-d'), $start, $reason, db_now()]);
            flash('success', 'Blocked ' . $date->format('D j M Y') . ($start === '' ? ' (whole day)' : ', ' . booking_slot_label($start)) . '. Existing bookings are not affected.');
        }
    } elseif (($id = post_int('unblock')) > 0) {
        db_exec('DELETE FROM blocked_slots WHERE id = ?', [$id]);
        flash('success', 'Unblocked — customers can book it again (unless your calendar has an event then).');
    }
    redirect('bookings.php' . ($view !== 'upcoming' ? '?view=' . $view : ''));
}

function booking_cancel_message(int $id): string
{
    $b = db_one('SELECT reference, status FROM bookings WHERE id = ?', [$id]);
    return $b && $b['status'] === 'cancelled'
        ? 'Booking ' . $b['reference'] . ' cancelled and the slot is free again. Let the customer know.'
        : 'That booking could not be cancelled.';
}

// Quietly retry calendar sync for upcoming bookings that didn't make it (e.g. Google was briefly down)
if (gcal_enabled()) {
    foreach (db_all("SELECT * FROM bookings WHERE status = 'confirmed' AND calendar_status IN ('pending','failed','off') AND slot_date >= ? ORDER BY slot_date LIMIT 5", [$today]) as $b) {
        booking_sync_calendar($b);
    }
}

$where = match ($view) {
    'past' => ["status = 'confirmed' AND slot_date < ?", 'slot_date DESC, slot_start DESC'],
    'cancelled' => ["status = 'cancelled' AND slot_date >= ?", 'slot_date ASC, slot_start ASC'],
    default => ["status = 'confirmed' AND slot_date >= ?", 'slot_date ASC, slot_start ASC'],
};
$rows = db_all("SELECT * FROM bookings WHERE {$where[0]} ORDER BY {$where[1]} LIMIT 200", [$today]);
$counts = [
    'upcoming' => (int) db_value("SELECT COUNT(*) FROM bookings WHERE status = 'confirmed' AND slot_date >= ?", [$today]),
    'past' => (int) db_value("SELECT COUNT(*) FROM bookings WHERE status = 'confirmed' AND slot_date < ?", [$today]),
    'cancelled' => (int) db_value("SELECT COUNT(*) FROM bookings WHERE status = 'cancelled' AND slot_date >= ?", [$today]),
];
$blocks = db_all('SELECT * FROM blocked_slots WHERE slot_date >= ? ORDER BY slot_date, slot_start', [$today]);
$open = get_int('id');

$fmtDate = static fn (string $ymd): string => (DateTimeImmutable::createFromFormat('!Y-m-d', $ymd, uk_tz()) ?: new DateTimeImmutable($ymd))->format('D j M Y');
$calBadge = static function (array $b): string {
    return match ($b['calendar_status']) {
        'synced' => '<span class="badge badge-ok">In calendar</span>',
        'failed' => '<span class="badge badge-warn" title="' . e((string) $b['calendar_error']) . '">Not in calendar</span>',
        'off' => '<span class="badge badge-muted">Calendar off</span>',
        default => '<span class="badge badge-muted">Pending</span>',
    };
};

admin_header('Bookings', 'bookings');
page_head('Bookings', '', 'Online bookings. Each one reserves its 2-hour slot.');
?>
<?php if (gcal_enabled()): ?>
  <div class="alert alert-success">Connected to Google Calendar (<?= e(gcal_settings()['calendar_id']) ?>). New bookings are added automatically, and anything you put in that calendar — including all-day events — blocks those slots on the website.</div>
<?php else: ?>
  <div class="alert alert-info">Google Calendar isn&rsquo;t connected yet, so bookings are only kept here. Use <strong>Block a day or slot</strong> below for holidays and jobs you take by phone. To connect it, follow <code>docs/google-calendar.md</code>.</div>
<?php endif; ?>

<nav class="toggles" aria-label="Filter bookings" style="margin-bottom:1rem">
  <?php foreach (['upcoming' => 'Upcoming', 'past' => 'Past', 'cancelled' => 'Cancelled'] as $k => $label): ?>
    <a class="pill <?= $view === $k ? 'pill-on' : '' ?>" href="<?= e(admin_url('bookings.php' . ($k !== 'upcoming' ? '?view=' . $k : ''))) ?>" <?= $view === $k ? 'aria-current="page"' : '' ?>><?= e($label) ?> (<?= $counts[$k] ?>)</a>
  <?php endforeach; ?>
</nav>

<?php if (!$rows): ?>
  <div class="card empty">No <?= e($view) ?> bookings.</div>
<?php else: ?>
<form method="post">
  <?= csrf_field() ?>
  <table class="table responsive">
    <thead><tr><th>When</th><th>Booking for</th><th>Customer</th><th>Address</th><th>Calendar</th><th class="col-actions"><span class="sr-only">Actions</span></th></tr></thead>
    <tbody>
    <?php foreach ($rows as $b): ?>
      <tr>
        <td data-label="When"><strong><?= e($fmtDate($b['slot_date'])) ?></strong><div class="muted small"><?= e(booking_slot_label($b['slot_start'])) ?></div></td>
        <td data-label="Booking for"><?= e($b['booking_ref']) ?><div class="muted small"><?= e($b['reference']) ?></div></td>
        <td data-label="Customer">
          <?= e($b['first_name'] . ' ' . $b['last_name']) ?>
          <div class="small"><a href="tel:<?= e(preg_replace('/[^0-9+]/', '', $b['phone'])) ?>"><?= e($b['phone']) ?></a> · <a href="mailto:<?= e($b['email']) ?>"><?= e($b['email']) ?></a></div>
        </td>
        <td data-label="Address"><?= e($b['postcode']) ?><div class="muted small"><?= e($b['town']) ?></div></td>
        <td data-label="Calendar"><?= $calBadge($b) ?></td>
        <td data-label="Actions" class="actions-cell"><div class="row-actions">
          <a class="btn btn-sm" href="<?= e(admin_url('bookings.php?' . http_build_query(array_filter(['view' => $view !== 'upcoming' ? $view : null, 'id' => $b['id']])) . '#b' . (int) $b['id'])) ?>">Details</a>
          <?php if ($b['status'] === 'confirmed' && $b['slot_date'] >= $today): ?>
            <?php if (gcal_enabled() && $b['calendar_status'] !== 'synced'): ?>
              <button class="btn btn-sm" name="retry" value="<?= (int) $b['id'] ?>" type="submit">Add to calendar</button>
            <?php endif; ?>
            <button class="btn btn-sm btn-danger" name="cancel" value="<?= (int) $b['id'] ?>" type="submit" data-confirm="Cancel booking <?= e($b['reference']) ?>? The slot becomes free again and the calendar event is removed. Remember to tell the customer.">Cancel</button>
          <?php endif; ?>
        </div></td>
      </tr>
      <?php if ($open === (int) $b['id']): ?>
      <tr id="b<?= (int) $b['id'] ?>">
        <td colspan="6" data-label="Details">
          <div class="stack small">
            <div><strong>Address:</strong> <?= e(implode(', ', array_filter([$b['address_line1'], $b['address_line2'], $b['town'], $b['city'], $b['postcode']]))) ?></div>
            <div><strong>Problem:</strong><br><?= nl2br(e($b['note'])) ?></div>
            <div class="muted">Booked <?= e(fmt_dt($b['created_at'])) ?><?= $b['calendar_error'] ? ' · Calendar error: ' . e($b['calendar_error']) : '' ?></div>
          </div>
        </td>
      </tr>
      <?php endif; ?>
    <?php endforeach; ?>
    </tbody>
  </table>
</form>
<?php endif; ?>

<section class="card stack" style="margin-top:1.5rem">
  <h2>Block a day or slot</h2>
  <p class="muted small">Stops customers booking it online (for holidays, training or jobs booked by phone). It doesn&rsquo;t cancel existing bookings.</p>
  <form method="post" class="stack">
    <?= csrf_field() ?>
    <div class="field-row">
      <div class="field"><label for="block_date">Date</label><input id="block_date" name="block_date" type="date" min="<?= e($today) ?>" required></div>
      <div class="field"><label for="block_slot">Slot</label>
        <select id="block_slot" name="block_slot">
          <option value="">Whole day</option>
          <?php foreach ($slots as $s => $e): ?><option value="<?= e($s) ?>"><?= e(booking_slot_label($s)) ?></option><?php endforeach; ?>
        </select>
      </div>
    </div>
    <div class="field"><label for="block_reason">Note (only you see this)</label><input id="block_reason" name="block_reason" maxlength="150" placeholder="e.g. Holiday"></div>
    <div class="form-actions"><button class="btn btn-primary" type="submit" name="block" value="1">Block</button></div>
  </form>
  <?php if ($blocks): ?>
    <form method="post">
      <?= csrf_field() ?>
      <table class="table responsive">
        <thead><tr><th>Date</th><th>Slot</th><th>Note</th><th class="col-actions"><span class="sr-only">Actions</span></th></tr></thead>
        <tbody>
        <?php foreach ($blocks as $bl): ?>
          <tr>
            <td data-label="Date"><?= e($fmtDate($bl['slot_date'])) ?></td>
            <td data-label="Slot"><?= $bl['slot_start'] === '' ? 'Whole day' : e(booking_slot_label($bl['slot_start'])) ?></td>
            <td data-label="Note"><?= e($bl['reason']) ?></td>
            <td data-label="Actions" class="actions-cell"><div class="row-actions"><button class="btn btn-sm" name="unblock" value="<?= (int) $bl['id'] ?>" type="submit">Unblock</button></div></td>
          </tr>
        <?php endforeach; ?>
        </tbody>
      </table>
    </form>
  <?php endif; ?>
</section>
<?php admin_footer(); ?>
