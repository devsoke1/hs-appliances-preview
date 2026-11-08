/**
 * Technical SEO audit of the built site.   npm run build && npm run audit
 *
 * Checks every page in out/ for: title (≤60), meta description (≤155), absolute trailing-slash
 * canonical matching the URL, Open Graph/Twitter tags, exactly one H1, heading order, JSON-LD
 * (parses + required properties per type), image alt/dimensions, duplicate titles/descriptions,
 * and that every internal link resolves. Also checks sitemap.xml, robots.txt, the old-domain
 * redirect file and docs/url-map.md. Writes docs/seo-audit.md. Exits 1 if anything fails.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "out");
const SITE = "https://hsappliances.co.uk";
const TITLE_MAX = 60;
const DESC_MAX = 155;

if (!fs.existsSync(OUT)) {
  console.error("out/ not found — run `npm run build` first.");
  process.exit(1);
}

/* ───────────── helpers ───────────── */
const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));
const attr = (html, re) => {
  const m = html.match(re);
  return m ? decode(m[1]) : null;
};
const meta = (html, key, by = "name") => attr(html, new RegExp(`<meta ${by}="${key.replace(/[:.]/g, "\\$&")}" content="([^"]*)"`));
const routeExists = (route) => {
  const clean = route.split(/[?#]/)[0];
  if (clean.endsWith("/")) return fs.existsSync(path.join(OUT, clean, "index.html"));
  return fs.existsSync(path.join(OUT, clean));
};

/* ───────────── collect pages ───────────── */
const pages = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith("_next") || e.name.startsWith("__next") || e.name === "_not-found") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === "index.html") {
      const rel = path.relative(OUT, path.dirname(p)).split(path.sep).join("/");
      if (rel === "404") continue;
      pages.push({ route: rel ? `/${rel}/` : "/", file: p });
    }
  }
})(OUT);
pages.sort((a, b) => a.route.localeCompare(b.route));
const has404 = fs.existsSync(path.join(OUT, "404.html"));

/* ───────────── schema validation ───────────── */
function flattenLd(blocks) {
  const nodes = [];
  for (const b of blocks) {
    if (Array.isArray(b["@graph"])) nodes.push(...b["@graph"]);
    else nodes.push(b);
  }
  return nodes;
}
const isAbs = (u) => typeof u === "string" && u.startsWith(`${SITE}/`);

function validateNode(n, route, errors) {
  const t = n["@type"];
  const need = (cond, msg) => cond || errors.push(`schema ${t}: ${msg}`);
  switch (t) {
    case "HomeAndConstructionBusiness":
    case "LocalBusiness":
      need(n.name, "missing name");
      need(n.telephone?.startsWith("+44"), "telephone not E.164");
      need(n.address?.streetAddress && n.address?.postalCode && n.address?.addressLocality, "incomplete address");
      need(typeof n.geo?.latitude === "number" && typeof n.geo?.longitude === "number", "missing geo coordinates");
      need(Array.isArray(n.openingHoursSpecification) && n.openingHoursSpecification.length, "missing openingHoursSpecification");
      need(Array.isArray(n.areaServed) && n.areaServed.length, "missing areaServed");
      need(isAbs(n.url) && isAbs(n.image) && isAbs(n.logo), "url/image/logo must be absolute");
      break;
    case "WebSite":
      need(n.name && isAbs(n.url), "missing name/url");
      break;
    case "Service":
      need(n.name && n.serviceType, "missing name/serviceType");
      need(n.provider?.["@id"], "missing provider");
      need(Array.isArray(n.areaServed) && n.areaServed.length, "missing areaServed");
      need(n.url === `${SITE}${route}`, `url ${n.url} ≠ page`);
      break;
    case "FAQPage":
      need(Array.isArray(n.mainEntity) && n.mainEntity.length, "no questions");
      for (const q of n.mainEntity ?? []) need(q["@type"] === "Question" && q.name && q.acceptedAnswer?.text, "malformed Question");
      break;
    case "BreadcrumbList": {
      const items = n.itemListElement ?? [];
      need(items.length >= 2, "fewer than 2 items");
      items.forEach((it, i) => {
        need(it.position === i + 1, "positions not sequential");
        if (i < items.length - 1) {
          need(isAbs(it.item), `item ${i + 1} not an absolute URL`);
          if (isAbs(it.item)) need(routeExists(it.item.slice(SITE.length)), `item ${it.item} does not exist`);
        }
      });
      break;
    }
    case "BlogPosting":
      need(n.headline && n.headline.length <= 110, "headline missing or > 110 chars");
      need(/^\d{4}-\d{2}-\d{2}/.test(n.datePublished ?? ""), "bad datePublished");
      need(n.author?.name && n.publisher, "missing author/publisher");
      need(isAbs(n.image), "missing image");
      need(n.url === `${SITE}${route}`, "url ≠ page");
      break;
    default:
      errors.push(`schema: unexpected type ${t}`);
  }
}

