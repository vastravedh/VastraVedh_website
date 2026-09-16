import { NextResponse } from "next/server";
import { addNotifyRequest } from "@/lib/notifyStore";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Record a "notify me when back in stock" request. Public endpoint. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const productId = body.productId ? String(body.productId) : undefined;
  const slug = body.slug ? String(body.slug) : undefined;
  const name = body.name ? String(body.name) : undefined;
  const size = body.size ? String(body.size) : undefined;

  try {
    await addNotifyRequest({ email, productId, slug, name, size });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not save your request. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
