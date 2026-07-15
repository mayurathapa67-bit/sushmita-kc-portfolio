"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import type {
  BlogPost,
  CaseStudy,
  Category,
  ChartPoint,
  Metric,
  SiteContent,
} from "@/lib/types";
import { formatDate } from "@/lib/utils";
import ImageField from "@/components/admin/ImageField";

type Tab = "overview" | "content" | "submissions" | "settings";

const CATEGORIES: Category[] = [
  "SEO",
  "PPC",
  "Social Media",
  "Content",
  "Email",
  "Brand Strategy",
];

const BLOG_CATEGORIES = ["SEO", "PPC", "Social Media", "Analytics", "Strategy"] as const;

interface SubmissionRow {
  id: string;
  name: string;
  email: string;
  company?: string;
  service?: string;
  message: string;
  type: string;
  createdAt: string;
}

export default function AdminDashboard({
  githubConfigured = false,
  cloudinaryConfigured = false,
}: {
  githubConfigured?: boolean;
  cloudinaryConfigured?: boolean;
}) {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [toast, setToast] = useState("");

  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [live, setLive] = useState(true);

  const loadContent = useCallback(async () => {
    const res = await fetch("/api/content", { cache: "no-store" });
    if (res.ok) setContent((await res.json()).content as SiteContent);
    setLoading(false);
  }, []);

  const loadSubmissions = useCallback(async () => {
    const res = await fetch("/api/submissions", { cache: "no-store" });
    if (res.ok) setSubmissions((await res.json()).submissions as SubmissionRow[]);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadContent();
    loadSubmissions();
  }, [loadContent, loadSubmissions]);

  useEffect(() => {
    if (!live) return;
    const id = setInterval(loadSubmissions, 8000);
    return () => clearInterval(id);
  }, [live, loadSubmissions]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  };

  const saveContent = async (next: SiteContent) => {
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      if (!res.ok) throw new Error();
      setContent(next);
      showToast("Content saved ✓");
    } catch {
      showToast("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.refresh();
  };

  const deleteSubmission = async (id: string) => {
    const res = await fetch("/api/submissions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setSubmissions((s) => s.filter((x) => x.id !== id));
      showToast("Submission deleted");
    }
  };

  if (loading || !content) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-charcoal/50">
        Loading dashboard…
      </div>
    );
  }

  const counts = {
    caseStudies: content.portfolio.length,
    blog: content.blog.length,
    services: content.services.length,
    testimonials: content.testimonials.length,
    submissions: submissions.length,
  };

  const updateNested = <K extends keyof SiteContent>(
    key: K,
    value: SiteContent[K]
  ) => setContent({ ...content, [key]: value });

  return (
    <div className="container-px mx-auto max-w-7xl py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-charcoal/55">Manage content, submissions &amp; settings</p>
        </div>
        <div className="flex items-center gap-3">
          {tab === "submissions" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
              <span className={`h-2 w-2 rounded-full ${live ? "animate-pulse bg-teal" : "bg-charcoal/30"}`} />
              {live ? "Live" : "Paused"}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-charcoal/15 px-4 py-2 text-sm font-semibold hover:border-charcoal/40"
          >
            <Icon name="close" size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-charcoal/10 pb-4">
        {(["overview", "content", "submissions", "settings"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition-colors ${
              tab === t ? "gradient-bg text-white" : "bg-cream-50 text-charcoal/70 hover:bg-charcoal/5"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "overview" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["Case Studies", counts.caseStudies, "trending"],
              ["Blog Posts", counts.blog, "pen"],
              ["Services", counts.services, "sparkles"],
              ["Testimonials", counts.testimonials, "quote"],
              ["Submissions", counts.submissions, "mail"],
            ].map(([label, val, icon]) => (
              <div key={label} className="card p-5">
                <Icon name={icon as never} size={22} className="text-teal" />
                <div className="mt-3 font-display text-3xl font-semibold">{val}</div>
                <div className="text-sm text-charcoal/55">{label}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "content" && (
          <ContentManager
            content={content}
            onChange={updateNested}
            onSave={saveContent}
            saving={saving}
          />
        )}

        {tab === "submissions" && (
          <SubmissionsTab
            submissions={submissions}
            live={live}
            setLive={setLive}
            onDelete={deleteSubmission}
          />
        )}

        {tab === "settings" && (
          <SettingsTab
            githubConfigured={githubConfigured}
            cloudinaryConfigured={cloudinaryConfigured}
          />
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-full gradient-bg px-5 py-3 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm font-medium ${className ?? ""}`}>
      {label}
      {children}
    </label>
  );
}

function ContentManager({
  content,
  onChange,
  onSave,
  saving,
}: {
  content: SiteContent;
  onChange: <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void;
  onSave: (next: SiteContent) => void;
  saving: boolean;
}) {
  const [modal, setModal] = useState<null | { kind: "case" | "blog"; index: number | null }>(null);

  const editCase = (index: number | null) => setModal({ kind: "case", index });
  const editBlog = (index: number | null) => setModal({ kind: "blog", index });

  const handleCaseSave = (study: CaseStudy) => {
    const list = [...content.portfolio];
    if (modal?.index !== null && modal?.index !== undefined) list[modal.index] = study;
    else list.push(study);
    onChange("portfolio", list);
    setModal(null);
  };

  const handleBlogSave = (post: BlogPost) => {
    const list = [...content.blog];
    if (modal?.index !== null && modal?.index !== undefined) list[modal.index] = post;
    else list.push(post);
    onChange("blog", list);
    setModal(null);
  };

  const removeCase = (i: number) =>
    onChange("portfolio", content.portfolio.filter((_, idx) => idx !== i));
  const removeBlog = (i: number) =>
    onChange("blog", content.blog.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-8">
      <section className="card p-6">
        <h2 className="font-display text-xl font-semibold">Hero</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Headline">
            <input className="input" value={content.hero.headline} onChange={(e) => onChange("hero", { ...content.hero, headline: e.target.value })} />
          </Field>
          <Field label="Subtitle">
            <input className="input" value={content.hero.subtitle} onChange={(e) => onChange("hero", { ...content.hero, subtitle: e.target.value })} />
          </Field>
          <Field label="Description">
            <textarea className="input resize-none" rows={3} value={content.hero.description} onChange={(e) => onChange("hero", { ...content.hero, description: e.target.value })} />
          </Field>
          <Field label="Primary CTA label">
            <input className="input" value={content.hero.ctaPrimary.label} onChange={(e) => onChange("hero", { ...content.hero, ctaPrimary: { ...content.hero.ctaPrimary, label: e.target.value } })} />
          </Field>
        </div>
        <div className="mt-4">
          <ImageField label="Profile photo" value={content.hero.image} onChange={(u) => onChange("hero", { ...content.hero, image: u })} />
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-display text-xl font-semibold">Branding &amp; Logo</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Logo text">
            <input className="input" value={content.nav.logo} onChange={(e) => onChange("nav", { ...content.nav, logo: e.target.value })} />
          </Field>
          <div className="flex items-end">
            <ImageField label="Logo image (optional)" value={content.nav.logoImage ?? ""} onChange={(u) => onChange("nav", { ...content.nav, logoImage: u })} aspect="1/1" />
          </div>
        </div>
        <p className="mt-2 text-xs text-charcoal/50">Leave the logo image empty to use the monogram badge.</p>
      </section>

      <section className="card p-6">
        <h2 className="font-display text-xl font-semibold">About</h2>
        <div className="mt-4 grid gap-4">
          <Field label="Bio">
            <textarea className="input resize-none" rows={4} value={content.about.bio} onChange={(e) => onChange("about", { ...content.about, bio: e.target.value })} />
          </Field>
          <Field label="Philosophy">
            <textarea className="input resize-none" rows={3} value={content.about.philosophy} onChange={(e) => onChange("about", { ...content.about, philosophy: e.target.value })} />
          </Field>
        </div>
      </section>

      <section className="card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Case Studies ({content.portfolio.length})</h2>
          <button onClick={() => editCase(null)} className="gradient-bg rounded-full px-4 py-2 text-sm font-semibold text-white">
            + Add case study
          </button>
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border border-charcoal/10">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 text-left text-charcoal/55">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {content.portfolio.map((s, i) => (
                <tr key={s.slug} className="border-t border-charcoal/10">
                  <td className="px-4 py-3 font-medium">{s.title}</td>
                  <td className="px-4 py-3">{s.category}</td>
                  <td className="px-4 py-3 text-charcoal/70">{s.client}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => editCase(i)} className="text-teal hover:underline">Edit</button>
                    <button onClick={() => removeCase(i)} className="ml-3 text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Blog Posts ({content.blog.length})</h2>
          <button onClick={() => editBlog(null)} className="gradient-bg rounded-full px-4 py-2 text-sm font-semibold text-white">
            + Add blog post
          </button>
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border border-charcoal/10">
          <table className="w-full text-sm">
            <thead className="bg-cream-100 text-left text-charcoal/55">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {content.blog.map((p, i) => (
                <tr key={p.slug} className="border-t border-charcoal/10">
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3 text-charcoal/70">{formatDate(p.publishedDate)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => editBlog(i)} className="text-teal hover:underline">Edit</button>
                    <button onClick={() => removeBlog(i)} className="ml-3 text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-display text-xl font-semibold">Contact Page &amp; Free Audit</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Header eyebrow">
            <input className="input" value={content.contactPage.eyebrow} onChange={(e) => onChange("contactPage", { ...content.contactPage, eyebrow: e.target.value })} />
          </Field>
          <Field label="Header title">
            <input className="input" value={content.contactPage.title} onChange={(e) => onChange("contactPage", { ...content.contactPage, title: e.target.value })} />
          </Field>
          <Field label="Header description" className="sm:col-span-2">
            <textarea className="input resize-none" rows={2} value={content.contactPage.description} onChange={(e) => onChange("contactPage", { ...content.contactPage, description: e.target.value })} />
          </Field>
          <Field label="Audit section title">
            <input className="input" value={content.contactPage.auditTitle} onChange={(e) => onChange("contactPage", { ...content.contactPage, auditTitle: e.target.value })} />
          </Field>
          <Field label="Audit section description" className="sm:col-span-2">
            <textarea className="input resize-none" rows={2} value={content.contactPage.auditDescription} onChange={(e) => onChange("contactPage", { ...content.contactPage, auditDescription: e.target.value })} />
          </Field>
        </div>

        <h3 className="mt-6 font-display text-lg font-semibold">Contact details</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <Field label="Email">
            <input className="input" value={content.contact.email} onChange={(e) => onChange("contact", { ...content.contact, email: e.target.value })} />
          </Field>
          <Field label="Phone">
            <input className="input" value={content.contact.phone} onChange={(e) => onChange("contact", { ...content.contact, phone: e.target.value })} />
          </Field>
          <Field label="Location">
            <input className="input" value={content.contact.location} onChange={(e) => onChange("contact", { ...content.contact, location: e.target.value })} />
          </Field>
        </div>

        <h3 className="mt-6 font-display text-lg font-semibold">Social links</h3>
        <div className="mt-3 flex flex-col gap-2">
          {(Array.isArray(content.contact.socials) ? content.contact.socials : []).map((s, i) => (
            <div key={i} className="grid grid-cols-3 gap-2">
              <input className="input" placeholder="Platform" value={s.platform} onChange={(e) => {
                const list = content.contact.socials.map((x, idx) => (idx === i ? { ...x, platform: e.target.value } : x));
                onChange("contact", { ...content.contact, socials: list });
              }} />
              <input className="input" placeholder="URL" value={s.url} onChange={(e) => {
                const list = content.contact.socials.map((x, idx) => (idx === i ? { ...x, url: e.target.value } : x));
                onChange("contact", { ...content.contact, socials: list });
              }} />
              <div className="flex gap-1">
                <input className="input" placeholder="icon" value={s.icon} onChange={(e) => {
                  const list = content.contact.socials.map((x, idx) => (idx === i ? { ...x, icon: e.target.value } : x));
                  onChange("contact", { ...content.contact, socials: list });
                }} />
                <button type="button" onClick={() => onChange("contact", { ...content.contact, socials: content.contact.socials.filter((_, idx) => idx !== i) })} className="px-2 text-red-600">×</button>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => onChange("contact", { ...content.contact, socials: [...content.contact.socials, { platform: "", url: "", icon: "" }] })} className="self-start text-xs font-semibold text-teal">+ Add social link</button>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          onClick={() => onSave(content)}
          disabled={saving}
          className="gradient-bg inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save all changes"} <Icon name="check" size={18} />
        </button>
      </div>

      {modal?.kind === "case" && (
        <CaseStudyModal
          initial={modal.index !== null ? content.portfolio[modal.index] : null}
          onClose={() => setModal(null)}
          onSave={handleCaseSave}
        />
      )}
      {modal?.kind === "blog" && (
        <BlogModal
          initial={modal.index !== null ? content.blog[modal.index] : null}
          onClose={() => setModal(null)}
          onSave={handleBlogSave}
        />
      )}
    </div>
  );
}

function slugFrom(title: string): string {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function CaseStudyModal({
  initial,
  onClose,
  onSave,
}: {
  initial: CaseStudy | null;
  onClose: () => void;
  onSave: (s: CaseStudy) => void;
}) {
  const [form, setForm] = useState<CaseStudy>(
    initial ?? {
      slug: "",
      title: "",
      category: "SEO",
      client: "",
      industry: "",
      challenge: "",
      strategy: "",
      results: { trafficGrowth: "", conversionRate: "", roi: "", revenue: "" },
      metrics: [],
      chartData: [],
      publishedDate: new Date().toISOString().slice(0, 10),
      featuredImage: "https://picsum.photos/seed/new/1200/800",
      testimonial: { quote: "", name: "", role: "" },
      excerpt: "",
    }
  );

  const set = <K extends keyof CaseStudy>(k: K, v: CaseStudy[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const updateMetric = (i: number, key: keyof Metric, val: string) =>
    setForm((f) => ({
      ...f,
      metrics: f.metrics.map((m, idx) => (idx === i ? { ...m, [key]: val } : m)),
    }));
  const addMetric = () =>
    setForm((f) => ({ ...f, metrics: [...f.metrics, { label: "", value: "", before: "", after: "" }] }));
  const removeMetric = (i: number) =>
    setForm((f) => ({ ...f, metrics: f.metrics.filter((_, idx) => idx !== i) }));

  const updatePoint = (i: number, key: keyof ChartPoint, val: string) =>
    setForm((f) => ({
      ...f,
      chartData: f.chartData.map((p, idx) =>
        idx === i ? { ...p, [key]: key === "label" ? val : Number(val) } : p
      ),
    }));
  const addPoint = () =>
    setForm((f) => ({ ...f, chartData: [...f.chartData, { label: "", before: 0, after: 0 }] }));
  const removePoint = (i: number) =>
    setForm((f) => ({ ...f, chartData: f.chartData.filter((_, idx) => idx !== i) }));

  const submit = () => {
    const slug = form.slug || slugFrom(form.title);
    onSave({ ...form, slug });
  };

  return (
    <ModalShell title={initial ? "Edit Case Study" : "New Case Study"} onClose={onClose}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title"><input className="input" value={form.title} onChange={(e) => set("title", e.target.value)} /></Field>
        <Field label="Category">
          <select className="input" value={form.category} onChange={(e) => set("category", e.target.value as Category)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Client"><input className="input" value={form.client} onChange={(e) => set("client", e.target.value)} /></Field>
        <Field label="Industry"><input className="input" value={form.industry} onChange={(e) => set("industry", e.target.value)} /></Field>
        <Field label="Published date"><input className="input" type="date" value={form.publishedDate} onChange={(e) => set("publishedDate", e.target.value)} /></Field>
        <ImageField label="Cover image" value={form.featuredImage} onChange={(u) => set("featuredImage", u)} />
      </div>

      <Field label="Excerpt"><textarea className="input resize-none" rows={2} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} /></Field>
      <Field label="Challenge"><textarea className="input resize-none" rows={2} value={form.challenge} onChange={(e) => set("challenge", e.target.value)} /></Field>
      <Field label="Strategy"><textarea className="input resize-none" rows={2} value={form.strategy} onChange={(e) => set("strategy", e.target.value)} /></Field>

      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="Traffic growth"><input className="input" value={form.results.trafficGrowth} onChange={(e) => set("results", { ...form.results, trafficGrowth: e.target.value })} /></Field>
        <Field label="Conversion rate"><input className="input" value={form.results.conversionRate} onChange={(e) => set("results", { ...form.results, conversionRate: e.target.value })} /></Field>
        <Field label="ROI"><input className="input" value={form.results.roi} onChange={(e) => set("results", { ...form.results, roi: e.target.value })} /></Field>
        <Field label="Revenue"><input className="input" value={form.results.revenue} onChange={(e) => set("results", { ...form.results, revenue: e.target.value })} /></Field>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-semibold">Metrics</h4>
          <button type="button" onClick={addMetric} className="text-xs font-semibold text-teal">+ Add</button>
        </div>
        <div className="flex flex-col gap-2">
          {form.metrics.map((m, i) => (
            <div key={i} className="grid grid-cols-4 gap-2">
              <input className="input" placeholder="Label" value={m.label} onChange={(e) => updateMetric(i, "label", e.target.value)} />
              <input className="input" placeholder="Value" value={m.value} onChange={(e) => updateMetric(i, "value", e.target.value)} />
              <input className="input" placeholder="Before" value={m.before} onChange={(e) => updateMetric(i, "before", e.target.value)} />
              <div className="flex gap-1">
                <input className="input" placeholder="After" value={m.after} onChange={(e) => updateMetric(i, "after", e.target.value)} />
                <button type="button" onClick={() => removeMetric(i)} className="px-2 text-red-600">×</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-sm font-semibold">Chart data (before/after)</h4>
          <button type="button" onClick={addPoint} className="text-xs font-semibold text-teal">+ Add</button>
        </div>
        <div className="flex flex-col gap-2">
          {form.chartData.map((p, i) => (
            <div key={i} className="grid grid-cols-4 gap-2">
              <input className="input" placeholder="Label" value={p.label} onChange={(e) => updatePoint(i, "label", e.target.value)} />
              <input className="input" type="number" placeholder="Before" value={p.before} onChange={(e) => updatePoint(i, "before", e.target.value)} />
              <input className="input" type="number" placeholder="After" value={p.after} onChange={(e) => updatePoint(i, "after", e.target.value)} />
              <button type="button" onClick={() => removePoint(i)} className="px-2 text-red-600">×</button>
            </div>
          ))}
        </div>
      </div>

      <Field label="Testimonial quote"><textarea className="input resize-none" rows={2} value={form.testimonial.quote} onChange={(e) => set("testimonial", { ...form.testimonial, quote: e.target.value })} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Testimonial name"><input className="input" value={form.testimonial.name} onChange={(e) => set("testimonial", { ...form.testimonial, name: e.target.value })} /></Field>
        <Field label="Testimonial role"><input className="input" value={form.testimonial.role} onChange={(e) => set("testimonial", { ...form.testimonial, role: e.target.value })} /></Field>
      </div>

      <ModalActions onClose={onClose} onSubmit={submit} />
    </ModalShell>
  );
}

function BlogModal({
  initial,
  onClose,
  onSave,
}: {
  initial: BlogPost | null;
  onClose: () => void;
  onSave: (p: BlogPost) => void;
}) {
  const [form, setForm] = useState<BlogPost>(
    initial ?? {
      slug: "",
      title: "",
      excerpt: "",
      content: "",
      publishedDate: new Date().toISOString().slice(0, 10),
      readTime: "5 min read",
      category: "SEO",
      featuredImage: "https://picsum.photos/seed/new/1200/800",
      author: "Sushmita Kc",
    }
  );
  const set = <K extends keyof BlogPost>(k: K, v: BlogPost[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = () => onSave({ ...form, slug: form.slug || slugFrom(form.title) });

  return (
    <ModalShell title={initial ? "Edit Blog Post" : "New Blog Post"} onClose={onClose}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title"><input className="input" value={form.title} onChange={(e) => set("title", e.target.value)} /></Field>
        <Field label="Category">
          <select className="input" value={form.category} onChange={(e) => set("category", e.target.value as BlogPost["category"])}>
            {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Published date"><input className="input" type="date" value={form.publishedDate} onChange={(e) => set("publishedDate", e.target.value)} /></Field>
        <Field label="Read time"><input className="input" value={form.readTime} onChange={(e) => set("readTime", e.target.value)} /></Field>
        <ImageField label="Cover image" value={form.featuredImage} onChange={(u) => set("featuredImage", u)} />
        <Field label="Author"><input className="input" value={form.author} onChange={(e) => set("author", e.target.value)} /></Field>
      </div>
      <Field label="Excerpt"><textarea className="input resize-none" rows={2} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} /></Field>
      <Field label="Content (separate paragraphs with blank lines)">
        <textarea className="input resize-none" rows={8} value={form.content} onChange={(e) => set("content", e.target.value)} />
      </Field>
      <ModalActions onClose={onClose} onSubmit={submit} />
    </ModalShell>
  );
}

function ModalShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-charcoal/40 p-4 backdrop-blur-sm">
      <div className="my-10 w-full max-w-3xl rounded-3xl bg-cream-50 p-7 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-2xl font-semibold">{title}</h3>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full hover:bg-charcoal/5">
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}

function ModalActions({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  return (
    <div className="mt-2 flex justify-end gap-3 border-t border-charcoal/10 pt-4">
      <button onClick={onClose} className="rounded-full border border-charcoal/15 px-5 py-2.5 text-sm font-semibold hover:border-charcoal/40">
        Cancel
      </button>
      <button onClick={onSubmit} className="gradient-bg rounded-full px-6 py-2.5 text-sm font-semibold text-white">
        Save
      </button>
    </div>
  );
}

function SubmissionsTab({
  submissions,
  live,
  setLive,
  onDelete,
}: {
  submissions: SubmissionRow[];
  live: boolean;
  setLive: (v: boolean) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">
          Contact Submissions ({submissions.length})
        </h2>
        <button
          onClick={() => setLive(!live)}
          className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/15 px-3 py-1.5 text-xs font-semibold"
        >
          <span className={`h-2 w-2 rounded-full ${live ? "animate-pulse bg-teal" : "bg-charcoal/30"}`} />
          {live ? "Auto-refresh ON" : "Auto-refresh OFF"}
        </button>
      </div>
      {submissions.length === 0 ? (
        <p className="text-charcoal/50">No submissions yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {submissions.map((s) => (
            <div key={s.id} className="rounded-2xl border border-charcoal/10 bg-cream-100 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-purple/10 px-2.5 py-0.5 text-xs font-semibold text-purple uppercase">
                    {s.type}
                  </span>
                  <span className="font-semibold">{s.name}</span>
                  <a href={`mailto:${s.email}`} className="text-sm text-teal hover:underline">{s.email}</a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-charcoal/45">{formatDate(s.createdAt)}</span>
                  <button onClick={() => onDelete(s.id)} className="text-xs font-semibold text-red-600 hover:underline">
                    Delete
                  </button>
                </div>
              </div>
              {(s.company || s.service) && (
                <p className="mt-1 text-xs text-charcoal/55">
                  {s.company ? `Company: ${s.company}` : ""}
                  {s.company && s.service ? " · " : ""}
                  {s.service ? `Service: ${s.service}` : ""}
                </p>
              )}
              {s.message && <p className="mt-2 text-sm text-charcoal/70">{s.message}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsTab({
  githubConfigured,
  cloudinaryConfigured,
}: {
  githubConfigured: boolean;
  cloudinaryConfigured: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadUrl, setUploadUrl] = useState("");

  const testUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadUrl("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    setUploading(false);
    if (res.ok) {
      const data = await res.json();
      setUploadUrl(data.url);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="card grid gap-4 p-6 sm:grid-cols-2">
        <div>
          <h3 className="font-semibold">GitHub Integration</h3>
          <p className="mt-1 text-sm text-charcoal/60">
            {githubConfigured
              ? "Connected — content syncs via the GitHub API in production."
              : "Not configured. Set GITHUB_REPO & GITHUB_TOKEN to enable remote sync."}
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Cloudinary Uploads</h3>
          <p className="mt-1 text-sm text-charcoal/60">
            {cloudinaryConfigured
              ? "Connected — images upload to Cloudinary."
              : "Not configured. Set CLOUDINARY_URL to enable real uploads (placeholder used otherwise)."}
          </p>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-display text-xl font-semibold">Image Upload</h3>
        <p className="mt-1 text-sm text-charcoal/60">Test the upload endpoint.</p>
        <input type="file" accept="image/*" onChange={testUpload} className="mt-3 block text-sm" />
        {uploading && <p className="mt-2 text-sm text-charcoal/50">Uploading…</p>}
        {uploadUrl && (
          <p className="mt-2 break-all text-sm text-teal">
            Uploaded: <a href={uploadUrl} target="_blank" rel="noreferrer" className="underline">{uploadUrl}</a>
          </p>
        )}
      </div>

      <div className="card p-6">
        <h3 className="font-display text-xl font-semibold">Security</h3>
        <p className="mt-1 text-sm text-charcoal/60">
          Change the admin password via the <code className="rounded bg-cream-100 px-1">ADMIN_PASSWORD</code>{" "}
          environment variable. Sessions expire after 7 days.
        </p>
      </div>
    </div>
  );
}
