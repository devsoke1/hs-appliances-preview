import Link from "next/link";
import { cn } from "@/lib/cn";
import { business } from "@/data/business";

/**
 * Interim wordmark. Replace the <svg> mark with the real logo file when available
 * (keep width ~40px on a square artboard).
 */
export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const light = tone === "light";
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)} aria-label={`${business.name} — home`}>
      <svg viewBox="0 0 40 40" className="size-10 shrink-0" aria-hidden>
        <rect width="40" height="40" rx="9" className={light ? "fill-white" : "fill-navy-900"} />
        <path d="M11 11v18M11 20h9M20 11v18" className={light ? "stroke-navy-900" : "stroke-white"} strokeWidth="3.2" strokeLinecap="round" fill="none" />
        <path d="M29.5 13.5c-1.6-1.4-4.6-1.3-5 .9-.5 2.6 5.6 2.6 5.6 6.4 0 3.2-4.3 3.9-6.4 1.9" className="stroke-accent-500" strokeWidth="3" strokeLinecap="round" fill="none" />
        <rect x="9.5" y="32" width="21" height="2.4" rx="1.2" className="fill-accent-500" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={cn("font-display text-[1.1875rem] font-extrabold tracking-tight", light ? "text-white" : "text-navy-900")}>
          HS Appliances
        </span>
        <span className={cn("mt-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em]", light ? "text-white/60" : "text-muted")}>
          House &amp; Shop
        </span>
      </span>
    </Link>
  );
}
