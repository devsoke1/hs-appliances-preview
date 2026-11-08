import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { business, fullAddress, groupedHours, mailHref, telHref } from "@/data/business";
import { featuredAreas } from "@/data/areas";
import { brandDisclaimer } from "@/data/brands";
import { companyLinks, legalLinks, serviceMenu } from "@/lib/nav";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { CookieSettingsLink } from "@/components/CookieConsent";

export function Footer() {
  const areas = featuredAreas(10);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-[0.9375rem] text-white/65">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        {/* NAP */}
        <div className="sm:col-span-2 lg:col-span-4">
          <Logo tone="light" />
          <p className="mt-5 max-w-sm">
            Repair, installation and maintenance for domestic appliances and commercial refrigeration across{" "}
            {business.serviceAreaSummary}.
          </p>
          <address className="mt-6 space-y-3 not-italic">
            <p className="flex items-start gap-3">
              <MapPin className="mt-1 size-4 shrink-0 text-accent-400" aria-hidden />
              <span>
                {business.name}
                <br />
                {fullAddress}
              </span>
            </p>
            <a href={telHref} className="flex items-center gap-3 font-semibold text-white hover:text-accent-400">
              <Phone className="size-4 shrink-0 text-accent-400" aria-hidden /> {business.phone.display}
            </a>
            <a href={mailHref} className="flex items-center gap-3 break-all hover:text-white">
              <Mail className="size-4 shrink-0 text-accent-400" aria-hidden /> {business.email}
            </a>
          </address>
          <div className="mt-6 flex items-start gap-3">
            <Clock className="mt-1 size-4 shrink-0 text-accent-400" aria-hidden />
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
              {groupedHours().map((h) => (
                <div key={h.label} className="contents">
                  <dt className="text-white/50">{h.label}</dt>
                  <dd className="text-white/85">{h.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          {!business.hoursConfirmed && (
            <p className="mt-2 pl-7 font-mono text-[0.6875rem] uppercase tracking-wide text-accent-400">[CONFIRM HOURS]</p>
          )}
        </div>

        <FooterCol title="Domestic" className="lg:col-span-2">
          {serviceMenu.domestic.map((l) => (
            <FooterLink key={l.href} href={l.href}>{l.label} Repair</FooterLink>
          ))}
        </FooterCol>

        <FooterCol title="Commercial" className="lg:col-span-2">
          {serviceMenu.commercial.map((l) => (
            <FooterLink key={l.href} href={l.href}>{l.label} Repair</FooterLink>
          ))}
        </FooterCol>

        <FooterCol title="Areas" className="lg:col-span-2">
          {areas.length > 0 ? (
            <>
              {areas.map((a) => (
                <FooterLink key={a.slug} href={`/areas/${a.slug}/`}>{a.name}</FooterLink>
              ))}
              <FooterLink href="/areas/">All areas →</FooterLink>
            </>
          ) : (
            <li className="font-mono text-xs uppercase tracking-wide text-accent-400">[ADD AREAS — src/data/areas.ts]</li>
          )}
        </FooterCol>

        <FooterCol title="Company" className="lg:col-span-2">
          {companyLinks.map((l) => (
            <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>
          ))}
        </FooterCol>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-4 py-6 text-[0.8125rem] lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1.5">
            <p>
              © {year} {business.name}. {business.legalName} · {business.companyNumber}
            </p>
            <p className="max-w-3xl text-white/60">{brandDisclaimer}</p>
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">{l.label}</Link>
              </li>
            ))}
            <li>
              <CookieSettingsLink className="hover:text-white" />
            </li>
          </ul>
        </Container>
      </div>
    </footer>
  );
}

function FooterCol({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <p className="mb-4 font-display text-sm font-bold uppercase tracking-[0.12em] text-white">{title}</p>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="transition-colors hover:text-white">{children}</Link>
    </li>
  );
}
