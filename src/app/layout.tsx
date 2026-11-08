import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { business } from "@/data/business";
import { staticPageSeo } from "@/data/seo";
import { GSC_VERIFICATION, OG_DEFAULT, SITE_URL } from "@/lib/seo";
import { siteGraph } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { CookieConsent } from "@/components/CookieConsent";
import { buildServices } from "@/lib/build-data";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-jakarta",
  display: "optional",
});

const source = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source",
  display: "optional",
});

/**
 * Site-wide defaults. Every page overrides title/description/canonical/OG via pageMeta() —
 * canonicals are never set here, or every page would point at the homepage.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: staticPageSeo.home.title,
  description: staticPageSeo.home.description,
  applicationName: business.name,
  formatDetection: { telephone: false, address: false, email: false }, // we mark up tel: links ourselves
  openGraph: { type: "website", locale: "en_GB", siteName: business.name, images: [{ url: OG_DEFAULT, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image" },
  // Google Search Console HTML-tag verification — set NEXT_PUBLIC_GSC_VERIFICATION at build time
  ...(GSC_VERIFICATION ? { verification: { google: GSC_VERIFICATION } } : {}),
};

export const viewport: Viewport = {
  themeColor: "#0b1d3a",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const services = await buildServices();
  return (
    <html lang="en-GB" className={`${jakarta.variable} ${source.variable}`}>
      <body className="pb-mobile-bar">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-lg focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Header services={services} />
        <main id="main">{children}</main>
        <Footer services={services} />
        <MobileBottomBar />
        <CookieConsent />
        <JsonLd data={siteGraph()} />
      </body>
    </html>
  );
}
