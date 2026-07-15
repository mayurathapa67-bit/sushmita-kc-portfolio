import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Sushmita Kc for a free marketing audit and a personalized growth plan.",
  openGraph: { title: "Contact | Sushmita Kc", description: "Book a free marketing audit." },
};

export default async function ContactPage() {
  const content = await getContent();
  const contact = content.contact;
  const page = content.contactPage;

  return (
    <>
      <PageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
      />

      <section className="section">
        <div className="container-px mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col gap-6">
              <div className="card p-7">
                <h3 className="font-display text-xl font-semibold">{page.auditTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/60">
                  {page.auditDescription}
                </p>
                <div className="mt-5">
                  <ContactForm defaultType="audit" />
                </div>
              </div>

              <div className="card flex flex-col gap-4 p-7">
                <h3 className="font-display text-xl font-semibold">Direct line</h3>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 text-charcoal/75 transition-colors hover:text-teal"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-teal/10 text-teal">
                    <Icon name="mail" size={18} />
                  </span>
                  {contact.email}
                </a>
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-3 text-charcoal/75 transition-colors hover:text-teal"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-purple/10 text-purple">
                    <Icon name="phone" size={18} />
                  </span>
                  {contact.phone}
                </a>
                <span className="flex items-center gap-3 text-charcoal/75">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-teal/10 text-teal">
                    <Icon name="map" size={18} />
                  </span>
                  {contact.location}
                </span>
              </div>

              <div className="card flex flex-col gap-3 p-7">
                <h3 className="font-display text-xl font-semibold">Follow</h3>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(contact.socials) ? contact.socials : []).map((s) => (
                    <a
                      key={s.platform}
                      href={s.url}
                      target={s.url.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-charcoal/15 bg-cream-50 px-4 py-2 text-sm font-medium transition-colors hover:border-charcoal/40"
                    >
                      <Icon name={s.icon as never} size={16} /> {s.platform}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
