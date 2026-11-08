"use client";

import { useLivePosts } from "@/lib/live";
import type { PostSummary } from "@/lib/live-types";
import { PostCards } from "@/components/PostCards";
import { Section, SectionHeader } from "@/components/ui/Section";

/** Latest published Insights (optionally by tag): build-time fallback + live refresh. Renders nothing if empty. */
export function LatestInsights({
  initial,
  limit = 3,
  tag,
  eyebrow = "Insights",
  title,
  tone = "white",
  action,
}: {
  initial: PostSummary[];
  limit?: number;
  tag?: string;
  eyebrow?: string;
  title: string;
  tone?: "white" | "mist";
  action?: React.ReactNode;
}) {
  const posts = useLivePosts(initial, limit, tag);
  if (!posts.length) return null;
  return (
    <Section tone={tone}>
      <SectionHeader eyebrow={eyebrow} title={title} action={action} />
      <PostCards posts={posts} />
    </Section>
  );
}
