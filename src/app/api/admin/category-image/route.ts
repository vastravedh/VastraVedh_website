import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/adminAuth";
import { setCategoryImage, removeCategoryImage } from "@/lib/categoryImageStore";
import { uploadImage, extForType } from "@/lib/firebase/storage";
import { categories } from "@/data/categories";

export const runtime = "nodejs";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

const validSlug = (s: string) => categories.some((c) => c.slug === s);

export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const form = await req.formData();
  const slug = String(form.get("slug") || "");
  const file = form.get("file");

  if (!validSlug(slug)) {
    return NextResponse.json(
      { ok: false, error: "Invalid category" },
      { status: 400 }
    );
  }
  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "No file provided" },
      { status: 400 }
    );
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { ok: false, error: `Unsupported type: ${file.type}` },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Image exceeds 5MB" },
      { status: 400 }
    );
  }

  const ext = extForType(file.type);
  const filename = `${slug}-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadImage(
    `uploads/categories/${filename}`,
    buffer,
    file.type
  );

  await setCategoryImage(slug, url);
  return NextResponse.json({ ok: true, slug, url });
}

export async function DELETE(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { slug } = await req.json().catch(() => ({}));
  if (!validSlug(slug)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  await removeCategoryImage(slug);
  return NextResponse.json({ ok: true });
}
