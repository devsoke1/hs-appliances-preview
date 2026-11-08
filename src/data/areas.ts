import type { Area } from "./types";

/**
 * Service areas — each becomes /areas/{slug}/ in a later phase.
 * TODO: populate with the real list. Example shape:
 *
 * {
 *   slug: "feltham",
 *   name: "Feltham",
 *   borough: "London Borough of Hounslow",
 *   postcodes: ["TW13", "TW14"],
 *   intro: "Unique paragraph about working in Feltham…",
 *   nearby: ["hounslow", "hanworth", "bedfont"],
 * }
 */
export const areas: Area[] = [];

export const getArea = (slug: string) => areas.find((a) => a.slug === slug);

/** Areas shown in the footer / nav (first N) */
export const featuredAreas = (limit = 8) => areas.slice(0, limit);
