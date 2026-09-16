import AdminHeader from "../AdminHeader";
import { getSubscribers } from "@/lib/subscriberStore";

export const metadata = { title: "Subscribers — VastraVedh Admin" };
export const dynamic = "force-dynamic";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default async function AdminSubscribersPage() {
  const subs = await getSubscribers();

  return (
    <div className="min-h-screen bg-cream">
      <AdminHeader />
      <div className="container-px py-8">
        <h1 className="font-serif text-2xl font-bold text-maroon">
          Newsletter Subscribers
        </h1>
        <p className="mt-1 text-sm text-ink/60">
          People who signed up via &ldquo;Stay in Style&rdquo;. When you publish
          a new product, they&apos;re emailed automatically (once an email
          provider is configured).
        </p>

        <p className="mt-4 text-sm font-medium text-maroon">
          {subs.length} subscriber{subs.length === 1 ? "" : "s"}
        </p>

        {subs.length === 0 ? (
          <p className="mt-10 text-center text-ink/50">No subscribers yet.</p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-lg border border-maroon/10 bg-white shadow-card">
            <table className="w-full text-sm">
              <thead className="bg-cream-dark text-left text-ink/60">
                <tr>
                  <th className="px-4 py-2 font-medium">Email</th>
                  <th className="px-4 py-2 font-medium">Source</th>
                  <th className="px-4 py-2 font-medium">Subscribed</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => (
                  <tr key={s.email} className="border-t border-maroon/10">
                    <td className="px-4 py-2 text-ink">{s.email}</td>
                    <td className="px-4 py-2 text-ink/60">{s.source ?? "—"}</td>
                    <td className="px-4 py-2 text-ink/60">
                      {formatDate(s.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
