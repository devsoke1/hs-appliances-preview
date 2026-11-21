import Link from "@/components/ui/SiteLink";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { business, fullAddress, groupedHours, mailHref, telHref } from "@/data/business";
import { featuredAreas } from "@/data/areas";
import { companyLinks, legalLinks } from "@/lib/nav";
import type { ServicesPayload } from "@/lib/live-types";
import { Container } from "@/components/ui/Container";
import { CookieSettingsLink } from "@/components/CookieConsent";
import { FooterServiceLinks } from "./FooterServiceLinks";
import { Logo } from "./Logo";

/** Mirrored in PHP: public/includes/footer.php. Links are ≥44px tall on mobile. */
export const footerLinkClass = "inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-white lg:min-h-0 lg:min-w-0";

export function Footer({ services }: { services: ServicesPayload }) {
  const areas = featuredAreas(12);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-[0.9375rem] text-white/65">
      <Container className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:py-14 lg:grid-cols-12 lg:gap-8">
        <div className="col-span-2 lg:col-span-4">
          <Logo tone="light" />
          <p className="mt-5 max-w-sm text-base">
            Repair, installation and maintenance for domestic appliances and commercial refrigeration across {business.serviceAreaSummary}.
          </p>
          <address className="mt-6 space-y-1 not-italic">
            <p className="flex items-start gap-3 py-1">
              <MapPin className="mt-1 size-4 shrink-0 text-accent-500" aria-hidden />
              <span>
                {business.name}
                <br />
                {fullAddress}
              </span>
            </p>
            <a href={telHref} className="flex min-h-11 items-center gap-3 font-semibold text-white hover:text-accent-500">
              <Phone className="size-4 shrink-0 text-accent-500" aria-hidden /> {business.phone.display}
            </a>
            <a href={mailHref} className="flex min-h-11 items-center gap-3 break-all hover:text-white">
              <Mail className="size-4 shrink-0 text-accent-500" aria-hidden /> {business.email}
            </a>
          </address>
          <div className="mt-4 flex items-start gap-3">
            <Clock className="mt-1 size-4 shrink-0 text-accent-500" aria-hidden />
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
              {groupedHours().map((h) => (
                <div key={h.label} className="contents">
                  <dt className="text-white/60">{h.label}</dt>
                  <dd className="text-white/85">{h.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          {!business.hoursConfirmed && <p className="mt-2 pl-7 font-mono text-[0.6875rem] tracking-wide text-accent-500 uppercase">[CONFIRM HOURS]</p>}
        </div>

        <FooterServiceLinks initial={services} />

        <FooterCol title="Areas" className="lg:col-span-2">
          {areas.map((a) => (
            <li key={a.slug}>
              <Link href={`/areas/${a.slug}/`} className={footerLinkClass}>
                {a.name}
              </Link>
            </li>
          ))}
        </FooterCol>

        <FooterCol title="Company" className="lg:col-span-2">
          {companyLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={footerLinkClass}>
                {l.label}
              </Link>
            </li>
          ))}
        </FooterCol>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-4 py-6 text-[0.8125rem] lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1.5">
            <p>
              © {year} {business.name}
              {business.companyNumber.startsWith("[") ? "" : ` · ${business.companyNumber}`}
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-5">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={footerLinkClass}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <CookieSettingsLink className={footerLinkClass} />
            </li>
          </ul>
        </Container>
      </div>
    </footer>
  );
}

export function FooterCol({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <p className="mb-2 font-display text-sm font-bold tracking-[0.12em] text-white uppercase lg:mb-4">{title}</p>
      <ul className="lg:space-y-2.5">{children}</ul>
    </div>
  );
}
