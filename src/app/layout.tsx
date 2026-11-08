import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { business } from "@/data/business";
import { areas } from "@/data/areas";
import { JsonLd } from "@/components/JsonLd";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const source = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-source",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(business.url),
  title: {
    default: `${business.name} | Appliance Repair in Feltham & West London`,
    template: `%s | ${business.shortName}`,
  },
  description:
    "Domestic appliance repair and commercial refrigeration repair, installation and maintenance from House & Shop Appliances, 209 Hounslow Road, Feltham.",
  openGraph: { type: "website", locale: "en_GB", siteName: business.name },
  // Canonicals are set per page via pageMeta() — never site-wide.
};

const dayCodes: Record<string, string> = {
  Monday: "Mo", Tuesday: "Tu", Wednesday: "We", Thursday: "Th", Friday: "Fr", Saturday: "Sa", Sunday: "Su",
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${business.url}/#business`,
  name: business.name,
  alternateName: business.shortName,
  url: business.url,
  telephone: business.phone.e164,
  email: business.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: business.address.street,
    addressLocality: business.address.locality,
    addressRegion: business.address.region,
    postalCode: business.address.postcode,
    addressCountry: business.address.country,
  },
  ...(business.geo.lat && business.geo.lng
    ? { geo: { "@type": "GeoCoordinates", latitude: business.geo.lat, longitude: business.geo.lng } }
    : {}),
  // Only published once hours are confirmed, so schema never contradicts Google Business Profile
  ...(business.hoursConfirmed
    ? {
        openingHours: business.hours
          .filter((h) => h.opens && h.closes)
          .map((h) => `${dayCodes[h.day]} ${h.opens}-${h.closes}`),
      }
    : {}),
  areaServed: areas.map((a) => ({ "@type": "Place", name: a.name })),
};

export const viewport: Viewport = {
  themeColor: "#0b1d3a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${jakarta.variable} ${source.variable}`}>
      <body className="pb-mobile-bar">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-lg focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileBottomBar />
        <JsonLd data={localBusinessSchema} />
      </body>
    </html>
  );
}
