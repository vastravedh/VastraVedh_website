import Link from "next/link";

export const metadata = {
  title: "My Account — VastraVedh",
};

export default function AccountPage() {
  return (
    <div className="container-px py-16">
      <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-card">
        <h1 className="text-center font-serif text-2xl font-bold text-maroon">
          Welcome to VastraVedh
        </h1>
        <p className="mt-1 text-center text-sm text-ink/60">
          Login or create an account
        </p>

        <form className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Email or Mobile
            </label>
            <input
              type="text"
              placeholder="you@example.com"
              className="w-full rounded-md border border-maroon/20 px-3 py-2.5 text-sm outline-none focus:border-maroon"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-md border border-maroon/20 px-3 py-2.5 text-sm outline-none focus:border-maroon"
            />
          </div>
          <button type="button" className="btn-primary w-full">
            Continue
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-ink/50">
          This is a demo login. Authentication will be wired up in a later
          phase.
        </p>

        <Link
          href="/"
          className="mt-4 block text-center text-sm text-maroon hover:underline"
        >
          ← Back to shopping
        </Link>
      </div>
    </div>
  );
}
