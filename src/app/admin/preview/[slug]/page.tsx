import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomProductBySlug } from "@/lib/productStore";
import ProductDetail from "@/components/ProductDetail";
import AdminHeader from "../../AdminHeader";
import PublishBar from "./PublishBar";

export const dynamic = "force-dynamic";
export const metadata = { title: "Preview — VastraVedh Admin" };

export default async function AdminPreviewPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getCustomProductBySlug(params.slug);
  if (!product) notFound();

  const isDraft = product.status === "draft";

  return (
    <div className="min-h-screen bg-cream">
      <AdminHeader />

      {/* Preview banner — makes it obvious this is not the live page yet */}
      <div className="border-b border-gold-dark/40 bg-cream-dark">
        <div className="container-px flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="text-sm">
            <span className="rounded bg-maroon px-2 py-0.5 text-xs font-bold text-cream">
              {isDraft ? "DRAFT PREVIEW" : "LIVE"}
            </span>
            <span className="ml-2 text-ink/70">
              {isDraft
                ? "This is how the product will look. Confirm to publish it live."
                : "This product is already live for customers."}
            </span>
          </div>
          <Link href="/admin" className="text-sm font-medium text-maroon hover:underline">
            ← Back to Admin
          </Link>
        </div>
      </div>

      <div className="container-px py-10">
        {/* Same component the live product page uses, so the preview is 1:1 */}
        <ProductDetail product={product} preview />
      </div>

      {isDraft && <PublishBar id={product.id} name={product.name} />}
    </div>
  );
}
