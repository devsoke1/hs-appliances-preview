"use client";

import Link from "@/components/ui/SiteLink";
import { useLiveServices } from "@/lib/live";
import type { ServicesPayload } from "@/lib/live-types";

const linkClass = "inline-flex min-h-11 min-w-11 items-center transition-colors hover:text-white lg:min-h-0 lg:min-w-0";

/** Footer service columns: build-time list, refreshed from the live API (admin changes show up without a rebuild). */
export function FooterServiceLinks({ initial }: { initial: ServicesPayload }) {
  const { services } = useLiveServices(initial);
  return (
    <>
      {(["domestic", "commercial"] as const).map((cat) => (
        <div key={cat} className="lg:col-span-2">
          <p className="mb-2 font-display text-sm font-bold tracking-[0.12em] text-white uppercase lg:mb-4">{cat === "domestic" ? "Domestic" : "Commercial"}</p>
          <ul className="lg:space-y-2.5">
            {services
              .filter((s) => s.category === cat)
              .map((s) => (
                <li key={s.slug}>
                  <Link href={s.url} className={linkClass}>
                    {s.menu_label || s.name} Repair
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </>
  );
}
