import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/userAuth";
import { getOrCreateUser } from "@/lib/userStore";

export const runtime = "nodejs";

/** Verify the OTP; on success create the user record and set the session. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const email = String(body?.email ?? "").trim().toLowerCase();
  const code = String(body?.code ?? "").trim();

  if (!email || !/^\d{6}$/.test(code)) {
    return NextResponse.json(
      { ok: false, error: "Enter the 6-digit code." },
      { status: 400 }
    );
  }

  const result = await verifyOtp(email, code);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error || "Invalid code." },
      { status: 401 }
    );
  }

  const user = await getOrCreateUser(email);
  return NextResponse.json({ ok: true, user: { email: user.email, name: user.name } });
}
