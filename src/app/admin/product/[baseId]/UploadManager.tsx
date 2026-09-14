"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function UploadManager({
  baseId,
  initial,
}: {
  baseId: string;
  initial: string[];
}) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setMsg("");
    const fd = new FormData();
    fd.append("baseId", baseId);
    Array.from(files).forEach((f) => fd.append("files", f));

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: fd,
    });
    setBusy(false);
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setImages(data.images);
      setMsg(`Uploaded ${files.length} image(s). Now live on the store.`);
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    } else {
      setMsg(data.error || "Upload failed.");
    }
  };

  const remove = async (url: string) => {
    setBusy(true);
    const res = await fetch("/api/admin/delete-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ baseId, url }),
    });
    setBusy(false);
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setImages(data.images);
      router.refresh();
    }
  };

  return (
    <div className="mt-6">
      {/* Upload zone */}
      <label
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-maroon/30 bg-white py-10 text-center transition-colors hover:border-maroon"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          upload(e.dataTransfer.files);
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => upload(e.target.files)}
        />
        <span className="text-sm font-semibold text-maroon">
          {busy ? "Uploading…" : "Click or drag images here to upload"}
        </span>
        <span className="mt-1 text-xs text-ink/50">
          JPG, PNG or WebP · up to 5MB each · you can select multiple
        </span>
      </label>

      {msg && <p className="mt-3 text-sm font-medium text-gold-dark">{msg}</p>}

      {/* Current uploaded images */}
      <h3 className="mt-8 font-serif text-lg font-semibold text-ink">
        Uploaded Images ({images.length})
      </h3>
      {images.length === 0 ? (
        <p className="mt-2 text-sm text-ink/50">
          No images uploaded yet. The store currently shows default photos for
          this product.
        </p>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((url) => (
            <div
              key={url}
              className="group relative overflow-hidden rounded-lg bg-white shadow-card"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={url}
                  alt="Uploaded product"
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              </div>
              <button
                onClick={() => remove(url)}
                disabled={busy}
                className="absolute right-2 top-2 rounded-full bg-maroon px-2 py-1 text-[10px] font-bold text-cream opacity-0 transition-opacity group-hover:opacity-100"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
