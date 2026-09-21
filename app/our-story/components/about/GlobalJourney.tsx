import Link from "next/link";
import { CONTAINER, Eyebrow, SERIF } from "./ui";

export default function GlobalJourney() {
  return (
    <section className={`${CONTAINER} pb-24 pt-16 text-center lg:pb-36 lg:pt-24`}>
      <Eyebrow className="text-[9px]">Continental to universal</Eyebrow>
      <h2
        className={`${SERIF} mt-5 text-[32px] font-light leading-[1.2] text-[#144A3B] sm:text-[40px] lg:text-[44px]`}
      >
        A Global Journey
      </h2>
      <p className="mx-auto mt-6 max-w-[780px] text-[14px] leading-[1.9] text-[#4A554E]">
        Today, Elims Clothings continues its journey with a renewed vision and
        an even greater purpose—to bring the richness of African fashion to a
        global audience while remaining deeply connected to the culture,
        stories, and artistry that inspire us.
      </p>

      <div className="relative mx-auto mt-14 max-w-[1000px] overflow-hidden bg-[#144A3B] px-6 py-16 text-white shadow-[0_34px_60px_-24px_rgba(10,40,30,0.55)] sm:px-12 lg:mt-16 lg:py-24">
        {/* Oversized monogram */}
        <span
          aria-hidden="true"
          className={`${SERIF} pointer-events-none absolute -bottom-10 right-6 select-none text-[200px] leading-none text-white/[0.08] lg:text-[260px]`}
        >
          E
        </span>

        <div className="relative">
          <p className="text-[8px] font-medium uppercase tracking-[0.22em] text-[#9DBFAE]">
            The Maison Creed
          </p>

          <div
            className={`${SERIF} mt-8 space-y-3 text-[20px] leading-snug sm:text-[24px]`}
          >
            <p>This is more than a fashion brand.</p>
            <p>This is a journey of purpose.</p>
            <p className="text-[#A9C9B7]">A celebration of heritage.</p>
            <p>A vision of elegance.</p>
            <p>And the beginning of a legacy.</p>
          </div>

          <p className={`${SERIF} mt-14 text-[20px] sm:text-[22px]`}>
            Welcome to the world of Elims Clothings.
          </p>
          <p className="mt-2 text-[11px] text-white/55">
            Our story is still being written—and we invite you to be part of it.
          </p>

          <p className="mx-auto mt-10 max-w-[560px] border border-white/15 px-5 py-3 text-[8px] font-medium uppercase leading-[1.8] tracking-[0.2em] text-white/70">
            Elims Clothings — Woven with heritage. Designed with purpose.
            Created for the world.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/collections"
              className="bg-white px-7 py-3.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#144A3B] transition-colors hover:bg-[#F0EDE4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Explore collections
            </Link>
            <Link
              href="/the-edit"
              className="bg-[#0F3A2E] px-7 py-3.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/85 transition-colors hover:bg-[#0B2F25] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              View the edit
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
