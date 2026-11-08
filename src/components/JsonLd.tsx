import type { Graph, Thing, WithContext } from "schema-dts";

/** Renders schema.org JSON-LD. `<` is escaped so content can't break out of the script tag. */
export function JsonLd({ data }: { data: WithContext<Thing> | Graph }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
