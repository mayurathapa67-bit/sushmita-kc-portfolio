import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import PageHeader from "@/components/PageHeader";
import ServicesGrid from "@/components/ServicesGrid";
import RoiCalculator from "@/components/RoiCalculator";
import ProcessSection from "@/components/ProcessSection";
import CtaBand from "@/components/CtaBand";
import SectionHeading from "@/components/SectionHeading";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Performance marketing services: SEO, Google Ads, social media, content, email automation and analytics — with transparent pricing.",
  openGraph: { title: "Services | Sushmita Kc", description: "Growth services with transparent pricing." },
};

export default async function ServicesPage() {
  const content = await getContent();

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Engagements built around outcomes"
        description="Pick a focus area or combine them into a full-growth retainer. Every plan includes transparent deliverables and reporting."
      />

      <section className="section">
        <div className="container-px mx-auto max-w-7xl">
          <ServicesGrid services={content.services} />
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container-px mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Special tool"
            title="What could better ROAS mean for you?"
            description="Drag the sliders to estimate the revenue gap between your current performance and a growth-focused engagement."
          />
          <div className="mt-12">
            <RoiCalculator />
          </div>
        </div>
      </section>

      <ProcessSection steps={content.process} />

      <CtaBand
        title="Not sure where to start?"
        description="Book a free audit and I'll tell you exactly which lever to pull first."
      />
    </>
  );
}
