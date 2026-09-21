import { CONTAINER, Dot, Eyebrow, SERIF } from "./ui";

export default function Hero() {
  return (
    <section className={`${CONTAINER} pb-20 lg:pb-28`}>
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)] lg:gap-16">
        {/* Copy column */}
        <div className="flex flex-col justify-between gap-12">
          <div>
            <p className="inline-flex items-center gap-2 bg-[#F0EDE4] px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-[#4A554E]">
              <span
                aria-hidden="true"
                className="h-1 w-1 rounded-full bg-[#144A3B]"
              />
              The Elims Story
            </p>

            <h1
              className={`${SERIF} mt-8 text-[36px] font-light leading-[1.15] tracking-[-0.01em] text-[#1F2A24] sm:text-[42px] lg:text-[44px]`}
            >
              A Dream Woven with Purpose, Heritage &amp; Passion
            </h1>

            <p
              className={`${SERIF} mt-6 text-[18px] italic leading-relaxed text-[#6D6A4E]`}
            >
              “Every great story begins with a dream.”
            </p>

            <p className="mt-8 max-w-[440px] text-[13.5px] leading-[1.85] text-[#4A554E]">
              Elims Clothings was born from a deep love for fashion, culture,
              creativity, and the timeless beauty of African heritage. What
              began as a passion for beautiful clothing has grown into a
              vision—one that celebrates where we come from while embracing the
              limitless possibilities of where we are going.
            </p>

            <div className="mt-8 max-w-[440px] bg-[#F0EDE4] p-5">
              <Eyebrow className="text-[8px]">Origin note</Eyebrow>
              <p className="mt-2 text-[12px] leading-[1.7] text-[#4A554E]">
                Conceived in the vibrant energy of Lagos and tailored for the
                discerning world, the maison honors centuries of textile craft
                through contemporary silhouettes.
              </p>
            </div>
          </div>
        </div>

        {/* Image column */}
        <figure className="relative">
          {/*
            Placeholder — swap this div for next/image, e.g.
            <Image src="/images/about/hero.jpg" alt="…" fill className="object-cover" priority />
          */}
          <div
            role="img"
            aria-label="Elims atelier, natural light"
            className="relative aspect-[6/7] w-full bg-[linear-gradient(to_bottom,#F0EEE8_0%,#EEECE5_42%,#B7B6AF_78%,#6F6F6A_100%)]"
          >
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-5 pb-5 lg:pl-[300px] lg:pr-8 lg:pb-6">
              <span className="bg-[#144A3B] px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-white">
                No. 01
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-white/85">
                Natural light <Dot className="mx-1 align-middle" /> 55mm
              </span>
            </div>
          </div>

          <figcaption className="mt-4 bg-[#FAF9F4] p-4 shadow-[0_14px_34px_-8px_rgba(20,40,30,0.18)] lg:absolute lg:-bottom-7 lg:-left-10 lg:mt-0 lg:w-[270px]">
            <Eyebrow className="text-[8px] text-[#8C7B48]">Observation</Eyebrow>
            <p
              className={`${SERIF} mt-2 text-[13px] italic leading-relaxed text-[#4A554E]`}
            >
              “Every weave holds a coordinate of history, every dye dip in
              indigo an act of remembrance.”
            </p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
