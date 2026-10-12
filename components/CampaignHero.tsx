"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface CampaignSlide {
  id: string;
  title: string;
  eyebrow: string;
  subtitle: string;
  image: string;
  alt: string;
  href: string;
  badge: string;
  category: string;
}

const CAMPAIGN_SLIDES: CampaignSlide[] = [
  {
    id: "women-summer",
    eyebrow: "NEW SEASON, SOFTER LINES",
    title: "Color of summer outfit.",
    subtitle:
      "A thoughtfully curated collection to make getting dressed feel natural again.",
    image: "/campaign/elims-women-summer.jpg",
    alt: "Elims Clothings - Women's Color of Summer Outfit",
    href: "/products/women",
    badge: "WOMEN'S COUTURE",
    category: "Women's Collection",
  },
  {
    id: "men-heritage",
    eyebrow: "AFRICAN HERITAGE · TIMELESS ELEGANCE",
    title: "Sovereign Poise & Distinction.",
    subtitle:
      "Royal cream and gold agbada with artisanal embroidery, crafted for poise and quiet majesty.",
    image: "/campaign/elims-men-heritage.jpg",
    alt: "Elims Clothings - Men's African Heritage Royal Agbada",
    href: "/products/men",
    badge: "MEN'S ATELIER",
    category: "Men's Collection",
  },
  {
    id: "kids-summer",
    eyebrow: "NEW SEASON, SOFTER LINES",
    title: "Color of summer outfit.",
    subtitle:
      "Joyful elegance, gold-striped gele, and heirloom coral beads celebrating little ones from inception.",
    image: "/campaign/elims-kids-summer.jpg",
    alt: "Elims Clothings - Children's Color of Summer Outfit",
    href: "/products/children",
    badge: "CHILDREN'S EDIT",
    category: "Children's Collection",
  },
  {
    id: "kids-blackgold",
    eyebrow: "HANDWOVEN HERITAGE ASO-OKE",
    title: "Festive Black & Gold Edition.",
    subtitle:
      "Ancestral loom craftsmanship tailored with modern distinction for moments that matter.",
    image: "/campaign/elims-kids-blackgold.jpg",
    alt: "Elims Clothings - Black & Gold Festive Collection",
    href: "/products/all",
    badge: "FESTIVE BESPOKE",
    category: "Festive Edition",
  },
];

