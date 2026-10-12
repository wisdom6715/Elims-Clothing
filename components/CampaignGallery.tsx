"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const LOOKBOOK_ITEMS = [
  {
    title: "Women’s Summer Couture",
    tagline: "Color of summer outfit",
    description: "Gold & cream pleated luxury wrap silhouette with bespoke tiered gele.",
    image: "/campaign/elims-women-summer.jpg",
    link: "/products/women",
    badge: "Look 01",
  },
  {
    title: "Men’s Sovereign Agbada",
    tagline: "African Heritage & Elegance",
    description: "Regal cream agbada adorned with intricate gold embroidery and royal beadwork.",
    image: "/campaign/elims-men-heritage.jpg",
    link: "/products/men",
    badge: "Look 02",
  },
  {
    title: "Children’s Summer Radiance",
    tagline: "New season, softer lines",
    description: "Handcrafted gold-striped gele with coral heirloom necklaces and pearl accents.",
    image: "/campaign/elims-kids-summer.jpg",
    link: "/products/children",
    badge: "Look 03",
  },
  {
    title: "Festive Black & Gold",
    tagline: "Ancestral Weaving",
    description: "Heritage aso-oke woven stripes engineered for celebratory milestones.",
    image: "/campaign/elims-kids-blackgold.jpg",
    link: "/products/all",
    badge: "Look 04",
  },
];

export default function CampaignGallery() {
  return (
    <section className="py-16 sm:py-20 lg:py-28 border-t border-[#e2dcd2]">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#c89e47]" />
            <p className="eyebrow text-[#865d1d]">THE 2026 EDITORIAL CAMPAIGN</p>
          </div>
          <h2 className="font-garamond mt-3 text-3xl sm:text-4xl lg:text-5xl font-light text-[#144a3b]">
            Color of Summer Outfit.
          </h2>
          <p className="mt-2 text-sm text-[#61574a] max-w-xl">
            A thoughtfully curated collection celebrating African artistry through exceptional craftsmanship, contemporary elegance, and timeless design.
          </p>
        </div>
        <Link
          href="/products/all"
          className="editorial-link text-[#865d1d] hover:text-[#144a3b] w-fit"
        >
          View Full Campaign <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {LOOKBOOK_ITEMS.map((item) => (
          <div
            key={item.badge}
            className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-[#e5decb] bg-[#faf7f0] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Poster Image Container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f0ebd9]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <span className="absolute left-4 top-4 rounded-full border border-white/40 bg-black/40 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                {item.badge}
              </span>
            </div>

            {/* Content Details */}
            <div className="flex flex-1 flex-col justify-between p-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9c7128]">
                  {item.tagline}
                </p>
                <h3 className="font-garamond mt-1.5 text-xl text-[#144a3b] sm:text-2xl font-normal">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#61574a]">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 border-t border-[#ede7d8] pt-4">
                <Link
                  href={item.link}
                  className="inline-flex w-full items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-[#865d1d] transition-colors group-hover:text-[#144a3b]"
                >
                  <span>Explore Style</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d8be86] bg-white text-[#865d1d] transition-transform duration-300 group-hover:bg-[#865d1d] group-hover:text-white">
                    <ArrowUpRight size={14} />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
