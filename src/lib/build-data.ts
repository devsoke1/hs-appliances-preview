/**
 * BUILD-TIME data for the static (Next.js) pages. This is the fallback baked into the HTML, so sections
 * are never empty and crawlers always see the links. The browser then refreshes from the live API.
 *
 * Source order: the live PHP API (if reachable during the build) → the project's own data files.
 * Set HS_BUILD_API_BASE="" to always use the project data (e.g. offline builds).
 */
import { services as tsServices, serviceHref } from "@/data/services";
import { imagePath, postImage, serviceImage } from "@/data/media";
import { getAllPosts, postHref } from "@/lib/blog";
import type { PostSummary, ReviewsPayload, ServicesPayload, ServiceSummary } from "./live-types";

const API_BASE = process.env.HS_BUILD_API_BASE ?? "https://hsappliances.co.uk";

const ICONS: Record<string, string> = {
  "washing-machine-repair": "WashingMachine", "fridge-freezer-repair": "Refrigerator", "american-fridge-repair": "Container",
  "dishwasher-repair": "UtensilsCrossed", "electric-cooker-repair": "CookingPot", "electric-hob-repair": "Zap",
  "gas-cooker-repair": "Flame", "gas-hob-repair": "Flame", "microwave-repair": "Microwave", "air-conditioning-repair": "AirVent",
  "cold-room-repair": "Warehouse", "dairy-cabinet-repair": "Milk", "display-fridge-repair": "Store", "bar-cooler-repair": "Beer",
  "cellar-cooler-repair": "Thermometer", "ice-machine-repair": "Snowflake",
};
const FEATURED = new Set(["washing-machine-repair", "fridge-freezer-repair", "american-fridge-repair", "dishwasher-repair", "electric-cooker-repair", "cold-room-repair", "display-fridge-repair", "ice-machine-repair"]);

async function api<T>(path: string): Promise<T | null> {
  if (!API_BASE) return null;
  try {
    const res = await fetch(API_BASE + path, { signal: AbortSignal.timeout(3500), headers: { Accept: "application/json" } });
    if (!res.ok || !(res.headers.get("content-type") ?? "").includes("json")) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function fallbackServices(): ServiceSummary[] {
  return tsServices.map((s, i) => {
    const img = serviceImage(s.slug);
    return {
      slug: s.slug,
      name: s.title,
      menu_label: s.name,
      category: s.category,
      short_description: s.shortDescription,
      image: img ? imagePath(img.name, 800) : null,
      image_alt: img?.alt ?? null,
      icon: ICONS[s.slug] ?? "Wrench",
      is_featured: FEATURED.has(s.slug),
      sort_order: (i + 1) * 10,
      url: serviceHref(s.slug),
    };
  });
}

let servicesPromise: Promise<ServicesPayload> | null = null;
export function buildServices(): Promise<ServicesPayload> {
  servicesPromise ??= api<{ services: ServiceSummary[]; homepage_services_limit?: number }>("/api/services.php").then((j) =>
    j?.services?.length ? { services: j.services, homepageLimit: j.homepage_services_limit ?? 8 } : { services: fallbackServices(), homepageLimit: 8 },
  );
  return servicesPromise;
}

let reviewsPromise: Promise<ReviewsPayload> | null = null;
export function buildReviews(): Promise<ReviewsPayload> {
  reviewsPromise ??= api<ReviewsPayload>("/api/reviews.php").then(
    (j) => j ?? { reviews: [], summary: { google_rating: null, google_review_count: null, google_reviews_url: null } },
  );
  return reviewsPromise;
}

export async function buildPosts(limit = 3, tag?: string): Promise<PostSummary[]> {
  const q = new URLSearchParams({ per_page: String(limit), ...(tag ? { tag } : {}) });
  const j = await api<{ posts: PostSummary[] }>(`/api/posts.php?${q}`);
  if (j?.posts) return j.posts;
  return getAllPosts()
    .filter((p) => !tag || p.areas.some((a) => a.toLowerCase() === tag.toLowerCase()))
    .slice(0, limit)
    .map((p) => {
      const img = postImage(p.slug);
      return {
        slug: p.slug,
        title: p.title,
        excerpt: p.description,
        featured_image: img ? imagePath(img.name, 800) : null,
        image_alt: img?.alt ?? null,
        category: "Guides",
        published_at: `${p.date}T09:00:00Z`,
        url: postHref(p.slug),
      };
    });
}