export default function CampaignHero() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % CAMPAIGN_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const activeSlide = CAMPAIGN_SLIDES[current];

  return (
    <section className="py-4 sm:py-6">
      {/* Top Banner Tagline */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[#e2dcd2] pb-3 text-[11px] uppercase tracking-[0.2em] text-[#856529]">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#b88c3a]" />
          <span className="font-semibold">Official 2026 Campaign</span>
          <span className="text-[#c5beaf]">•</span>
          <span className="text-[#64594c]">African Heritage · Timeless Elegance</span>
        </div>
        <Link
          href="/about#family"
          className="text-[#856529] hover:underline font-medium tracking-[0.16em]"
        >
          The Family Behind Elims →
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.75fr)_minmax(280px,0.75fr)] lg:gap-5">
        {/* MAIN HERO CAROUSEL */}
        <article
          className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[660px] overflow-hidden rounded-[2rem] border border-[#e5decb] bg-[#faf7f0] shadow-xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Background Images Crossfade */}
          <div className="absolute inset-0">
            {CAMPAIGN_SLIDES.map((slide, idx) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                {/* Full poster on medium-up right side or full background with luxury treatment */}
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={idx === 0}
                  sizes="(min-width: 1024px) 65vw, 100vw"
                  className="object-contain object-right-bottom sm:object-cover sm:object-center lg:object-contain lg:object-right"
                />

                {/* Editorial Gradient Overlay for legibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#fbf8f2] via-[#fbf8f2]/90 to-transparent sm:via-[#fbf8f2]/75 lg:from-[#fbf8f2] lg:via-[#fbf8f2]/80 lg:to-transparent lg:w-[60%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#fbf8f2] via-transparent to-transparent sm:hidden" />
              </div>
            ))}
          </div>

          {/* Decorative Gold Filigree Curve Line */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-full">
            <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full border border-[#d8be86]/30" />
            <div className="absolute -left-10 -top-10 h-96 w-96 rounded-full border border-[#d8be86]/20" />
          </div>

          {/* Content Layer (Aligned with the typography in the uploaded images) */}
          <div className="relative z-20 flex h-full min-h-[580px] sm:min-h-[640px] lg:min-h-[660px] max-w-xl flex-col justify-between p-7 sm:p-10 lg:p-12">
            {/* Top Brand Crest & Eyebrow */}
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#c89e47]" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8a6521]">
                  {activeSlide.eyebrow}
                </p>
              </div>

              {/* Gold Crest Monogram */}
              <div className="mt-4 flex items-center gap-3">
                <span className="font-serif text-xs tracking-[0.25em] text-[#9c7128]">
                  ELIMS CLOTHINGS
                </span>
                <span className="text-[10px] text-[#c0a266]">❖</span>
                <span className="text-[9px] uppercase tracking-[0.18em] text-[#8a7a67]">
                  LAGOS COUTURE
                </span>
              </div>
            </div>

            {/* Middle Main Headline */}
            <div className="my-6">
              <span className="inline-block rounded-full border border-[#d8be86] bg-[#f7f2e6] px-3.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[#876221]">
                {activeSlide.badge}
              </span>

              <h1 className="font-garamond mt-4 text-[clamp(2.8rem,5.2vw,5.5rem)] font-light leading-[0.9] tracking-[-0.04em] text-[#865d1d] sm:leading-[0.92]">
                {activeSlide.title}
              </h1>

              <div className="my-4 h-0.5 w-16 bg-gradient-to-r from-[#c89e47] to-transparent" />

              <p className="max-w-md text-[14px] leading-relaxed text-[#595246] sm:text-[15.5px]">
                {activeSlide.subtitle}
              </p>

              {/* View Collection Pill Button */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={activeSlide.href}
                  className="gold-pill-btn inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-lg"
                >
                  <span>View Collection</span>
                  <ArrowRight size={15} />
                </Link>

                <Link
                  href="/products/all"
                  className="inline-flex items-center gap-2 rounded-full border border-[#c5ad7c] bg-white/70 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#715018] backdrop-blur-sm transition-colors hover:bg-white"
                >
                  <span>Shop All Pieces</span>
                </Link>
              </div>
            </div>

            {/* Bottom Controls & Slide Thumbnails */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#d8be86]/40 pt-4">
              <div className="flex items-center gap-2">
                {CAMPAIGN_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setCurrent(idx)}
                    aria-label={`Go to ${slide.category}`}
                    className={`h-2.5 transition-all duration-300 rounded-full ${
                      idx === current
                        ? "w-8 bg-[#9c7128]"
                        : "w-2.5 bg-[#d8be86]/50 hover:bg-[#9c7128]/50"
                    }`}
                  />
                ))}
              </div>

              {/* Next / Prev buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrent(
                      (prev) => (prev - 1 + CAMPAIGN_SLIDES.length) % CAMPAIGN_SLIDES.length
                    )
                  }
                  aria-label="Previous slide"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d8be86] bg-white/80 text-[#865d1d] transition hover:bg-[#865d1d] hover:text-white"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() =>
                    setCurrent((prev) => (prev + 1) % CAMPAIGN_SLIDES.length)
                  }
                  aria-label="Next slide"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d8be86] bg-white/80 text-[#865d1d] transition hover:bg-[#865d1d] hover:text-white"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* SIDE SPOTLIGHT CARDS (Featuring Men & Kids campaign artworks) */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-5">
          {/* Card 1: Men's Agbada Edition */}
          <Link
            href="/products/men"
            className="group relative min-h-[300px] overflow-hidden rounded-[2rem] border border-[#e5decb] bg-[#f5efe4] p-6 shadow-md transition-all duration-300 hover:shadow-xl lg:min-h-[318px]"
          >
            <Image
              src="/campaign/elims-men-heritage.jpg"
              alt="Men's Heritage Agbada Collection"
              fill
              sizes="(min-width: 1024px) 30vw, 50vw"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            {/* Dark luxury gradient for text overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

            <div className="relative z-10 flex h-full flex-col justify-between text-white">
              <span className="eyebrow text-[#e7d2a5]">Royal Atelier</span>
              <div>
                <h2 className="font-garamond text-3xl font-light leading-tight sm:text-4xl text-[#fffdfa]">
                  Men’s Royal<br />Agbada Suite
                </h2>
                <p className="mt-2 text-xs text-white/80">
                  African Heritage · Timeless Elegance
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#ecd7aa]">
                  <span>Explore Collection</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Card 2: Children's Celebratory Collection */}
          <Link
            href="/products/children"
            className="group relative min-h-[300px] overflow-hidden rounded-[2rem] border border-[#e5decb] bg-[#f5efe4] p-6 shadow-md transition-all duration-300 hover:shadow-xl lg:min-h-[318px]"
          >
            <Image
              src="/campaign/elims-kids-summer.jpg"
              alt="Children's Gold & Cream Gele Collection"
              fill
              sizes="(min-width: 1024px) 30vw, 50vw"
              className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

            <div className="relative z-10 flex h-full flex-col justify-between text-white">
              <span className="eyebrow text-[#e7d2a5]">New Season</span>
              <div>
                <h2 className="font-garamond text-3xl font-light leading-tight sm:text-4xl text-[#fffdfa]">
                  Children’s<br />Festive Gele
                </h2>
                <p className="mt-2 text-xs text-white/80">
                  Small moments, big joy &amp; heirloom grace
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#ecd7aa]">
                  <span>Shop Children</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
