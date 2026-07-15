"use client";

import { useMemo, useState } from "react";
import CaseStudyCard from "@/components/CaseStudyCard";
import Icon from "@/components/ui/Icon";
import type { CaseStudy } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "SEO",
  "PPC",
  "Social Media",
  "Content",
  "Email",
  "Brand Strategy",
] as const;

export default function PortfolioExplorer({ studies }: { studies: CaseStudy[] }) {
  const list = useMemo(() => (Array.isArray(studies) ? studies : []), [studies]);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((s) => {
      const matchesCategory = category === "All" || s.category === category;
      const matchesQuery =
        q === "" ||
        s.title.toLowerCase().includes(q) ||
        s.client.toLowerCase().includes(q) ||
        s.industry.toLowerCase().includes(q) ||
        s.excerpt.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [list, category, query]);

  return (
    <div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
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

        <div className="flex w-full max-w-sm items-center gap-2 rounded-full border border-charcoal/15 bg-cream-50 px-4 py-2.5 focus-within:border-teal">
          <Icon name="search" size={18} className="text-charcoal/45" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search case studies…"
            aria-label="Search case studies"
            className="w-full bg-transparent text-sm outline-none placeholder:text-charcoal/40"
          />
        </div>
      </div>

      <p className="mt-5 text-sm text-charcoal/50">
        Showing {filtered.length} of {list.length} case studies
      </p>

      {filtered.length === 0 ? (
        <div className="mt-10 grid place-items-center rounded-3xl border border-dashed border-charcoal/15 py-20 text-center">
          <Icon name="search" size={32} className="text-charcoal/30" />
          <p className="mt-3 text-charcoal/55">No case studies match your search.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((study, i) => (
            <CaseStudyCard key={study.slug} study={study} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
