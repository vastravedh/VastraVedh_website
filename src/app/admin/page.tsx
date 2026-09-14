import Link from "next/link";
import Image from "next/image";
import { getBaseProducts } from "@/data/products";
import { getAllUploads } from "@/lib/uploadStore";
import { getCustomProducts } from "@/lib/productStore";
import { Product } from "@/data/types";
import AdminHeader from "./AdminHeader";
import DeleteProductButton from "./DeleteProductButton";

export const metadata = { title: "Admin — VastraVedh" };
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [uploads, custom] = await Promise.all([
    getAllUploads(),
    getCustomProducts(),
  ]);

  const builtIn = getBaseProducts();
  const all: Product[] = [...custom, ...builtIn];

  const byCategory = all.reduce<Record<string, Product[]>>((acc, p) => {
    (acc[p.category] ??= []).push(p);
    return acc;
  }, {});

  const isCustom = (id: string) => custom.some((c) => c.id === id);

  return (
    <div className="min-h-screen bg-cream">
      <AdminHeader />
      <div className="container-px py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-2xl font-bold text-maroon">
              Products
            </h1>
            <p className="mt-1 text-sm text-ink/60">
              Add new products, upload photos, and manage your catalogue.
              Everything here shows live on the store.
            </p>
          </div>
          <Link href="/admin/new" className="btn-primary">
            + Add Product
          </Link>
        </div>

        {Object.entries(byCategory).map(([cat, items]) => (
          <section key={cat} className="mt-8">
            <h2 className="mb-3 font-serif text-lg font-semibold capitalize text-ink">
              {cat.replace("-", " ")}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((p) => {
                const baseId = p.baseId ?? p.id;
                const uploadedCount = (uploads[baseId] ?? []).length;
                const cover = uploads[baseId]?.[0] ?? p.images[0];
                const custom = isCustom(p.id);
                return (
                  <div
                    key={p.id}
                    className="group relative overflow-hidden rounded-lg bg-white shadow-card"
                  >
                    <Link href={`/admin/product/${baseId}`}>
                      <div className="relative aspect-[3/4]">
                        <Image
                          src={cover}
                          alt={p.name}
                          fill
                          sizes="25vw"
                          className="object-cover"
                        />
                        <span
                          className={`absolute right-2 top-2 rounded px-2 py-0.5 text-[10px] font-bold ${
                            uploadedCount > 0
                              ? "bg-maroon text-cream"
                              : "bg-ink/60 text-cream"
                          }`}
                        >
                          {uploadedCount > 0
                            ? `${uploadedCount} photos`
                            : "Add photos"}
                        </span>
                        {custom && (
                          <span className="absolute left-2 top-2 rounded bg-gold px-2 py-0.5 text-[10px] font-bold text-ink">
                            Custom
                          </span>
                        )}
                      </div>
                    </Link>
                    <div className="p-3">
                      <p className="line-clamp-1 text-sm font-medium text-ink">
                        {p.name}
                      </p>
                      <p className="mt-0.5 text-xs text-ink/50">
                        ₹{p.price} · ID: {baseId}
                      </p>
                      {custom && (
                        <div className="mt-2">
                          <DeleteProductButton id={p.id} name={p.name} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
