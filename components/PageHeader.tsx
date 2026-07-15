import type { ReactNode } from "react";

export default function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-charcoal/10">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-teal/15 blur-[110px]" />
        <div className="absolute -right-16 top-10 h-72 w-72 rounded-full bg-purple/15 blur-[110px]" />
      </div>
      <div className="container-px mx-auto max-w-7xl py-16 md:py-20">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-full border border-charcoal/10 bg-cream-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-teal">
            <span className="h-1.5 w-1.5 rounded-full gradient-bg" />
            {eyebrow}
          </span>
        )}
        <h1 className="mt-5 max-w-4xl text-balance font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-charcoal/65">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
