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
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.75fr)_minmax(280px,0.75fr)] lg:gap-5">
        {/* MAIN HERO CAROUSEL */}
        <article
          className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[660px] overflow-hidden rounded-[2rem] border border-[#e5decb] bg-[#faf7f0] lg:border-[#523d1d] lg:bg-[#1f150a] shadow-xl"
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
                  className="object-contain object-right-bottom sm:object-cover sm:object-center lg:object-cover lg:object-right"
                />

                {/* Editorial Gradient Overlay for legibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#fbf8f2] via-[#fbf8f2]/90 to-transparent sm:via-[#fbf8f2]/75 lg:from-[#1f150a] lg:via-[#1f150a]/90 lg:to-transparent lg:w-[68%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#fbf8f2] via-transparent to-transparent sm:hidden" />
              </div>
            ))}
          </div>


          {/* Content Layer (Aligned with the typography in the uploaded images) */}
          <div className="relative z-20 flex h-full min-h-[580px] sm:min-h-[640px] lg:min-h-[660px] max-w-xl flex-col justify-between p-7 sm:p-10 lg:p-12">
            {/* Main Headline Block */}
            <div className="my-auto py-4">
              <span className="inline-block rounded-full border border-[#d8be86] bg-[#f7f2e6] px-3.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[#876221] lg:border-[#8f6e33]/70 lg:bg-[#342413]/80 lg:text-[#f3dfb5]">
                {activeSlide.badge}
              </span>

              <h1 className="font-garamond mt-4 text-[clamp(2.8rem,5.2vw,5.5rem)] font-light leading-[0.9] tracking-[-0.04em] text-[#865d1d] lg:text-[#fffdfa] sm:leading-[0.92]">
                {activeSlide.title}
              </h1>

              <div className="my-4 h-0.5 w-16 bg-gradient-to-r from-[#c89e47] to-transparent lg:from-[#e4c98f]" />

              <p className="max-w-md text-[14px] leading-relaxed text-[#595246] lg:text-[#dfd7c9] sm:text-[15.5px]">
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
                  className="inline-flex items-center gap-2 rounded-full border border-[#c5ad7c] bg-white/70 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#715018] backdrop-blur-sm transition-colors hover:bg-white lg:border-[#a88344]/70 lg:bg-[#2e1d0f]/70 lg:text-[#f3dfb5] lg:hover:bg-[#3d2714]"
                >
                  <span>Shop All Pieces</span>
                </Link>
              </div>
            </div>

            {/* Bottom Controls & Slide Thumbnails */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#d8be86]/40 lg:border-[#856128]/40 pt-4">
              <div className="flex items-center gap-2">
                {CAMPAIGN_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setCurrent(idx)}
                    aria-label={`Go to ${slide.category}`}
                    className={`h-2.5 transition-all duration-300 rounded-full ${
                      idx === current
                        ? "w-8 bg-[#9c7128] lg:bg-[#e4c98f]"
                        : "w-2.5 bg-[#d8be86]/50 lg:bg-[#856128]/50 hover:bg-[#9c7128]/50 lg:hover:bg-[#e4c98f]/50"
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
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d8be86] bg-white/80 text-[#865d1d] transition hover:bg-[#865d1d] hover:text-white lg:border-[#856128] lg:bg-[#2b1c0e]/80 lg:text-[#e4c98f] lg:hover:bg-[#e4c98f] lg:hover:text-[#20160b]"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() =>
                    setCurrent((prev) => (prev + 1) % CAMPAIGN_SLIDES.length)
                  }
                  aria-label="Next slide"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d8be86] bg-white/80 text-[#865d1d] transition hover:bg-[#865d1d] hover:text-white lg:border-[#856128] lg:bg-[#2b1c0e]/80 lg:text-[#e4c98f] lg:hover:bg-[#e4c98f] lg:hover:text-[#20160b]"
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
