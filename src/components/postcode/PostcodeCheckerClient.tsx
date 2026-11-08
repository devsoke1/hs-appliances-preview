"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ArrowRight, CircleCheck, MapPin, Phone, Search } from "lucide-react";
import { checkPostcode, type AreaIndexEntry, type PostcodeResult } from "@/data/areas";
import { cn } from "@/lib/cn";
import { buttonClasses } from "@/components/ui/Button";

export function PostcodeCheckerClient({
  index,
  phoneDisplay,
  telHref,
  tone = "dark",
  className,
}: {
  index: AreaIndexEntry[];
  phoneDisplay: string;
  telHref: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  const id = useId();
  const [value, setValue] = useState("");
  const [result, setResult] = useState<PostcodeResult | null>(null);
  const dark = tone === "dark";

  return (
    <div className={cn("rounded-[var(--radius-card)] p-5 sm:p-6", dark ? "bg-white/[0.07] ring-1 ring-white/15" : "border border-line bg-white shadow-[var(--shadow-card)]", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setResult(checkPostcode(value, index));
        }}
        noValidate
      >
        <label htmlFor={id} className={cn("mb-2 flex items-center gap-2 font-display font-bold", dark ? "text-white" : "text-ink")}>
          <MapPin className={cn("size-4", dark ? "text-accent-400" : "text-brand-600")} aria-hidden />
          Do we cover your area?
        </label>
        <div className="flex gap-2">
          <input
            id={id}
            type="text"
            inputMode="text"
            autoComplete="postal-code"
            placeholder="Enter your postcode, e.g. TW13 6AD"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (result) setResult(null);
            }}
            className="h-12 min-w-0 flex-1 rounded-lg border border-line bg-white px-4 text-ink uppercase placeholder:normal-case placeholder:text-muted focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
          <button type="submit" className={buttonClasses(dark ? "primary" : "secondary", "md", "shrink-0 px-4")}>
            <Search className="size-4" aria-hidden />
            <span className="hidden sm:inline">Check</span>
            <span className="sr-only sm:hidden">Check postcode</span>
          </button>
        </div>
      </form>

      <div aria-live="polite" className="empty:hidden">
        {result?.status === "covered" && (
          <div className={cn("mt-4 rounded-lg p-4", dark ? "bg-emerald-400/15 text-white" : "bg-emerald-50 text-ink")}>
            <p className="flex items-start gap-2 font-semibold">
              <CircleCheck className={cn("mt-0.5 size-5 shrink-0", dark ? "text-emerald-300" : "text-emerald-600")} aria-hidden />
              <span>
                Yes, we cover {result.outward}
                {result.area ? ` (${result.area.name})` : ""}.
              </span>
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 pl-7">
              <Link href={`/book/?postcode=${encodeURIComponent(value.trim().toUpperCase())}`} className={buttonClasses("primary", "sm")}>
                Book now <ArrowRight className="size-4" aria-hidden />
              </Link>
              {result.area && (
                <Link href={`/areas/${result.area.slug}/`} className={cn("text-sm font-semibold underline-offset-4 hover:underline", dark ? "text-white/80" : "text-brand-600")}>
                  About {result.area.name}
                </Link>
              )}
            </div>
          </div>
        )}
        {result?.status === "not-covered" && (
          <div className={cn("mt-4 rounded-lg p-4", dark ? "bg-white/10 text-white" : "bg-mist text-ink")}>
            <p className="font-semibold">{result.outward} isn&rsquo;t on our standard list — call us to check.</p>
            <p className={cn("mt-1 text-sm", dark ? "text-white/70" : "text-muted")}>We may still be able to help, depending on the job.</p>
            <a href={telHref} className={buttonClasses(dark ? "outline-light" : "outline", "sm", "mt-3")}>
              <Phone className="size-4" aria-hidden /> {phoneDisplay}
            </a>
          </div>
        )}
        {result?.status === "invalid" && (
          <p className={cn("mt-3 text-sm font-semibold", dark ? "text-accent-400" : "text-accent-700")}>
            Please enter a valid UK postcode, e.g. TW13 6AD.
          </p>
        )}
      </div>
    </div>
  );
}
