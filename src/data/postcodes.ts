import type { Area } from "./types";

/* Kept separate from areas.ts so the client-side postcode checker does not ship every area page's copy. */

/* ─────────────────────────── Postcode coverage ───────────────────────────
 * Edit this list to change what the postcode checker accepts.
 *  - A full district ("TW13") matches only that district.
 *  - A bare area prefix ("UB", "W", "KT") matches every district in that area.
 *    Note: "W" matches W1–W14 (incl. central London W1) but NOT "WC"/"WD".
 * TW6 (Heathrow), TW9 and TW10 (Richmond) were added because they have area pages.
 */
export const coveredPostcodes: string[] = [
  "TW1", "TW2", "TW3", "TW4", "TW5", "TW6", "TW7", "TW9", "TW10",
  "TW13", "TW14", "TW15", "TW16", "TW17", "TW18", "TW19",
  "UB", "W", "KT",
];

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

export function checkPostcode(input: string, index: AreaIndexEntry[] = []): PostcodeResult {
  const outward = outwardCode(input);
  if (!outward) return { status: "invalid" };
  const prefix = outward.match(/^[A-Z]+/)![0];
  const covered = coveredPostcodes.some((c) => c === outward || c === prefix);
  if (!covered) return { status: "not-covered", outward };
  return { status: "covered", outward, area: index.find((a) => a.postcodes.includes(outward)) };
}
