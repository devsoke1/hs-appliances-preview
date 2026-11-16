/**
 * GitHub Pages cannot run PHP. After the static export, add short notes where
 * the live site would serve services, insights, and admin.
 */
import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "out");
const home = "/hs-appliances-preview/";

const page = (title, body) => `<!DOCTYPE html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>
  body { margin: 0; font: 17px/1.5 system-ui, sans-serif; color: #00243a; background: #f4f7fb; }
  main { max-width: 40rem; margin: 4rem auto; padding: 0 1.25rem; }
  a { color: #0061a5; }
</style>
</head>
<body>
<main>
  <h1>${title}</h1>
  <p>${body}</p>
  <p><a href="${home}">Back to the preview</a></p>
</main>
</body>
</html>
`;

const notes = {
  "services/index.html": page(
    "Service pages",
    "These pages are generated from the database on the real server. They are not part of this static preview.",
  ),
  "insights/index.html": page(
    "Insights",
    "Articles are published from the admin panel on the real server. They are not part of this static preview.",
  ),
  "hs-admin/index.html": page(
    "Admin",
    "The admin panel needs PHP and the database. Open it on the real server, not on this preview.",
  ),
};

for (const [file, html] of Object.entries(notes)) {
  const dest = path.join(root, file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
  console.log("✓", file);
}
