import { categories } from "@/data/categories";
import AdminHeader from "../AdminHeader";
import NewProductForm from "./NewProductForm";

export const metadata = { title: "Add Product — VastraVedh Admin" };

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-cream">
      <AdminHeader />
      <div className="container-px py-8">
        <h1 className="font-serif text-2xl font-bold text-maroon">
          Add New Product
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          Fill in all the details customers will see, then upload photos.
        </p>
        <NewProductForm
          categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
        />
      </div>
    </div>
  );
}
