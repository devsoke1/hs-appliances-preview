"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Star } from "lucide-react";
import { useLiveReviews } from "@/lib/live";
import type { ReviewItem, ReviewsPayload } from "@/lib/live-types";
import { cn } from "@/lib/cn";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Reviews from the admin panel (real reviews only). Desktop: 3 per view; carousel if more than 3.
 * Mobile: one card + peek of the next, swipe, dots + arrows, autoplay that pauses on touch/hover/focus.
 * CSS scroll-snap does the heavy lifting — no slider library. Mirrored in public/assets/js/site.js.
 */
export function ReviewsSection({
  initial,
  fiveStarOnly = false,
  shuffle = false,
}: {
  initial: ReviewsPayload;
  /** Homepage: only 5-star reviews */
  fiveStarOnly?: boolean;
  /** Random order on every visit, so returning visitors rarely see the same review first */
  shuffle?: boolean;
}) {
  const [{ reviews: all, summary }, loaded] = useLiveReviews(initial);
  const filtered = useMemo(() => (fiveStarOnly ? all.filter((r) => r.rating === 5) : all), [all, fiveStarOnly]);
  const [order, setOrder] = useState<number[] | null>(null);
  useEffect(() => {
    if (!shuffle || !loaded) return;
    const idx = filtered.map((_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    setOrder(idx);
  }, [shuffle, loaded, filtered]);
  const reviews = order && order.length === filtered.length ? order.map((i) => filtered[i]) : filtered;
  if (loaded && !reviews.length && !summary.google_reviews_url) return null;

  return (
    <Section>
      <div className="mb-8 flex flex-col gap-5 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Eyebrow>Reviews</Eyebrow>
          <h2 className="text-h2">What our customers say</h2>
        </div>
        <RatingBadge summary={summary} />
      </div>
      {reviews.length ? (
        <ReviewSlider reviews={reviews} />
      ) : !loaded ? (
        <ReviewSkeleton />
      ) : (
        <p className="text-lead text-muted">Read what our customers say on Google.</p>
      )}
    </Section>
  );
}

function Stars({ n, className }: { n: number; className?: string }) {
  return (
    <span className={cn("flex gap-0.5", className)} role="img" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={cn("size-4", i < n ? "fill-[#e8a200] text-[#e8a200]" : "fill-line text-line")} aria-hidden />
      ))}
    </span>
  );
}

function RatingBadge({ summary }: { summary: ReviewsPayload["summary"] }) {
  if (!summary.google_rating && !summary.google_reviews_url) return null;
  return (
    <div className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-line bg-white p-4 sm:flex-row sm:items-center sm:gap-5">
      {summary.google_rating ? (
        <div className="flex items-center gap-3">
          <span className="font-display text-3xl font-extrabold text-ink">{summary.google_rating.toFixed(1)}</span>
          <span>
            <Stars n={Math.round(summary.google_rating)} />
            <span className="mt-0.5 block text-sm text-muted">
              {summary.google_review_count ? `${summary.google_review_count} Google reviews` : "Google rating"}
            </span>
          </span>
        </div>
      ) : null}
      {summary.google_reviews_url && (
        <a
          href={summary.google_reviews_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1.5 font-display text-[0.9375rem] font-bold text-brand-600 hover:underline"
        >
          See all reviews on Google <ExternalLink className="size-4" aria-hidden />
        </a>
      )}
    </div>
  );
}

function ReviewCard({ r, i, total }: { r: ReviewItem; i: number; total: number }) {
  const [open, setOpen] = useState(false);
  const long = r.review_text.length > 220;
  const date = r.review_date ? new Date(`${r.review_date}T12:00:00Z`).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : null;
  return (
    <article
      aria-roledescription="slide"
      aria-label={`Review ${i + 1} of ${total}`}
      data-slide
      className="flex shrink-0 basis-[85%] snap-start flex-col rounded-[var(--radius-card)] border border-line bg-white p-5 shadow-[var(--shadow-card)] sm:basis-[calc(50%-0.625rem)] sm:p-6 lg:basis-[calc((100%-2.5rem)/3)]"
    >
      <div className="flex items-center justify-between gap-3">
        <Stars n={r.rating} />
        {r.source === "Google" && (
          <span className="rounded-full border border-line bg-mist px-2.5 py-0.5 text-xs font-bold text-muted">Google review</span>
        )}
      </div>
      <p className={cn("mt-4 text-base whitespace-pre-line text-body", !open && "line-clamp-5")}>{r.review_text}</p>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-1 inline-flex min-h-11 items-center self-start font-display text-sm font-bold text-brand-600 hover:underline"
        >
          {open ? "Show less" : "Read more"}
        </button>
      )}
      <footer className="mt-auto border-t border-line pt-4">
        <p className="font-display font-bold text-ink">{r.customer_name}</p>
        <p className="text-sm text-muted">{[r.location, r.service?.name, date].filter(Boolean).join(" · ")}</p>
      </footer>
    </article>
  );
}

