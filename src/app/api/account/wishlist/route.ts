import { NextResponse } from "next/server";
import { currentUserEmail } from "@/lib/userAuth";
import { getUser, toggleWishlist } from "@/lib/userStore";

export const runtime = "nodejs";

/** Get the current user's wishlist product ids. */
export async function GET() {
  const email = await currentUserEmail();
  if (!email) return NextResponse.json({ wishlist: [] });
  const user = await getUser(email);
  return NextResponse.json({ wishlist: user?.wishlist ?? [] });
}

/** Toggle a product in the wishlist. Requires login. */
export async function POST(req: Request) {
  const email = await currentUserEmail();
  if (!email) {
    return NextResponse.json(
      { ok: false, error: "Please sign in to save items." },
      { status: 401 }
    );
  }
  const body = await req.json().catch(() => null);
  const productId = String(body?.productId ?? "").trim();
  if (!productId) {
    return NextResponse.json({ ok: false, error: "Missing product." }, { status: 400 });
  }
  const { wishlist, added } = await toggleWishlist(email, productId);
  return NextResponse.json({ ok: true, wishlist, added });
}
