import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/adminAuth";
import { publishProducts } from "@/lib/productStore";

export const runtime = "nodejs";

/** Publish one or more draft products (make them live). */
export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const ids: unknown = body?.ids;
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json(
      { ok: false, error: "No products selected." },
      { status: 400 }
    );
  }

  const cleanIds = ids.filter((id): id is string => typeof id === "string");
  await publishProducts(cleanIds);
  return NextResponse.json({ ok: true, published: cleanIds.length });
}
