# URL map: old site → new site

- **Old:** `https://houseandshopappliances.co.uk` (WordPress / Elementor)
- **New:** `https://hsappliances.co.uk` (Next.js static export)

Every old URL should **301 redirect** to its new URL so search rankings and backlinks carry over.
All new URLs use a trailing slash (`trailingSlash: true`).

| # | Old URL | New URL | Notes |
|---|---------|---------|-------|
| 1 | `/` | `/` | |
| 2 | `/about-us/` | `/about/` | |
| 3 | `/contact-us/` | `/contact/` | |
| 4 | `/services/` | `/services/` | Hub: all services, Domestic / Commercial |
| 5 | `/faqs/` | `/faq/` | Renamed (new site also 301s `/faqs/` → `/faq/`) |
| 6 | `/book-appointment/` | `/book/` | Booking form (PHP handler in `/api/`) |
| 7 | `/washing-machine/` | `/services/washing-machine-repair/` | |
| 8 | `/fridge-freezer/` | `/services/fridge-freezer-repair/` | |
| 9 | `/american-fridge/` | `/services/american-fridge-repair/` | |
| 10 | `/dishwasher/` | `/services/dishwasher-repair/` | |
| 11 | `/electric-hob/` | `/services/electric-hob-repair/` | |
| 12 | `/electric-cooker/` | `/services/electric-cooker-repair/` | |
| 13 | `/gas-hob/` | `/services/gas-hob-repair/` | Gas Safe number required before launch |
| 14 | `/gas-cooker/` | `/services/gas-cooker-repair/` | Gas Safe number required before launch |
| 15 | `/microwave/` | `/services/microwave-repair/` | |
| 16 | `/air-conditioning/` | `/air-conditioning/` | Same path: the new Air Conditioning page (quotation, installation, servicing, repair). Repair details stay at `/services/air-conditioning-repair/`. |
| 17 | `/refrigeration-cold-room/` | `/services/cold-room-repair/` | Shorter, clearer slug |
| 18 | `/dairy-cabinet/` | `/services/dairy-cabinet-repair/` | |
| 19 | `/display-fridge/` | `/services/display-fridge-repair/` | |
| 20 | `/bar-cooler/` | `/services/bar-cooler-repair/` | |
| 21 | `/celler-cooler/` | `/services/cellar-cooler-repair/` | Typo fixed: "celler" → "cellar" |
| 22 | `/ice-machine/` | `/services/ice-machine-repair/` | |

The service mappings also live in code as `legacyPath` on each item in `src/data/services.ts`.

## New URLs with no old equivalent

| New URL | Purpose |
|---------|---------|
| `/areas/` | Areas index + postcode list |
| `/areas/{feltham,hounslow,twickenham,ashford,staines,isleworth,hayes,southall,richmond,kingston,ealing,heathrow}/` | 12 local area pages (`src/data/areas.ts`) |
| `/privacy-policy/`, `/terms/` | Legal pages (cookie info is inside the privacy policy) |
| `/sitemap.xml`, `/robots.txt` | Generated at build |

## WordPress leftovers to catch

WordPress also exposes URLs that may be indexed or linked. Send these to sensible destinations:

| Old pattern | New URL |
|-------------|---------|
| `/feed/`, `/comments/feed/` | `/` |
| `/wp-admin/`, `/wp-login.php`, `/wp-content/*` | `/` (or let them 404 once the old site is gone) |
| `/?p=*`, `/?page_id=*` | `/` |
| `/category/*`, `/tag/*`, `/author/*` | `/` |

Check Google Search Console (old property → **Pages**) and any backlink tool for other URLs before switching over.

## Redirect rules for the OLD domain

Because the domain is changing, the redirects must be served **by the old domain**. Keep
`houseandshopappliances.co.uk` registered and pointed at hosting, and replace its `.htaccess`.

> **The ready-to-upload file is [`old-domain-htaccess/.htaccess`](../old-domain-htaccess/.htaccess).** It contains the rules below,
> plus a `.well-known` passthrough so SSL keeps renewing, case-insensitive matching, a `/cellar-cooler/` alias, and query-string
> stripping on the catch-all. Upload steps are in [deploy.md §6](deploy.md#6-old-domain-redirects). The rules below are for reference:

```apache
RewriteEngine On

# Specific pages (most specific first)
RewriteRule ^about-us/?$                 https://hsappliances.co.uk/about/ [R=301,L]
RewriteRule ^contact-us/?$               https://hsappliances.co.uk/contact/ [R=301,L]
RewriteRule ^services/?$                 https://hsappliances.co.uk/services/ [R=301,L]
RewriteRule ^faqs/?$                     https://hsappliances.co.uk/faq/ [R=301,L]
RewriteRule ^book-appointment/?$         https://hsappliances.co.uk/book/ [R=301,L]
RewriteRule ^washing-machine/?$          https://hsappliances.co.uk/services/washing-machine-repair/ [R=301,L]
RewriteRule ^fridge-freezer/?$           https://hsappliances.co.uk/services/fridge-freezer-repair/ [R=301,L]
RewriteRule ^american-fridge/?$          https://hsappliances.co.uk/services/american-fridge-repair/ [R=301,L]
RewriteRule ^dishwasher/?$               https://hsappliances.co.uk/services/dishwasher-repair/ [R=301,L]
RewriteRule ^electric-hob/?$             https://hsappliances.co.uk/services/electric-hob-repair/ [R=301,L]
RewriteRule ^electric-cooker/?$          https://hsappliances.co.uk/services/electric-cooker-repair/ [R=301,L]
RewriteRule ^gas-hob/?$                  https://hsappliances.co.uk/services/gas-hob-repair/ [R=301,L]
RewriteRule ^gas-cooker/?$               https://hsappliances.co.uk/services/gas-cooker-repair/ [R=301,L]
RewriteRule ^microwave/?$                https://hsappliances.co.uk/services/microwave-repair/ [R=301,L]
RewriteRule ^air-conditioning/?$         https://hsappliances.co.uk/air-conditioning/ [R=301,L]
RewriteRule ^refrigeration-cold-room/?$  https://hsappliances.co.uk/services/cold-room-repair/ [R=301,L]
RewriteRule ^dairy-cabinet/?$            https://hsappliances.co.uk/services/dairy-cabinet-repair/ [R=301,L]
RewriteRule ^display-fridge/?$           https://hsappliances.co.uk/services/display-fridge-repair/ [R=301,L]
RewriteRule ^bar-cooler/?$               https://hsappliances.co.uk/services/bar-cooler-repair/ [R=301,L]
RewriteRule ^celler-cooler/?$            https://hsappliances.co.uk/services/cellar-cooler-repair/ [R=301,L]
RewriteRule ^ice-machine/?$              https://hsappliances.co.uk/services/ice-machine-repair/ [R=301,L]

# Everything else (homepage, WP leftovers) → new homepage
RewriteRule ^(.*)$ https://hsappliances.co.uk/ [R=301,L]
```

## Switch-over checklist

1. Deploy the new site to `hsappliances.co.uk` and check every URL in the "New URL" column loads.
2. Put the redirect `.htaccess` above on the old domain. Test each old URL with
   `curl -I https://houseandshopappliances.co.uk/washing-machine/` and expect a `301` and the right `Location`.
3. In Google Search Console, verify both domains, then use **Settings → Change of address** on the old property.
4. Update the website URL on your Google Business Profile, directories and social profiles.
5. Keep the old domain and its redirects live for **at least 12 months**.
