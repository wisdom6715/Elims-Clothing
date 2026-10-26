"use client"
import { Playfair_Display, Inter } from "next/font/google";
import {
  fittedSizes,
  freeSizes,
  girlsSizes,
  boysSizes,
  lengthOptions,
  measureSteps,
  features,
} from "./data";
import { FeatureGlyph, TapeMeasureIcon, HangerIcon } from "./SizeGuideIcon";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "next/image";
import { useEffect, useState } from "react";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export default function SizeGuidePage() {
  return (
    <main
      className={`${display.variable} ${body.variable} font-sans bg-[#FAF8F3] text-[#1A1A1A]`}
    > 
      <Header />
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <Hero />
        <FittedOutfitsSection />
        <LengthOptionsSection />
        <FreeStylesSection />
        <KidsSizeSection />
        <HowToMeasureSection />
        <FeaturesBar />
      </div>
      <Footer />
    </main>
  );
}

function SectionBand({
  eyebrow,
  title,
  tone = "dark",
}: {
  eyebrow: string;
  title: string;
  tone?: "dark" | "muted";
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1.5 px-6 py-6 text-center sm:py-7 ${
        tone === "dark" ? "bg-[#111110] text-[#F5F2EA]" : "bg-[#6E6C63] text-[#F5F2EA]"
      }`}
    >
      <h2 className="font-serif text-xl font-medium tracking-wide sm:text-2xl">{title}</h2>
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#F5F2EA]/70 sm:text-xs">
        {eyebrow}
      </p>
    </div>
  );
}

function Hero() {
  return (
    <header className="flex flex-col items-center gap-4 pb-10 pt-14 text-center sm:pb-14 sm:pt-20">
      <h1 className="font-serif text-4xl font-medium leading-tight tracking-tight sm:text-6xl">
        International Size Guide
      </h1>
      <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#6E6C63] sm:text-sm">
        Tailored for you. Designed for elegance.
      </p>
      <div className="mt-2 h-px w-16 bg-[#1A1A1A]/20" />
    </header>
  );
}

function FittedOutfitsSection() {
  const columns: { label: string; render: (s: (typeof fittedSizes)[number]) => string }[] = [
    { label: "UK Size", render: (s) => s.uk },
    { label: "US Size", render: (s) => s.us },
    { label: "EU Size", render: (s) => s.eu },
    { label: "Burst (Bust)", render: (s) => `${s.bust.in} | ${s.bust.cm}` },
    { label: "Waist", render: (s) => `${s.waist.in} | ${s.waist.cm}` },
    { label: "Hip", render: (s) => `${s.hip.in} | ${s.hip.cm}` },
    { label: "Dress Length", render: (s) => `${s.length.in} | ${s.length.cm}` },
  ];

  return (
    <section className="pb-12 sm:pb-16">
      <div className="overflow-hidden rounded-sm border border-[#E7E2D6]">
        <SectionBand eyebrow="Dresses, Jumpsuits, Tailored Sets, Two-Piece Sets" title="Fitted Outfits" />

        {/* Desktop / tablet table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="bg-[#111110] text-[#F5F2EA]">
                <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wider">
                  Nextgen Size
                </th>
                {columns.map((c) => (
                  <th
                    key={c.label}
                    className="px-5 py-3 text-[11px] font-medium uppercase tracking-wider"
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fittedSizes.map((s, i) => (
                <tr
                  key={s.size}
                  className={i % 2 === 0 ? "bg-white" : "bg-[#F5F2EA]"}
                >
                  <td className="px-5 py-4 font-serif text-base font-medium">{s.size}</td>
                  {columns.map((c) => (
                    <td key={c.label} className="px-5 py-4 text-sm text-[#3F3D37]">
                      {c.render(s)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="flex flex-col divide-y divide-[#E7E2D6] md:hidden">
          {fittedSizes.map((s) => (
            <div key={s.size} className="flex flex-col gap-3 bg-white px-5 py-5">
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-xl font-medium">{s.size}</span>
                <span className="text-xs text-[#6E6C63]">
                  UK {s.uk} · US {s.us}
                </span>
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <Field label="Bust" value={`${s.bust.in} | ${s.bust.cm}`} />
                <Field label="Waist" value={`${s.waist.in} | ${s.waist.cm}`} />
                <Field label="Hip" value={`${s.hip.in} | ${s.hip.cm}`} />
                <Field label="Length" value={`${s.length.in} | ${s.length.cm}`} />
              </dl>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <div className="flex gap-4 rounded-sm bg-[#F0EEE7] p-6">
          <TapeMeasureIcon className="h-6 w-6 shrink-0 text-[#1A1A1A]" />
          <div>
            <h3 className="font-serif text-lg font-medium">Length Options</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#3F3D37]">
              Choose your fit: Petite, Regular, or Tall — see the exact range in the panel
              below.
            </p>
          </div>
        </div>
        <div className="rounded-sm bg-[#E8E1D3] p-6">
          <p className="font-serif text-[15px] italic leading-relaxed text-[#3F3D37]">
            &ldquo;For fitted styles, we recommend 2 inches of ease on bust and waist, and
            2-4 inches ease on hip for comfort and a perfect silhouette.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-medium uppercase tracking-wider text-[#9A9789]">
        {label}
      </dt>
      <dd className="text-[#3F3D37]">{value}</dd>
    </div>
  );
}

function LengthOptionsSection() {
  return (
    <section className="pb-12 sm:pb-16">
      <h2 className="mb-6 text-center font-serif text-2xl font-medium sm:mb-8 sm:text-3xl">
        Length Options
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
        {lengthOptions.map((opt, i) => (
          <div
            key={opt.label}
            className={`rounded-sm border p-7 text-center ${
              i === 1
                ? "border-[#111110] bg-[#111110] text-[#F5F2EA]"
                : "border-[#E7E2D6] bg-white text-[#1A1A1A]"
            }`}
          >
            <p
              className={`text-[10px] font-medium uppercase tracking-[0.2em] ${
                i === 1 ? "text-[#F5F2EA]/60" : "text-[#9A9789]"
              }`}
            >
              {opt.option}
            </p>
            <p className="mt-3 font-serif text-2xl font-medium">{opt.label}</p>
            <p className="mt-3 text-sm">{opt.inches}</p>
            <p className={`text-xs ${i === 1 ? "text-[#F5F2EA]/70" : "text-[#6E6C63]"}`}>
              ({opt.cm})
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FreeStylesSection() {
  return (
    <section className="pb-12 sm:pb-16">
      <div className="overflow-hidden rounded-sm border border-[#E7E2D6]">
        <SectionBand
          eyebrow="Boubou, Kaftans, Kimonos, Abayas, Resort Wear"
          title="Free Styles"
          tone="muted"
        />

        {/* Desktop / tablet table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="bg-[#111110] text-[#F5F2EA]">
                <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wider">
                  Elims Size
                </th>
                <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wider">
                  UK Size
                </th>
                <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wider">
                  Burst (Bust) Fits Up To
                </th>
                <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wider">
                  Waist Fits Up To
                </th>
                <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wider">
                  Hip Fits Up To
                </th>
              </tr>
            </thead>
            <tbody>
              {freeSizes.map((s, i) => (
                <tr key={s.size} className={i % 2 === 0 ? "bg-white" : "bg-[#F5F2EA]"}>
                  <td className="px-5 py-4 font-serif text-base font-medium">{s.size}</td>
                  <td className="px-5 py-4 text-sm text-[#3F3D37]">{s.uk}</td>
                  <td className="px-5 py-4 text-sm text-[#3F3D37]">
                    {s.bust.in} | {s.bust.cm}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#3F3D37]">
                    {s.waist.in} | {s.waist.cm}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#3F3D37]">
                    {s.hip.in} | {s.hip.cm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="flex flex-col divide-y divide-[#E7E2D6] md:hidden">
          {freeSizes.map((s) => (
            <div key={s.size} className="flex flex-col gap-3 bg-white px-5 py-5">
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-xl font-medium">{s.size}</span>
                <span className="text-xs text-[#6E6C63]">UK {s.uk}</span>
              </div>
              <dl className="grid grid-cols-3 gap-x-3 gap-y-2 text-sm">
                <Field label="Bust" value={`${s.bust.cm} cm`} />
                <Field label="Waist" value={`${s.waist.cm} cm`} />
                <Field label="Hip" value={`${s.hip.cm} cm`} />
              </dl>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-3 border-t border-[#E7E2D6] bg-[#F5F2EA] px-5 py-5">
          <HangerIcon className="mt-0.5 h-5 w-5 shrink-0 text-[#1A1A1A]" />
          <p className="text-sm leading-relaxed text-[#3F3D37]">
            Free styles are designed for comfort and flow. Measurements are the body size
            range the style can fit. The wider the style, the more relaxed the fit.
          </p>
        </div>
      </div>
    </section>
  );
}

function KidsSizeSection() {
  const [activeTab, setActiveTab] = useState<"girls" | "boys">("girls");

  return (
    <section className="pb-12 sm:pb-16">
      <div className="overflow-hidden rounded-sm border border-[#E7E2D6]">
        <SectionBand
          eyebrow="Girls &amp; Boys Collection (Ages 2 – 16)"
          title="Children's Size Guide"
        />

        {/* Tab switcher */}
        <div className="flex border-b border-[#E7E2D6] bg-white">
          <button
            type="button"
            onClick={() => setActiveTab("girls")}
            className={`flex-1 py-3 text-center text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === "girls"
                ? "border-b-2 border-[#111110] bg-[#FAF8F3] text-[#111110]"
                : "text-[#6E6C63] hover:text-[#111110]"
            }`}
          >
            Girls&apos; Size Chart
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("boys")}
            className={`flex-1 py-3 text-center text-xs font-semibold uppercase tracking-wider transition-colors ${
              activeTab === "boys"
                ? "border-b-2 border-[#111110] bg-[#FAF8F3] text-[#111110]"
                : "text-[#6E6C63] hover:text-[#111110]"
            }`}
          >
            Boys&apos; Size Chart
          </button>
        </div>

        {/* Desktop / tablet table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="bg-[#111110] text-[#F5F2EA]">
                <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-wider">Size</th>
                <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-wider">US Size</th>
                <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-wider">Age</th>
                <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-wider">Height (in | cm)</th>
                <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-wider">Chest (in | cm)</th>
                <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-wider">Waist (in | cm)</th>
                <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-wider">Hip (in | cm)</th>
                <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-wider">Shoulder (in | cm)</th>
                <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-wider">Sleeve (in | cm)</th>
                <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-wider">
                  {activeTab === "girls" ? "Suggested Dress Length" : "Trouser Inseam"}
                </th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === "girls" ? girlsSizes : boysSizes).map((s, i) => (
                <tr key={`${s.size}-${s.usSize}`} className={i % 2 === 0 ? "bg-white" : "bg-[#F5F2EA]"}>
                  <td className="px-3 py-3 font-serif text-sm font-semibold">{s.size}</td>
                  <td className="px-3 py-3 text-xs text-[#3F3D37]">{s.usSize}</td>
                  <td className="px-3 py-3 text-xs text-[#3F3D37]">{s.age} yrs</td>
                  <td className="px-3 py-3 text-xs text-[#3F3D37]">{s.height.in} | {s.height.cm}</td>
                  <td className="px-3 py-3 text-xs text-[#3F3D37]">{s.chest.in} | {s.chest.cm}</td>
                  <td className="px-3 py-3 text-xs text-[#3F3D37]">{s.waist.in} | {s.waist.cm}</td>
                  <td className="px-3 py-3 text-xs text-[#3F3D37]">{s.hip.in} | {s.hip.cm}</td>
                  <td className="px-3 py-3 text-xs text-[#3F3D37]">{s.shoulder.in} | {s.shoulder.cm}</td>
                  <td className="px-3 py-3 text-xs text-[#3F3D37]">{s.sleeve.in} | {s.sleeve.cm}</td>
                  <td className="px-3 py-3 text-xs font-medium text-[#111110]">
                    {activeTab === "girls"
                      ? `${s.suggestedDressLength?.in} | ${s.suggestedDressLength?.cm}`
                      : `${s.trouserInseam?.in} | ${s.trouserInseam?.cm}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="flex flex-col divide-y divide-[#E7E2D6] md:hidden">
          {(activeTab === "girls" ? girlsSizes : boysSizes).map((s) => (
            <div key={`${s.size}-${s.usSize}`} className="flex flex-col gap-2.5 bg-white px-5 py-4">
              <div className="flex items-baseline justify-between">
                <span className="font-serif text-lg font-semibold">{s.size} (US {s.usSize})</span>
                <span className="text-xs text-[#6E6C63]">Age {s.age} yrs</span>
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                <div><dt className="text-[10px] text-neutral-400 uppercase">Height</dt><dd>{s.height.in} in ({s.height.cm} cm)</dd></div>
                <div><dt className="text-[10px] text-neutral-400 uppercase">Chest</dt><dd>{s.chest.in} in ({s.chest.cm} cm)</dd></div>
                <div><dt className="text-[10px] text-neutral-400 uppercase">Waist</dt><dd>{s.waist.in} in ({s.waist.cm} cm)</dd></div>
                <div><dt className="text-[10px] text-neutral-400 uppercase">Hip</dt><dd>{s.hip.in} in ({s.hip.cm} cm)</dd></div>
                <div><dt className="text-[10px] text-neutral-400 uppercase">Shoulder</dt><dd>{s.shoulder.in} in ({s.shoulder.cm} cm)</dd></div>
                <div><dt className="text-[10px] text-neutral-400 uppercase">Sleeve</dt><dd>{s.sleeve.in} in ({s.sleeve.cm} cm)</dd></div>
                <div className="col-span-2 pt-1">
                  <dt className="text-[10px] text-neutral-400 uppercase">
                    {activeTab === "girls" ? "Suggested Dress Length" : "Trouser Inseam"}
                  </dt>
                  <dd className="font-medium text-[#111110]">
                    {activeTab === "girls"
                      ? `${s.suggestedDressLength?.in} in (${s.suggestedDressLength?.cm} cm)`
                      : `${s.trouserInseam?.in} in (${s.trouserInseam?.cm} cm)`}
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowToMeasureSection() {
  const [isZoomed, setIsZoomed] = useState(false);

  // Close on Escape, lock body scroll while open
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
    <section className="pb-12 sm:pb-16">
      <div className="grid grid-cols-1 gap-8 rounded-sm bg-[#111110] p-6 text-[#F5F2EA] sm:p-10 md:grid-cols-2 md:gap-10 md:p-12">
        <button
          type="button"
          onClick={() => setIsZoomed(true)}
          aria-label="View size guide diagram full screen"
          className="group relative flex aspect-[3/4] cursor-zoom-in items-center justify-center overflow-hidden rounded-sm bg-[#F5F2EA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2EA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111110]"
        >
          <Image
            src="/size.png"
            alt="Size guide measurement diagram"
            height={700}
            width={900}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/20">
            <span className="rounded-full bg-black/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              Click to enlarge
            </span>
          </span>
        </button>

        <div className="flex flex-col justify-center gap-6 sm:gap-7">
          <h2 className="font-serif text-2xl font-medium sm:text-3xl">How to Measure</h2>
          {measureSteps.map((step) => (
            <div key={step.number} className="flex gap-4">
              <span className="font-serif text-2xl font-medium text-[#F5F2EA]/25 sm:text-3xl">
                {step.number}
              </span>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-[#F5F2EA]">
                  {step.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[#F5F2EA]/70">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isZoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Size guide diagram, enlarged"
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-8 animate-fadeIn"
        >
          <button
            type="button"
            onClick={() => setIsZoomed(false)}
            aria-label="Close enlarged image"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-[#F5F2EA] transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F2EA] sm:right-8 sm:top-8"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>

          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-full max-w-full"
          >
            <Image
              src="/size.png"
              alt="Size guide measurement diagram, enlarged"
              height={1400}
              width={1800}
              className="max-h-[90vh] w-auto max-w-full rounded-sm object-contain"
              priority
            />
          </div>
        </div>
      )}
    </section>
  );
}

function FeaturesBar() {
  return (
    <section className="border-y border-[#E7E2D6] py-10 sm:py-12">
      <div className="grid grid-cols-2 gap-y-8 gap-x-4 sm:grid-cols-5 sm:gap-x-6">
        {features.map((f) => (
          <div key={f.label} className="flex flex-col items-center gap-2.5 text-center">
            <FeatureGlyph icon={f.icon} className="h-6 w-6 text-[#1A1A1A]" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-[#3F3D37] sm:text-[11px]">
              {f.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}