import type { NextConfig } from "next";

/**
 * Static export for Hostinger Single Web Hosting (no Node.js runtime).
 * `npm run build` writes the site to /out — upload its contents to public_html.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  images: { unoptimized: true },
  // experimental.inlineCss is deliberately OFF: it embeds the stylesheet in every page three times
  // (a <style> tag plus twice in the React payload), which made the homepage HTML ~2x larger and its
  // mobile LCP worse than one cached, render-blocking CSS file.
};

export default nextConfig;
