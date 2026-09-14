import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/adminAuth";
import { removeUploadedImage } from "@/lib/uploadStore";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { baseId, url } = await req.json().catch(() => ({}));
  if (!baseId || !url) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const remaining = await removeUploadedImage(baseId, url);
  return NextResponse.json({ ok: true, images: remaining });
}
