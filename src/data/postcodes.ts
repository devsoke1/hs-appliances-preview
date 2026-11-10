import type { Area } from "./types";
import coverage from "./coverage.json";

/* Kept separate from areas.ts so the client-side postcode checker does not ship every area page's copy. */

/* ─────────────────────────── Postcode coverage ───────────────────────────
 * Edit src/data/coverage.json — it is shared with the PHP booking API, so the form and the
 * server always agree.
 *  - "districts": exact outward codes ("TW13" matches TW13 only, never TW1).
 *  - "areas": whole postcode areas by their letters ("SW" matches SW1–SW20, but "W" does NOT match "WC").
 * Domestic bookings use the domestic list; air conditioning has its own wider list; commercial has none.
 */
export type CoverageKind = "domestic" | "ac" | "commercial";
type CoverageList = { label: string; districts: string[]; areas: string[] } | null;
const lists = coverage as unknown as Record<CoverageKind, CoverageList>;

/** Domestic districts — shown on the areas page and used by the "Do we cover you?" checker. */
export const coveredPostcodes: string[] = lists.domestic?.districts ?? [];
export const acCoverageText: string = (coverage.ac as { description?: string }).description ?? "";

/** Minimal area info for the client-side checker (keeps page copy out of the JS bundle). */
export type AreaIndexEntry = Pick<Area, "slug" | "name" | "postcodes">;

export type PostcodeResult =
  | { status: "covered"; outward: string; area?: AreaIndexEntry }
  | { status: "not-covered"; outward: string }
  | { status: "invalid" };

/** Extracts the outward code ("TW13") from "tw13 6ad", "TW136AD" or "TW13". */
export function outwardCode(input: string): string | null {
  const pc = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!pc) return null;
  // Full postcode: inward part is always digit + 2 letters
  const outward = /^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/.test(pc) ? pc.slice(0, -3) : pc;
  return /^[A-Z]{1,2}\d[A-Z\d]?$/.test(outward) ? outward : null;
}

/** True when the outward code is covered for this kind of booking (commercial: everywhere). */
export function isCovered(outward: string, kind: CoverageKind): boolean {
  const list = lists[kind];
  if (!list) return true;
  const area = outward.match(/^[A-Z]+/)?.[0] ?? "";
  return list.districts.includes(outward) || list.areas.includes(area);
}

export function checkPostcode(input: string, index: AreaIndexEntry[] = [], kind: CoverageKind = "domestic"): PostcodeResult {
  const outward = outwardCode(input);
  if (!outward) return { status: "invalid" };
  if (!isCovered(outward, kind)) return { status: "not-covered", outward };
  return { status: "covered", outward, area: index.find((a) => a.postcodes.includes(outward)) };
}

/** "TW1–TW20, SL0–SL9, …, SW13–SW15, W3–W7" — readable summary of the domestic districts (ranges collapsed). */
export function districtSummary(districts: string[] = coveredPostcodes): string {
  const byArea = new Map<string, number[]>();
  for (const d of districts) {
    const m = d.match(/^([A-Z]+)(\d+)$/);
    if (!m) continue;
    byArea.set(m[1], [...(byArea.get(m[1]) ?? []), Number(m[2])]);
  }
  const parts: string[] = [];
  for (const [area, nums] of byArea) {
    const sorted = [...new Set(nums)].sort((a, b) => a - b);
    for (let i = 0; i < sorted.length; i++) {
      let j = i;
      while (j + 1 < sorted.length && sorted[j + 1] === sorted[j] + 1) j++;
      parts.push(j > i ? `${area}${sorted[i]}–${area}${sorted[j]}` : `${area}${sorted[i]}`);
      i = j;
    }
  }
  return parts.join(", ");
}
