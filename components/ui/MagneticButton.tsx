"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";
import { useRef } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  icon?: ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

const variants: Record<string, string> = {
  primary:
    "gradient-bg text-white shadow-[0_10px_30px_-10px_rgba(139,92,246,0.6)] hover:shadow-[0_16px_40px_-12px_rgba(13,115,119,0.7)]",
  secondary:
    "bg-charcoal text-cream hover:bg-charcoal-soft shadow-[0_10px_30px_-12px_rgba(26,26,26,0.5)]",
  ghost:
    "border border-charcoal/15 bg-cream-50 text-charcoal hover:border-charcoal/40",
};

export default function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  icon,
}: MagneticButtonProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18 });
  const sy = useSpring(y, { stiffness: 250, damping: 18 });

  const handleMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * 0.3);
    y.set(relY * 0.3);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const inner = (
    <motion.span
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
      {icon}
    </motion.span>
  );

  if (href) {
    const external = href.startsWith("http");
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex">
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className="inline-flex">
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className="inline-flex">
      {inner}
    </button>
  );
}
