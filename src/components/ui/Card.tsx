import Link from "@/components/ui/SiteLink";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-card)]", className)}>
      {children}
    </div>
  );
}

/** Clickable service card — whole card is the link target. */
export function ServiceCard({
  href,
  title,
  description,
  icon,
  tag,
}: {
  href: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  tag?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-card)] transition-[box-shadow,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="mb-5 flex items-start justify-between">
        {icon && (
          <span className="grid size-12 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-navy-900 group-hover:text-white">
            {icon}
          </span>
        )}
        {tag && (
          <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-muted">{tag}</span>
        )}
      </div>
      <h3 className="text-h3 mb-2">{title}</h3>
      <p className="mb-5 text-[0.9688rem] text-muted">{description}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 font-display text-sm font-bold text-brand-600">
        View service
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
      </span>
    </Link>
  );
}
