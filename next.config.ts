import type { NextConfig } from "next";

/**
 * Static export for Hostinger Single Web Hosting (no Node.js runtime).
 * `npm run build` writes the site to /out — upload its contents to public_html.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  experimental: {
    // Inline the (small, ~10KB compressed) Tailwind CSS into each page: removes the render-blocking
    // stylesheet request, which was the main LCP cost on mobile.
    inlineCss: true,
  },
};

export default nextConfig;