/* ───────────── per-page checks ───────────── */
const results = [];
const titles = new Map();
const descs = new Map();
const brokenLinks = new Map();
let linkCount = 0;

for (const pg of pages) {
  const html = fs.readFileSync(pg.file, "utf8");
  const errors = [];
  const warnings = [];
  const url = `${SITE}${pg.route}`;

  const title = attr(html, /<title>([^<]*)<\/title>/);
  const desc = meta(html, "description");
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
  const robots = meta(html, "robots");
  const noindex = /noindex/.test(robots ?? "");

  if (!title) errors.push("missing <title>");
  else if (title.length > TITLE_MAX) errors.push(`title ${title.length} chars > ${TITLE_MAX}`);
  if (!desc) errors.push("missing meta description");
  else if (desc.length > DESC_MAX) errors.push(`description ${desc.length} chars > ${DESC_MAX}`);
  if (canonical !== url) errors.push(`canonical ${canonical ?? "missing"} ≠ ${url}`);

  for (const [k, by] of [["og:title", "property"], ["og:description", "property"], ["og:url", "property"], ["og:image", "property"], ["twitter:card", "name"], ["twitter:image", "name"]]) {
    if (!meta(html, k, by)) errors.push(`missing ${k}`);
  }
  if (meta(html, "og:url", "property") && meta(html, "og:url", "property") !== url) errors.push("og:url ≠ canonical");

  const h1s = html.match(/<h1[\s>]/g)?.length ?? 0;
  if (h1s !== 1) errors.push(`${h1s} <h1> elements`);
  let prev = 0;
  for (const m of html.matchAll(/<h([1-6])[\s>]/g)) {
    const lvl = Number(m[1]);
    if (prev && lvl > prev + 1) {
      warnings.push(`heading jumps h${prev} → h${lvl}`);
      break;
    }
    prev = lvl;
  }

  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="/.test(m[0])) errors.push("img without alt");
    if (!/\bwidth="/.test(m[0]) || !/\bheight="/.test(m[0])) warnings.push("img without width/height (CLS risk)");
  }

  const blocks = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      blocks.push(JSON.parse(m[1]));
    } catch {
      errors.push("JSON-LD does not parse");
    }
  }
  const nodes = flattenLd(blocks);
  const types = [...new Set(nodes.map((n) => n["@type"]))];
  nodes.forEach((n) => validateNode(n, pg.route, errors));
  const expect = (t) => types.includes(t) || errors.push(`expected ${t} schema`);
  expect("HomeAndConstructionBusiness");
  if (pg.route !== "/") expect("BreadcrumbList");
  if (/^\/services\/[^/]+\/$/.test(pg.route)) (expect("Service"), expect("FAQPage"));
  if (/^\/blog\/[^/]+\/$/.test(pg.route)) expect("BlogPosting");
  if (pg.route === "/faq/" || pg.route === "/") expect("FAQPage");
  if (types.filter((t) => t === "FAQPage").length > 1) errors.push("more than one FAQPage");

  for (const m of html.matchAll(/href="(\/[^"]*)"/g)) {
    const href = decode(m[1]);
    if (href.startsWith("/_next/")) continue;
    linkCount++;
    if (!routeExists(href)) {
      if (!brokenLinks.has(href)) brokenLinks.set(href, new Set());
      brokenLinks.get(href).add(pg.route);
    }
  }

  if (title && !noindex) titles.set(title, [...(titles.get(title) ?? []), pg.route]);
  if (desc && !noindex) descs.set(desc, [...(descs.get(desc) ?? []), pg.route]);
  results.push({ ...pg, title, desc, canonical, h1s, types, errors, warnings, noindex });
}

