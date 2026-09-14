import { notFound } from "next/navigation";
import { getCategory } from "@/data/categories";
import { catalogByCategory } from "@/lib/catalog";
import ProductFilters from "@/components/ProductFilters";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { slug: string } }) {
  const category = getCategory(params.slug);
  if (!category) return { title: "Not Found — VastraVedh" };
  return {
    title: `${category.name} — VastraVedh`,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = getCategory(params.slug);
  if (!category) notFound();

  const products = await catalogByCategory(category.slug);

  return (
    <div className="container-px py-10">
      {/* Category header */}
      <div className="mb-8 text-center">
        <nav className="mb-2 text-xs text-ink/50">
          Home / <span className="text-maroon">{category.name}</span>
        </nav>
        <h1 className="font-serif text-4xl font-bold text-maroon">
          {category.name}
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-ink/60">
          {category.description}
        </p>
        <div className="mx-auto mt-3 h-0.5 w-16 bg-gold" />
      </div>

      {products.length === 0 ? (
        <p className="py-16 text-center text-ink/50">
          New styles arriving soon. Check back shortly!
        </p>
      ) : (
        <ProductFilters products={products} />
      )}
    </div>
  );
}
