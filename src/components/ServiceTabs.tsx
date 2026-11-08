"use client";

import { useRef, useState } from "react";
import { Building2, Home } from "lucide-react";
import { cn } from "@/lib/cn";

type Tab = { key: string; label: string; panel: React.ReactNode };

/**
 * Accessible tabs (WAI-ARIA pattern, arrow-key navigation).
 * Panels are server-rendered and passed in, so all service links are in the static HTML.
 */
export function ServiceTabs({ domestic, commercial }: { domestic: React.ReactNode; commercial: React.ReactNode }) {
  const tabs: Tab[] = [
    { key: "domestic", label: "Domestic", panel: domestic },
    { key: "commercial", label: "Commercial", panel: commercial },
  ];
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = (i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Service type" className="mb-8 inline-flex rounded-xl bg-mist p-1.5 ring-1 ring-line">
        {tabs.map((t, i) => {
          const Icon = t.key === "domestic" ? Home : Building2;
          const selected = i === active;
          return (
            <button
              key={t.key}
              ref={(el) => {
                refs.current[i] = el;
              }}
              role="tab"
              type="button"
              id={`tab-${t.key}`}
              aria-selected={selected}
              aria-controls={`panel-${t.key}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn(
                "inline-flex h-11 items-center gap-2 rounded-lg px-5 font-display text-[0.9375rem] font-bold transition-colors",
                selected ? "bg-navy-900 text-white shadow-sm" : "text-navy-900 hover:bg-white",
              )}
            >
              <Icon className="size-4" aria-hidden />
              {t.label}
            </button>
          );
        })}
      </div>
      {tabs.map((t, i) => (
        <div key={t.key} role="tabpanel" id={`panel-${t.key}`} aria-labelledby={`tab-${t.key}`} hidden={i !== active}>
          {t.panel}
        </div>
      ))}
    </div>
  );
}
