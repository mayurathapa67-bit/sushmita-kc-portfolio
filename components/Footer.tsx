import Link from "next/link";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import NewsletterForm from "@/components/ui/NewsletterForm";
import type { ContactContent, NavLink, Service } from "@/lib/types";

interface FooterProps {
  nav: { logo: string; logoImage?: string; links: NavLink[] };
  contact: ContactContent;
  services: Service[];
}

export default function Footer({ nav, contact, services }: FooterProps) {
  const year = new Date().getFullYear();
  const socials = Array.isArray(contact?.socials) ? contact.socials : [];
  const serviceList = Array.isArray(services) ? services : [];

  return (
    <footer className="border-t border-charcoal/10 bg-cream-100">
      <div className="container-px mx-auto grid max-w-7xl gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 font-display text-xl font-semibold">
            {nav?.logoImage ? (
              <span className="relative block h-9 w-9 overflow-hidden rounded-xl">
                <Image src={nav.logoImage} alt={nav?.logo || "Sushmita Kc"} fill sizes="36px" className="object-cover" />
              </span>
            ) : (
              <span className="gradient-bg grid h-9 w-9 place-items-center rounded-xl text-sm font-bold text-white">
                SK
              </span>
            )}
            {nav?.logo || "Sushmita Kc"}
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-charcoal/60">
            Data-driven digital marketing specialist helping brands turn audiences
            into measurable revenue.
          </p>
          <div className="flex gap-2 pt-1">
            {socials.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target={s.url.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={s.platform}
                className="grid h-10 w-10 place-items-center rounded-full border border-charcoal/10 bg-cream-50 text-charcoal/70 transition-colors hover:text-teal"
              >
                <Icon name={s.icon as never} size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal/50">
            Services
          </h3>
          <ul className="flex flex-col gap-2.5">
            {serviceList.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services#${s.slug}`}
                  className="text-sm text-charcoal/70 transition-colors hover:text-teal"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal/50">
            Resources
          </h3>
          <ul className="flex flex-col gap-2.5">
            {(Array.isArray(nav?.links) ? nav.links : []).map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-charcoal/70 transition-colors hover:text-teal"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/admin"
                className="text-sm text-charcoal/40 transition-colors hover:text-teal"
              >
                Admin
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-charcoal/50">
            Stay in the loop
          </h3>
          <NewsletterForm />
          <div className="flex flex-col gap-2 pt-2 text-sm text-charcoal/70">
            <a href={`mailto:${contact?.email}`} className="flex items-center gap-2 hover:text-teal">
              <Icon name="mail" size={16} /> {contact?.email}
            </a>
            <a href={`tel:${contact?.phone}`} className="flex items-center gap-2 hover:text-teal">
              <Icon name="phone" size={16} /> {contact?.phone}
            </a>
            <span className="flex items-center gap-2">
              <Icon name="map" size={16} /> {contact?.location}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-charcoal/10">
        <div className="container-px mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 py-6 text-xs text-charcoal/50 sm:flex-row">
          <p>© {year} {nav?.logo || "Sushmita Kc"}. All rights reserved.</p>
          <p>Built with strategy, data &amp; a little bit of magic.</p>
        </div>
      </div>
    </footer>
  );
}
