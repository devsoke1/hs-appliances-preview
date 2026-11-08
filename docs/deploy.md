# Deploying hsappliances.co.uk to Hostinger

The site is a **static export** (HTML/CSS/JS in `out/`) plus two **PHP form handlers** (`/api/contact.php`, `/api/booking.php`). It runs on Hostinger Single Web Hosting without Node.js.

**Steps:** [1. One-time setup](#1-one-time-setup) · [2. Build](#2-build) · [3. Upload](#3-upload) · [4. config.php](#4-configphp) · [5. Test](#5-test) · [6. Old domain redirects](#6-old-domain-redirects) · [7. Troubleshooting](#7-troubleshooting) · [8. Redeploying](#8-redeploying)

---

## 1. One-time setup

### 1.1 Domain, SSL and PHP
1. In **hPanel → Websites**, add `hsappliances.co.uk`, or check it's already added.
2. In **hPanel → Security → SSL**, check the free SSL certificate shows **Active**. Don't upload the site until it does, because `.htaccess` forces HTTPS.
3. In **hPanel → Advanced → PHP Configuration**, choose **PHP 8.2 or newer**. Under *PHP extensions*, check that `fileinfo`, `mbstring`, `openssl` and `curl` are ticked. They are by default.

### 1.2 Create the website mailbox
The forms send email through Hostinger's SMTP server, so they need a mailbox on the domain.

1. Go to **hPanel → Emails → Email Accounts → Create email account**.
2. Create **`website@hsappliances.co.uk`** with a strong password. You'll put this password in `config.php`.
3. In **Emails → Email Accounts → DNS settings**, check that **SPF, DKIM and DMARC** all show as configured. Without them, emails land in spam. If the domain's DNS isn't managed by Hostinger, add the records it shows at your DNS provider.

You don't need to read this inbox. Enquiries are delivered to `house.shopappliances@gmail.com`, with Reply-To set to the customer, so you can just hit Reply.

SMTP settings (already filled in as defaults):

| Setting | Value |
|---|---|
| Host | `smtp.hostinger.com` |
| Port | `465` |
| Encryption | SSL |
| Username | `website@hsappliances.co.uk` |

### 1.3 reCAPTCHA v3 (optional)
The forms already have a honeypot field, an origin check and rate limiting. Add reCAPTCHA only if spam gets through anyway.

1. Go to <https://www.google.com/recaptcha/admin>, create a **reCAPTCHA v3** key and add the domain `hsappliances.co.uk`. Add `localhost` too if you want to test locally.
2. Put the **site key** (it's public) in a file called `.env.local` in the project root:
   ```
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lc...your-site-key
   ```
3. Put the **secret key** in `config.php` under `recaptcha.secret`. Never put it in `.env.local`.
4. Rebuild and re-upload (step 2 onwards). The privacy policy adds its reCAPTCHA paragraph automatically when the site key is set.

---

## 2. Build

On your computer, in the project folder:

```bash
npm ci          # first time, or after dependencies change
npm run build   # creates the out/ folder
```

`out/` now contains the whole site, including the hidden files the server needs:

```
out/
├── .htaccess                  ← HTTPS, redirects, caching, security headers
├── index.html, 404.html, about/, services/, areas/, …
├── sitemap.xml, robots.txt
├── _next/                     ← JS/CSS/fonts
└── api/
    ├── .htaccess              ← only contact.php and booking.php are reachable
    ├── .user.ini              ← PHP upload limits
    ├── contact.php
    ├── booking.php
    ├── config.example.php     ← template only (blocked from the web)
    └── _lib/                  ← PHPMailer + shared code (blocked from the web)
```

PHPMailer is already included in `api/_lib/PHPMailer/` (v7.1.1). There's nothing to install on the server.

---

## 3. Upload

Upload the **contents** of `out/` into `public_html`, so that `public_html/index.html` exists. Don't upload the `out` folder itself, or the site would end up at `public_html/out/`.

### Option A: File Manager (recommended)

1. Zip the contents of `out/`, **including hidden files**. In **PowerShell** in the project folder, run:
   ```powershell
   tar.exe -a -c -f site.zip -C out .
   ```
   Windows' built-in *Send to → Compressed folder* can skip dotfiles, so use the command above.
2. Open **hPanel → Files → File Manager** and go to `public_html`.
3. **First deploy only:** if `public_html` has old files in it (e.g. a default page or WordPress), download a backup, then delete them.
4. Upload `site.zip`, right-click it → **Extract** into `public_html`, then delete `site.zip`.
5. Turn on **Settings → Show hidden files** and check that `.htaccess` is in `public_html` and in `public_html/api/`.

### Option B: FTP (FileZilla)

1. In **hPanel → Files → FTP Accounts**, note the host, username and port (21), and set a password.
2. In FileZilla, go to **Server → Force showing hidden files**. If you skip this, `.htaccess` files won't upload.
3. Connect, open `public_html` on the right and the `out` folder on the left.
4. Select **everything inside** `out/` and drag it into `public_html`. When asked, choose *Overwrite if source newer*.

---

## 4. config.php

The form handlers need SMTP credentials. These live in a `config.php` file that is **never committed to git** and should sit **outside `public_html`**, so it can't be downloaded even if the server is misconfigured.

1. On your computer, copy `public/api/config.example.php` to `config.php` and fill in:
   - `smtp.password`: the mailbox password from step 1.2
   - `hash_salt`: any long random string (mash the keyboard; 40+ characters)
   - `recaptcha.secret`: only if you set up step 1.3
   - check that `business.to_email` is where you want enquiries delivered
2. In **File Manager**, go up one level from `public_html`. The folder is `/home/uXXXXXXXXX/domains/hsappliances.co.uk/`, and you'll see `public_html` inside it.
3. Create a folder called **`private`** next to `public_html`, and upload `config.php` into it:
   ```
   domains/hsappliances.co.uk/
   ├── private/
   │   └── config.php      ← here
   └── public_html/
   ```
4. Right-click `config.php` → **Permissions** → set to **600**.

The handlers look for config in this order:
1. `HS_CONFIG` environment variable
2. `../private/config.php`
3. `public_html/api/config.php` (works, and `.htaccess` blocks it, but it's second-best)

Runtime files (the log, rate-limit counters) are written to `private/hs-data/`, and created automatically.

Because the config lives outside `public_html`, **redeploying never overwrites it**.

---

## 5. Test

### 5.1 Pages, redirects and blocked files
Run these from any terminal. `curl -I` shows just the response headers.

```bash
curl -I http://hsappliances.co.uk/                 # → 301 to https://hsappliances.co.uk/
curl -I https://www.hsappliances.co.uk/about       # → 301 to https://hsappliances.co.uk/about (then /about/)
curl -I https://hsappliances.co.uk/about           # → 301 to /about/
curl -I https://hsappliances.co.uk/faqs/           # → 301 to /faq/
curl -I https://hsappliances.co.uk/no-such-page/   # → 404 (custom page)
curl -I https://hsappliances.co.uk/api/config.example.php    # → 403
curl -I https://hsappliances.co.uk/api/_lib/bootstrap.php    # → 403
curl -I https://hsappliances.co.uk/api/.user.ini             # → 403
curl -i https://hsappliances.co.uk/api/contact.php           # → 405 {"success":false,"message":"Method not allowed."}
```

Also check:
- **Headers:** run the site through <https://securityheaders.com>, and check `/services/` on <https://pagespeed.web.dev>.
- **Contact page:** open `/contact/`, open the browser console (F12) and check there are **no CSP errors**. The Google Map should display.

### 5.2 Forms
1. On `/contact/`, send a message using **your own email address**. You should see the green "Message sent" panel, and then:
   - the enquiry arrives at `house.shopappliances@gmail.com` (check Spam the first time and mark it *Not spam*);
   - a confirmation email arrives at the address you entered;
   - hitting **Reply** on the enquiry addresses the customer.
2. On `/book/`, make a booking **with a photo attached**. The photo should arrive as an attachment (`photo-1.jpg`).
3. Submit the contact form **6 times in a row**. The 6th should say you've sent several requests (rate limit). This resets after 10 minutes.
4. Check the log at `private/hs-data/logs/api.log`. It records sends and errors (no customer details).

### 5.3 Testing locally before uploading
PHP 8.1+ must be installed on your computer.

```bash
npm run build
mkdir private
# create private/config.php containing:
#   <?php return ['mail_transport' => 'log', 'allowed_origins' => ['http://localhost:8000'], 'hash_salt' => 'local'];
php -S localhost:8000 -t out
```

Open <http://localhost:8000> and submit the forms. Instead of sending, the emails are written as `.eml` files to `private/hs-data/mail/`, and you can open them in any email program. (`private/` is git-ignored.)

PHP's built-in server ignores `.htaccess`, so redirects and blocked files can only be tested on Hostinger. Also, `npm run dev` doesn't run PHP: in dev mode the forms show an error state, which is expected.

---

## 6. Old domain redirects

This sends `houseandshopappliances.co.uk` visitors and Google to the new site with permanent (301) redirects, page by page. The rules come from `docs/url-map.md`.

1. **Only after the new site is live and tested**, open the **old domain's** File Manager → `public_html`.
2. **Back up** the WordPress site first, using hPanel's backup feature or by downloading `public_html` plus a database export.
3. Replace `public_html/.htaccess` with `old-domain-htaccess/.htaccess` from this project. You can leave the WordPress files where they are or delete them; the redirects catch every request either way.
4. **Keep SSL active** on the old domain, so `https://houseandshopappliances.co.uk/...` links still redirect instead of showing a certificate warning.
5. Test a few URLs:
   ```bash
   for p in / about-us/ contact-us/ faqs/ book-appointment/ washing-machine/ celler-cooler/ refrigeration-cold-room/ "?p=123" wp-admin/; do
     printf '%-28s ' "$p"; curl -s -o /dev/null -w '%{http_code} → %{redirect_url}\n' "https://houseandshopappliances.co.uk/$p"
   done
   ```
   Every line should show `301` and the matching new URL from `docs/url-map.md`. Unmapped URLs go to the new homepage.
6. In **Google Search Console**, verify both domains, then on the old property use **Settings → Change of address**.
7. Keep the old domain registered and the redirects live for **at least 12 months**.

---

## 7. Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| **500 error on every page** right after upload | A `.htaccess` directive isn't supported. Rename `public_html/.htaccess` to `.htaccess.off` to confirm, then re-enable its sections one at a time. |
| **Redirect loop** | SSL isn't active yet, or Cloudflare (if used) is in "Flexible" mode. Set Cloudflare SSL to **Full**. |
| Form says **"Forbidden"** | The page's origin isn't in `allowed_origins`. Use `https://hsappliances.co.uk` exactly: no `www` and no trailing slash. |
| Form says **"couldn't send…"** | SMTP problem. Check `api.log` for the error. The usual causes are a wrong mailbox password, or `from_email` not matching the SMTP username. |
| Form says **"too large"** | The photos exceed PHP's limits. `api/.user.ini` sets 6MB per file and 20MB total; changes can take up to 5 minutes to apply. |
| Emails go to **spam** | SPF, DKIM or DMARC isn't set up (step 1.2). Mark the first email *Not spam* in Gmail. |
| Map or reCAPTCHA **doesn't load** | It's blocked by the Content-Security-Policy. Check the browser console. If you add a new third-party service, add its domain to the CSP line in `public/.htaccess`. |
| Changes don't appear after redeploy | Your browser cached the old page. Hard-refresh (Ctrl+F5). HTML is served with `no-cache`, so visitors get new pages straight away. |

---

## 8. Redeploying

1. Make the changes, then run `npm run build`.
2. Zip `out/` (step 3A) and upload, extracting it over `public_html` so existing files are replaced.
3. **Delete any pages you removed** from `public_html` by hand. Extracting a zip doesn't delete old files.
4. `config.php` lives in `private/`, so it isn't affected.
