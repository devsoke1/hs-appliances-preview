import type { NextConfig } from "next";

/**
 * Static export for Hostinger Single Web Hosting (no Node.js runtime).
 * `npm run build` writes the site to /out — upload its contents to public_html.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
