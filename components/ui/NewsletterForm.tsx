"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Newsletter", email, message: "", type: "newsletter" }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2" noValidate>
      <label htmlFor="newsletter-email" className="text-sm font-medium text-charcoal/70">
        Get marketing insights in your inbox
      </label>
      <div className="flex items-center gap-2 rounded-full border border-charcoal/15 bg-cream-50 p-1.5 pl-4 focus-within:border-teal">
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="w-full bg-transparent text-sm outline-none placeholder:text-charcoal/40"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="gradient-bg grid h-9 w-9 shrink-0 place-items-center rounded-full text-white transition-opacity disabled:opacity-60"
          aria-label="Subscribe"
        >
          <Icon name="arrow-right" size={18} />
        </button>
      </div>
      {status === "done" && (
        <p className="text-xs font-medium text-teal">Thanks — you&apos;re subscribed!</p>
      )}
      {status === "error" && (
        <p className="text-xs font-medium text-red-600">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
