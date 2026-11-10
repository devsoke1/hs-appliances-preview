import Link from "@/components/ui/SiteLink";
import { AirVent, ArrowRight, Refrigerator, WashingMachine, type LucideIcon } from "lucide-react";
import { categoryNav } from "@/lib/nav";

const copy: Record<string, { Icon: LucideIcon; text: string }> = {
  domestic: { Icon: WashingMachine, text: "Washing machines, fridge freezers, ovens, hobs, dishwashers and microwaves — repaired at home." },
  commercial: { Icon: Refrigerator, text: "Cold rooms, display fridges, dairy cabinets, bar and cellar coolers and ice machines." },
  ac: { Icon: AirVent, text: "Cooling and heating in one: free quotations, installation, servicing and repair." },
};

/** Domestic / Commercial / Air Conditioning — the three ways into the site, each with its own booking form. */
export function CategoryCards() {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {categoryNav.map((c) => {
        const { Icon, text } = copy[c.key];
        return (
          <li key={c.key} className="flex flex-col rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-[var(--shadow-card)] sm:p-6">
            <span className="grid size-12 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <Icon className="size-6" aria-hidden />
            </span>
            <h3 className="mt-4 font-display text-xl font-extrabold text-ink">{c.label}</h3>
            <p className="mt-2 flex-1 text-base text-muted">{text}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href={`${c.href}#book`}
                className="inline-flex min-h-11 items-center rounded-lg bg-accent-600 px-4 font-display text-[0.9375rem] font-bold text-white transition-colors hover:bg-accent-700"
              >
                Book Now<span className="sr-only">: {c.label}</span>
              </Link>
              <Link
                href={c.href}
                className="inline-flex min-h-11 items-center gap-1 rounded-lg border border-line px-4 font-display text-[0.9375rem] font-bold text-navy-900 transition-colors hover:border-brand-500 hover:text-brand-600"
              >
                Explore<span className="sr-only"> {c.label}</span> <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