const globalErrors = [];
for (const [t, rs] of titles) if (rs.length > 1) globalErrors.push(`duplicate title "${t}" on ${rs.join(", ")}`);
for (const [d, rs] of descs) if (rs.length > 1) globalErrors.push(`duplicate description on ${rs.join(", ")}`);
for (const [href, from] of brokenLinks) globalErrors.push(`broken internal link ${href} (from ${[...from].slice(0, 3).join(", ")})`);
if (!has404) globalErrors.push("out/404.html missing");

/* ───────────── sitemap + robots ───────────── */
const sitemapXml = fs.readFileSync(path.join(OUT, "sitemap.xml"), "utf8");
const locs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const indexable = results.filter((r) => !r.noindex).map((r) => `${SITE}${r.route}`);
for (const l of locs) {
  if (!isAbs(l) || !l.endsWith("/")) globalErrors.push(`sitemap: ${l} not absolute/trailing-slash`);
  else if (!routeExists(l.slice(SITE.length))) globalErrors.push(`sitemap: ${l} has no page`);
}
for (const u of indexable) if (!locs.includes(u)) globalErrors.push(`sitemap: missing ${u}`);
if (locs.some((l) => /\/404\/?$/.test(l))) globalErrors.push("sitemap: contains 404");
const robotsTxt = fs.readFileSync(path.join(OUT, "robots.txt"), "utf8");
if (!robotsTxt.includes(`Sitemap: ${SITE}/sitemap.xml`)) globalErrors.push("robots.txt: no Sitemap line");
if (/^Disallow:\s*\/\s*$/m.test(robotsTxt)) globalErrors.push("robots.txt blocks the whole site");

