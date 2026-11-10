-- ─────────────────────────────────────────────────────────────────────────────
--  HS Appliances — database schema (MySQL 8 / MariaDB 10.6+)
--  Import FIRST in phpMyAdmin (then seed.sql). Safe to re-run: tables are only
--  created if they don't exist.
--
--  Conventions
--   • utf8mb4 everywhere (emoji, £, °C, curly quotes)
--   • All DATETIMEs are UTC — the app converts to UK time for display
--   • JSON columns hold arrays of objects (faults, FAQs)
-- ─────────────────────────────────────────────────────────────────────────────

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- ── Services ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug              VARCHAR(120) NOT NULL,
  name              VARCHAR(150) NOT NULL,              -- page title, e.g. "Washing Machine Repair"
  menu_label        VARCHAR(80)  NOT NULL DEFAULT '',   -- short name for menus/cards, e.g. "Washing Machine"
  category          ENUM('domestic','commercial') NOT NULL DEFAULT 'domestic',
  short_description VARCHAR(300) NOT NULL DEFAULT '',
  content           MEDIUMTEXT   NULL,                  -- sanitised HTML
  common_faults     JSON         NULL,                  -- [{"name": "...", "detail": "..."}]
  faqs              JSON         NULL,                  -- [{"question": "...", "answer": "..."}]
  compliance_note   TEXT         NULL,                  -- Gas Safe / F-Gas notice shown on the page
  image             VARCHAR(255) NULL,                  -- /uploads/YYYY/MM/xxxx.webp
  image_alt         VARCHAR(255) NULL,
  icon              VARCHAR(60)  NULL,                  -- icon key (lucide name)
  meta_title        VARCHAR(70)  NULL,
  meta_description  VARCHAR(170) NULL,
  sort_order        INT          NOT NULL DEFAULT 0,
  is_featured       TINYINT(1)   NOT NULL DEFAULT 0,
  is_active         TINYINT(1)   NOT NULL DEFAULT 1,
  created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_services_slug (slug),
  KEY idx_services_list (is_active, category, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Insights (blog posts) ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug              VARCHAR(160) NOT NULL,
  title             VARCHAR(200) NOT NULL,
  excerpt           VARCHAR(400) NOT NULL DEFAULT '',
  content           MEDIUMTEXT   NULL,                  -- sanitised HTML (HTMLPurifier)
  featured_image    VARCHAR(255) NULL,
  image_alt         VARCHAR(255) NULL,
  category          VARCHAR(80)  NOT NULL DEFAULT '',
  tags              VARCHAR(300) NOT NULL DEFAULT '',   -- normalised "tag one, tag two"
  author            VARCHAR(100) NOT NULL DEFAULT 'House & Shop Appliances',
  meta_title        VARCHAR(70)  NULL,
  meta_description  VARCHAR(170) NULL,
  status            ENUM('draft','published') NOT NULL DEFAULT 'draft',
  published_at      DATETIME     NULL,                  -- future + published = scheduled
  created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_posts_slug (slug),
  KEY idx_posts_published (status, published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Reviews (real reviews only — never invent them) ─────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  customer_name     VARCHAR(100) NOT NULL,
  location          VARCHAR(100) NOT NULL DEFAULT '',
  rating            TINYINT UNSIGNED NOT NULL,
  review_text       TEXT         NOT NULL,
  service_id        INT UNSIGNED NULL,
  source            ENUM('Google','Facebook','Direct') NOT NULL DEFAULT 'Google',
  review_date       DATE         NULL,
  is_active         TINYINT(1)   NOT NULL DEFAULT 1,
  sort_order        INT          NOT NULL DEFAULT 0,
  created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_reviews_list (is_active, sort_order),
  CONSTRAINT fk_reviews_service FOREIGN KEY (service_id) REFERENCES services (id) ON DELETE SET NULL,
  CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Settings (key/value) ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  setting_key       VARCHAR(64)  NOT NULL PRIMARY KEY,
  setting_value     TEXT         NULL,
  updated_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Admin users ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email             VARCHAR(190) NOT NULL,
  password_hash     VARCHAR(255) NOT NULL,              -- password_hash() — never plain text
  last_login        DATETIME     NULL,
  created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_admin_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Slug redirects (filled automatically when a slug changes) ───────────────
CREATE TABLE IF NOT EXISTS slug_redirects (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  type              ENUM('service','post') NOT NULL,
  old_slug          VARCHAR(160) NOT NULL,
  new_slug          VARCHAR(160) NOT NULL,
  created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_redirect_old (type, old_slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
