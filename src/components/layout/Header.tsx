"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Clock, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { business, fullAddress, groupedHours, mailHref, telHref } from "@/data/business";
import { mainNav } from "@/lib/nav";
import { useLiveServices } from "@/lib/live";
import type { ServicesPayload, ServiceSummary } from "@/lib/live-types";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { ServiceIcon } from "@/components/ServiceIcon";
import { Logo } from "./Logo";

/** Mirrored in PHP: public/includes/header.php (same markup and classes). */
export function Header({ services: initial }: { services: ServicesPayload }) {
  const pathname = usePathname();
  const { services } = useLiveServices(initial);
  const domestic = services.filter((s) => s.category === "domestic");
  const commercial = services.filter((s) => s.category === "commercial");
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setMegaOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const openMega = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  }, []);
  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaOpen(false), 140);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href);
  const hours = groupedHours();

  return (
    <>
      <div className="hidden bg-navy-950 text-[0.8125rem] text-white/70 md:block">
        <Container className="flex h-11 items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5 text-accent-400" aria-hidden />
              {fullAddress}
            </span>
            <span className="hidden items-center gap-1.5 lg:inline-flex">
              <Clock className="size-3.5 text-accent-400" aria-hidden />
              {hours.map((h) => `${h.label} ${h.value}`).join(" · ")}
            </span>
          </div>
          <a href={mailHref} className="inline-flex min-h-11 items-center gap-1.5 hover:text-white">
            <Mail className="size-3.5 text-accent-400" aria-hidden />
            {business.email}
          </a>
        </Container>
      </div>

      <header
        ref={headerRef}
        className={cn(
          "sticky top-0 z-50 border-b bg-white transition-shadow",
          scrolled || megaOpen ? "border-line shadow-[0_6px_24px_-12px_rgb(11_29_58/0.25)]" : "border-transparent",
        )}
      >
        <Container className="flex h-16 items-center justify-between gap-4 lg:h-20">
          <Logo />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              <li onMouseEnter={openMega} onMouseLeave={scheduleClose}>
                <button
                  type="button"
                  aria-expanded={megaOpen}
                  aria-controls="mega-menu"
                  onClick={() => setMegaOpen((v) => !v)}
                  className={cn(
                    "inline-flex h-11 items-center gap-1 rounded-lg px-3.5 font-display text-[0.9375rem] font-semibold transition-colors",
                    megaOpen || pathname.startsWith("/services") ? "text-brand-600" : "text-navy-900 hover:text-brand-600",
                  )}
                >
                  Services
                  <ChevronDown className={cn("size-4 transition-transform", megaOpen && "rotate-180")} aria-hidden />
                </button>
              </li>
              {mainNav.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className={cn(
                      "inline-flex h-11 items-center rounded-lg px-3.5 font-display text-[0.9375rem] font-semibold transition-colors",
                      isActive(l.href) ? "text-brand-600" : "text-navy-900 hover:text-brand-600",
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a href={telHref} className="group hidden items-center gap-2.5 lg:flex" aria-label={`Call ${business.phone.display}`}>
              <span className="grid size-10 place-items-center rounded-full bg-brand-50 text-brand-600 transition-colors group-hover:bg-navy-900 group-hover:text-white">
                <Phone className="size-[1.125rem]" aria-hidden />
              </span>
              <span className="hidden flex-col leading-tight xl:flex">
                <span className="text-xs font-semibold text-muted">Call us</span>
                <span className="font-display text-[1.0625rem] font-extrabold text-navy-900">{business.phone.display}</span>
              </span>
            </a>
            <Link href="/book/" className={buttonClasses("primary", "md", "max-sm:hidden")}>
              Book a Repair
            </Link>
            <a href={telHref} className="grid size-11 place-items-center rounded-lg bg-brand-50 text-brand-600 lg:hidden" aria-label={`Call ${business.phone.display}`}>
              <Phone className="size-5" aria-hidden />
            </a>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="grid size-11 place-items-center rounded-lg bg-navy-900 text-white lg:hidden"
            >
              {mobileOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
          </div>
        </Container>

        {megaOpen && (
          <div
            id="mega-menu"
            onMouseEnter={openMega}
            onMouseLeave={scheduleClose}
            className="absolute inset-x-0 top-full hidden animate-fade-down border-t border-line bg-white shadow-[0_24px_48px_-16px_rgb(11_29_58/0.25)] lg:block"
          >
            <Container className="grid grid-cols-12 gap-8 py-8">
              <MegaColumn title="Domestic appliances" items={domestic} className="col-span-5" cols={2} />
              <MegaColumn title="Commercial refrigeration" items={commercial} className="col-span-4" cols={1} />
              <div className="col-span-3 flex flex-col justify-between rounded-[var(--radius-card)] bg-navy-900 bg-blueprint p-6 text-white">
                <div>
                  <p className="font-display text-lg font-bold">Not sure what&rsquo;s wrong?</p>
                  <p className="mt-2 text-sm text-white/70">Describe the fault and the appliance make &amp; model — we&rsquo;ll talk you through the next step.</p>
                </div>
                <div className="mt-6 space-y-2">
                  <a href={telHref} className={buttonClasses("primary", "md", "w-full")}>
                    <Phone className="size-4" aria-hidden /> {business.phone.display}
                  </a>
                  <Link href="/services/" className="flex items-center justify-center gap-1 py-2 text-sm font-semibold text-white/80 hover:text-white">
                    All services <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </Container>
          </div>
        )}

        {mobileOpen && <MobileMenu domestic={domestic} commercial={commercial} />}
      </header>
    </>
  );
}

function MegaColumn({ title, items, className, cols }: { title: string; items: ServiceSummary[]; className?: string; cols: 1 | 2 }) {
  return (
    <div className={className}>
      <p className="mb-3 border-b border-line pb-3 font-display text-xs font-bold tracking-[0.12em] text-muted uppercase">{title}</p>
      <ul className={cn("grid gap-x-4 gap-y-0.5", cols === 2 ? "grid-cols-2" : "grid-cols-1")}>
        {items.map((s) => (
          <li key={s.slug}>
            <Link href={s.url} className="group flex items-center gap-3 rounded-lg px-2 py-2 font-semibold text-navy-900 transition-colors hover:bg-mist hover:text-brand-600">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600 transition-colors group-hover:bg-white">
                <ServiceIcon icon={s.icon} slug={s.slug} className="size-[1.125rem]" />
              </span>
              <span className="text-[0.9375rem]">{s.menu_label || s.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobileMenu({ domestic, commercial }: { domestic: ServiceSummary[]; commercial: ServiceSummary[] }) {
  const [section, setSection] = useState<"domestic" | "commercial" | null>(null);
  const groups = { domestic, commercial };
  return (
    <div id="mobile-menu" className="absolute inset-x-0 top-full z-50 h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-line bg-white lg:hidden">
      <nav aria-label="Mobile" className="px-4 pt-4 pb-32">
        <p className="px-2 pb-2 font-display text-xs font-bold tracking-[0.12em] text-muted uppercase">Services</p>
        {(["domestic", "commercial"] as const).map((key) => (
          <div key={key} className="border-b border-line">
            <button
              type="button"
              onClick={() => setSection((cur) => (cur === key ? null : key))}
              aria-expanded={section === key}
              className="flex min-h-14 w-full items-center justify-between px-2 py-3 font-display text-lg font-bold text-navy-900"
            >
              {key === "domestic" ? "Domestic appliances" : "Commercial refrigeration"}
              <ChevronDown className={cn("size-5 transition-transform", section === key && "rotate-180")} aria-hidden />
            </button>
            {section === key && (
              <ul className="grid grid-cols-1 gap-0.5 pb-3 sm:grid-cols-2">
                {groups[key].map((s) => (
                  <li key={s.slug}>
                    <Link href={s.url} className="flex min-h-11 items-center gap-3 rounded-lg px-2 py-2 font-semibold text-body active:bg-mist">
                      <ServiceIcon icon={s.icon} slug={s.slug} className="size-5 text-brand-600" />
                      {s.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/services/" className="flex min-h-11 items-center gap-1 px-2 py-2 font-semibold text-brand-600">
                    All services <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </li>
              </ul>
            )}
          </div>
        ))}
        <ul className="mt-2">
          {mainNav.map((l) => (
            <li key={l.href} className="border-b border-line">
              <Link href={l.href} className="flex min-h-14 items-center px-2 font-display text-lg font-bold text-navy-900">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 space-y-3 rounded-[var(--radius-card)] bg-mist p-5 text-[0.9375rem]">
          <p className="flex items-start gap-2">
            <MapPin className="mt-1 size-4 shrink-0 text-brand-600" aria-hidden /> {fullAddress}
          </p>
          <a href={mailHref} className="flex min-h-11 items-center gap-2 break-all">
            <Mail className="size-4 shrink-0 text-brand-600" aria-hidden /> {business.email}
          </a>
        </div>
      </nav>
    </div>
  );
}
