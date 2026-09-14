import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default function AdminHeader() {
  return (
    <div className="border-b border-maroon/10 bg-white">
      <div className="container-px flex items-center justify-between py-3">
        <Link href="/admin" className="font-serif text-lg font-bold text-maroon">
          VastraVedh <span className="text-gold-dark">Admin</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/admin" className="text-ink hover:text-maroon">
            Products
          </Link>
          <Link href="/admin/categories" className="text-ink hover:text-maroon">
            Category Images
          </Link>
          <Link href="/" className="text-ink hover:text-maroon">
            View Store
          </Link>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
