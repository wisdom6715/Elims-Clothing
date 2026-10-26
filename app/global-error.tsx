"use client";

import Image from "next/image";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-center bg-[#faf7f0] px-6 py-16 text-center text-[#144a3b] font-sans antialiased">
        <div className="mb-6">
          <Image
            src="/logo1.png"
            alt="Elims Clothings"
            width={120}
            height={70}
            className="h-14 w-auto object-contain mx-auto"
          />
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif text-[#144a3b]">
          Elims Clothings
        </h1>

        <p className="mt-3 max-w-md text-sm text-[#465b52]">
          A temporary issue occurred while loading this page. Please try refreshing.
        </p>

        <div className="mt-7 flex gap-4">
          <button
            onClick={() => reset()}
            className="rounded-full bg-[#144a3b] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white"
          >
            Reload Page
          </button>
          <a
            href="/"
            className="rounded-full border border-[#c5ad7c] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#715018]"
          >
            Home
          </a>
        </div>
      </body>
    </html>
  );
}
