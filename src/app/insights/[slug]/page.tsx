import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarCheck, Clock, List, Phone } from "lucide-react";
import { business, telHref } from "@/data/business";
import { imagePath, postImage } from "@/data/media";
import { getService, serviceHref } from "@/data/services";
import { formatDate, getAllPosts, getPost, postHref } from "@/lib/blog";
import { absoluteUrl, pageMeta } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { PostCards } from "@/components/PostCards";
import { ServiceIcon } from "@/components/ServiceIcon";
import { CtaBand } from "@/components/CtaBand";
import SiteLink from "@/components/ui/SiteLink";
import type { WithContext, BlogPosting } from "schema-dts";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const img = postImage(post.slug);
  return pageMeta({
    title: post.seoTitle,
    description: post.description,
    path: postHref(post.slug),
    image: img ? { url: imagePath(img.name, 1200), alt: img.alt } : undefined,
    article: { publishedTime: post.date, modifiedTime: post.updated ?? post.date },
  });
}

function withHeadingIds(html: string): { html: string; toc: { id: string; text: string }[] } {
  const toc: { id: string; text: string }[] = [];
  const used = new Set<string>();
  const next = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_match, inner: string) => {
    const text = inner
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
    let id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
    const base = id;
    for (let n = 2; used.has(id); n += 1) id = `${base}-${n}`;
    used.add(id);
    toc.push({ id, text });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { html: next, toc };
}

export default async function InsightPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { html, toc } = withHeadingIds(post.html);
  const img = postImage(post.slug);
  const service = post.service ? getService(post.service) : undefined;
  const bookHref = service ? `/book/?service=${encodeURIComponent(service.slug)}` : "/book/";
  const url = absoluteUrl(postHref(post.slug));
  const related = getAllPosts()
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);
  const share = [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(`${post.title} ${url}`)}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { label: "X", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` },
    { label: "Email", href: `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(url)}` },
  ];
  const schema: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: url,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: "en-GB",
    author: { "@type": "Organization", name: business.name },
    publisher: { "@type": "Organization", name: business.name },
  };

  return (
    <>
      <JsonLd data={schema} />
      <PageHero
        crumbs={[{ label: "Insights", href: "/insights/" }, { label: post.title }]}
        eyebrow="Guide"
        title={post.title}
        intro={post.description}
      >
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-base text-white/80">
          <span>
            By {business.name} · <time dateTime={post.date}>{formatDate(post.date)}</time>
          </span>
          {post.updated && post.updated > post.date && (
            <span>
              Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time>
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock className="size-4" aria-hidden /> {post.readingMinutes} min read
          </span>
        </p>
      </PageHero>

      <Container className="grid gap-10 py-10 sm:py-14 lg:grid-cols-12 lg:gap-12 lg:py-16">
        <article className="min-w-0 lg:col-span-8">
          {img && (
            <div className="mb-8 aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] bg-mist">
              <SmartImage src={imagePath(img.name, 1200)} alt={img.alt} sizes="(min-width: 1024px) 66vw, 100vw" priority />
            </div>
          )}

          {toc.length >= 2 && (
            <details className="group mb-8 rounded-[var(--radius-card)] border border-line bg-mist lg:hidden">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-5 font-display font-bold text-ink [&::-webkit-details-marker]:hidden">
                <span className="inline-flex items-center gap-2">
                  <List className="size-5 text-brand-600" aria-hidden /> On this page
                </span>
              </summary>
              <ol className="space-y-0.5 px-5 pb-4">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="flex min-h-11 items-center border-l-2 border-line py-1.5 pl-3 text-[0.9375rem] text-body hover:border-brand-500 hover:text-brand-600">
                      {item.text}
                    </a>
                  </li>
                ))}
              </ol>
            </details>
          )}

          <div
            className="max-w-3xl text-[1.0625rem] [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:scroll-mt-28 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-ink [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-ink [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6 [&_li]:marker:text-brand-600 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-6 [&_ol_li]:marker:font-bold [&_a]:font-semibold [&_a]:text-brand-600 [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-ink [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-accent-600 [&_blockquote]:bg-mist [&_blockquote]:px-5 [&_blockquote]:py-3 [&_blockquote]:text-ink"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <div className="mt-10 border-t border-line pt-6">
            <p className="font-display font-bold text-ink">Share this guide</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {share.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-white px-3.5 text-sm font-semibold text-navy-900 hover:border-brand-500 hover:text-brand-600"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-10 rounded-lg bg-mist p-4 text-base text-muted">
            This guide is general advice. If you’re ever unsure, or an appliance is sparking, smoking, leaking or smells of gas, stop using it and call a professional. For a suspected gas leak, call the National Gas Emergency Service on 0800 111 999.
          </p>
        </article>

        <aside className="lg:col-span-4">
          <div className="space-y-5 lg:sticky lg:top-28">
            {toc.length >= 2 && (
              <nav aria-label="On this page" className="hidden rounded-[var(--radius-card)] border border-line bg-white p-6 lg:block">
                <p className="mb-3 flex items-center gap-2 font-display font-bold text-ink">
                  <List className="size-5 text-brand-600" aria-hidden /> On this page
                </p>
                <ol className="space-y-0.5">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className="flex items-center border-l-2 border-line py-1.5 pl-3 text-[0.9375rem] text-body hover:border-brand-500 hover:text-brand-600">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            <div className="rounded-[var(--radius-card)] bg-navy-900 bg-blueprint p-6 text-white">
              <ServiceIcon slug={service?.slug} className="size-8 text-accent-400" />
              <p className="mt-3 font-display text-xl font-extrabold">Need a repair?</p>
              <p className="mt-2 text-white/80">
                {service?.shortDescription ?? `Our engineers repair domestic appliances and commercial refrigeration across ${business.serviceAreaSummary}.`}
              </p>
              <div className="mt-5 space-y-2.5">
                <Button href={bookHref} className="w-full">
                  <CalendarCheck className="size-5" aria-hidden /> Book a repair
                </Button>
                <Button href={telHref} variant="outline-light" className="w-full">
                  <Phone className="size-5" aria-hidden /> {business.phone.display}
                </Button>
                {service && (
                  <SiteLink href={serviceHref(service.slug)} className="flex min-h-11 items-center justify-center gap-1 text-sm font-semibold text-white/85 hover:text-white">
                    About our {service.name.toLowerCase()} <ArrowRight className="size-4" aria-hidden />
                  </SiteLink>
                )}
              </div>
            </div>
          </div>
        </aside>
      </Container>

      {related.length > 0 && (
        <Section tone="mist">
          <SectionHeader eyebrow="More insights" title="Related guides" />
          <PostCards
            posts={related.map((item) => {
              const photo = postImage(item.slug);
              return {
                slug: item.slug,
                title: item.title,
                excerpt: item.description,
                featured_image: photo ? imagePath(photo.name, 800) : null,
                image_alt: photo?.alt ?? null,
                category: "Guides",
                published_at: `${item.date}T09:00:00Z`,
                url: postHref(item.slug),
              };
            })}
          />
        </Section>
      )}

      <CtaBand title="Need a repair?" text="Call us or book online — tell us the make, model and what it's doing." bookHref={bookHref} />
    </>
  );
}
