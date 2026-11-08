/**
 * Technical SEO audit of the RUNNING site (static pages + PHP-rendered services/insights).
 *   npm run build && npm run serve:php    (another terminal)
 *   npm run audit                         (or: BASE=https://hsappliances.co.uk npm run audit)
 *
 * Crawls every URL in /sitemap.xml plus every internal link found, and checks: status 200, title ≤60,
 * description ≤155, absolute trailing-slash canonical, Open Graph/Twitter, exactly one H1, heading order,
 * JSON-LD (parses + required properties per type), image alt/dimensions, duplicate titles/descriptions,
 * internal links (no 404s, no redirect hops), sitemap vs crawl, robots.txt, old-domain redirects.
 * Writes docs/seo-audit.md. Exits 1 on any error.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BASE = (process.env.BASE || "http://localhost:8080").replace(/\/$/, "");
const SITE = "https://hsappliances.co.uk";
const TITLE_MAX = 60;
const DESC_MAX = 155;

/* ───────────── helpers ───────────── */
const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));
const attr = (html, re) => {
  const m = html.match(re);
  return m ? decode(m[1]) : null;
};
const meta = (html, key, by = "name") => attr(html, new RegExp(`<meta ${by}="${key.replace(/[:.]/g, "\\$&")}" content="([^"]*)"`));
const statusCache = new Map();
async function status(p) {
  if (!statusCache.has(p)) {
    statusCache.set(p, fetch(BASE + p, { redirect: "manual" }).then(async (r) => ({ code: r.status, location: r.headers.get("location") })).catch(() => ({ code: 0 })));
  }
  return statusCache.get(p);
}
const isAbs = (u) => typeof u === "string" && u.startsWith(`${SITE}/`);

try {
  await fetch(BASE + "/");
} catch {
  console.error(`Can't reach ${BASE}. Start the site first: npm run build && npm run serve:php`);
  process.exit(1);
}

/* ───────────── schema validation ───────────── */
async function validateNode(n, route, errors) {
  const t = n["@type"];
  const need = (cond, msg) => cond || errors.push(`schema ${t}: ${msg}`);
  switch (t) {
    case "HomeAndConstructionBusiness":
      need(n.name && n.telephone?.startsWith("+44"), "name/telephone");
      need(n.address?.streetAddress && n.address?.postalCode, "address");
      need(typeof n.geo?.latitude === "number", "geo");
      need(n.openingHoursSpecification?.length, "openingHoursSpecification");
      need(n.areaServed?.length, "areaServed");
      break;
    case "WebSite":
      need(n.name && isAbs(n.url), "name/url");
      break;
    case "Service":
      need(n.name && n.provider?.["@id"] && n.areaServed?.length, "name/provider/areaServed");
      need(n.url === `${SITE}${route}`, `url ${n.url} ≠ page`);
      break;
    case "FAQPage":
      need(n.mainEntity?.length, "no questions");
      for (const q of n.mainEntity ?? []) need(q["@type"] === "Question" && q.name && q.acceptedAnswer?.text, "malformed Question");
      break;
    case "BreadcrumbList": {
      const items = n.itemListElement ?? [];
      need(items.length >= 2, "fewer than 2 items");
      for (const [i, it] of items.entries()) {
        need(it.position === i + 1, "positions not sequential");
        if (i < items.length - 1) {
          need(isAbs(it.item), `item ${i + 1} not absolute`);
          if (isAbs(it.item)) need((await status(it.item.slice(SITE.length))).code === 200, `item ${it.item} is not 200`);
        }
      }
      break;
    }
    case "BlogPosting":
      need(n.headline && n.headline.length <= 110, "headline");
      need(/^\d{4}-\d{2}-\d{2}/.test(n.datePublished ?? ""), "datePublished");
      need(n.author?.name && n.publisher && isAbs(n.image), "author/publisher/image");
      need(n.url === `${SITE}${route}`, "url ≠ page");
      break;
    default:
      errors.push(`schema: unexpected type ${t}`);
  }
}

/* ───────────── crawl ───────────── */
const sitemapXml = await (await fetch(BASE + "/sitemap.xml")).text();
const locs = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const queue = locs.filter((l) => l.startsWith(SITE)).map((l) => l.slice(SITE.length));
const seen = new Set(queue);
const results = [];
const titles = new Map();
const descs = new Map();
const linkIssues = new Map();
let linkCount = 0;

