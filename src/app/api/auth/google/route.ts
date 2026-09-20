import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { createSession } from "@/lib/userAuth";
import { getOrCreateUser, updateProfile } from "@/lib/userStore";

export const runtime = "nodejs";

/**
 * Sign in with Google. The browser completes the Google popup via the Firebase
 * client SDK and posts the resulting Firebase ID token here. We verify it with
 * the Admin SDK, then create our own session cookie (same one the email-OTP
 * flow uses), so the rest of the account area works identically.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const idToken = String(body?.idToken ?? "").trim();
  if (!idToken) {
    return NextResponse.json(
      { ok: false, error: "Missing sign-in token." },
      { status: 400 }
    );
  }

  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(idToken);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not verify Google sign-in." },
      { status: 401 }
    );
  }

  const email = (decoded.email ?? "").trim().toLowerCase();
  if (!email || decoded.email_verified === false) {
    return NextResponse.json(
      { ok: false, error: "A verified email is required." },
      { status: 401 }
    );
  }

  await getOrCreateUser(email);
  // Save their display name if we don't have one yet.
  const name = (decoded.name as string | undefined)?.trim();
  if (name) await updateProfile(email, { name });

  await createSession(email);
  return NextResponse.json({ ok: true, user: { email, name } });
}
