"use client";

import Image from "next/image";
import type { ClientLogo } from "@/lib/types";

export default function ClientLogos({ clients }: { clients: ClientLogo[] }) {
  const list = Array.isArray(clients) ? clients : [];
  if (list.length === 0) return null;
  const doubled = [...list, ...list];

  return (
    <section className="section">
      <div className="container-px mx-auto max-w-7xl">
        <p className="mb-10 text-center text-sm font-semibold uppercase tracking-[0.2em] text-charcoal/40">
          Trusted by ambitious brands worldwide
        </p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-12">
            {doubled.map((client, i) => (
              <div
                key={`${client.name}-${i}`}
                className="group flex shrink-0 items-center gap-3 opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                title={client.name}
              >
                <span className="relative h-12 w-32 overflow-hidden rounded-lg bg-cream-50">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    fill
                    sizes="128px"
                    className="object-contain p-2"
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
