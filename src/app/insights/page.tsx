import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { staticPageSeo } from "@/data/seo";
import { imagePath, postImage } from "@/data/media";
import { formatDate, getAllPosts, postHref } from "@/lib/blog";
import { pageMeta } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { SmartImage } from "@/components/ui/SmartImage";
import { PostCards } from "@/components/PostCards";
import { CtaBand } from "@/components/CtaBand";
import SiteLink from "@/components/ui/SiteLink";

export const metadata: Metadata = pageMeta({ ...staticPageSeo.insights, path: "/insights/" });

export default function InsightsPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;
  const featuredImage = featured ? postImage(featured.slug) : null;

  return (
    <>
      <PageHero
        crumbs={[{ label: "Insights" }]}
        eyebrow="Insights & guides"
        title="Appliance repair insights from our engineers"
        intro="Practical guides to common faults — what you can safely check yourself, and when it's time to call an engineer."
      />

      <section className="py-12 sm:py-16 lg:py-20">
        <Container>
          {featured ? (
            <SiteLink
              href={postHref(featured.slug)}
              className="group mb-10 grid overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)] transition-[box-shadow,border-color] hover:border-brand-200 hover:shadow-[var(--shadow-lift)] lg:mb-14 lg:grid-cols-12"
            >
              <div className="aspect-[16/9] overflow-hidden bg-mist lg:col-span-7 lg:aspect-auto lg:min-h-80">
                {featuredImage ? (
                  <SmartImage
                    src={imagePath(featuredImage.name, 1200)}
                    alt={featuredImage.alt}
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="h-full bg-navy-900 bg-blueprint" />
                )}
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-8 lg:col-span-5 lg:p-10">
                <p className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
                  <span className="rounded-full bg-accent-50 px-2.5 py-0.5 text-xs font-bold tracking-wide text-accent-700 uppercase">Latest</span>
                  <span className="font-semibold text-brand-600">Guides</span>
                  <span aria-hidden>·</span>
                  <time dateTime={featured.date}>{formatDate(featured.date)}</time>
                </p>
                <h2 className="mt-3 font-display text-2xl leading-tight font-extrabold text-ink group-hover:text-brand-600 sm:text-3xl">{featured.title}</h2>
                <p className="mt-3 text-base text-muted sm:text-lg">{featured.description}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 font-display font-bold text-brand-600">
                  Read the guide <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </div>
            </SiteLink>
          ) : (
            <p className="text-lead text-muted">
              New guides are on the way. In the meantime,{" "}
              <a className="font-semibold text-brand-600 underline" href="/contact/">
                ask us your question
              </a>
              .
            </p>
          )}

          {rest.length > 0 && (
            <PostCards
              headingLevel={2}
              posts={rest.map((post) => {
                const photo = postImage(post.slug);
                return {
                  slug: post.slug,
                  title: post.title,
                  excerpt: post.description,
                  featured_image: photo ? imagePath(photo.name, 800) : null,
                  image_alt: photo?.alt ?? null,
                  category: "Guides",
                  published_at: `${post.date}T09:00:00Z`,
                  url: postHref(post.slug),
                };
              })}
            />
          )}
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
