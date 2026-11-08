# HS Appliances — hsappliances.co.uk

Next.js (App Router, TypeScript, Tailwind v4) as a **static export**, with **PHP form handlers**. It runs on Hostinger Single Web Hosting, which has no Node.js on the server.

```bash
npm install
npm run dev     # http://localhost:3000 (forms need PHP, see docs/deploy.md §5.3)
npm run build   # static site → out/ (postbuild fixes Next 16 prefetch file names)
npm run audit   # SEO/link/schema/redirect audit of out/ → docs/seo-audit.md
npm run images  # assets/images/* → optimised WebP in public/images/ + src/data/images.json
npm run brand-assets  # regenerate OG image + icons
npm run db:seed-sql   # regenerate database/seed.sql from src/data + content/blog
```

**Deploy:** see [docs/deploy.md](docs/deploy.md). The short version: upload the *contents* of `out/` (including hidden `.htaccess` files) to `public_html`, and put `config.php` in `../private/`.

## Where things live

| What | Where |
|---|---|
| Business details, services, areas, brands, FAQs | `src/data/` |
| Postcode coverage list | `src/data/areas.ts` → `coveredPostcodes` |
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
| Blog posts (markdown + frontmatter) | `content/blog/*.md` — see `src/lib/blog.ts` for fields |
| Search Console / launch SEO | `docs/search-console.md` |
| Admin panel (PHP) | `public/hs-admin/` — setup: `docs/admin-setup.md` |
| Database schema + seed | `database/schema.sql`, `database/seed.sql`, one-time `database/install.php` |
| Read-only JSON API | `public/api/services.php`, `posts.php`, `reviews.php` (DB access: `public/api/db.php`) |
| Vendored PHP libs | PHPMailer 7.1.1, HTMLPurifier 4.19.1 in `public/api/_lib/`; Quill 2.0.3 in `public/hs-admin/assets/vendor/` |
| Admin uploads (live, not in git) | `public_html/uploads/` — never delete on redeploy |

## Environment

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | `.env.local` (build time) | Optional reCAPTCHA v3 site key. Leave it empty to disable. |
| `NEXT_PUBLIC_GA4_ID` | `.env.local` | Optional GA4 ID — loaded only after cookie consent; enables the banner |
| `NEXT_PUBLIC_GSC_VERIFICATION` | `.env.local` | Optional Search Console HTML-tag code |
| SMTP password, reCAPTCHA secret | `config.php` on the server | Never in the repo or `.env` files. |

Before launch, search for `[ADD` and `[CONFIRM` and replace every placeholder with real data.
