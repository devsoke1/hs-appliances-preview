/**
 * Optional Google reCAPTCHA v3. Enabled only when NEXT_PUBLIC_RECAPTCHA_SITE_KEY is set at build time
 * (and the matching secret is set in the server's config.php). The script loads lazily on first form focus.
 */
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";
export const recaptchaEnabled = SITE_KEY !== "";

type Grecaptcha = {
  ready(cb: () => void): void;
  execute(siteKey: string, opts: { action: string }): Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

let loader: Promise<void> | null = null;

export function loadRecaptcha(): Promise<void> {
  if (!recaptchaEnabled || typeof window === "undefined") return Promise.resolve();
  if (!loader) {
    loader = new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(SITE_KEY)}`;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => {
        loader = null;
        reject(new Error("reCAPTCHA failed to load"));
      };
      document.head.appendChild(s);
    });
  }
  return loader;
}

/** Returns a token, or "" when reCAPTCHA is disabled. Throws if it's enabled but unavailable. */
export async function getRecaptchaToken(action: string): Promise<string> {
  if (!recaptchaEnabled) return "";
  await loadRecaptcha();
  const g = window.grecaptcha;
  if (!g) throw new Error("reCAPTCHA unavailable");
  return new Promise<string>((resolve, reject) => {
    g.ready(() => {
      g.execute(SITE_KEY, { action }).then(resolve, reject);
    });
  });
}
