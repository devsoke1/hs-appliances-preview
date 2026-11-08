/**
 * LOCAL TESTING ONLY — runs PHP with the extensions the site needs (pdo_sqlite for the dev database,
 * gd for image uploads, pdo_mysql, fileinfo, mbstring), even if your php.ini doesn't enable them.
 *
 *   node scripts/dev/php.mjs <php args…>
 *   npm run dev:db       build private/dev.sqlite from database/schema.sql + seed.sql
 *   npm run serve:php    serve out/ with the .htaccess-emulating router on http://localhost:8080
 */
import { execFileSync, spawn } from "node:child_process";
import path from "node:path";

const php = process.env.PHP_BIN || "php";
let extDir = "";
try {
  const bin = execFileSync(php, ["-r", "echo PHP_BINARY;"], { encoding: "utf8" }).trim();
  extDir = path.join(path.dirname(bin), "ext");
} catch {
  console.error("PHP not found. Install PHP 8.1+ (e.g. `winget install PHP.PHP.8.4`) or set PHP_BIN.");
  process.exit(1);
}
const loaded = execFileSync(php, ["-m"], { encoding: "utf8" }).toLowerCase().split(/\r?\n/);
const flags = [`-dextension_dir=${extDir}`];
for (const ext of ["pdo_sqlite", "pdo_mysql", "gd", "fileinfo", "mbstring", "openssl", "curl"]) {
  if (!loaded.includes(ext)) flags.push(`-dextension=${ext}`);
}
flags.push("-dupload_max_filesize=6M", "-dpost_max_size=20M");

const child = spawn(php, [...flags, ...process.argv.slice(2)], { stdio: "inherit" });
child.on("exit", (code) => process.exit(code ?? 0));
