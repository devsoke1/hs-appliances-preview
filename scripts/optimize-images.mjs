/**
 * Image pipeline: assets/images/*.(jpg|jpeg|png|webp|tif|tiff) → public/images/{name}-{width}.webp
 * plus src/data/images.json (intrinsic size + widths) so <ResponsiveImage> can set width/height
 * (no layout shift) and a srcset (right size per device).
 *
 *   npm run images
 *
 * Originals in assets/ are committed; generated files in public/images/ are committed too, so the
 * build doesn't depend on sharp. Re-run after adding or replacing a photo.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "assets", "images");
const OUT = path.join(ROOT, "public", "images");
const MANIFEST = path.join(ROOT, "src", "data", "images.json");
const WIDTHS = [480, 800, 1200, 1600];
const QUALITY = 72;

fs.mkdirSync(SRC, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

const files = fs.readdirSync(SRC).filter((f) => /\.(jpe?g|png|webp|tiff?)$/i.test(f));
const manifest = {};

for (const file of files) {
  const name = file
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const input = sharp(path.join(SRC, file)).rotate(); // honour EXIF orientation
  const meta = await input.metadata();
  const isRotated = (meta.orientation ?? 1) >= 5;
  const width = isRotated ? meta.height : meta.width;
  const height = isRotated ? meta.width : meta.height;
  const widths = WIDTHS.filter((w) => w <= width);
  if (!widths.length || widths[widths.length - 1] < width) widths.push(Math.min(width, 2000));

  for (const w of widths) {
    await input
      .clone()
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 5 })
      .toFile(path.join(OUT, `${name}-${w}.webp`));
  }
  manifest[name] = { width, height, widths };
  console.log(`✓ ${file} → ${name} (${width}×${height}) @ ${widths.join(", ")}w`);
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(files.length ? `\nWrote ${path.relative(ROOT, MANIFEST)}` : "No images in assets/images/ — wrote empty manifest.");
