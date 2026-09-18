import "server-only";
import { cookies } from "next/headers";
import crypto from "crypto";
import { adminDb } from "./firebase/admin";

/**
 * Passwordless shopper auth via email OTP.
 *
 * Flow:
 *  1. requestOtp(email) — generate a 6-digit code, store its hash + expiry in
 *     Firestore `otps/<email>`, and email it (via the mailer).
 *  2. verifyOtp(email, code) — check the code, and on success set a signed
 *     session cookie identifying the user.
 *
 * The session cookie is an HMAC of the email (so it can't be forged) plus the
 * email itself, signed with ADMIN_SESSION_SECRET.
 */

const COOKIE = "vv_user";
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const OTP_MAX_ATTEMPTS = 5;

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET || "dev-insecure-secret-change-me";
}

function hash(value: string): string {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

const otpCol = () => adminDb.collection("otps");

/** Generate + store + email a one-time code. Returns the code in dev only. */
export async function requestOtp(
  email: string
): Promise<{ ok: boolean; devCode?: string }> {
  const id = email.trim().toLowerCase();
  const code = String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
  const expiresAt = Date.now() + OTP_TTL_MS;

  await otpCol().doc(id).set({
    codeHash: hash(code),
    expiresAt,
    attempts: 0,
    createdAt: Date.now(),
  });

  // Email the code (no-op if the mailer isn't configured).
  const { sendEmail } = await import("./mailer");
  const html = `
    <div style="font-family:Arial,sans-serif;color:#2B1A1F">
      <h2 style="color:#7B0F2B">Your VastraVedh login code</h2>
      <p>Use this code to sign in. It expires in 10 minutes.</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:6px;color:#7B0F2B">${code}</p>
      <p style="font-size:12px;color:#888">If you didn't request this, you can ignore this email.</p>
    </div>`;
  const res = await sendEmail({
    to: id,
    subject: `${code} is your VastraVedh login code`,
    html,
  });

  // In dev (or when email isn't configured), surface the code so it's testable.
  const devCode =
    res.skipped || process.env.NODE_ENV !== "production" ? code : undefined;
  return { ok: true, devCode };
}

/** Verify a code. On success sets the session cookie and returns the email. */
export async function verifyOtp(
  email: string,
  code: string
): Promise<{ ok: boolean; error?: string }> {
  const id = email.trim().toLowerCase();
  const ref = otpCol().doc(id);
  const snap = await ref.get();
  if (!snap.exists) {
    return { ok: false, error: "Please request a new code." };
  }
  const data = snap.data() as {
    codeHash: string;
    expiresAt: number;
    attempts: number;
  };

  if (Date.now() > data.expiresAt) {
    await ref.delete().catch(() => {});
    return { ok: false, error: "Code expired. Please request a new one." };
  }
  if ((data.attempts ?? 0) >= OTP_MAX_ATTEMPTS) {
    await ref.delete().catch(() => {});
    return { ok: false, error: "Too many attempts. Please request a new code." };
  }
  if (hash(code.trim()) !== data.codeHash) {
    await ref.update({ attempts: (data.attempts ?? 0) + 1 }).catch(() => {});
    return { ok: false, error: "Incorrect code. Try again." };
  }

  // Success — clear the OTP and set the session.
  await ref.delete().catch(() => {});
  await createSession(id);
  return { ok: true };
}

/* ---------- Session ---------- */

function makeToken(email: string): string {
  return `${email}.${hash(`user:${email}`)}`;
}

export async function createSession(email: string): Promise<void> {
  cookies().set(COOKIE, makeToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function destroyUserSession(): Promise<void> {
  cookies().delete(COOKIE);
}

/** The logged-in user's email, or null. Verifies the cookie signature. */
export async function currentUserEmail(): Promise<string | null> {
  const raw = cookies().get(COOKIE)?.value;
  if (!raw) return null;
  const idx = raw.lastIndexOf(".");
  if (idx <= 0) return null;
  const email = raw.slice(0, idx);
  const sig = raw.slice(idx + 1);
  if (sig !== hash(`user:${email}`)) return null;
  return email;
}
