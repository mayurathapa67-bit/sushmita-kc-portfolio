import { getContent } from "@/lib/content";
import Hero from "@/components/Hero";
import CaseStudyCard from "@/components/CaseStudyCard";
import ServicesPreview from "@/components/ServicesGrid";
import ProcessSection from "@/components/ProcessSection";
import ClientLogos from "@/components/ClientLogos";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import BlogPreview from "@/components/BlogPreview";
import CtaBand from "@/components/CtaBand";
import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getContent();
  const featured = Array.isArray(content.portfolio) ? content.portfolio.slice(0, 3) : [];

  return (
    <>
      <Hero hero={content.hero} />

      <ClientLogos clients={content.clients} />

      <section className="section">
        <div className="container-px mx-auto max-w-7xl">
          <div className="flex flex-col items-end justify-between gap-6 sm:flex-row">
            <SectionHeading
              align="left"
              eyebrow="Selected work"
              title="Case studies with real numbers"
              description="A snapshot of campaigns that moved the metrics that matter — traffic, conversions, and revenue."
            />
            <Link
              href="/portfolio"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-charcoal/15 bg-cream-50 px-5 py-2.5 text-sm font-semibold transition-colors hover:border-charcoal/40"
            >
              All case studies <Icon name="arrow-right" size={16} />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((study, i) => (
              <CaseStudyCard key={study.slug} study={study} index={i} />
            ))}
          </div>
        </div>
      </section>

      <ServicesPreview services={content.services} />

      <ProcessSection steps={content.process} />

      <TestimonialsCarousel testimonials={content.testimonials} />

      <BlogPreview posts={content.blog} />

      <CtaBand />
    </>
  );
}
