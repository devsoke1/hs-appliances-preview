/**
 * LOCAL TESTING ONLY — mobile audit with headless Chrome (puppeteer-core).
 *   npm run serve:php   (in another terminal)
 *   node scripts/dev/mobile-audit.mjs <path-to-puppeteer-core> [outDir]
 * Checks at 360 / 390 / 414 / 768px: horizontal overflow, tap targets < 44px, body text < 16px,
 * hero CTA visible without scrolling; saves screenshots.
 */
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
const require = createRequire(import.meta.url);
const puppeteer = require(process.argv[2]);
const OUT = process.argv[3] || "mobile-audit";
const B = process.env.BASE || "http://localhost:8080";
fs.mkdirSync(OUT, { recursive: true });

const PAGES = ["/", "/domestic/", "/commercial/", "/air-conditioning/", "/services/", "/services/washing-machine-repair/", "/insights/", "/insights/washing-machine-not-draining/", "/areas/hounslow/", "/about/", "/contact/", "/book/", "/faq/"];
const WIDTHS = [360, 390, 414, 768];

const browser = await puppeteer.launch({ executablePath: process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
let problems = 0;

for (const w of WIDTHS) {
  await page.setViewport({ width: w, height: w === 768 ? 1024 : 800, deviceScaleFactor: 1, isMobile: w < 768, hasTouch: true });
  for (const p of PAGES) {
    await page.goto(B + p, { waitUntil: "networkidle0" });
    const r = await page.evaluate(() => {
      const vw = window.innerWidth;
      const overflow = document.documentElement.scrollWidth - vw;
      const offenders = [];
      // Always scan: body may clip overflow (so scrollWidth looks fine) while content is still cut off
      {
        for (const el of document.querySelectorAll("main *")) {
          const b = el.getBoundingClientRect();
          if (b.width && b.right > vw + 1 && getComputedStyle(el).position !== "fixed" && !el.closest("[class*='overflow-x-auto'], [class*='overflow-hidden']")) {
            offenders.push(el.tagName.toLowerCase() + "." + String(el.className).split(" ").slice(0, 3).join("."));
            if (offenders.length > 3) break;
          }
        }
      }
      const visible = (el) => {
        const s = getComputedStyle(el);
        if (s.visibility === "hidden" || s.display === "none" || el.closest("[hidden], .sr-only")) return false;
        const b = el.getBoundingClientRect();
        return b.width > 0 && b.height > 0;
      };
      const small = [];
      // Inline text links (inside sentences/labels) are exempt, as in WCAG 2.5.5; the breadcrumb's current page isn't a link
      const skip = (el) => el.closest("p, label");
      for (const el of document.querySelectorAll("a, button, input:not([type=hidden]), select, textarea, summary")) {
        if (!visible(el) || skip(el) || el.closest("[aria-hidden=true]")) continue;
        if (el.closest("[class*='[&_a]']") && el.tagName === "A") continue; // links inside article prose
        const b = el.getBoundingClientRect();
        const isCheck = el.matches("input[type=checkbox], input[type=radio]");
        if (isCheck) continue; // label is the tap target
        if (b.height < 43.5 || b.width < 43.5) small.push(`${el.tagName.toLowerCase()}(${Math.round(b.width)}x${Math.round(b.height)}) "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 28)}"`);
      }
      // Controls pushed (partly) off-screen, outside intentional horizontal scrollers
      const offscreen = [];
      for (const el of document.querySelectorAll("a, button")) {
        if (!visible(el) || el.closest("[class*='overflow-x-auto'], .sr-only")) continue;
        const b = el.getBoundingClientRect();
        if (b.right > vw + 1 || b.left < -1) offscreen.push(`${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 24)}"`);
      }
      small.push(...offscreen.map((o) => "OFFSCREEN " + o));
      const tinyText = [];
      for (const el of document.querySelectorAll("main p, main li")) {
        if (el.closest("nav")) continue;
        if (!visible(el)) continue;
        const t = (el.textContent || "").trim();
        if (t.length < 60 || el.querySelector("p, li")) continue;
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs < 16) tinyText.push(`${fs}px "${t.slice(0, 40)}"`);
      }
      const cta = [...document.querySelectorAll("main a[href^='/book/'], main a[href^='tel:']")].find(visible);
      const ctaBottom = cta ? Math.round(cta.getBoundingClientRect().bottom) : null;
      return { overflow, offenders, small, tinyText, ctaBottom, vh: window.innerHeight };
    });
    const issues = [];
    if (r.overflow > 1 || r.offenders.length) issues.push(`content wider than the screen ${Math.max(r.overflow, 0)}px (${r.offenders.join(", ")})`);
    if (r.small.length) issues.push(`${r.small.length} small tap targets: ${r.small.slice(0, 4).join(" | ")}`);
    if (r.tinyText.length) issues.push(`${r.tinyText.length} text blocks <16px: ${r.tinyText.slice(0, 2).join(" | ")}`);
    if (w < 768 && (p === "/" || p.startsWith("/services/")) && (r.ctaBottom === null || r.ctaBottom > r.vh)) issues.push(`hero CTA not above the fold (bottom ${r.ctaBottom}px, viewport ${r.vh}px)`);
    problems += issues.length;
    console.log(`${issues.length ? "✗" : "✓"} ${w}px ${p}${issues.length ? "\n    - " + issues.join("\n    - ") : ""}`);
    if (w === 390 || w === 768) {
      const name = `${w}${p.replace(/\//g, "_") || "_home"}`.replace(/_+$/, "");
      await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false });
    }
  }
}
await browser.close();
console.log(problems ? `\n${problems} issue(s)` : "\nAll mobile checks passed");