while (queue.length && results.length < 400) {
  const route = queue.shift();
  const res = await fetch(BASE + route, { redirect: "manual" });
  const html = res.status === 200 ? await res.text() : "";
  const errors = [];
  const warnings = [];
  if (res.status !== 200) {
    errors.push(`HTTP ${res.status}`);
    results.push({ route, errors, warnings, types: [], h1s: 0 });
    continue;
  }
  const url = `${SITE}${route.split("?")[0]}${route.includes("?") ? "?" + route.split("?")[1] : ""}`;
  const title = attr(html, /<title>([^<]*)<\/title>/);
  const desc = meta(html, "description");
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
  const noindex = /noindex/.test(meta(html, "robots") ?? "");

  if (!title) errors.push("missing <title>");
  else if (title.length > TITLE_MAX) errors.push(`title ${title.length} chars > ${TITLE_MAX}`);
  if (!desc) errors.push("missing meta description");
  else if (desc.length > DESC_MAX) errors.push(`description ${desc.length} chars > ${DESC_MAX}`);
  if (decode(canonical ?? "") !== url) errors.push(`canonical ${canonical ?? "missing"} ≠ ${url}`);
  for (const [k, by] of [["og:title", "property"], ["og:url", "property"], ["og:image", "property"], ["twitter:card", "name"]]) {
    if (!meta(html, k, by)) errors.push(`missing ${k}`);
  }
  const h1s = html.match(/<h1[\s>]/g)?.length ?? 0;
  if (h1s !== 1) errors.push(`${h1s} <h1>`);
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
    if (/src="\/images\//.test(m[0]) && (!/\bwidth="/.test(m[0]) || !/\bheight="/.test(m[0]))) warnings.push("pipeline img without width/height");
  }

  const blocks = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      blocks.push(JSON.parse(m[1]));
    } catch {
      errors.push("JSON-LD does not parse");
    }
  }
  const nodes = blocks.flatMap((b) => (Array.isArray(b["@graph"]) ? b["@graph"] : [b]));
  const types = nodes.map((n) => n["@type"]);
  for (const n of nodes) await validateNode(n, route.split("?")[0], errors);
  const expect = (t) => types.includes(t) || errors.push(`expected ${t} schema`);
  expect("HomeAndConstructionBusiness");
  if (route !== "/") expect("BreadcrumbList");
  if (/^\/services\/[^/]+\/$/.test(route)) expect("Service");
  if (/^\/insights\/[^/?]+\/$/.test(route)) expect("BlogPosting");
  if (route === "/faq/") expect("FAQPage");
  if (types.filter((t) => t === "FAQPage").length > 1) errors.push("more than one FAQPage");

  for (const m of html.matchAll(/href="(\/[^"#]*)(#[^"]*)?"/g)) {
    let href = decode(m[1]);
    if (href.startsWith("/_next/") || /\.(png|svg|webmanifest|webp|woff2|xml|txt|ico)(\?|$)/.test(href)) continue;
    linkCount++;
    const st = await status(href);
    if (st.code !== 200) {
      const key = `${href} → ${st.code}${st.location ? " " + st.location : ""}`;
      if (!linkIssues.has(key)) linkIssues.set(key, new Set());
      linkIssues.get(key).add(route);
    }
    // crawl HTML pages we haven't seen (skip booking query strings)
    const clean = href.startsWith("/book/?") ? "/book/" : href;
    if (st.code === 200 && !seen.has(clean) && !/^\/(api|hs-admin)\//.test(clean)) {
      seen.add(clean);
      queue.push(clean);
    }
  }

  if (title && !noindex) titles.set(title, [...(titles.get(title) ?? []), route]);
  if (desc && !noindex) descs.set(desc, [...(descs.get(desc) ?? []), route]);
  results.push({ route, title, desc, canonical, h1s, types: [...new Set(types)], errors, warnings, noindex });
}

const globalErrors = [];
for (const [t, rs] of titles) if (rs.length > 1) globalErrors.push(`duplicate title "${t}" on ${rs.join(", ")}`);
for (const [, rs] of descs) if (rs.length > 1) globalErrors.push(`duplicate description on ${rs.join(", ")}`);
for (const [key, from] of linkIssues) {
  const code = Number(key.split(" → ")[1].split(" ")[0]);
  (code >= 400 || code === 0 ? globalErrors : results[0].warnings).push(`internal link ${key} (from ${[...from].slice(0, 3).join(", ")})`);
}

