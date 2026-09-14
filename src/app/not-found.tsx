import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-px py-24 text-center">
      <p className="font-serif text-6xl font-bold text-gold">404</p>
      <h1 className="mt-4 font-serif text-3xl font-bold text-maroon">
        Page not found
      </h1>
      <p className="mt-2 text-ink/60">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className="btn-primary mt-6">
        Back to Home
      </Link>
    </div>
  );
}
