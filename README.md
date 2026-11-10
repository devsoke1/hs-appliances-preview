# HS Appliances — hsappliances.co.uk

Next.js (App Router, TypeScript, Tailwind v4) as a **static export**, plus **PHP** for everything that changes from the admin panel. It runs on Hostinger Single Web Hosting, which has no Node.js on the server.

- **Static (Next.js):** home, about, areas, contact, book, FAQ and legal pages. Each one is built with fallback data, then refreshes the services menu, reviews and latest insights from the JSON API in the browser.
- **PHP (rendered from MySQL):** `/services/`, `/services/{slug}/`, `/insights/`, `/insights/{slug}/` and `/sitemap.xml`. Admin edits show up instantly. These pages share the same Tailwind build and look identical.

```bash
npm install
npm run dev     # http://localhost:3000 (forms need PHP, see docs/deploy.md §5.3)
npm run build   # static site → out/ (prebuild: export:php + build:css; postbuild fixes Next 16 prefetch file names)
npm run dev:db      # local SQLite DB (private/dev.sqlite) from database/schema.sql + seed.sql
npm run serve:php   # whole site incl. PHP pages on http://localhost:8080 (emulates .htaccess)
npm run audit   # crawls the running site (BASE, default :8080) → docs/seo-audit.md
npm run export:php  # src/data → public/includes/generated/*.json (+ fonts) for the PHP templates
npm run build:css   # Tailwind → public/assets/css/site.css (inlined by the PHP <head>)
npm run images  # assets/images/* → optimised WebP in public/images/ + src/data/images.json
npm run brand-assets  # regenerate OG image + icons
npm run db:seed-sql   # regenerate database/seed.sql from src/data + content/blog
```

**Deploy:** see [docs/deploy.md](docs/deploy.md). The short version: upload the *contents* of `out/` (including hidden `.htaccess` files) to `public_html`, and put `config.php` in `../private/`.

## Where things live

| What | Where |
|---|---|
| Business details, services, areas, brands, FAQs | `src/data/` |
| Booking postcode coverage (Domestic list, AC areas) | `src/data/coverage.json` — shared by the booking form and the PHP booking API |
| Booking references, AC options, 2-hour slots | `src/lib/booking.ts` (mirrored in `public/api/_lib/booking.php`) |
| Booking form / Domestic, Commercial, AC pages | `src/components/forms/BookingForm.tsx`, `src/components/booking/`, `src/app/{domestic,commercial,air-conditioning,book}/` |
| Booking API + availability + Google Calendar | `public/api/booking.php`, `public/api/availability.php`, `public/api/_lib/{booking,gcal}.php` — setup: `docs/google-calendar.md` |
| Design tokens | `src/app/globals.css` (`@theme`) |
| UI / layout components | `src/components/ui/`, `src/components/layout/` |
| Forms (client) | `src/components/forms/` |
| Form handlers (PHP) | `public/api/contact.php`, `public/api/booking.php` |
| PHP shared code + PHPMailer 7.1.1 | `public/api/_lib/` (blocked from the web) |
| Server config template | `public/api/config.example.php` → real `config.php` lives outside public_html |
| Site `.htaccess` (HTTPS, caching, security headers) | `public/.htaccess` |
| Old-domain 301 redirects | `old-domain-htaccess/.htaccess` |
| Old → new URL map | `docs/url-map.md` |
| Titles & meta descriptions | `src/data/seo.ts` |
| JSON-LD builders (typed with schema-dts) | `src/lib/schema.ts` |
| PHP page templates | `public/services/`, `public/insights/`, shared includes in `public/includes/` (blocked from the web) |
| Demo photos (originals + credits) | `assets/images/`, `scripts/image-sources.json`, `docs/image-credits.md` |
| Original blog posts (seed source) | `content/blog/*.md` → imported into the DB by `npm run db:seed-sql` |
| Search Console / launch SEO | `docs/search-console.md` |
| Admin panel (PHP) | `public/hs-admin/` — setup: `docs/admin-setup.md` |
| Database schema + seed | `database/schema.sql`, `database/seed.sql`, one-time `database/install.php`; upgrades: `database/update-bookings.sql`, `database/update-images.sql` |
| Read-only JSON API | `public/api/services.php`, `posts.php`, `reviews.php` (DB access: `public/api/db.php`) |
| Vendored PHP libs | PHPMailer 7.1.1, HTMLPurifier 4.19.1 in `public/api/_lib/`; Quill 2.0.3 in `public/hs-admin/assets/vendor/` |
| Admin uploads (live, not in git) | `public_html/uploads/` — never delete on redeploy |

## Environment

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | `.env.local` (build time) | Optional reCAPTCHA v3 site key. Leave it empty to disable. |
| `NEXT_PUBLIC_GA4_ID` | `.env.local` | Optional GA4 ID — loaded only after cookie consent; enables the banner |
| `NEXT_PUBLIC_GSC_VERIFICATION` | `.env.local` | Optional Search Console HTML-tag code |
| `HS_BUILD_API_BASE` | build shell | Where the build reads live services/reviews/posts (default `https://hsappliances.co.uk`). Set it to empty to build offline from `src/data`. |
| SMTP password, reCAPTCHA secret | `config.php` on the server | Never in the repo or `.env` files. |

Before launch, search for `[ADD` and `[CONFIRM` and replace every placeholder with real data.
