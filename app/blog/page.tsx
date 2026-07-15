import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import PageHeader from "@/components/PageHeader";
import BlogExplorer from "@/components/BlogExplorer";
import CtaBand from "@/components/CtaBand";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Digital marketing articles on SEO, PPC, social media, analytics and strategy — tactical playbooks from Sushmita Kc.",
  openGraph: { title: "Blog | Sushmita Kc", description: "Tactical digital marketing playbooks." },
};

export default async function BlogPage() {
  const content = await getContent();
  const posts = Array.isArray(content.blog) ? content.blog : [];

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Ideas worth acting on"
        description="No-fluff breakdowns of the tactics, frameworks and experiments that move metrics."
      />
      <section className="section">
        <div className="container-px mx-auto max-w-7xl">
          <BlogExplorer posts={posts} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
