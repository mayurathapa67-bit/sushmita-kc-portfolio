"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageField({
  label,
  value,
  onChange,
  aspect = "16/10",
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspect?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      if (!res.ok) throw new Error("Upload failed");
      const data = (await res.json()) as { url: string };
      onChange(data.url);
    } catch {
      setError("Could not upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-charcoal/70">{label}</span>
      <div className="flex flex-wrap items-center gap-4">
        <div
          className="relative overflow-hidden rounded-xl border border-charcoal/15 bg-cream-50"
          style={{ width: 140, aspectRatio: aspect }}
        >
          {value ? (
            <Image src={value} alt={label} fill sizes="140px" className="object-cover" />
          ) : (
            <span className="grid h-full w-full place-items-center text-xs text-charcoal/40">
              No image
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-teal/10 px-4 py-2 text-sm font-semibold text-teal transition-colors hover:bg-teal/20">
            {uploading ? "Uploading…" : "Upload photo"}
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
          {error && <span className="text-xs text-red-600">{error}</span>}
        </div>
      </div>
      <input
        className="input text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste an image URL"
      />
    </div>
  );
}
