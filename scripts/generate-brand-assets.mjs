/**
 * Brand assets come from the real logo PDF, not the interim HS monogram.
 *   npm run brand-assets
 */
import { spawnSync } from "node:child_process";

const result = spawnSync("python", ["scripts/extract-logo.py"], { stdio: "inherit" });
process.exit(result.status ?? 1);
