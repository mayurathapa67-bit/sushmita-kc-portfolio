import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getContent } from "@/lib/content";
import ResultsChart from "@/components/ResultsChart";
import CaseStudyCard from "@/components/CaseStudyCard";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
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
  const study = (content.portfolio ?? []).find((s) => s.slug === slug);
  if (!study) return { title: "Case Study Not Found" };
  return {
    title: study.title,
    description: study.excerpt,
    openGraph: {
      title: study.title,
      description: study.excerpt,
      images: [{ url: study.featuredImage }],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = await getContent();
  const study = (content.portfolio ?? []).find((s) => s.slug === slug);
  if (!study) notFound();

  const related = (content.portfolio ?? [])
    .filter((s) => s.slug !== study.slug && s.category === study.category)
    .slice(0, 3);
  const fallbackRelated = (content.portfolio ?? [])
    .filter((s) => s.slug !== study.slug)
    .slice(0, 3);
  const relatedStudies = related.length > 0 ? related : fallbackRelated;

  return (
    <>
      <section className="relative overflow-hidden border-b border-charcoal/10">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-purple/15 blur-[120px]" />
          <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-teal/15 blur-[120px]" />
        </div>
        <div className="container-px mx-auto max-w-7xl py-14">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal/55 transition-colors hover:text-teal"
          >
            <Icon name="arrow-right" size={16} className="rotate-180" /> Back to portfolio
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
              {study.category}
            </span>
            <span className="text-sm text-charcoal/50">{formatDate(study.publishedDate)}</span>
          </div>
          <h1 className="mt-4 max-w-4xl text-balance font-display text-4xl font-semibold leading-[1.1] sm:text-5xl">
            {study.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-charcoal/65">
            {study.client} · {study.industry}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-px mx-auto grid max-w-7xl gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-charcoal/10">
            <Image
              src={study.featuredImage}
              alt={study.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="card p-4">
                <div className="font-display text-2xl font-semibold gradient-text">
                  {study.results.trafficGrowth}
                </div>
                <div className="text-xs text-charcoal/50">Traffic Growth</div>
              </div>
              <div className="card p-4">
                <div className="font-display text-2xl font-semibold gradient-text">
                  {study.results.conversionRate}
                </div>
                <div className="text-xs text-charcoal/50">Conv. Rate</div>
              </div>
              <div className="card p-4">
                <div className="font-display text-2xl font-semibold gradient-text">
                  {study.results.roi}
                </div>
                <div className="text-xs text-charcoal/50">ROI</div>
              </div>
              <div className="card p-4">
                <div className="font-display text-2xl font-semibold gradient-text">
                  {study.results.revenue}
                </div>
                <div className="text-xs text-charcoal/50">Revenue</div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal/45">
                Performance over time
              </h3>
              <div className="mt-4">
                <ResultsChart type="line" data={study.chartData} height={260} />
              </div>
              <div className="mt-3 flex gap-5 text-xs text-charcoal/55">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-4 rounded-full border border-dashed border-teal" /> Before
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-4 rounded-full bg-purple" /> After
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-px mx-auto grid max-w-7xl gap-10 lg:grid-cols-3">
          <Reveal className="lg:col-span-1">
            <div className="card h-full p-7">
              <h3 className="flex items-center gap-2 font-display text-xl font-semibold">
                <Icon name="target" size={20} className="text-teal" /> The Challenge
              </h3>
              <p className="mt-3 leading-relaxed text-charcoal/65">{study.challenge}</p>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-2" delay={0.08}>
            <div className="card h-full p-7">
              <h3 className="flex items-center gap-2 font-display text-xl font-semibold">
                <Icon name="compass" size={20} className="text-purple" /> The Strategy
              </h3>
              <p className="mt-3 leading-relaxed text-charcoal/65">{study.strategy}</p>
              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                {study.metrics.map((m) => (
                  <div key={m.label} className="rounded-2xl bg-cream-50 p-4">
                    <div className="text-xs font-medium text-charcoal/50">{m.label}</div>
                    <div className="mt-1 font-display text-2xl font-semibold gradient-text">
                      {m.value}
                    </div>
                    <div className="mt-1 text-xs text-charcoal/45">
                      {m.before} → {m.after}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-px mx-auto max-w-3xl">
          <Reveal>
            <figure className="relative overflow-hidden rounded-[2rem] border border-charcoal/10 bg-cream-50 p-8 text-center shadow-[0_30px_70px_-40px_rgba(26,26,26,0.5)] sm:p-12">
              <Icon name="quote" size={40} className="mx-auto text-teal/20" />
              <blockquote className="mt-4 font-display text-2xl font-medium leading-snug text-charcoal">
                &ldquo;{study.testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 text-sm font-semibold text-charcoal/70">
                {study.testimonial.name} — {study.testimonial.role}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {relatedStudies.length > 0 && (
        <section className="section bg-cream-100">
          <div className="container-px mx-auto max-w-7xl">
            <h2 className="font-display text-3xl font-semibold">More case studies</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedStudies.map((s, i) => (
                <CaseStudyCard key={s.slug} study={s} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        title="Want results like these?"
        description="Let's build a data-driven growth plan for your brand."
      />
    </>
  );
}
