import "server-only";
import { cookies } from "next/headers";
import crypto from "crypto";

/**
 * Minimal admin auth: a single shared password (from env) exchanged for a
 * signed session cookie. Good enough for a single-admin store. For multiple
 * admins / real accounts, swap this for a proper auth provider later.
 *
 * Configure in .env.local:
 *   ADMIN_PASSWORD=your-strong-password
 *   ADMIN_SESSION_SECRET=some-long-random-string
 */

const COOKIE = "vv_admin";

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET || "dev-insecure-secret-change-me";
}

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin123";
}

/** The token stored in the cookie: a HMAC of a fixed payload. */
function makeToken(): string {
  return crypto.createHmac("sha256", secret()).update("vv-admin").digest("hex");
}

export function verifyPassword(input: string): boolean {
  const a = Buffer.from(input);
  const b = Buffer.from(adminPassword());
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function createSession(): Promise<void> {
  cookies().set(COOKIE, makeToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
}

export async function destroySession(): Promise<void> {
  cookies().delete(COOKIE);
}

export async function isAuthed(): Promise<boolean> {
  const token = cookies().get(COOKIE)?.value;
  return !!token && token === makeToken();
}
