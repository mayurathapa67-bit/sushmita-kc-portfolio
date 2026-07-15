import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full border border-charcoal/10 bg-cream-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-teal">
          <span className="h-1.5 w-1.5 rounded-full gradient-bg" />
          {eyebrow}
        </span>
      )}
      <h2 className="max-w-3xl text-balance text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-2xl text-pretty text-base leading-relaxed text-charcoal/65 sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
