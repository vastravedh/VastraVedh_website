import { NextResponse } from "next/server";
import { addSubscriber } from "@/lib/subscriberStore";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Newsletter sign-up ("Stay in Style"). Public endpoint. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const source = body?.source ? String(body.source) : "footer";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  try {
    await addSubscriber(email, source);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not subscribe. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
