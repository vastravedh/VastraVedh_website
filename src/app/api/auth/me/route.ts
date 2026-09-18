import { NextResponse } from "next/server";
import { currentUserEmail } from "@/lib/userAuth";
import { getUser } from "@/lib/userStore";

export const runtime = "nodejs";

/** Return the currently logged-in user (or null). */
export async function GET() {
  const email = await currentUserEmail();
  if (!email) return NextResponse.json({ user: null });
  const user = await getUser(email);
  return NextResponse.json({
    user: user
      ? { email: user.email, name: user.name, phone: user.phone }
      : { email },
  });
}
