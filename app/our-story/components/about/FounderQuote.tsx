import { InfoIcon } from "./icons";
import { CONTAINER, Eyebrow, SERIF } from "./ui";

export default function FounderQuote() {
  return (
    <section className="bg-[#F0EDE4] py-20 lg:py-28">
      <div className={`${CONTAINER} flex flex-col items-center text-center`}>
        <Eyebrow className="text-[9px]">The Founder’s Philosophy</Eyebrow>

        <span
          aria-hidden="true"
          className={`${SERIF} mt-6 block h-12 text-[72px] leading-[1.1] text-[#CDBB93]`}
        >
          ”
        </span>

        <blockquote
          className={`${SERIF} mt-2 max-w-[900px] text-[26px] leading-[1.4] text-[#1F2A24] sm:text-[32px] lg:text-[36px]`}
        >
          “For the founder of Elims Clothings, fashion has always been more than
          fabric and design. It is a language. It tells stories without words.
          It carries memories, expresses identity, and has the power to make a
          person feel confident, beautiful, and seen.”
        </blockquote>

        <div className="mt-10">
          <Eyebrow className="text-[9px]">From the Founder’s Notebook</Eyebrow>
          <p className="mt-2 text-[10px] text-[#5B655E]">
            Creative Director &amp; Custodian • Elims Maison
          </p>
        </div>

        <div className="mt-16 flex w-full max-w-[780px] items-center justify-center gap-3 border border-[#E3E0D5] bg-[#FAF9F4] px-6 py-3.5 text-left">
          <InfoIcon className="h-3.5 w-3.5 shrink-0 text-[#9A9A8C]" />
          <p className="text-[11px] leading-relaxed text-[#4A554E]">
            The journey of Elims has been shaped by passion, resilience,
            creativity, and an unwavering belief in purpose.
          </p>
        </div>
      </div>
    </section>
  );
}
