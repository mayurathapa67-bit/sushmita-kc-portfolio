"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Invalid password");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[80vh] place-items-center container-px py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="gradient-bg mx-auto grid h-14 w-14 place-items-center rounded-2xl text-xl font-bold text-white">
            SK
          </span>
          <h1 className="mt-4 font-display text-3xl font-semibold">Admin Login</h1>
          <p className="mt-2 text-sm text-charcoal/55">
            Enter your password to manage content and submissions.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="card flex flex-col gap-4 p-7">
          <label htmlFor="password" className="flex flex-col gap-2 text-sm font-medium">
            Password
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              autoFocus
            />
          </label>
          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="gradient-bg inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"} <Icon name="arrow-right" size={18} />
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-charcoal/40">
          Default password: sushmita2025 (set ADMIN_PASSWORD to change)
        </p>
      </div>
    </div>
  );
}
