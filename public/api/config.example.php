<?php
/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HS Appliances — form handler configuration (TEMPLATE)
 * ─────────────────────────────────────────────────────────────────────────────
 *  1. Copy this file to config.php and fill in the values.
 *  2. Upload it OUTSIDE public_html (recommended):
 *        /home/uXXXXXXXX/domains/hsappliances.co.uk/private/config.php
 *     The handlers look there first. Fallback location: public_html/api/config.php
 *     (blocked from the web by .htaccess, but outside public_html is safer).
 *  3. Never commit config.php — it's in .gitignore.
 *
 *  See docs/deploy.md for the full walkthrough.
 */

return [
    // 'smtp' = send real email. 'log' = write .eml files to the storage folder (local testing only).
    'mail_transport' => 'smtp',

    'smtp' => [
        'host' => 'smtp.hostinger.com',
        'port' => 465,
        'secure' => 'ssl',
        // A mailbox you create in hPanel → Emails, e.g. website@hsappliances.co.uk
        'username' => 'website@hsappliances.co.uk',
        'password' => 'CHANGE-ME',
        // Must be the same mailbox as username (Hostinger rejects other From addresses)
        'from_email' => 'website@hsappliances.co.uk',
        'from_name' => 'HS Appliances Website',
    ],

    'business' => [
        'name' => 'House & Shop Appliances',
        // Where enquiries and bookings are delivered
        'to_email' => 'house.shopappliances@gmail.com',
        'to_name' => 'House & Shop Appliances',
        'phone' => '07777 372586',
        'website' => 'https://hsappliances.co.uk',
    ],

    // Send customers an automatic "we've received your request" email
    'send_customer_confirmation' => true,

    // Google reCAPTCHA v3 (optional). Leave 'secret' empty to disable.
    // The matching SITE key goes in the Next.js build: NEXT_PUBLIC_RECAPTCHA_SITE_KEY=...
    'recaptcha' => [
        'secret' => '',
        'min_score' => 0.5,
    ],

    // Only form posts from these origins are accepted.
    // Add 'http://localhost:8000' while testing locally with `php -S`.
    'allowed_origins' => [
        'https://hsappliances.co.uk',
    ],

    'rate_limit' => [
        'max' => 5,          // per IP, per form...
        'window' => 600,     // ...in 10 minutes
        'global_max' => 60,  // all visitors combined, per form, per hour
    ],

    // MySQL database (hPanel → Databases → Management). On Hostinger the host is "localhost".
    // Database name and user look like u123456789_hsdb / u123456789_hsuser.
    'db' => [
        'host' => 'localhost',
        'port' => 3306,
        'name' => 'u000000000_hsdb',
        'user' => 'u000000000_hsuser',
        'pass' => 'CHANGE-ME',
        'charset' => 'utf8mb4',
    ],

    // Admin panel (/hs-admin/)
    'admin' => [
        // Needed ONCE by hs-admin/install.php to create the first admin. Use a long random string,
        // then DELETE this line (and install.php) after installing.
        'install_token' => 'CHANGE-ME-to-a-long-random-string',
        'session_idle_minutes' => 120,   // auto logout after inactivity
        'max_login_attempts' => 5,       // failed logins (per IP and per email)…
        'lockout_minutes' => 15,         // …before a lockout of this long
    ],

    // Public URL patterns for "View" links and API responses
    'public_paths' => [
        'service' => '/services/{slug}/',
        'post' => '/insights/{slug}/',
    ],

    // Leave empty for auto: ../private/hs-data (outside public_html), else public_html/api/_data
    'storage_dir' => '',

    // Any long random string (used to hash IP addresses in logs and rate-limit files)
    'hash_salt' => 'CHANGE-ME-to-a-long-random-string',
];