/* ───────────── sitemap / robots ───────────── */
for (const l of locs) {
  if (!isAbs(l) || !new URL(l).pathname.endsWith("/")) globalErrors.push(`sitemap: ${l} not absolute/trailing-slash`);
  const r = results.find((x) => x.route === l.slice(SITE.length));
  if (r && r.errors.some((e) => e.startsWith("HTTP"))) globalErrors.push(`sitemap: ${l} → ${r.errors[0]}`);
}
const indexable = results.filter((r) => !r.noindex && !r.route.includes("?") && !r.errors.some((e) => e.startsWith("HTTP")));
for (const r of indexable) if (!locs.includes(SITE + r.route)) globalErrors.push(`sitemap: missing ${r.route}`);
const robots = await (await fetch(BASE + "/robots.txt")).text();
if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) globalErrors.push("robots.txt: no Sitemap line");
if (!/Disallow:\s*\/hs-admin\//.test(robots)) globalErrors.push("robots.txt: /hs-admin/ not disallowed");
if ((await status("/this-page-does-not-exist/")).code !== 404) globalErrors.push("unknown URL does not return 404");

/* ───────────── redirects ───────────── */
const oldHt = fs.readFileSync(path.join(ROOT, "old-domain-htaccess", ".htaccess"), "utf8");
const rules = [...oldHt.matchAll(/^RewriteRule\s+(\S+)\s+(\S+)\s+\[([^\]]+)\]/gm)].map((m) => ({ pattern: m[1], target: m[2], flags: m[3] }));
const OLD = ["/", "/about-us/", "/contact-us/", "/services/", "/faqs/", "/book-appointment/", "/washing-machine/", "/fridge-freezer/", "/american-fridge/", "/dishwasher/", "/electric-hob/", "/electric-cooker/", "/gas-hob/", "/gas-cooker/", "/microwave/", "/air-conditioning/", "/refrigeration-cold-room/", "/dairy-cabinet/", "/display-fridge/", "/bar-cooler/", "/celler-cooler/", "/ice-machine/"];
const redirectRows = [];
for (const old of OLD) {
  const rule = rules.find((r) => r.target !== "-" && new RegExp(r.pattern, /NC/.test(r.flags) ? "i" : "").test(old.slice(1)));
  const target = rule?.target.replace(/\?$/, "");
  const p = target?.startsWith(SITE) ? target.slice(SITE.length) || "/" : null;
  const ok = Boolean(rule && /R=301/.test(rule.flags) && p && (await status(p)).code === 200);
  if (!ok) globalErrors.push(`old URL ${old} → ${target ?? "no rule"} is not a 200 page`);
  redirectRows.push({ old, target: target ?? "—", ok });
}
for (const [from, to] of [["/faqs/", "/faq/"], ["/blog/", "/insights/"], ["/blog/washing-machine-not-draining/", "/insights/washing-machine-not-draining/"]]) {
  const st = await status(from);
  if (st.code !== 301 || !(st.location ?? "").endsWith(to)) globalErrors.push(`${from} should 301 → ${to} (got ${st.code} ${st.location ?? ""})`);
}

/* ───────────── report ───────────── */
const pageErrors = results.reduce((n, r) => n + r.errors.length, 0);
const pageWarnings = results.reduce((n, r) => n + r.warnings.length, 0);
const totalErrors = pageErrors + globalErrors.length;
const esc = (s) => String(s ?? "").replace(/\|/g, "\\|");
let md = `# SEO audit\n\nGenerated by \`npm run audit\` on ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC against ${BASE}.\n\n| Check | Result |\n|---|---|\n`;
md += `| Pages crawled | ${results.length} (sitemap: ${locs.length}) |\n| Internal links checked | ${linkCount} — ${[...linkIssues.keys()].filter((k) => !/→ 3\d\d/.test(k)).length ? "**broken links found**" : "no 404s ✓"} |\n`;
md += `| Old URLs → live pages | ${redirectRows.filter((r) => r.ok).length}/${redirectRows.length} |\n| Errors | ${totalErrors ? `**${totalErrors}**` : "0 ✓"} |\n| Warnings | ${pageWarnings} |\n\n`;
if (globalErrors.length) md += `## Site-wide errors\n\n${globalErrors.map((e) => `- ${e}`).join("\n")}\n\n`;
md += `## Pages\n\n| Page | Title (chars) | Desc | Canonical | H1 | Schema | Issues |\n|---|---|---|---|---|---|---|\n`;
for (const r of results) {
  const issues = [...r.errors.map((e) => `❌ ${e}`), ...r.warnings.map((w) => `⚠️ ${w}`)].join("<br>") || "✓";
  md += `| \`${r.route}\`${r.noindex ? " (noindex)" : ""} | ${esc(r.title)} (${r.title?.length ?? 0}) | ${r.desc?.length ?? 0} | ${r.canonical ? "✓" : "✗"} | ${r.h1s} | ${r.types.join(", ")} | ${issues} |\n`;
}
md += `\n## Old-domain redirects\n\n| Old URL | 301 target | Resolves |\n|---|---|---|\n${redirectRows.map((r) => `| \`${r.old}\` | \`${r.target}\` | ${r.ok ? "✓" : "✗"} |`).join("\n")}\n`;
fs.writeFileSync(path.join(ROOT, "docs", "seo-audit.md"), md);

console.log(`Pages: ${results.length} | links: ${linkCount} | sitemap: ${locs.length} | old URLs OK: ${redirectRows.filter((r) => r.ok).length}/${redirectRows.length}`);
for (const e of globalErrors) console.log("✗", e);
for (const r of results) for (const e of r.errors) console.log("✗", r.route, "—", e);
for (const r of results) for (const w of r.warnings) console.log("⚠", r.route, "—", w);
console.log(totalErrors ? `\n${totalErrors} error(s). Report: docs/seo-audit.md` : `\nAll checks passed (${pageWarnings} warnings). Report: docs/seo-audit.md`);
process.exit(totalErrors ? 1 : 0);
