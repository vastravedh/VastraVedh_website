import Link from "next/link";
import { notFound } from "next/navigation";
import { getBaseProducts } from "@/data/products";
import { getUploadedImages } from "@/lib/uploadStore";
import AdminHeader from "../../AdminHeader";
import UploadManager from "./UploadManager";

export const dynamic = "force-dynamic";

export default async function AdminProductPage({
  params,
}: {
  params: { baseId: string };
}) {
  const base = getBaseProducts().find(
    (p) => (p.baseId ?? p.id) === params.baseId
  );
  if (!base) notFound();

  const uploaded = await getUploadedImages(params.baseId);

  return (
    <div className="min-h-screen bg-cream">
      <AdminHeader />
      <div className="container-px py-8">
        <nav className="mb-4 text-xs text-ink/50">
          <Link href="/admin" className="hover:text-maroon">
            Admin
          </Link>{" "}
          / <span className="text-maroon">{base.name}</span>
        </nav>

        <h1 className="font-serif text-2xl font-bold text-maroon">
          {base.name}
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          Product ID: <span className="font-mono">{params.baseId}</span> ·
          Category: <span className="capitalize">{base.category}</span>
        </p>

        <UploadManager baseId={params.baseId} initial={uploaded} />
      </div>
    </div>
  );
}
