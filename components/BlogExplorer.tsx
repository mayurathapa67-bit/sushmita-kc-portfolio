"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import type { BlogPost } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

const CATEGORIES = ["All", "SEO", "PPC", "Social Media", "Analytics", "Strategy"] as const;

const CATEGORY_STYLES: Record<string, string> = {
  SEO: "bg-teal/10 text-teal",
  PPC: "bg-purple/10 text-purple",
  "Social Media": "bg-teal/10 text-teal",
  Analytics: "bg-purple/10 text-purple",
  Strategy: "bg-teal/10 text-teal",
};

export default function BlogExplorer({ posts }: { posts: BlogPost[] }) {
  const list = useMemo(() => (Array.isArray(posts) ? posts : []), [posts]);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");

  const filtered = useMemo(
    () => (category === "All" ? list : list.filter((p) => p.category === category)),
    [list, category]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              category === c
                ? "gradient-bg text-white"
                : "border border-charcoal/15 bg-cream-50 text-charcoal/70 hover:border-charcoal/40"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-3xl border border-charcoal/10 bg-cream-50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(26,26,26,0.5)]"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span
                className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${CATEGORY_STYLES[post.category] ?? "bg-charcoal/10 text-charcoal"}`}
              >
                {post.category}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-6">
              <div className="flex items-center gap-3 text-xs text-charcoal/45">
                <span className="flex items-center gap-1">
                  <Icon name="calendar" size={14} /> {formatDate(post.publishedDate)}
                </span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <h3 className="font-display text-lg font-semibold leading-snug group-hover:text-teal">
                {post.title}
              </h3>
              <p className="line-clamp-2 text-sm text-charcoal/60">{post.excerpt}</p>
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-teal">
                Read article <Icon name="arrow-right" size={16} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
