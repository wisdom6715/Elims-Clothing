import { ArrowRightIcon, DiamondIcon } from "./icons";
import { CONTAINER, Eyebrow, GoldRule, SERIF } from "./ui";

const STATS = [
  { value: "100%", label: "Artisan woven" },
  { value: "03", label: "Primary textiles" },
  { value: "Zero", label: "Compromise" },
];

const TEXTILES = [
  {
    kicker: "Card 01 • Indigo Heritage",
    title: "Adire",
    body: "Resist-dyed storytelling using natural indigo vats and hand-drawn patterns passed down through maternal craft lineages.",
    tag: "Starch & thread resist",
  },
  {
    kicker: "Card 02 • Vibrant Geometry",
    title: "Ankara",
    body: "Vivid botanical motifs and rhythmic geometric symbols translating social proverbs, joy, and communal ceremonies.",
    tag: "Visual proverbs",
  },
  {
    kicker: "Card 03 • Ceremonial Prestige",
    title: "Aso-Oke",
    body: "Centuries-old narrow strip-woven cloth crafted on horizontal looms, embodying dignity, royal presence, and celebration.",
    tag: "Horizontal loom weft",
  },
];

export default function Heritage() {
  return (
    <section className={`${CONTAINER} py-20 lg:py-28`}>
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-20">
        {/* Image placeholder */}
        <div className="relative aspect-[4/5] w-full bg-[#EFEDE5]">
          <p className="absolute bottom-3 left-0 bg-[#FAF9F4] px-3 py-2 text-[8px] font-medium uppercase tracking-[0.2em] text-[#4A554E]">
            Handloom workshop • Master weavers
          </p>
        </div>

        {/* Copy */}
        <div>
          <Eyebrow className="text-[9px]">Ancestral alchemy</Eyebrow>
          <h2
            className={`${SERIF} mt-5 text-[32px] font-light leading-[1.2] text-[#144A3B] sm:text-[38px] lg:text-[40px]`}
          >
            Crafted by Heritage, Reimagined for Today
          </h2>
          <GoldRule className="mt-6" />

          <p className="mt-7 max-w-[560px] text-[14px] leading-[1.85] text-[#4A554E]">
            Inspired by the richness of African artistry, Elims Clothing draws
            from the beauty of traditional fabrics such as Adire, Ankara and
            Aso-Oke, reimagining them through a contemporary and refined lens.
          </p>
          <p className="mt-5 max-w-[560px] text-[12.5px] leading-[1.85] text-[#5B655E]">
            Every design reflects a desire to preserve the beauty of our
            heritage while creating something fresh, elegant, and relevant for
            today’s world. By elevating artisan textile guilds and honoring
            traditional technique, each silhouette becomes an archival relic
            tailored for contemporary existence.
          </p>

          <dl className="mt-10 grid max-w-[460px] grid-cols-3 gap-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd
                  className={`${SERIF} text-[26px] leading-none text-[#1F2A24]`}
                >
                  {s.value}
                </dd>
                <p
                  aria-hidden="true"
                  className="mt-2 text-[8px] font-medium uppercase tracking-[0.2em] text-[#5B655E]"
                >
                  {s.label}
                </p>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Textile cards */}
      <ul className="mt-20 grid gap-5 md:grid-cols-3 lg:mt-24">
        {TEXTILES.map((t) => (
          <li
            key={t.title}
            className="flex flex-col border border-[#E8E5DA] bg-[#F4F2EB] p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <Eyebrow className="text-[8px]">{t.kicker}</Eyebrow>
              <DiamondIcon className="h-3 w-3 shrink-0 text-[#B89B5E]" />
            </div>
            <h3
              className={`${SERIF} mt-8 text-[26px] leading-none text-[#144A3B]`}
            >
              {t.title}
            </h3>
            <p className="mt-4 text-[12.5px] leading-[1.75] text-[#4A554E]">
              {t.body}
            </p>
            <div className="mt-auto flex items-center justify-between pt-8">
              <Eyebrow className="text-[8px] text-[#144A3B]">{t.tag}</Eyebrow>
              <ArrowRightIcon className="h-3.5 w-3.5 text-[#144A3B]" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
