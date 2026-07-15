"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";

type Status = "idle" | "loading" | "done" | "error";

export default function ContactForm({
  defaultType = "contact",
}: {
  defaultType?: "contact" | "audit";
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const update = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: defaultType }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to send");
      }
      setStatus("done");
      setForm({ name: "", email: "", company: "", service: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (status === "done") {
    return (
      <div className="card flex flex-col items-center gap-3 p-10 text-center">
        <span className="gradient-bg grid h-14 w-14 place-items-center rounded-full text-white">
          <Icon name="check" size={28} />
        </span>
        <h3 className="font-display text-2xl font-semibold">Message received!</h3>
        <p className="text-charcoal/60">
          Thanks for reaching out. I&apos;ll get back to you within 48 hours.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm font-semibold text-teal underline-offset-4 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-5 p-7 sm:p-9" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="name">
          <input
            id="name"
            required
            value={form.name}
            onChange={update("name")}
            placeholder="Jane Doe"
            className="input"
          />
        </Field>
        <Field label="Email" htmlFor="email">
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={update("email")}
            placeholder="jane@company.com"
            className="input"
          />
        </Field>
      </div>
      {defaultType === "audit" && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Company" htmlFor="company">
            <input
              id="company"
              value={form.company}
              onChange={update("company")}
              placeholder="Acme Inc."
              className="input"
            />
          </Field>
          <Field label="Service of interest" htmlFor="service">
            <select id="service" value={form.service} onChange={update("service")} className="input">
              <option value="">Select…</option>
              <option value="SEO">SEO Audit &amp; Strategy</option>
              <option value="PPC">Google Ads Management</option>
              <option value="Social">Social Media Management</option>
              <option value="Content">Content Marketing</option>
              <option value="Email">Email Automation</option>
              <option value="Analytics">Analytics &amp; Reporting</option>
            </select>
          </Field>
        </div>
      )}
      <Field label={defaultType === "audit" ? "Tell me about your business" : "Message"} htmlFor="message">
        <textarea
          id="message"
          required
          rows={5}
          value={form.message}
          onChange={update("message")}
          placeholder={
            defaultType === "audit"
              ? "Current channels, goals, and any numbers you can share…"
              : "How can I help you grow?"
          }
          className="input resize-none"
        />
      </Field>

      {status === "error" && (
        <p className="text-sm font-medium text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="gradient-bg inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition-shadow hover:shadow-[0_14px_38px_-12px_rgba(13,115,119,0.8)] disabled:opacity-60"
      >
        {status === "loading" ? "Sending…" : defaultType === "audit" ? "Request Free Audit" : "Send Message"}
        {status !== "loading" && <Icon name="arrow-right" size={18} />}
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-2 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}
