"use client";

import Link from "@/components/ui/SiteLink";
import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import {
  analyticsEnabled,
  clearAnalyticsCookies,
  loadAnalytics,
  OPEN_SETTINGS_EVENT,
  readConsent,
  saveConsent,
  type Consent,
} from "@/lib/analytics";
import { buttonClasses } from "@/components/ui/Button";

/**
 * Minimal, PECR/UK-GDPR-style consent banner: analytics stay off until "Accept".
 * Renders nothing when GA4 isn't configured (the site then sets no non-essential cookies).
 * Fixed-position, so it never causes layout shift.
 */
export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!analyticsEnabled) return;
    const c = readConsent();
    if (c === "granted") loadAnalytics();
    if (c === null) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, reopen);
  }, []);

  if (!analyticsEnabled || !open) return null;

  const choose = (v: Consent) => {
    saveConsent(v);
    if (v === "granted") loadAnalytics();
    else clearAnalyticsCookies();
    setOpen(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-[45] mx-auto max-w-xl rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-[var(--shadow-lift)] lg:right-6 lg:bottom-6 lg:left-auto lg:mx-0"
    >
      <p className="flex items-center gap-2 font-display font-bold text-ink">
        <Cookie className="size-5 text-accent-600" aria-hidden /> Cookies
      </p>
      <p className="mt-2 text-[0.9375rem] text-body">
        We&rsquo;d like to use Google Analytics cookies to understand how visitors use our site. They&rsquo;re only set if you accept.{" "}
        <Link href="/privacy-policy/#cookies" className="font-semibold text-brand-600 underline underline-offset-2">
          Privacy &amp; cookies
        </Link>
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={() => choose("granted")} className={buttonClasses("secondary", "sm")}>
          Accept analytics
        </button>
        <button type="button" onClick={() => choose("denied")} className={buttonClasses("outline", "sm")}>
          Reject
        </button>
      </div>
    </div>
  );
}

/** Footer link to reopen the banner. Hidden when analytics aren't configured. */
export function CookieSettingsLink({ className }: { className?: string }) {
  if (!analyticsEnabled) return null;
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))} className={className}>
      Cookie settings
    </button>
  );
}
