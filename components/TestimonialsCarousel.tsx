"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import type { Testimonial } from "@/lib/types";

export default function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const items = Array.isArray(testimonials) ? testimonials : [];
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next, items.length]);

  if (items.length === 0) return null;

  const active = items[index];

  return (
    <section className="section">
      <div className="container-px mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-charcoal/10 bg-cream-50 p-8 shadow-[0_30px_70px_-40px_rgba(26,26,26,0.5)] sm:p-12">
          <span className="absolute -left-2 -top-4 font-display text-[8rem] leading-none text-teal/10">
            &ldquo;
          </span>
          <AnimatePresence mode="wait">
            <motion.div
              key={active.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45 }}
              className="relative flex flex-col items-center gap-6 text-center"
            >
              <div className="flex gap-1 text-purple">
                {Array.from({ length: active.rating }).map((_, i) => (
                  <Icon key={i} name="star" size={20} className="fill-purple text-purple" />
                ))}
              </div>
              <blockquote className="max-w-2xl text-balance font-display text-2xl font-medium leading-snug text-charcoal sm:text-3xl">
                {active.quote}
              </blockquote>
              <div className="flex items-center gap-4">
                <span className="relative h-14 w-14 overflow-hidden rounded-full border border-charcoal/10">
                  <Image
                    src={active.avatar}
                    alt={active.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </span>
                <div className="text-left">
                  <div className="font-semibold text-charcoal">{active.name}</div>
                  <div className="text-sm text-charcoal/55">
                    {active.role}, {active.company}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-7 flex items-center justify-center gap-2">
          {items.map((t, i) => (
            <button
              key={t.name}
              type="button"
              aria-label={`Show testimonial from ${t.name}`}
              onClick={() => setIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === index ? "w-8 gradient-bg" : "w-2.5 bg-charcoal/20 hover:bg-charcoal/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
