"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ZoomIn, Download, Maximize2, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FeatureGlyph, TapeMeasureIcon, HangerIcon } from "./SizeGuideIcon";
import { features, measureSteps } from "./data";

export default function SizeGuidePage() {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (!isZoomed) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsZoomed(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isZoomed]);

  return (
    <main className="font-sans bg-[#FAF8F3] text-[#1A1A1A] min-h-screen">
      <Header />
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        {/* Hero */}
        <header className="flex flex-col items-center gap-4 pb-8 pt-12 text-center sm:pb-12 sm:pt-16">
          <p className="eyebrow text-[#0F473A]">Elims Clothings</p>
          <h1 className="font-serif text-4xl font-medium leading-tight tracking-tight text-[#0F473A] sm:text-5xl lg:text-6xl">
            Official Size Chart &amp; Measurements
          </h1>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#6E6C63] sm:text-xs">
            Style for Every Generation · Women · Men · Children
          </p>
          <div className="mt-2 h-px w-16 bg-[#0F473A]/20" />
        </header>

        {/* Primary Master Size Chart Graphic */}
        <section className="pb-12 sm:pb-16">
          <div className="overflow-hidden rounded-2xl border border-[#E7E2D6] bg-white shadow-sm p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E7E2D6]">
              <div>
                <h2 className="font-serif text-2xl font-medium text-[#0F473A]">
                  Elims Master Size Chart
                </h2>
                <p className="text-xs text-[#6E6C63] mt-1">
                  Click the chart below to enlarge or view in high resolution.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsZoomed(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#C6D0C8] bg-white text-[#0F473A] font-semibold text-xs hover:bg-[#F0F4F1] transition-colors"
                >
                  <ZoomIn size={14} /> Enlarge Image
                </button>
                <a
                  href="/size-chart.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0F473A] text-white font-semibold text-xs hover:bg-[#1E6151] transition-colors"
                >
                  <Download size={14} /> Open Full Size
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsZoomed(true)}
              className="group relative w-full block cursor-zoom-in rounded-xl overflow-hidden border border-[#D5DFD6] focus:outline-none focus:ring-2 focus:ring-[#0F473A]"
              title="Click to view full image"
            >
              <img
                src="/size-chart.jpg"
                alt="Elims Clothings Girls and Boys Size Chart & Measurements"
                className="w-full h-auto object-contain block transition-transform duration-300 group-hover:scale-[1.01]"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                  <ZoomIn size={14} /> Click to expand full screen
                </span>
              </div>
            </button>
          </div>
        </section>

        {/* How to Measure Section */}
        <section className="pb-12 sm:pb-16">
          <div className="grid grid-cols-1 gap-8 rounded-2xl bg-[#111110] p-6 text-[#F5F2EA] sm:p-10 md:grid-cols-2 md:gap-10 md:p-12 shadow-md">
            <button
              type="button"
              onClick={() => setIsZoomed(true)}
              aria-label="View size guide diagram full screen"
              className="group relative flex aspect-[3/4] cursor-zoom-in items-center justify-center overflow-hidden rounded-xl bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2EA]"
            >
              <img
                src="/size-chart.jpg"
                alt="Elims size guide diagram"
                className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/20">
                <span className="rounded-full bg-black/70 px-3.5 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  Click to enlarge
                </span>
              </span>
            </button>

            <div className="flex flex-col justify-center gap-6 sm:gap-7">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A96E] font-semibold">
                  Accurate Tailoring
                </p>
                <h2 className="font-serif text-2xl font-medium sm:text-3xl mt-1 text-white">
                  How to Measure
                </h2>
              </div>
              {measureSteps.map((step) => (
                <div key={step.number} className="flex gap-4">
                  <span className="font-serif text-2xl font-medium text-[#C9A96E]/40 sm:text-3xl">
                    {step.number}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-white">
                      {step.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-[#F5F2EA]/75">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features bar */}
        <section className="border-y border-[#E7E2D6] py-10 sm:py-12 mb-12">
          <div className="grid grid-cols-2 gap-y-8 gap-x-4 sm:grid-cols-5 sm:gap-x-6">
            {features.map((f) => (
              <div
                key={f.label}
                className="flex flex-col items-center gap-2.5 text-center"
              >
                <FeatureGlyph icon={f.icon} className="h-6 w-6 text-[#0F473A]" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-[#3F3D37] sm:text-[11px]">
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Fullscreen Lightbox Overlay */}
      {isZoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full size measurements chart"
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-8"
        >
          <button
            type="button"
            onClick={() => setIsZoomed(false)}
            aria-label="Close enlarged chart"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors shadow-lg"
          >
            <X size={20} />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-full max-w-full overflow-auto flex items-center justify-center"
          >
            <img
              src="/size-chart.jpg"
              alt="Elims Clothings Size Chart, Full Resolution"
              className="max-h-[95vh] max-w-[98vw] w-auto h-auto rounded-lg object-contain shadow-2xl"
            />
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
