import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/SectionHeading";
import type { Service } from "@/lib/types";

export default function ServicesGrid({ services }: { services: Service[] }) {
  const list = Array.isArray(services) ? services : [];
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {list.map((service, i) => (
        <Reveal key={service.slug} delay={(i % 3) * 0.07}>
          <div
            id={service.slug}
            className="group flex h-full scroll-mt-28 flex-col gap-5 rounded-3xl border border-charcoal/10 bg-cream-50 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-teal/30 hover:shadow-[0_30px_60px_-34px_rgba(13,115,119,0.5)]"
          >
            <div className="flex items-center justify-between">
              <span className="gradient-bg grid h-14 w-14 place-items-center rounded-2xl text-white shadow-[0_12px_28px_-12px_rgba(139,92,246,0.7)]">
                <Icon name={service.icon as never} size={24} />
              </span>
              <span className="text-right">
                <span className="block font-display text-2xl font-semibold">
                  {service.price}
                </span>
                <span className="text-xs text-charcoal/50">{service.priceNote}</span>
              </span>
            </div>

            <div>
              <h3 className="font-display text-xl font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/60">
                {service.description}
              </p>
            </div>

            <ul className="flex flex-col gap-2.5">
              {service.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-charcoal/75">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal/10 text-teal">
                    <Icon name="check" size={13} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-col gap-4 pt-2">
              <div className="rounded-2xl bg-cream-100 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-charcoal/45">
                  Deliverables
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {service.deliverables.map((d) => (
                    <span
                      key={d}
                      className="rounded-full border border-charcoal/10 bg-cream-50 px-2.5 py-1 text-xs text-charcoal/65"
                    >
                      {d}
                    </span>
                  ))}
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-charcoal/50">
                  <Icon name="calendar" size={14} /> Timeline: {service.timeline}
                </p>
              </div>
              <Link
                href="/contact"
                className="gradient-bg inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-shadow hover:shadow-[0_14px_38px_-12px_rgba(13,115,119,0.8)]"
              >
                Get Started <Icon name="arrow-right" size={16} />
              </Link>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function ServicesPreview({ services }: { services: Service[] }) {
  const list = Array.isArray(services) ? services.slice(0, 3) : [];
  return (
    <section className="section">
      <div className="container-px mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="What I do"
          title="Services engineered for growth"
          description="From technical SEO to full-funnel paid media — every engagement is built around measurable outcomes."
        />
        <div className="mt-14">
          <ServicesGrid services={list} />
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-charcoal/15 bg-cream-50 px-6 py-3 text-sm font-semibold transition-colors hover:border-charcoal/40"
          >
            View all services <Icon name="arrow-right" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
