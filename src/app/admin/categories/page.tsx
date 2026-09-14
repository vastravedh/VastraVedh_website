import { categories } from "@/data/categories";
import { getCategoryImages } from "@/lib/categoryImageStore";
import AdminHeader from "../AdminHeader";
import CategoryImageManager from "./CategoryImageManager";

export const metadata = { title: "Category Images — VastraVedh Admin" };
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const uploaded = await getCategoryImages();

  const items = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    current: uploaded[c.slug] ?? c.image,
    isCustom: !!uploaded[c.slug],
  }));

  return (
    <div className="min-h-screen bg-cream">
      <AdminHeader />
      <div className="container-px py-8">
        <h1 className="font-serif text-2xl font-bold text-maroon">
          Category Images
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          Upload a banner image for each category. These show in the
          &ldquo;Shop by Category&rdquo; section on the homepage.
        </p>

        <CategoryImageManager items={items} />
      </div>
    </div>
  );
}
