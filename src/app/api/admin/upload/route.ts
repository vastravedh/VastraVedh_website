import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/adminAuth";
import { addUploadedImages } from "@/lib/uploadStore";
import { uploadImage, extForType } from "@/lib/firebase/storage";

export const runtime = "nodejs";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const form = await req.formData();
  const baseId = String(form.get("baseId") || "");
  const files = form.getAll("files").filter((f): f is File => f instanceof File);

  if (!baseId || !/^[a-z0-9-]+$/i.test(baseId)) {
    return NextResponse.json(
      { ok: false, error: "Invalid product id" },
      { status: 400 }
    );
  }
  if (files.length === 0) {
    return NextResponse.json(
      { ok: false, error: "No files provided" },
      { status: 400 }
    );
  }

  const savedUrls: string[] = [];
  for (const file of files) {
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { ok: false, error: `Unsupported type: ${file.type}` },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { ok: false, error: `${file.name} exceeds 5MB` },
        { status: 400 }
      );
    }
    const ext = extForType(file.type);
    const filename = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadImage(
      `uploads/${baseId}/${filename}`,
      buffer,
      file.type
    );
    savedUrls.push(url);
  }

  const all = await addUploadedImages(baseId, savedUrls);
  return NextResponse.json({ ok: true, images: all });
}
