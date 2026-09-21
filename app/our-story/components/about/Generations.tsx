import { HeartIcon, SparkIcon } from "./icons";
import { CONTAINER, Eyebrow, GoldRule, SERIF } from "./ui";

const GROUPS = [
  {
    kicker: "Couture",
    title: "The Woman",
    body: "Extraordinary, statuesque grace",
  },
  {
    kicker: "Tailoring",
    title: "The Man",
    body: "Sovereign poise and quiet distinction",
  },
  {
    kicker: "Heritage",
    title: "The Child",
    body: "Confidence rooted from inception.",
  },
];

export default function Generations() {
  return (
    <section className={`${CONTAINER} py-20 lg:py-28`}>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left */}
        <div>
          <Eyebrow className="text-[9px]">Inclusive couture</Eyebrow>
          <h2
            className={`${SERIF} mt-5 text-[30px] font-light leading-[1.2] text-[#144A3B] sm:text-[36px] lg:text-[38px]`}
          >
            Created For Every Generation
          </h2>
          <GoldRule className="mt-6" />

          <p className="mt-7 max-w-[520px] text-[13.5px] leading-[1.85] text-[#4A554E]">
            Elims Clothings was created for the woman who wants to feel
            extraordinary, the man who values distinction, and the child whose
            confidence and individuality deserve to be celebrated from the very
            beginning.
          </p>

          <ul className="mt-9 grid max-w-[520px] grid-cols-1 gap-3 sm:grid-cols-3">
            {GROUPS.map((g) => (
              <li key={g.title} className="bg-[#F0EDE4] p-4">
                <Eyebrow className="text-[7px] tracking-[0.22em]">
                  {g.kicker}
                </Eyebrow>
                <h3 className={`${SERIF} mt-2 text-[16px] text-[#144A3B]`}>
                  {g.title}
                </h3>
                <p className="mt-1.5 text-[9.5px] leading-[1.6] text-[#5B655E]">
                  {g.body}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Right */}
        <figure className="bg-[#F0EDE4] p-8 sm:p-10 lg:p-12">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#144A3B] text-white">
            <HeartIcon className="h-3.5 w-3.5" />
          </span>
          <blockquote
            className={`${SERIF} mt-8 text-[20px] leading-[1.6] text-[#1F2A24] sm:text-[22px]`}
          >
            “Each piece is created with intention, because we believe that what
            you wear should make you feel something. It should remind you of
            your beauty, your strength, your roots, and your uniqueness.”
          </blockquote>
          <figcaption className="mt-10 flex items-end justify-between gap-4 border-t border-[#DEDACB] pt-5">
            <div>
              <Eyebrow className="text-[8px] text-[#144A3B]">
                The Elims philosophy
              </Eyebrow>
              <p className="mt-1.5 text-[10px] text-[#5B655E]">
                Intentional Fabrication • Lagos Atelier
              </p>
            </div>
            <SparkIcon className="h-5 w-5 text-[#C9A98C]" />
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
