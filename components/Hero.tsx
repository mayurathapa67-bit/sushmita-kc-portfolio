"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import MagneticButton from "@/components/ui/MagneticButton";
import Icon from "@/components/ui/Icon";
import type { HeroContent } from "@/lib/types";
import { parseNumeric } from "@/lib/utils";

export default function Hero({ hero }: { hero: HeroContent }) {
  const reduce = useReducedMotion();
  const stats = Array.isArray(hero?.stats) ? hero.stats : [];

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-0 h-[480px] w-[480px] rounded-full bg-teal/20 blur-[120px]" />
        <div className="absolute -right-24 top-40 h-[420px] w-[420px] rounded-full bg-purple/20 blur-[120px]" />
        <div className="absolute left-1/2 top-1/3 h-[360px] w-[360px] -translate-x-1/2 rounded-full gradient-bg-animated opacity-10 blur-[130px]" />
      </div>

      <div className="container-px mx-auto grid max-w-7xl items-center gap-12 py-16 md:py-24 lg:grid-cols-2 lg:gap-8">
        <div className="flex flex-col gap-7">
          <motion.span
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-charcoal/10 bg-cream-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-teal"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
            </span>
            {hero?.role}
          </motion.span>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-balance font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            {hero?.title ? (
              <>
                <span className="block text-charcoal/50">{hero.title}</span>
              </>
            ) : null}
            <span className="gradient-text mt-2 block">{hero?.headline}</span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="max-w-xl text-pretty text-lg leading-relaxed text-charcoal/65"
          >
            {hero?.description}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="flex flex-wrap gap-3"
          >
            <MagneticButton href={hero?.ctaPrimary?.href} variant="primary" icon={<Icon name="arrow-right" size={18} />}>
              {hero?.ctaPrimary?.label}
            </MagneticButton>
            <MagneticButton href={hero?.ctaSecondary?.href} variant="ghost" icon={<Icon name="sparkles" size={18} />}>
              {hero?.ctaSecondary?.label}
            </MagneticButton>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-charcoal/10 shadow-[0_30px_80px_-30px_rgba(26,26,26,0.5)]">
            <Image
              src={hero?.image || "https://picsum.photos/seed/sushmita/900/1100"}
              alt={hero?.title || "Sushmita Kc"}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-6 -left-6 hidden w-56 gap-3 rounded-2xl glass p-4 shadow-xl sm:flex sm:flex-col">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal">
              <Icon name="trending" size={16} /> Live Results
            </div>
            <div className="text-3xl font-semibold">
              <AnimatedCounter value={500} suffix="%" /> <span className="text-sm font-normal text-charcoal/50">traffic</span>
            </div>
          </div>

          <motion.div
            animate={reduce ? undefined : { y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-4 top-8 hidden rounded-2xl glass p-4 shadow-xl sm:block"
          >
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-full gradient-bg text-white">
                <Icon name="trophy" size={18} />
              </span>
              <div>
                <div className="text-xl font-semibold">
                  <AnimatedCounter value={2} prefix="$" suffix="M+" />
                </div>
                <div className="text-xs text-charcoal/50">revenue driven</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="container-px mx-auto -mt-4 max-w-7xl pb-16">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card flex flex-col gap-1 p-5"
            >
              <div className="font-display text-3xl font-semibold text-charcoal sm:text-4xl">
                <AnimatedCounter
                  value={parseNumeric(stat.value)}
                  prefix={stat.value.trim().startsWith("$") ? "$" : ""}
                  suffix={stat.suffix || ""}
                />
              </div>
              <div className="text-sm text-charcoal/55">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
