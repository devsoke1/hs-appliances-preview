import { cn } from "@/lib/cn";

/** Long-form text styling for legal and content pages. */
export function Prose({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        "[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-ink first:[&_h2]:mt-0",
        "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-ink",
        "[&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_li]:marker:text-brand-600",
        "[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-6 [&_ol_li]:marker:font-bold",
        "[&_a]:font-semibold [&_a]:text-brand-600 [&_a]:underline [&_a]:underline-offset-2",
        "[&_strong]:text-ink",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Inline placeholder marker for legal text that needs real details. */
export function Todo({ children }: { children: React.ReactNode }) {
  return <mark className="rounded bg-accent-50 px-1 font-mono text-[0.85em] font-semibold text-accent-700">{children}</mark>;
}
