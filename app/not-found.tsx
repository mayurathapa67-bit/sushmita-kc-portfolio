import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center container-px py-20 text-center">
      <div className="flex flex-col items-center gap-5">
        <span className="gradient-text font-display text-7xl font-semibold">404</span>
        <h1 className="font-display text-2xl font-semibold">Page not found</h1>
        <p className="max-w-md text-charcoal/60">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <Link
          href="/"
          className="gradient-bg rounded-full px-6 py-3 text-sm font-semibold text-white"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
