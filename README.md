# HS Appliances — hsappliances.co.uk

Next.js (App Router, TypeScript, Tailwind v4) as a **static export** for Hostinger Single Web Hosting (no Node.js on the server).

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # writes static site to /out
```

**Deploy:** upload the *contents* of `out/` (including the hidden `.htaccess`) to `public_html`.

- Content/data: `src/data/` (business NAP, services, areas, brands)
- Design tokens: `src/app/globals.css` (`@theme`)
- UI primitives: `src/components/ui/`, layout: `src/components/layout/`
- PHP endpoints: `public/api/` (copied into the export)
- Old → new URLs + redirect rules: `docs/url-map.md`

Before launch, search for `[ADD` and `[CONFIRM` and replace every placeholder with real data.
