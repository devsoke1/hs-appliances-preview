import { Plus } from "lucide-react";
import type { FAQ } from "@/data/types";
import { cn } from "@/lib/cn";
import { JsonLd } from "@/components/JsonLd";

/**
 * Native <details> accordion — works without JavaScript and is fully static.
 * Set `schema` on the single primary FAQ list of a page to emit FAQPage JSON-LD.
 */
export function FaqAccordion({ faqs, schema = false, className }: { faqs: FAQ[]; schema?: boolean; className?: string }) {
  return (
    <>
      <div className={cn("divide-y divide-line overflow-hidden rounded-[var(--radius-card)] border border-line bg-white", className)}>
        {faqs.map((f) => (
          <details key={f.question} className="group">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 font-display text-[1.0625rem] font-bold text-ink transition-colors hover:bg-mist sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
              {f.question}
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 transition-transform group-open:rotate-45">
                <Plus className="size-4" aria-hidden />
              </span>
            </summary>
            <p className="px-5 pb-5 text-body sm:px-6">{f.answer}</p>
          </details>
        ))}
      </div>
      {schema && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }}
        />
      )}
    </>
  );
}
