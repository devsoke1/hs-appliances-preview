/**
 * Generates the default social share image and app icons from SVG:
 *   public/og/default.png (1200×630), public/icon-192.png, public/icon-512.png,
 *   src/app/icon.svg (favicon), src/app/apple-icon.png (180×180)
 *
 *   npm run brand-assets
 *
 * Outputs are committed. Re-run if the logo or brand colours change.
 * Replace with a designed OG image / real logo whenever you have one.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const NAVY = "#00243a";
const ORANGE = "#f25c00";
const ORANGE_LIGHT = "#ff8445";

const mark = (size, x = 0, y = 0) => `
  <g transform="translate(${x} ${y}) scale(${size / 40})">
    <rect width="40" height="40" rx="9" fill="${NAVY}"/>
    <path d="M11 11v18M11 20h9M20 11v18" stroke="#fff" stroke-width="3.2" stroke-linecap="round" fill="none"/>
    <path d="M29.5 13.5c-1.6-1.4-4.6-1.3-5 .9-.5 2.6 5.6 2.6 5.6 6.4 0 3.2-4.3 3.9-6.4 1.9" stroke="${ORANGE}" stroke-width="3" stroke-linecap="round" fill="none"/>
    <rect x="9.5" y="32" width="21" height="2.4" rx="1.2" fill="${ORANGE}"/>
  </g>`;

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">${mark(40)}</svg>`;

const FONT = "Segoe UI, Helvetica Neue, Arial, sans-serif";
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#0061a5" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#0061a5" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="${NAVY}"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <circle cx="1080" cy="80" r="420" fill="url(#glow)"/>
  <rect x="0" y="618" width="1200" height="12" fill="${ORANGE}"/>
  ${mark(112, 88, 88)}
  <text x="88" y="320" font-family="${FONT}" font-size="68" font-weight="800" fill="#ffffff">House &amp; Shop Appliances</text>
  <text x="88" y="390" font-family="${FONT}" font-size="38" font-weight="600" fill="#ffffff" fill-opacity="0.82">Domestic &amp; commercial appliance repair</text>
  <rect x="88" y="430" width="72" height="5" rx="2.5" fill="${ORANGE}"/>
  <text x="88" y="500" font-family="${FONT}" font-size="34" font-weight="700" fill="${ORANGE_LIGHT}">Feltham · West London · 07777 372586</text>
  <text x="88" y="562" font-family="${FONT}" font-size="28" font-weight="600" fill="#ffffff" fill-opacity="0.6">hsappliances.co.uk</text>
</svg>`;

const write = async (svg, file, size) => {
  const out = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  let img = sharp(Buffer.from(svg), { density: 300 });
  if (size) img = img.resize(size[0], size[1]);
  await img.png({ compressionLevel: 9 }).toFile(out);
  console.log("✓", file);
};

fs.writeFileSync(path.join(ROOT, "src/app/icon.svg"), iconSvg + "\n");
console.log("✓ src/app/icon.svg");
await write(ogSvg, "public/og/default.png", [1200, 630]);
await write(iconSvg, "public/icon-192.png", [192, 192]);
await write(iconSvg, "public/icon-512.png", [512, 512]);
await write(iconSvg, "src/app/apple-icon.png", [180, 180]);
