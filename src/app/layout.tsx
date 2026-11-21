import type { Metadata, Viewport } from "next";
import Script from "next/script";
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
  themeColor: "#00243a",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const services = await buildServices();
  return (
    <html lang="en-GB" className={`${jakarta.variable} ${source.variable}`} suppressHydrationWarning>
      <body className="pb-mobile-bar" suppressHydrationWarning>
        <Script id="strip-extension-attrs" strategy="beforeInteractive">
          {`(function(){var n=["bis_skin_checked","bis_register","cz-shortcut-listen","fdprocessedid"];var bad={};for(var i=0;i<n.length;i++)bad[n[i]]=1;var set=Element.prototype.setAttribute;Element.prototype.setAttribute=function(k,v){if(bad[k])return;return set.call(this,k,v)};function s(e){if(!e||e.nodeType!==1)return;for(var i=0;i<n.length;i++)e.hasAttribute(n[i])&&e.removeAttribute(n[i])}function w(e){s(e);var c=e.children;if(!c)return;for(var i=0;i<c.length;i++)w(c[i])}w(document.documentElement);new MutationObserver(function(l){for(var i=0;i<l.length;i++){var m=l[i];if(m.type==="attributes")s(m.target);else if(m.addedNodes)for(var j=0;j<m.addedNodes.length;j++)w(m.addedNodes[j])}}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:n})})();`}
        </Script>
        {process.env.NEXT_PUBLIC_BASE_PATH ? (
          <p className="bg-navy-950 px-4 py-2 text-center text-sm text-white/80">
            Client preview. Design and page copy can be checked here. Booking, service pages, insights, and the admin panel run on the real server.
          </p>
        ) : null}
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
