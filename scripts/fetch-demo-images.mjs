/**
 * Downloads the demo photos listed in scripts/image-sources.json from the Unsplash CDN into
 * assets/images/{name}.jpg, then writes docs/image-credits.md. Run `npm run images` afterwards.
 *
 *   node scripts/fetch-demo-images.mjs
 *
 * Skips files that already exist (delete one to re-download). Replace any of these with your own
 * photos by dropping a file with the same name into assets/images/ and running `npm run images`.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const { images } = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts", "image-sources.json"), "utf8"));
const OUT = path.join(ROOT, "assets", "images");
fs.mkdirSync(OUT, { recursive: true });

let failed = 0;
for (const img of images) {
  const file = path.join(OUT, `${img.name}.jpg`);
  if (!img.id || fs.existsSync(file)) continue;
  const url = `https://images.unsplash.com/photo-${img.id}?w=${img.width}&q=82&fm=jpg&fit=max`;
  const res = await fetch(url);
  if (!res.ok) {
    console.log(`✗ ${img.name} (${res.status})`);
    failed++;
    continue;
  }
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  console.log(`✓ ${img.name}`);
}

/* ── docs/image-credits.md ── */
const order = { high: 0, medium: 1, low: 2 };
const rows = (list) =>
  list
    .map((i) => {
      const credit = String(i.page).startsWith("http") ? i.page : `https://unsplash.com/photos/${i.page}`;
      return `| \`${i.name}\` | ${i.usedOn} | [${i.photographer}](${credit}) | ${i.alt} | ${i.replace === "high" ? "**Replace first**" : i.replace === "medium" ? "Replace when you can" : "Optional"} |`;
    })
    .join("\n");
const md = `# Image credits

All demo photos are from **[Unsplash](https://unsplash.com)** under the [Unsplash License](https://unsplash.com/license), except the dishwasher photo, which is from **[Pexels](https://www.pexels.com/license/)**. Both are free for commercial use. They're credited here so you can swap them out.

Files: originals in \`assets/images/*.jpg\` → optimised WebP (480–2000px) in \`public/images/\` via \`npm run images\`.
To replace a photo with your own, save your photo as \`assets/images/<same name>.jpg\` (landscape, at least 1600px wide), run \`npm run images\`, rebuild and redeploy. For services, you can also upload a new image in the admin panel.

## Replace these first (they should be *your* business)
Real photos of your van, your engineers at work and your workshop build far more trust than stock photos, and Google Business Profile photos can be reused here.

| File | Used on | Photographer | Alt text | Priority |
|---|---|---|---|---|
${rows(images.filter((i) => i.replace === "high"))}

## All images

| File | Used on | Photographer | Alt text | Priority |
|---|---|---|---|---|
${rows([...images].sort((a, b) => order[a.replace] - order[b.replace] || a.usedOn.localeCompare(b.usedOn)))}

## Notes
- **Area photos:** only the Twickenham Stadium, Kingston riverside and Heathrow images show the named place. The others are generic West London scenes, and their alt text describes what's in the photo rather than claiming a location. Real local photos you take yourself (e.g. your van outside a recognisable local spot) will help local SEO.
- **No faces or brand-name close-ups:** photos with prominent appliance or product brand logos, watermarks or recognisable faces were rejected.
- **OG / social image:** \`public/og/default.png\` is generated from the brand (\`npm run brand-assets\`). Service and Insight pages use their own photo as the social image.
`;
fs.writeFileSync(path.join(ROOT, "docs", "image-credits.md"), md);
console.log(`\n${images.length - failed}/${images.length} images ready. Wrote docs/image-credits.md`);
process.exit(failed ? 1 : 0);
