"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  /** How long each image stays before switching. Default 4000ms — slow and calm. */
  intervalMs?: number;
  /** Extra classes applied to every <Image>, e.g. object-position tweaks. */
  imageClassName?: string;
  sizes?: string;
}

/**
 * Cycles through `images` with a slow crossfade. No dots, no counters —
 * purely a background layer. Renders as a Fragment so it inherits
 * positioning from whatever wraps it (keep the wrapper `relative` or
 * `absolute` + `overflow-hidden`).
 */
export function ImageCarousel({
  images,
  alt,
  intervalMs = 4000,
  imageClassName = "",
  sizes = "(min-width: 1024px) 40vw, 62vw",
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [images.length, intervalMs]);

  return (
    <>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={`object-cover object-top transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          } ${imageClassName}`}
          priority={i === 0}
        />
      ))}
    </>
  );
}

interface HeroCarouselProps extends ImageCarouselProps {
  /** Extra classes for the rotated/positioned image wrapper. */
  wrapperClassName: string;
}

/**
 * Same crossfade behavior as ImageCarousel, plus a small circular loader
 * that spins briefly at bottom-right right before each swap. The loader is
 * rendered as a sibling (not nested in the rotated wrapper) so it stays
 * level even when the image container is slanted.
 */
export function HeroCarousel({
  images,
  alt,
  intervalMs = 4000,
  imageClassName = "",
  sizes = "(min-width: 1024px) 40vw, 62vw",
  wrapperClassName,
}: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;
    const loaderLeadMs = 500; // spinner shows briefly before each swap
    let swapTimeout: ReturnType<typeof setTimeout>;

    const cycle = setInterval(() => {
      setLoading(true);
      swapTimeout = setTimeout(() => {
        setIndex((prev) => (prev + 1) % images.length);
        setLoading(false);
      }, loaderLeadMs);
    }, intervalMs);

    return () => {
      clearInterval(cycle);
      clearTimeout(swapTimeout);
    };
  }, [images.length, intervalMs]);

  return (
    <>
      <div className={wrapperClassName}>
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            } ${imageClassName}`}
            priority={i === 0}
          />
        ))}
      </div>

      <span
        className={`absolute bottom-6 right-6 z-20 h-6 w-6 rounded-full border-2 border-white/30 border-t-white transition-opacity duration-300 ${
          loading ? "animate-spin opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />
    </>
  );
}