import { staticPageSeo } from "@/data/seo";
import { getAllPosts } from "@/lib/blog";
import { pageMeta } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/ui/PageHero";
import { PostCards } from "@/components/PostCards";
import { CtaBand } from "@/components/CtaBand";

export const metadata = pageMeta({ ...staticPageSeo.blog, path: "/blog/" });

export default function BlogIndexPage() {
  const posts = getAllPosts();
  return (
    <>
      <PageHero
        crumbs={[{ label: "Advice" }]}
        eyebrow="Advice & guides"
        title="Appliance repair advice from our engineers"
        intro="Practical guides to common faults — what you can safely check yourself, and when it's time to call an engineer."
      />
      <Section>
        {posts.length ? <PostCards posts={posts} headingLevel={2} /> : <p className="text-lead text-muted">New guides coming soon.</p>}
      </Section>
      <CtaBand />
    </>
  );
}
