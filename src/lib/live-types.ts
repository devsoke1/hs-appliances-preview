/** Shapes returned by the PHP JSON API (public/api/*.php). Shared by build-time and client code. */

export type ServiceSummary = {
  slug: string;
  name: string;
  menu_label: string;
  category: "domestic" | "commercial";
  short_description: string;
  image: string | null;
  image_alt: string | null;
  icon: string | null;
  is_featured: boolean;
  sort_order: number;
  url: string;
};

export type ServicesPayload = { services: ServiceSummary[]; homepageLimit: number };

export type ReviewItem = {
  id: number;
  customer_name: string;
  location: string | null;
  rating: number;
  review_text: string;
  source: string;
  review_date: string | null;
  service: { slug: string; name: string; url: string } | null;
};

export type ReviewSummary = {
  google_rating: number | null;
  google_review_count: number | null;
  google_reviews_url: string | null;
};

export type ReviewsPayload = { reviews: ReviewItem[]; summary: ReviewSummary };

export type PostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  featured_image: string | null;
  image_alt: string | null;
  category: string;
  published_at: string | null;
  url: string;
};

/** Homepage rule: featured first, then sort order — limited per category tab. */
export function homepagePick(services: ServiceSummary[], category: ServiceSummary["category"], limit: number): ServiceSummary[] {
  return services
    .filter((s) => s.category === category)
    .sort((a, b) => Number(b.is_featured) - Number(a.is_featured) || a.sort_order - b.sort_order || a.name.localeCompare(b.name))
    .slice(0, limit);
}
