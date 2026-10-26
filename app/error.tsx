"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // If it's a chunk loading failure from a new deployment, auto-reload once
    if (
      error?.name === "ChunkLoadError" ||
      error?.message?.includes("Loading chunk") ||
      error?.message?.includes("Failed to fetch dynamically imported module")
    ) {
      try {
        const reloadKey = "elims_chunk_reloaded";
        if (typeof window !== "undefined" && !sessionStorage.getItem(reloadKey)) {
          sessionStorage.setItem(reloadKey, "true");
          window.location.reload();
        }
      } catch {
        // Fall back gracefully if storage is restricted
        window.location.reload();
      }
    }
    console.error("Application error captured:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf7f0] px-6 py-16 text-center text-[#144a3b]">
      <Link href="/" className="mb-8 inline-block">
        <Image
          src="/logo1.png"
          alt="Elims Clothings"
          width={120}
          height={70}
          priority
          className="h-14 w-auto object-contain mx-auto"
        />
      </Link>

      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#865d1d]">
        Elims Clothings Atelier
      </span>

      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#144a3b] mt-3">
        Experience in Progress
      </h1>

      <p className="mt-4 max-w-md text-sm sm:text-base text-[#465b52] leading-relaxed">
        We encountered a brief interruption while preparing this collection view.
        Please refresh or return to explore our pieces.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => reset()}
          className="rounded-full bg-[#144a3b] px-7 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#1f6652]"
        >
          Try Again
        </button>

        <Link
          href="/"
          className="rounded-full border border-[#c5ad7c] bg-white/80 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#715018] transition hover:bg-white"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
