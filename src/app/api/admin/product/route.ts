import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/adminAuth";
import { addCustomProduct, deleteCustomProduct } from "@/lib/productStore";
import { uploadImage, extForType } from "@/lib/firebase/storage";
import { Product } from "@/data/types";

export const runtime = "nodejs";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const form = await req.formData();
  const get = (k: string) => String(form.get(k) ?? "").trim();

  const name = get("name");
  const category = get("category");
  const mrp = Number(get("mrp"));
  const price = Number(get("price"));
  const fabric = get("fabric") || "—";
  const description = get("description") || "";
  const sizes = get("sizes")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const colors = get("colors")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const rating = Number(get("rating")) || 4.5;
  const reviews = Number(get("reviews")) || 0;

  // Parse the per-size stock map sent by the form (JSON: { S: 5, M: 0 }).
  let stock: Record<string, number> = {};
  try {
    const raw = get("stock");
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      for (const [k, v] of Object.entries(parsed)) {
        const qty = Math.max(0, Math.floor(Number(v) || 0));
        stock[k.trim()] = qty;
      }
    }
  } catch {
    stock = {};
  }
  // If sizes were provided but no stock map, default each to 0.
  if (Object.keys(stock).length === 0) {
    for (const s of sizes) stock[s] = 0;
  }

  // Validate required fields
  if (!name || !category || !price || sizes.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Name, category, selling price and at least one size are required." },
      { status: 400 }
    );
  }
  const finalMrp = mrp && mrp >= price ? mrp : price;

  // Unique id/slug
  const id = `c-${Date.now().toString(36)}`;
  const slug = `${slugify(name)}-${id}`;

  // Save uploaded images to Firebase Storage under uploads/<id>/
  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  const images: string[] = [];
  for (const file of files) {
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { ok: false, error: `Unsupported file type: ${file.type}` },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { ok: false, error: `${file.name} exceeds 5MB` },
        { status: 400 }
      );
    }
    const ext = extForType(file.type);
    const filename = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;
    const url = await uploadImage(
      `uploads/${id}/${filename}`,
      Buffer.from(await file.arrayBuffer()),
      file.type
    );
    images.push(url);
  }

  if (images.length === 0) {
    images.push("/placeholder.jpg");
  }

  const product: Product = {
    id,
    baseId: id,
    slug,
    name,
    category,
    price,
    mrp: finalMrp,
    images,
    colors: colors.length ? colors : ["Maroon"],
    sizes,
    stock,
    fabric,
    rating: Math.min(5, Math.max(0, rating)),
    reviews: Math.max(0, Math.round(reviews)),
    description,
    isNew: true,
    variantColor: colors[0] ?? "Maroon",
    status: "draft",
  };

  await addCustomProduct(product);
  return NextResponse.json({ ok: true, product });
}

export async function DELETE(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  await deleteCustomProduct(id);
  return NextResponse.json({ ok: true });
}
