import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import type { CaseStudy } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const CATEGORY_STYLES: Record<string, string> = {
  SEO: "bg-teal/10 text-teal",
  PPC: "bg-purple/10 text-purple",
  "Social Media": "bg-teal/10 text-teal",
  Content: "bg-purple/10 text-purple",
  Email: "bg-teal/10 text-teal",
  "Brand Strategy": "bg-purple/10 text-purple",
};

export default function CaseStudyCard({
  study,
  index = 0,
}: {
  study: CaseStudy;
  index?: number;
}) {
  if (!study) return null;
  const badge = CATEGORY_STYLES[study.category] ?? "bg-charcoal/10 text-charcoal";

  return (
    <Reveal delay={(index % 3) * 0.08}>
      <Link
        href={`/portfolio/${study.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-3xl border border-charcoal/10 bg-cream-50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(26,26,26,0.55)]"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={study.featuredImage}
            alt={study.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${badge}`}
          >
            {study.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-charcoal/45">
              {study.client} · {study.industry}
            </p>
            <h3 className="mt-1.5 font-display text-xl font-semibold leading-snug">
              {study.title}
            </h3>
          </div>

          <p className="line-clamp-2 text-sm leading-relaxed text-charcoal/60">
            {study.excerpt}
          </p>

          <div className="mt-auto grid grid-cols-3 gap-2 border-t border-charcoal/10 pt-4">
            <div>
              <div className="font-display text-lg font-semibold gradient-text">
                {study.results.trafficGrowth}
              </div>
              <div className="text-[11px] text-charcoal/50">Traffic</div>
            </div>
            <div>
              <div className="font-display text-lg font-semibold gradient-text">
                {study.results.conversionRate}
              </div>
              <div className="text-[11px] text-charcoal/50">Conv. Rate</div>
            </div>
            <div>
              <div className="font-display text-lg font-semibold gradient-text">
                {study.results.roi}
              </div>
              <div className="text-[11px] text-charcoal/50">ROI</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-charcoal/45">{formatDate(study.publishedDate)}</span>
            <span className="inline-flex items-center gap-1 font-semibold text-teal transition-transform group-hover:translate-x-1">
              View case study <Icon name="arrow-right" size={16} />
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}
