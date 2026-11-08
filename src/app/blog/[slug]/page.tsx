import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarCheck, Clock, MapPin, Phone } from "lucide-react";
import { business, telHref } from "@/data/business";
import { getService, serviceHref } from "@/data/services";
import { areaHref, getArea } from "@/data/areas";
import { formatDate, getAllPosts, getPost } from "@/lib/blog";
import { pageMeta } from "@/lib/seo";
import { blogPostingSchema } from "@/lib/schema";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { Prose } from "@/components/ui/Prose";
import { JsonLd } from "@/components/JsonLd";
import { PostCards } from "@/components/PostCards";
import { CtaBand } from "@/components/CtaBand";
import { ServiceIcon } from "@/components/ServiceIcon";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  return pageMeta({
    title: p.seoTitle,
    description: p.description,
    path: `/blog/${p.slug}/`,
    article: { publishedTime: p.date, modifiedTime: p.updated },
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const service = post.service ? getService(post.service) : undefined;
  const postAreas = post.areas.map(getArea).filter((a): a is NonNullable<typeof a> => Boolean(a));
  const related = getAllPosts().filter((p) => p.slug !== post.slug).slice(0, 3);
  const bookHref = service ? `/book/?service=${service.slug}` : "/book/";

  return (
    <>
      <PageHero crumbs={[{ label: "Advice", href: "/blog/" }, { label: post.title }]} eyebrow="Guide" title={post.title} intro={post.description}>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/75">
          <span>
            By {business.name} · <time dateTime={post.date}>{formatDate(post.date)}</time>
          </span>
          {post.updated && (
            <span>
              Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time>
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock className="size-4" aria-hidden /> {post.readingMinutes} min read
          </span>
        </p>
      </PageHero>

      <Container className="grid gap-12 py-14 sm:py-16 lg:grid-cols-12 lg:py-20">
        <article className="min-w-0 lg:col-span-8">
          {/* Trusted, build-time markdown from /content/blog */}
          <Prose className="text-[1.0625rem]">
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
          </Prose>
          <p className="mt-10 rounded-lg bg-mist p-4 text-sm text-muted">
            This guide is general advice. If you&rsquo;re ever unsure, or an appliance is sparking, smoking, leaking or smells of gas, stop using
            it and call a professional. For a suspected gas leak, call the National Gas Emergency Service on 0800 111 999.
          </p>
        </article>

        <aside className="lg:col-span-4">
          <div className="space-y-5 lg:sticky lg:top-28">
            {service && (
              <div className="rounded-[var(--radius-card)] bg-navy-900 bg-blueprint p-6 text-white">
                <ServiceIcon slug={service.slug} className="size-8 text-accent-400" />
                <p className="mt-3 font-display text-xl font-extrabold">Need a {service.name.toLowerCase()} repair?</p>
                <p className="mt-2 text-white/75">{service.shortDescription}</p>
                <div className="mt-5 space-y-2.5">
                  <Button href={bookHref} className="w-full">
                    <CalendarCheck className="size-5" aria-hidden /> Book a repair
                  </Button>
                  <Button href={telHref} variant="outline-light" className="w-full">
                    <Phone className="size-5" aria-hidden /> {business.phone.display}
                  </Button>
                  <Link href={serviceHref(service.slug)} className="flex items-center justify-center gap-1 pt-1 text-sm font-semibold text-white/85 hover:text-white">
                    About our {service.title.toLowerCase()} <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </div>
            )}
            {postAreas.length > 0 && (
              <div className="rounded-[var(--radius-card)] border border-line bg-white p-6">
                <p className="font-display font-bold text-ink">Local engineers covering</p>
                <ul className="mt-3 space-y-1.5">
                  {postAreas.map((a) => (
                    <li key={a.slug}>
                      <Link href={areaHref(a.slug)} className="inline-flex items-center gap-2 font-semibold text-brand-600 hover:underline">
                        <MapPin className="size-4" aria-hidden />
                        {service ? `${service.title} in ${a.name}` : `Appliance repair in ${a.name}`}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </Container>

      {related.length > 0 && (
        <Section tone="mist">
          <SectionHeader eyebrow="More advice" title="Related guides" />
          <PostCards posts={related} />
        </Section>
      )}

      <JsonLd data={blogPostingSchema({ ...post, serviceSlug: post.service })} />
      <CtaBand bookHref={bookHref} />
    </>
  );
}
