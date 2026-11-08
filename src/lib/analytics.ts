/**
 * GA4, loaded ONLY after the visitor accepts analytics cookies.
 * Set NEXT_PUBLIC_GA4_ID (e.g. G-XXXXXXXXXX) at build time to enable. Empty = no analytics, no banner.
 */
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID ?? "";
export const analyticsEnabled = /^G-[A-Z0-9]+$/.test(GA4_ID);

export type Consent = "granted" | "denied";
const KEY = "hs-cookie-consent-v1";
export const OPEN_SETTINGS_EVENT = "hs:open-cookie-settings";

export function readConsent(): Consent | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function saveConsent(v: Consent) {
  try {
    localStorage.setItem(KEY, v);
  } catch {
    /* private mode — consent applies to this page view only */
  }
}

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

let loaded = false;

export function loadAnalytics() {
  if (!analyticsEnabled || loaded || typeof window === "undefined") return;
  loaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js expects the `arguments` object itself
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA4_ID);
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`;
  document.head.appendChild(s);
}

/** Removes GA cookies on this domain after consent is withdrawn (GA stops on next page load). */
export function clearAnalyticsCookies() {
  const host = location.hostname.replace(/^www\./, "");
  for (const c of document.cookie.split(";")) {
    const name = c.split("=")[0].trim();
    if (name === "_ga" || name.startsWith("_ga_")) {
      for (const domain of ["", `; domain=.${host}`, `; domain=${host}`]) {
        document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
      }
    }
  }
}
