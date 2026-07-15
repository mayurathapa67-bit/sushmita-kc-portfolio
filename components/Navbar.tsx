"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import type { NavLink } from "@/lib/types";
import { cn } from "@/lib/utils";

const FALLBACK_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

interface NavbarProps {
  nav: { logo: string; logoImage?: string; links: NavLink[] };
}

export default function Navbar({ nav }: NavbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = Array.isArray(nav?.links) && nav.links.length > 0
    ? nav.links
    : FALLBACK_LINKS;
  const logo = nav?.logo || "Sushmita Kc";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "glass shadow-[0_4px_30px_-12px_rgba(26,26,26,0.25)]" : "bg-transparent"
      )}
    >
      <nav className="container-px mx-auto flex h-16 max-w-7xl items-center justify-between md:h-20">
        <Link
          href="/"
          className="group flex items-center gap-2 font-display text-xl font-semibold tracking-tight"
        >
          {nav?.logoImage ? (
            <span className="relative block h-9 w-9 overflow-hidden rounded-xl">
              <Image src={nav.logoImage} alt={logo} fill sizes="36px" className="object-cover" />
            </span>
          ) : (
            <span className="gradient-bg grid h-9 w-9 place-items-center rounded-xl text-sm font-bold text-white">
              SK
            </span>
          )}
          <span>{logo}</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                      isActive(link.href)
                        ? "text-charcoal"
                        : "text-charcoal/60 hover:text-charcoal"
                    )}
                  >
                {link.label}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full gradient-bg"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <Link
            href="/contact"
            className="gradient-bg rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(139,92,246,0.7)] transition-shadow hover:shadow-[0_14px_38px_-12px_rgba(13,115,119,0.8)]"
          >
            Get Free Audit
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-charcoal/10 bg-cream-50 md:hidden"
        >
          <Icon name={open ? "close" : "menu"} size={20} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-charcoal/10 glass md:hidden"
          >
            <ul className="container-px flex flex-col gap-1 py-4">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className={cn(
                      "block rounded-xl px-4 py-3 text-base font-medium",
                      isActive(link.href)
                        ? "gradient-bg text-white"
                        : "text-charcoal/80 hover:bg-charcoal/5"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/contact"
                  className="gradient-bg block rounded-xl px-4 py-3 text-center text-base font-semibold text-white"
                >
                  Get Free Audit
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
