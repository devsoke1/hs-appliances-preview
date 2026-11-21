-- Adds the online booking tables and settings to a database created before the booking system.
-- Safe to run more than once (tables are only created if missing; settings are only added if missing).
SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ── Bookings (online booking system) ────────────────────────────────────────
--  One booking per 2-hour slot. slot_key is "YYYY-MM-DD HH:MM" while the booking is
--  confirmed and NULL once cancelled, so the UNIQUE key stops two people booking the
--  same slot (even at the same instant) and a cancelled slot becomes free again.
CREATE TABLE IF NOT EXISTS bookings (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  reference         VARCHAR(20)  NOT NULL,              -- public code sent to the customer, e.g. HS-7K3M9Q
  booking_ref       VARCHAR(150) NOT NULL,              -- what they booked, e.g. "Domestic - Washing Machine"
  category          ENUM('domestic','commercial','ac') NOT NULL,
  first_name        VARCHAR(60)  NOT NULL,
  last_name         VARCHAR(60)  NOT NULL,
  email             VARCHAR(150) NOT NULL,
  phone             VARCHAR(20)  NOT NULL,
  address_line1     VARCHAR(150) NOT NULL,
  address_line2     VARCHAR(150) NOT NULL DEFAULT '',
  town              VARCHAR(80)  NOT NULL,
  city              VARCHAR(80)  NOT NULL DEFAULT '',
  postcode          VARCHAR(10)  NOT NULL,
  note              TEXT         NOT NULL,
  slot_date         DATE         NOT NULL,              -- UK date
  slot_start        CHAR(5)      NOT NULL,              -- UK time, "09:00"
  slot_key          VARCHAR(20)  NULL,
  status            ENUM('confirmed','cancelled') NOT NULL DEFAULT 'confirmed',
  calendar_event_id VARCHAR(255) NULL,                  -- Google Calendar event id
  calendar_status   ENUM('pending','synced','failed','off') NOT NULL DEFAULT 'pending',
  calendar_error    VARCHAR(255) NULL,
  created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_bookings_reference (reference),
  UNIQUE KEY uq_bookings_slot (slot_key),
  KEY idx_bookings_date (slot_date, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Blocked slots (set in the admin: holidays, training days…) ──────────────
--  slot_start '' = the whole day.
CREATE TABLE IF NOT EXISTS blocked_slots (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slot_date         DATE         NOT NULL,
  slot_start        CHAR(5)      NOT NULL DEFAULT '',
  reason            VARCHAR(150) NOT NULL DEFAULT '',
  created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_blocked_slot (slot_date, slot_start)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO settings (setting_key, setting_value) VALUES ('booking_days', '1,2,3,4,5,6,7');
INSERT IGNORE INTO settings (setting_key, setting_value) VALUES ('booking_days_ahead', '30');
INSERT IGNORE INTO settings (setting_key, setting_value) VALUES ('booking_lead_minutes', '120');
