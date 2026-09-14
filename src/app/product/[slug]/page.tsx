import { notFound } from "next/navigation";
import { getProduct } from "@/data/products";
import { catalogProduct, catalogByCategory } from "@/lib/catalog";
import ProductDetail from "@/components/ProductDetail";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) return { title: `${params.slug} — VastraVedh` };
  return {
    title: `${product.name} — VastraVedh`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await catalogProduct(params.slug);
  if (!product) notFound();

  const related = (await catalogByCategory(product.category))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container-px py-10">
      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-center font-serif text-2xl font-bold text-maroon">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
