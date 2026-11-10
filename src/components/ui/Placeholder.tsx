import { cn } from "@/lib/cn";

/**
 * Visible marker for content that needs REAL data before launch
 * (reviews, photos, accreditations). Search the codebase for "[ADD" / "[CONFIRM" to find them all.
 */
export function Placeholder({ label, className, tone = "light" }: { label: string; className?: string; tone?: "light" | "dark" }) {
  return (
    <div
      className={cn(
        "grid min-h-24 place-items-center rounded-[var(--radius-card)] border-2 border-dashed p-4 text-center font-mono text-xs font-semibold uppercase tracking-wide",
        tone === "dark" ? "border-white/25 text-white/60" : "border-accent-500/60 bg-accent-50/50 text-accent-700",
        className,
      )}
    >
      {label}
    </div>
  );
}
