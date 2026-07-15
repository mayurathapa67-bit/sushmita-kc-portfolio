import Link from "next/link";
import Icon from "@/components/ui/Icon";
import MagneticButton from "@/components/ui/MagneticButton";

export default function CtaBand({
  title = "Ready to grow?",
  description = "Book a free marketing audit and get a personalized growth plan within 48 hours.",
  primaryLabel = "Get Free Audit",
  primaryHref = "/contact",
  secondaryLabel = "View Case Studies",
  secondaryHref = "/portfolio",
}: {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <section className="section">
      <div className="container-px mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] gradient-bg-animated px-8 py-16 text-center text-white sm:px-16 sm:py-20">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
            <h2 className="text-balance font-display text-4xl font-semibold leading-tight sm:text-5xl">
              {title}
            </h2>
            <p className="text-pretty text-lg text-white/85">{description}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <MagneticButton href={primaryHref} variant="secondary" icon={<Icon name="arrow-right" size={18} />}>
                {primaryLabel}
              </MagneticButton>
              <Link
                href={secondaryHref}
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
