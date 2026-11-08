import { cn } from "@/lib/cn";

/** Small uppercase label above headings, with an accent tick. */
export function Eyebrow({ children, tone = "light", className }: { children: React.ReactNode; tone?: "light" | "dark"; className?: string }) {
  return (
    <p
      className={cn(
        "mb-3 inline-flex items-center gap-2 font-display text-[0.8125rem] font-bold uppercase tracking-[0.12em]",
        tone === "dark" ? "text-brand-200" : "text-brand-600",
        className,
      )}
    >
      <span aria-hidden className="h-0.5 w-5 rounded-full bg-accent-500" />
      {children}
    </p>
  );
}
