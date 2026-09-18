import { NextResponse } from "next/server";
import { currentUserEmail } from "@/lib/userAuth";
import { addAddress, deleteAddress, getUser } from "@/lib/userStore";

export const runtime = "nodejs";

/** List the current user's saved addresses. */
export async function GET() {
  const email = await currentUserEmail();
  if (!email) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }
  const user = await getUser(email);
  return NextResponse.json({ ok: true, addresses: user?.addresses ?? [] });
}

/** Add a new address. */
export async function POST(req: Request) {
  const email = await currentUserEmail();
  if (!email) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }
  const b = await req.json().catch(() => null);
  const name = String(b?.name ?? "").trim();
  const phone = String(b?.phone ?? "").replace(/\D/g, "");
  const address = String(b?.address ?? "").trim();
  const city = String(b?.city ?? "").trim();
  const pincode = String(b?.pincode ?? "").replace(/\D/g, "");
  const landmark = b?.landmark ? String(b.landmark).trim() : undefined;

  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: "Enter a name." }, { status: 400 });
  }
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return NextResponse.json({ ok: false, error: "Enter a valid 10-digit phone." }, { status: 400 });
  }
  if (address.length < 5) {
    return NextResponse.json({ ok: false, error: "Enter your address." }, { status: 400 });
  }
  if (!city) {
    return NextResponse.json({ ok: false, error: "Enter your city." }, { status: 400 });
  }
  if (!/^\d{6}$/.test(pincode)) {
    return NextResponse.json({ ok: false, error: "Pincode must be 6 digits." }, { status: 400 });
  }

  const saved = await addAddress(email, {
    name,
    phone,
    address,
    landmark,
    city,
    pincode,
  });
  return NextResponse.json({ ok: true, address: saved });
}

/** Delete an address by id. */
export async function DELETE(req: Request) {
  const email = await currentUserEmail();
  if (!email) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }
  const b = await req.json().catch(() => null);
  const id = String(b?.id ?? "").trim();
  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing address id." }, { status: 400 });
  }
  await deleteAddress(email, id);
  return NextResponse.json({ ok: true });
}
