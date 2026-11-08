"use client";

/**
 * Client-side refresh from the live PHP API. Each endpoint is fetched once per page view and shared
 * by every component (header menu, footer, homepage grid…). If the API is unreachable (e.g. `next dev`),
 * components simply keep their build-time fallback.
 */
import { useEffect, useState } from "react";
import type { PostSummary, ReviewsPayload, ServicesPayload, ServiceSummary } from "./live-types";

const cache = new Map<string, Promise<unknown>>();

function getJson<T>(url: string): Promise<T | null> {
  if (!cache.has(url)) {
    cache.set(
      url,
      fetch(url, { headers: { Accept: "application/json" } })
        .then((r) => (r.ok && (r.headers.get("content-type") ?? "").includes("json") ? r.json() : null))
        .catch(() => null),
    );
  }
  return cache.get(url) as Promise<T | null>;
}

export function useLiveServices(initial: ServicesPayload): ServicesPayload {
  const [data, setData] = useState(initial);
  useEffect(() => {
    let alive = true;
    getJson<{ services: ServiceSummary[]; homepage_services_limit?: number }>("/api/services.php").then((j) => {
      if (alive && j?.services?.length) setData({ services: j.services, homepageLimit: j.homepage_services_limit ?? initial.homepageLimit });
    });
    return () => {
      alive = false;
    };
  }, [initial.homepageLimit]);
  return data;
}

/** Returns [data, loaded]. `loaded` is false until the API answered (or failed). */
export function useLiveReviews(initial: ReviewsPayload): [ReviewsPayload, boolean] {
  const [data, setData] = useState(initial);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let alive = true;
    getJson<ReviewsPayload>("/api/reviews.php").then((j) => {
      if (!alive) return;
      if (j) setData(j);
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);
  return [data, loaded];
}

export function useLivePosts(initial: PostSummary[], limit: number, tag?: string): PostSummary[] {
  const [posts, setPosts] = useState(initial);
  useEffect(() => {
    let alive = true;
    const q = new URLSearchParams({ per_page: String(limit), ...(tag ? { tag } : {}) });
    getJson<{ posts: PostSummary[] }>(`/api/posts.php?${q}`).then((j) => {
      if (alive && j?.posts && (j.posts.length || !tag)) setPosts(j.posts);
    });
    return () => {
      alive = false;
    };
  }, [limit, tag]);
  return posts;
}
