/**
 * Node module-resolution hooks so build scripts can import the site's TypeScript data files
 * directly (Node ≥ 22.6 strips types natively):
 *   - extensionless relative imports  → ./file.ts or ./dir/index.ts
 *   - the "@/..." path alias           → src/...
 * Registered via scripts/ts-register.mjs.
 */
import { existsSync, statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "src");

function tryTs(absPath) {
  for (const candidate of [absPath, `${absPath}.ts`, `${absPath}.tsx`, path.join(absPath, "index.ts")]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return pathToFileURL(candidate).href;
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const url = tryTs(path.join(SRC, specifier.slice(2)));
    if (url) return { url, shortCircuit: true };
  }
  if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL?.startsWith("file:")) {
    const base = path.dirname(fileURLToPath(context.parentURL));
    const abs = path.resolve(base, specifier);
    if (!path.extname(abs) || !existsSync(abs)) {
      const url = tryTs(abs);
      if (url) return { url, shortCircuit: true };
    }
  }
  const resolved = await nextResolve(specifier, context);
  // The app imports JSON without `with { type: "json" }` (fine for Next.js); add it for Node.
  if (resolved.url.endsWith(".json")) {
    return { ...resolved, importAttributes: { ...(context.importAttributes ?? {}), type: "json" }, shortCircuit: true };
  }
  return resolved;
}
