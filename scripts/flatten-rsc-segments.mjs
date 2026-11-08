/**
 * Post-build fix for Next.js 16 static export on plain Apache/LiteSpeed hosting.
 *
 * Next writes per-segment prefetch payloads into folders, e.g.
 *   out/areas/hayes/__next.areas/$d$slug/__PAGE__.txt
 * but the client router requests the dotted, flat name:
 *   /areas/hayes/__next.areas.$d$slug.__PAGE__.txt
 * Without a server rewrite those prefetches 404 (console errors, wasted requests, slower navigation).
 * This copies each nested payload to the flat name so it works on any static host.
 *
 * Runs automatically after `npm run build` (postbuild).
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "out");
let copied = 0;

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name.startsWith("__next.")) flatten(dir, p);
      else if (e.name !== "_next") walk(p);
    }
  }
}

/** routeDir/__next.a/b/__PAGE__.txt → routeDir/__next.a.b.__PAGE__.txt */
function flatten(routeDir, segDir) {
  (function inner(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) inner(p);
      else if (e.name.endsWith(".txt")) {
        const rel = path.relative(routeDir, p).split(path.sep).join(".");
        const target = path.join(routeDir, rel);
        if (!fs.existsSync(target)) {
          fs.copyFileSync(p, target);
          copied++;
        }
      }
    }
  })(segDir);
}

if (!fs.existsSync(OUT)) {
  console.error("flatten-rsc-segments: out/ not found");
  process.exit(1);
}
walk(OUT);
console.log(`flatten-rsc-segments: ${copied} prefetch payload(s) copied to flat names`);