function ReviewSlider({ reviews }: { reviews: ReviewItem[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [pages, setPages] = useState(1);
  const paused = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const measure = useCallback(() => {
    const el = track.current;
    const first = el?.querySelector<HTMLElement>("[data-slide]");
    if (!el || !first) return;
    const step = first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
    const visible = Math.max(1, Math.round(el.clientWidth / step));
    setPages(el.scrollWidth > el.clientWidth + 4 ? reviews.length - visible + 1 : 1);
    setIndex(Math.min(reviews.length - 1, Math.round(el.scrollLeft / step)));
  }, [reviews.length]);

  const goTo = useCallback((i: number) => {
    const el = track.current;
    const slide = el?.querySelectorAll<HTMLElement>("[data-slide]")[i];
    if (!el || !slide) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: slide.offsetLeft - el.offsetLeft, behavior: reduce ? "auto" : "smooth" });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [measure]);

  // Autoplay (off for reduced motion); pauses on hover, focus and touch
  useEffect(() => {
    if (pages <= 1 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      if (!paused.current && document.visibilityState === "visible") goTo(index + 1 >= pages ? 0 : index + 1);
    }, 6000);
    return () => clearInterval(t);
  }, [index, pages, goTo]);

  const pause = () => {
    paused.current = true;
    clearTimeout(resumeTimer.current);
  };
  const resumeLater = (ms = 8000) => {
    clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => (paused.current = false), ms);
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer reviews"
      onMouseEnter={pause}
      onMouseLeave={() => resumeLater(1500)}
      onFocusCapture={pause}
      onBlurCapture={() => resumeLater()}
      onTouchStart={pause}
      onTouchEnd={() => resumeLater()}
    >
      <div
        ref={track}
        tabIndex={0}
        aria-label="Reviews — scroll or swipe for more"
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((r, i) => (
          <ReviewCard key={r.id} r={r} i={i} total={reviews.length} />
        ))}
      </div>
      {pages > 1 && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => goTo(Math.max(0, index - 1))}
            disabled={index === 0}
            aria-label="Previous review"
            className="grid size-11 place-items-center rounded-full border border-line bg-white text-navy-900 transition-colors hover:border-brand-500 disabled:opacity-40"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <div className="flex items-center">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to review ${i + 1}`}
                aria-current={i === Math.min(index, pages - 1) ? "true" : undefined}
                className="grid size-11 place-items-center"
              >
                <span className={cn("block h-2.5 rounded-full transition-all", i === Math.min(index, pages - 1) ? "w-6 bg-brand-600" : "w-2.5 bg-line")} />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => goTo(Math.min(pages - 1, index + 1))}
            disabled={index >= pages - 1}
            aria-label="Next review"
            className="grid size-11 place-items-center rounded-full border border-line bg-white text-navy-900 transition-colors hover:border-brand-500 disabled:opacity-40"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}

function ReviewSkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-3" aria-hidden>
      {[0, 1, 2].map((i) => (
        <div key={i} className={cn("animate-pulse rounded-[var(--radius-card)] border border-line bg-white p-6", i > 0 && "hidden md:block")}>
          <div className="h-4 w-24 rounded bg-line" />
          <div className="mt-5 space-y-2">
            <div className="h-3.5 rounded bg-mist" />
            <div className="h-3.5 rounded bg-mist" />
            <div className="h-3.5 w-4/5 rounded bg-mist" />
          </div>
          <div className="mt-6 h-4 w-32 rounded bg-line" />
        </div>
      ))}
      <span className="sr-only">Loading reviews…</span>
    </div>
  );
}
