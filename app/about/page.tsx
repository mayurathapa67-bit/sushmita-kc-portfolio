import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/ui/Reveal";
import Icon from "@/components/ui/Icon";
import CtaBand from "@/components/CtaBand";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description:
    "Marketing philosophy, expertise, experience and certifications of Sushmita Kc, a data-driven Digital Marketing Specialist.",
  openGraph: { title: "About Sushmita Kc", description: "Marketing philosophy, expertise and measurable results." },
};

export default async function AboutPage() {
  const content = await getContent();
  const about = content.about;

  return (
    <>
      <PageHeader
        eyebrow="About"
        title={<>{about?.headline ?? "Digital Marketing Expert"}</>}
        description={about?.bio}
      />

      <section className="section">
        <div className="container-px mx-auto grid max-w-7xl gap-12 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Reveal>
              <div className="sticky top-24">
                <h2 className="font-display text-2xl font-semibold">My philosophy</h2>
                <p className="mt-4 text-pretty leading-relaxed text-charcoal/65">
                  {about?.philosophy}
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {(Array.isArray(about?.certifications) ? about.certifications : []).map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/10 bg-cream-50 px-3 py-1.5 text-xs font-medium text-charcoal/75"
                    >
                      <Icon name="check" size={13} className="text-teal" /> {c}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl font-semibold">Areas of expertise</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {(Array.isArray(about?.expertise) ? about.expertise : []).map((e, i) => (
                <Reveal key={e.title} delay={i * 0.06}>
                  <div className="card flex h-full gap-4 p-5">
                    <span className="gradient-bg grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white">
                      <Icon name={e.icon as never} size={20} />
                    </span>
                    <div>
                      <h3 className="font-semibold">{e.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-charcoal/60">
                        {e.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <h2 className="mt-14 font-display text-2xl font-semibold">Experience</h2>
            <ol className="mt-6 flex flex-col gap-px overflow-hidden rounded-2xl border border-charcoal/10 bg-charcoal/5">
              {(Array.isArray(about?.experience) ? about.experience : []).map((exp) => (
                <li key={`${exp.company}-${exp.role}`} className="bg-cream-50 p-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-display text-lg font-semibold">{exp.role}</h3>
                      <p className="text-sm font-medium text-teal">{exp.company}</p>
                    </div>
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-charcoal/5 px-3 py-1 text-xs font-medium text-charcoal/60">
                      <Icon name="calendar" size={14} /> {exp.duration}
                    </span>
                  </div>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {exp.achievements.map((a) => (
                      <li key={a} className="flex items-start gap-2 text-sm text-charcoal/70">
                        <Icon name="trending" size={16} className="mt-0.5 shrink-0 text-purple" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>

            <h2 className="mt-14 font-display text-2xl font-semibold">Tools I master</h2>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {(Array.isArray(about?.tools) ? about.tools : []).map((t, i) => (
                <Reveal key={t} delay={i * 0.03}>
                  <span className="rounded-full gradient-bg px-4 py-2 text-sm font-medium text-white shadow-[0_8px_20px_-10px_rgba(139,92,246,0.7)]">
                    {t}
                  </span>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
