import { NextResponse } from "next/server";
import { verifyPassword, createSession } from "@/lib/adminAuth";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (typeof password !== "string" || !verifyPassword(password)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  await createSession();
  return NextResponse.json({ ok: true });
}
