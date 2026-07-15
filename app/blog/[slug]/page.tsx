import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getContent } from "@/lib/content";
import Icon from "@/components/ui/Icon";
import CtaBand from "@/components/CtaBand";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = await getContent();
  const post = (content.blog ?? []).find((p) => p.slug === slug);
  if (!post) return { title: "Article Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: [{ url: post.featuredImage }] },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await getContent();
  const post = (content.blog ?? []).find((p) => p.slug === slug);
  if (!post) notFound();

  const paragraphs = post.content.split(/\n\n+/).filter(Boolean);
  const related = (content.blog ?? [])
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <article>
        <header className="relative overflow-hidden border-b border-charcoal/10">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-purple/15 blur-[120px]" />
          </div>
          <div className="container-px mx-auto max-w-3xl py-14">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal/55 transition-colors hover:text-teal"
            >
              <Icon name="arrow-right" size={16} className="rotate-180" /> Back to blog
            </Link>
            <div className="mt-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-teal">
              {post.category}
            </div>
            <h1 className="mt-4 text-balance font-display text-4xl font-semibold leading-[1.1] sm:text-5xl">
              {post.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-charcoal/55">
              <span className="flex items-center gap-1.5">
                <Icon name="users" size={16} /> {post.author}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Icon name="calendar" size={16} /> {formatDate(post.publishedDate)}
              </span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </header>

        <div className="container-px mx-auto max-w-3xl py-12">
          <div className="relative mb-10 aspect-[16/8] overflow-hidden rounded-3xl border border-charcoal/10">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-6 text-lg leading-relaxed text-charcoal/75">
            {paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="section bg-cream-100">
          <div className="container-px mx-auto max-w-7xl">
            <h2 className="font-display text-3xl font-semibold">Keep reading</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-charcoal/10 bg-cream-50 transition-all duration-300 hover:-translate-y-1.5"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={p.featuredImage}
                      alt={p.title}
                      fill
                      sizes="33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-teal">
                      {p.category}
                    </span>
                    <h3 className="font-display text-lg font-semibold leading-snug group-hover:text-teal">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
