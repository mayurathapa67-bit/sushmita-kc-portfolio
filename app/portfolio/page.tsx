import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import PageHeader from "@/components/PageHeader";
import PortfolioExplorer from "@/components/PortfolioExplorer";
import CtaBand from "@/components/CtaBand";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Data-driven marketing case studies across SEO, PPC, social media, content, email and brand strategy with measurable results.",
  openGraph: { title: "Case Studies | Sushmita Kc", description: "Measurable marketing results across every channel." },
};

export default async function PortfolioPage() {
  const content = await getContent();
  const studies = Array.isArray(content.portfolio) ? content.portfolio : [];

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Case studies that moved the needle"
        description="Filter by discipline or search by client. Every engagement is backed by real, audited numbers."
      />
      <section className="section">
        <div className="container-px mx-auto max-w-7xl">
          <PortfolioExplorer studies={studies} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
