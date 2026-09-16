import { NextResponse } from "next/server";
import { addContactMessage } from "@/lib/contactStore";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Record a "Contact Us" message. Public endpoint. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const message = String(body.message ?? "").trim();

  if (name.length < 2) {
    return NextResponse.json(
      { ok: false, error: "Please enter your name." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  if (message.length < 5) {
    return NextResponse.json(
      { ok: false, error: "Please enter a message." },
      { status: 400 }
    );
  }

  const phone = body.phone ? String(body.phone).trim().slice(0, 20) : undefined;
  const subject = body.subject ? String(body.subject).trim().slice(0, 120) : undefined;

  try {
    await addContactMessage({
      name: name.slice(0, 120),
      email,
      phone,
      subject,
      message: message.slice(0, 5000),
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not send your message. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
