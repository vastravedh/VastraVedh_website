"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Item {
  slug: string;
  name: string;
  current: string;
  isCustom: boolean;
}

export default function CategoryImageManager({ items }: { items: Item[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const upload = async (slug: string, file: File | null) => {
    if (!file) return;
    setBusy(slug);
    setMsg("");
    const fd = new FormData();
    fd.append("slug", slug);
    fd.append("file", file);
    const res = await fetch("/api/admin/category-image", {
      method: "POST",
      body: fd,
    });
    const data = await res.json().catch(() => ({}));
    setBusy(null);
    if (res.ok) {
      setMsg(`Updated "${slug}" banner. Live on the homepage now.`);
      router.refresh();
    } else {
      setMsg(data.error || "Upload failed.");
    }
  };

  const reset = async (slug: string) => {
    setBusy(slug);
    await fetch("/api/admin/category-image", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    setBusy(null);
    router.refresh();
  };

  return (
    <div className="mt-6">
      {msg && (
        <p className="mb-4 text-sm font-medium text-gold-dark">{msg}</p>
      )}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((c) => (
          <div
            key={c.slug}
            className="overflow-hidden rounded-lg bg-white shadow-card"
          >
            <div className="relative aspect-square">
              <Image
                src={c.current}
                alt={c.name}
                fill
                sizes="25vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              <span className="absolute bottom-2 left-0 right-0 text-center font-serif text-base font-semibold text-cream">
                {c.name}
              </span>
              {c.isCustom && (
                <span className="absolute left-2 top-2 rounded bg-gold px-2 py-0.5 text-[10px] font-bold text-ink">
                  Custom
                </span>
              )}
            </div>
            <div className="space-y-2 p-3">
              <label className="block cursor-pointer rounded-md bg-maroon px-3 py-2 text-center text-xs font-semibold text-cream hover:bg-maroon-dark">
                {busy === c.slug ? "Uploading…" : "Upload Image"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={busy === c.slug}
                  onChange={(e) => upload(c.slug, e.target.files?.[0] ?? null)}
                />
              </label>
              {c.isCustom && (
                <button
                  onClick={() => reset(c.slug)}
                  disabled={busy === c.slug}
                  className="w-full text-xs font-medium text-maroon hover:underline"
                >
                  Reset to default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
