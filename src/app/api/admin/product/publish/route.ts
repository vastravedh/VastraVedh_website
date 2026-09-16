import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/adminAuth";
import { publishProducts, getCustomProducts } from "@/lib/productStore";
import { notifyNewArrival } from "@/lib/subscriberStore";

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

  // Best-effort: email subscribers about each newly published arrival. This
  // is a no-op until an email provider is configured (RESEND_API_KEY), and it
  // never fails the publish operation.
  let notified = 0;
  try {
    const all = await getCustomProducts();
    const published = all.filter((p) => cleanIds.includes(p.id));
    for (const p of published) {
      const r = await notifyNewArrival({
        name: p.name,
        slug: p.slug,
        price: p.price,
        image: p.images?.[0],
      });
      if (r.ok && !r.skipped) notified += r.sent;
    }
  } catch (e) {
    console.error("[publish] new-arrival email failed:", e);
  }

  return NextResponse.json({ ok: true, published: cleanIds.length, notified });
}
