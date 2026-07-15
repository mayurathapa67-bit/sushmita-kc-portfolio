import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/SectionHeading";
import type { ProcessStep } from "@/lib/types";

export default function ProcessSection({
  steps,
}: {
  steps: ProcessStep[];
}) {
  const list = Array.isArray(steps) ? steps : [];
  return (
    <section className="section bg-cream-100">
      <div className="container-px mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="How I work"
          title="A process built for predictable growth"
          description="Four disciplined stages that turn strategy into compounding, measurable results."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.08}>
              <div className="card group relative flex h-full flex-col gap-4 p-7 transition-transform duration-300 hover:-translate-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="gradient-bg grid h-12 w-12 place-items-center rounded-2xl text-white shadow-[0_10px_24px_-10px_rgba(139,92,246,0.7)]">
                    <Icon name={step.icon as never} size={22} />
                  </span>
                  <span className="font-display text-4xl font-semibold text-charcoal/10">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-charcoal/60">
                  {step.description}
                </p>
                {i < list.length - 1 && (
                  <span className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-charcoal/20 lg:block">
                    <Icon name="arrow-right" size={20} />
                  </span>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
