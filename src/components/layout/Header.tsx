"use client";

import Link from "@/components/ui/SiteLink";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AirVent, ArrowRight, ChevronDown, ClipboardCheck, Clock, Mail, MapPin, Menu, Phone, Settings, Wrench, X, type LucideIcon } from "lucide-react";
import { business, fullAddress, groupedHours, mailHref, telHref } from "@/data/business";
import { categoryNav, mainNav, type CategoryKey } from "@/lib/nav";
import { AC_OPTIONS, acHref, isAcService } from "@/lib/booking";
import { useLiveServices } from "@/lib/live";
import type { ServicesPayload, ServiceSummary } from "@/lib/live-types";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/Button";
import { ServiceIcon } from "@/components/ServiceIcon";
import { Logo } from "./Logo";

const AC_ICONS: Record<string, LucideIcon> = { ClipboardCheck, AirVent, Settings, Wrench };

type MenuItem = { key: string; label: string; href: string; icon: React.ReactNode; sub?: string };

/** Mirrored in PHP: public/includes/header.php (same markup and classes) + public/assets/js/site.js. */
export function Header({ services: initial }: { services: ServicesPayload }) {
  const pathname = usePathname();
  const { services } = useLiveServices(initial);
  const [open, setOpen] = useState<CategoryKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  const items: Record<CategoryKey, MenuItem[]> = {
    domestic: services
      .filter((s) => s.category === "domestic" && !isAcService(s.slug))
      .map((s) => serviceItem(s)),
    commercial: services.filter((s) => s.category === "commercial").map((s) => serviceItem(s)),
    ac: AC_OPTIONS.map((o) => {
      const Icon = AC_ICONS[o.icon] ?? Wrench;
      return { key: o.key, label: o.menu, href: acHref(o.key), icon: <Icon className="size-[1.125rem]" aria-hidden />, sub: o.title };
    }),
  };

  useEffect(() => {
    setOpen(null);
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
        setOpen(null);
        setMobileOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpen(null);
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

  const openMenu = useCallback((key: CategoryKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(key);
  }, []);
  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href);
  const hours = groupedHours();

  return (
    <>
      <div className="hidden bg-navy-950 text-[0.8125rem] text-white/70 md:block">
        <Container className="flex h-11 items-center justify-between gap-6">
          <div className="flex min-w-0 items-center gap-6">
            <span className="inline-flex items-center gap-1.5 truncate">
              <MapPin className="size-3.5 shrink-0 text-accent-500" aria-hidden />
              {fullAddress}
            </span>
            <span className="hidden items-center gap-1.5 xl:inline-flex">
              <Clock className="size-3.5 text-accent-500" aria-hidden />
              {hours.map((h) => `${h.label} ${h.value}`).join(" · ")}
            </span>
          </div>
          <nav aria-label="Company" className="flex shrink-0 items-center">
            {mainNav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={cn("inline-flex min-h-11 min-w-11 items-center justify-center px-2.5 font-semibold transition-colors hover:text-white", isActive(l.href) && "text-white")}
              >
                {l.label}
              </Link>
            ))}
            <a href={mailHref} className="ml-2 hidden min-h-11 items-center gap-1.5 hover:text-white 2xl:inline-flex">
              <Mail className="size-3.5 text-accent-500" aria-hidden />
              {business.email}
            </a>
          </nav>
        </Container>
      </div>

      <header
        ref={headerRef}
        className={cn(
          "sticky top-0 z-50 border-b bg-white transition-shadow",
          scrolled || open ? "border-line shadow-[0_6px_24px_-12px_rgb(0_36_58/0.25)]" : "border-transparent",
        )}
      >
        <Container className="flex h-16 items-center justify-between gap-4 lg:h-20">
          <Logo />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-0.5 xl:gap-1">
              {categoryNav.map((c) => {
                const active = open === c.key;
                return (
                  <li key={c.key} className="relative" onMouseEnter={() => openMenu(c.key)} onMouseLeave={scheduleClose}>
                    <div className="flex items-center">
                      <Link
                        href={c.href}
                        aria-current={isActive(c.href) ? "page" : undefined}
                        className={cn(
                          "inline-flex h-11 items-center rounded-lg pr-1 pl-3 font-display text-[0.9375rem] font-semibold transition-colors xl:pl-3.5",
                          active || isActive(c.href) ? "text-brand-600" : "text-navy-900 hover:text-brand-600",
                        )}
                      >
                        {c.label}
                      </Link>
                      <button
                        type="button"
                        aria-expanded={active}
                        aria-controls={`menu-${c.key}`}
                        aria-label={`Show ${c.title.toLowerCase()} menu`}
                        onClick={() => setOpen((v) => (v === c.key ? null : c.key))}
                        className={cn("grid h-11 w-8 place-items-center rounded-lg transition-colors", active ? "text-brand-600" : "text-navy-900 hover:text-brand-600")}
                      >
                        <ChevronDown className={cn("size-4 transition-transform", active && "rotate-180")} aria-hidden />
                      </button>
                    </div>
                    {active && <Dropdown id={`menu-${c.key}`} category={c} items={items[c.key]} />}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a href={telHref} className={buttonClasses("outline", "md", "max-lg:hidden")} aria-label={`Call ${business.phone.display}`}>
              <Phone className="size-4" aria-hidden />
              <span className="xl:hidden">Call</span>
              <span className="hidden xl:inline">{business.phone.display}</span>
            </a>
            <Link href="/book/" className={buttonClasses("primary", "md", "max-sm:hidden")}>
              Book Now
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

        {mobileOpen && <MobileMenu items={items} />}
      </header>
    </>
  );
}

function serviceItem(s: ServiceSummary): MenuItem {
  return { key: s.slug, label: s.menu_label || s.name, href: s.url, icon: <ServiceIcon icon={s.icon} slug={s.slug} className="size-[1.125rem]" /> };
}

function Dropdown({ id, category, items }: { id: string; category: (typeof categoryNav)[number]; items: MenuItem[] }) {
  const wide = category.key === "domestic";
  return (
    <div id={id} className={cn("absolute top-full z-50 pt-2", category.key === "ac" ? "right-0" : "left-0")}>
      <div
        className={cn(
          "animate-fade-down rounded-[var(--radius-card)] border border-line bg-white p-4 shadow-[0_24px_48px_-16px_rgb(0_36_58/0.3)]",
          wide ? "w-[34rem]" : category.key === "ac" ? "w-[22rem]" : "w-[20rem]",
        )}
      >
        <p className="mb-2 px-2 font-display text-xs font-bold tracking-[0.12em] text-muted uppercase">{category.title}</p>
        <ul className={cn("grid gap-x-3 gap-y-0.5", wide ? "grid-cols-2" : "grid-cols-1")}>
          {items.map((it) => (
            <li key={it.key}>
              <Link href={it.href} className="group flex items-center gap-3 rounded-lg px-2 py-2 font-semibold text-navy-900 transition-colors hover:bg-mist hover:text-brand-600">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600 transition-colors group-hover:bg-white">{it.icon}</span>
                <span className="flex flex-col leading-tight">
                  <span className="text-[0.9375rem]">{it.label}</span>
                  {it.sub && it.sub !== it.label && <span className="text-xs font-semibold text-muted">{it.sub}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
          <Link href={category.href} className="inline-flex min-h-11 items-center gap-1 px-2 text-sm font-bold text-brand-600 hover:text-brand-700">
            {category.all} <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link href={`${category.href}#book`} className={buttonClasses("primary", "sm")}>
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}

function MobileMenu({ items }: { items: Record<CategoryKey, MenuItem[]> }) {
  const [section, setSection] = useState<CategoryKey | null>(null);
  return (
    <div id="mobile-menu" className="absolute inset-x-0 top-full z-50 h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-line bg-white lg:hidden">
      <nav aria-label="Mobile" className="px-4 pt-4 pb-32">
        {categoryNav.map((c) => (
          <div key={c.key} className="border-b border-line">
            <button
              type="button"
              onClick={() => setSection((cur) => (cur === c.key ? null : c.key))}
              aria-expanded={section === c.key}
              aria-controls={`mm-${c.key}`}
              className="flex min-h-14 w-full items-center justify-between px-2 py-3 font-display text-lg font-bold text-navy-900"
            >
              {c.label}
              <ChevronDown className={cn("size-5 transition-transform", section === c.key && "rotate-180")} aria-hidden />
            </button>
            {section === c.key && (
              <ul id={`mm-${c.key}`} className="grid grid-cols-1 gap-0.5 pb-3 sm:grid-cols-2">
                <li className="sm:col-span-2">
                  <Link href={c.href} className="flex min-h-11 items-center gap-1 px-2 py-2 font-bold text-brand-600">
                    {c.all} <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </li>
                {items[c.key].map((it) => (
                  <li key={it.key}>
                    <Link href={it.href} className="flex min-h-11 items-center gap-3 rounded-lg px-2 py-2 font-semibold text-body active:bg-mist">
                      <span className="text-brand-600">{it.icon}</span>
                      {it.sub ?? it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link href="/book/" className={buttonClasses("primary", "lg", "w-full")}>
            Book Now
          </Link>
          <a href={telHref} className={buttonClasses("secondary", "lg", "w-full")} aria-label={`Call ${business.phone.display}`}>
            <Phone className="size-5" aria-hidden /> Call
          </a>
        </div>
        <ul className="mt-4">
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