/* ───────────── redirects ───────────── */
const OLD_URLS = [
  "/", "/about-us/", "/contact-us/", "/services/", "/faqs/", "/book-appointment/", "/washing-machine/", "/fridge-freezer/",
  "/american-fridge/", "/dishwasher/", "/electric-hob/", "/electric-cooker/", "/gas-hob/", "/gas-cooker/", "/microwave/",
  "/air-conditioning/", "/refrigeration-cold-room/", "/dairy-cabinet/", "/display-fridge/", "/bar-cooler/", "/celler-cooler/", "/ice-machine/",
];
const oldHt = fs.readFileSync(path.join(ROOT, "old-domain-htaccess", ".htaccess"), "utf8");
const rules = [...oldHt.matchAll(/^RewriteRule\s+(\S+)\s+(\S+)\s+\[([^\]]+)\]/gm)].map((m) => ({ pattern: m[1], target: m[2], flags: m[3] }));
const redirectRows = [];
for (const old of OLD_URLS) {
  const subject = old.replace(/^\//, ""); // .htaccess matches without leading slash
  const rule = rules.find((r) => {
    if (r.target === "-") return false;
    try {
      return new RegExp(r.pattern, /NC/.test(r.flags) ? "i" : "").test(subject);
    } catch {
      return false;
    }
  });
  const target = rule?.target.replace(/\?$/, "");
  const newPath = target?.startsWith(SITE) ? target.slice(SITE.length) || "/" : null;
  const ok = Boolean(rule && /R=301/.test(rule.flags) && newPath && routeExists(newPath));
  if (!ok) globalErrors.push(`old URL ${old} → ${target ?? "no rule"} does not resolve to a page`);
  redirectRows.push({ old, target: target ?? "—", ok });
}
// Unmapped old URLs fall to the catch-all
const catchAll = rules[rules.length - 1];
if (!catchAll || catchAll.pattern !== "^" || !catchAll.target.startsWith(`${SITE}/`)) globalErrors.push("old-domain .htaccess: last rule is not a catch-all to the new homepage");
// url-map.md new URLs exist
const urlMap = fs.readFileSync(path.join(ROOT, "docs", "url-map.md"), "utf8");
for (const m of urlMap.matchAll(/^\|\s*\d+\s*\|\s*`([^`]+)`\s*\|\s*`([^`]+)`/gm)) {
  if (!routeExists(m[2])) globalErrors.push(`url-map.md: ${m[1]} → ${m[2]} has no page`);
}
// New-site .htaccess renamed-page redirects
const newHt = fs.readFileSync(path.join(OUT, ".htaccess"), "utf8");
for (const m of newHt.matchAll(/^\s*RewriteRule\s+\^(\S+?)\/\?\$\s+(\/\S*)\s+\[[^\]]*R=301/gm)) {
  if (!routeExists(m[2])) globalErrors.push(`.htaccess: /${m[1]}/ → ${m[2]} has no page`);
}

/* ───────────── report ───────────── */
const pageErrors = results.reduce((n, r) => n + r.errors.length, 0);
const pageWarnings = results.reduce((n, r) => n + r.warnings.length, 0);
const totalErrors = pageErrors + globalErrors.length;
const esc = (s) => String(s ?? "").replace(/\|/g, "\\|");

let md = `# SEO audit\n\nGenerated by \`npm run audit\` on ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC against \`out/\`.\n\n`;
md += `| Check | Result |\n|---|---|\n`;
md += `| Pages audited | ${results.length} (+ 404.html ${has404 ? "✓" : "✗"}) |\n`;
md += `| Internal links checked | ${linkCount} — ${brokenLinks.size ? `**${brokenLinks.size} broken**` : "0 broken ✓"} |\n`;
md += `| Sitemap URLs | ${locs.length} (indexable pages: ${indexable.length}) |\n`;
md += `| Old URLs → live pages | ${redirectRows.filter((r) => r.ok).length}/${redirectRows.length} |\n`;
md += `| Errors | ${totalErrors ? `**${totalErrors}**` : "0 ✓"} |\n| Warnings | ${pageWarnings} |\n\n`;
if (globalErrors.length) md += `## Site-wide errors\n\n${globalErrors.map((e) => `- ${e}`).join("\n")}\n\n`;
md += `## Pages\n\n| Page | Title (chars) | Description (chars) | Canonical | H1 | Schema | Issues |\n|---|---|---|---|---|---|---|\n`;
for (const r of results) {
  const issues = [...r.errors.map((e) => `❌ ${e}`), ...r.warnings.map((w) => `⚠️ ${w}`)].join("<br>") || "✓";
  md += `| \`${r.route}\`${r.noindex ? " (noindex)" : ""} | ${esc(r.title)} (${r.title?.length ?? 0}) | ${r.desc?.length ?? 0} | ${r.canonical === `${SITE}${r.route}` ? "✓" : "✗"} | ${r.h1s} | ${r.types.join(", ")} | ${issues} |\n`;
}
md += `\n## Old-domain redirects\n\n| Old URL | 301 target | Resolves |\n|---|---|---|\n`;
for (const r of redirectRows) md += `| \`${r.old}\` | \`${r.target}\` | ${r.ok ? "✓" : "✗"} |\n`;
md += `\nAnything not listed above (WordPress leftovers like \`/?p=123\`, \`/feed/\`, \`/wp-admin/\`) hits the catch-all → \`${SITE}/\`.\n`;
fs.writeFileSync(path.join(ROOT, "docs", "seo-audit.md"), md);

console.log(`Pages: ${results.length} | links: ${linkCount} (${brokenLinks.size} broken) | sitemap: ${locs.length} | old URLs OK: ${redirectRows.filter((r) => r.ok).length}/${redirectRows.length}`);
for (const e of globalErrors) console.log("✗", e);
for (const r of results) for (const e of r.errors) console.log("✗", r.route, "—", e);
for (const r of results) for (const w of r.warnings) console.log("⚠", r.route, "—", w);
console.log(totalErrors ? `\n${totalErrors} error(s). Report: docs/seo-audit.md` : `\nAll checks passed (${pageWarnings} warnings). Report: docs/seo-audit.md`);
process.exit(totalErrors ? 1 : 0);
