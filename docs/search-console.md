# Search Console & launch SEO checklist

## 1. Fix these before launch
The SEO is only as good as the data behind it. Search the code for `[ADD` / `[CONFIRM` and fix these first:

| What | Where | Why it matters |
|---|---|---|
| **Opening hours** | `src/data/business.ts` → `hours`, then set `hoursConfirmed: true` | They're published in LocalBusiness schema and on every page, so they must match your Google Business Profile exactly. |
| **Google Business Profile URL** | `src/data/business.ts` → `social.googleBusinessProfile` | Adds `sameAs` to the schema, which links the site and your GBP listing. |
| **Map pin** | `src/data/business.ts` → `geo` | Currently the TW13 6AD postcode centre. Replace it with the exact pin from GBP if it's different. |
| **"Same-Day" claim** | `src/data/content.ts` (trust points) and `src/data/seo.ts` → `SAME_DAY_IN_TITLES` | It appears in titles and descriptions, so only keep it if it's true. |
| **Hero photo** | `assets/images/` → `npm run images` → `business.heroImage` | A real photo of you, your van or your work. No stock images. |

## 2. Verify the site in Search Console
Go to <https://search.google.com/search-console>, choose **Add property**, and use one of these methods:

- **Domain property (recommended):** enter `hsappliances.co.uk`, then add the TXT record Google gives you in **hPanel → Domains → DNS / Nameservers**. This covers http/https and www/non-www in one property.
- **URL-prefix property:** use `https://hsappliances.co.uk/` with the **HTML tag** method. Copy only the `content="…"` value into `.env.local`:
  ```
  NEXT_PUBLIC_GSC_VERIFICATION=abc123…
  ```
  Then rebuild and redeploy. The `<meta name="google-site-verification">` tag is added to every page automatically.

Also add the **old domain** (`houseandshopappliances.co.uk`) as a property; you need it for step 4.

## 3. Submit the sitemap
In the new property, go to **Sitemaps** and submit `sitemap.xml`. It lists 41 URLs: home, 16 services, 12 areas, the blog and 3 posts, and the company and legal pages. `robots.txt` already points to it.

Then use **URL inspection → Request indexing** on the homepage and your most important service pages.

## 4. Move the old domain
1. Put the redirects live on the old domain (`old-domain-htaccess/.htaccess`; see deploy.md §6).
2. In the **old** property, go to **Settings → Change of address** and pick the new property.
3. Update the website link on your **Google Business Profile**, Facebook, directories (Yell, Checkatrade etc.) and anywhere else you're listed.
4. Keep the old domain and redirects for at least 12 months.

## 5. Analytics (optional)
Create a GA4 property, then put its measurement ID in `.env.local` and rebuild:
```
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
```
The cookie banner appears automatically. GA only loads after a visitor clicks **Accept analytics**, and visitors can change their mind later via **Cookie settings** in the footer. The privacy policy updates itself to describe it.

## 6. Re-check after changes
```bash
npm run build && npm run audit
```
The audit checks titles, descriptions, canonicals, H1s, schema, internal links, the sitemap and the old-URL redirects. It writes `docs/seo-audit.md` and fails if anything is broken.

To test structured data on the live site, use Google's [Rich Results Test](https://search.google.com/test/rich-results) and the [Schema.org validator](https://validator.schema.org/).

Note that Google currently only shows FAQ rich results for government and health sites. The FAQ markup is still valid and still helps search engines understand the page, but don't expect FAQ dropdowns in your search results.
