import { CONTAINER, Eyebrow, GoldRule, SERIF, SANS } from "./ui";

const FAMILY_MEMBERS = [
  {
    name: "Oluwaferanmi Ifedayo Salako",
    role: "Operations & Business Manager",
    bio: "Oluwaferanmi oversees business operations, organisational efficiency, and strategic business development. His focus is on building a strong operational foundation, supporting sustainable growth, maintaining standards, and ensuring that the business is positioned for long-term success.",
    focus: "Operations • Efficiency • Strategic Growth",
  },
  {
    name: "Iteoluwakishi Sijuwola Salako",
    role: "Development Lead",
    bio: "Iteoluwakishi focuses on development, innovation, and continuous improvement. His role is to support the evolution of the brand, explore new opportunities, strengthen its development processes, and help build a foundation that supports Elims’ long-term ambitions.",
    focus: "Development • Innovation • Continuous Improvement",
  },
  {
    name: "Kikidaope Olatokunbo Salako",
    role: "Digital Marketing & International Growth Lead",
    bio: "Kikidaope leads the brand’s digital marketing and international growth initiatives. His focus is on expanding Elims’ digital presence, connecting with new audiences, strengthening brand awareness, and identifying opportunities to introduce Elims Clothings to customers across international markets.",
    focus: "Digital Marketing • International Growth • Brand Awareness",
  },
];

export default function FamilyBehindElims() {
  return (
    <section className={`${CONTAINER} py-20 lg:py-28 border-t border-[#DEDACB]`}>
      <div className="max-w-[850px]">
        <Eyebrow className="text-[9px]">The Salako Legacy</Eyebrow>
        <h2
          className={`${SERIF} mt-4 text-[32px] font-light leading-[1.15] text-[#144A3B] sm:text-[42px] lg:text-[48px]`}
        >
          The Family Behind Elims Clothings
        </h2>
        <p className={`${SERIF} mt-3 text-[20px] italic text-[#C9A98C] sm:text-[24px]`}>
          One Family. One Vision. A Shared Future.
        </p>
        <GoldRule className="mt-6" />

        <div className="mt-8 space-y-4 text-[14px] leading-[1.8] text-[#4A554E]">
          <p>
            At Elims Clothings, family is at the heart of our story. Built on a foundation of faith, resilience, creativity, and a passion for fashion, Elims represents a vision that goes beyond clothing. It is a commitment to celebrating African heritage, embracing modern elegance, and building a brand with an international identity.
          </p>
          <p>
            As a family, we share a common goal: to preserve the vision behind Elims while building a strong, innovative, and sustainable fashion brand for generations to come.
          </p>
          <p>
            Each member of our team brings a distinct area of expertise, working together to turn our shared vision into reality.
          </p>
        </div>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FAMILY_MEMBERS.map((member, idx) => (
          <div
            key={member.name}
            className="flex flex-col justify-between bg-[#F0EDE4] p-7 transition-transform duration-200 hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between border-b border-[#DEDACB] pb-3">
                <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#B89B5E]">
                  Leadership 0{idx + 1}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#144A3B]/40" />
              </div>
              <h3 className={`${SERIF} mt-5 text-[22px] leading-snug text-[#144A3B]`}>
                {member.name}
              </h3>
              <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#B89B5E]">
                {member.role}
              </p>
              <p className="mt-4 text-[13px] leading-[1.75] text-[#5B655E]">
                {member.bio}
              </p>
            </div>
            <div className="mt-6 border-t border-[#DEDACB] pt-3">
              <span className="text-[8.5px] uppercase tracking-[0.15em] text-[#7A857E]">
                {member.focus}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 bg-[#144A3B] p-8 sm:p-12 text-[#FAF9F4]">
        <Eyebrow className="text-[8.5px] text-[#C9A98C]">Shared Purpose</Eyebrow>
        <h3 className={`${SERIF} mt-3 text-[26px] sm:text-[34px] leading-tight text-white`}>
          Growing Together, Building for the Future
        </h3>
        <p className="mt-4 max-w-[850px] text-[14px] leading-[1.8] text-[#D8E2DC]">
          Together, we bring business leadership, development, and digital growth into one shared vision. While each of us has a distinct responsibility, we are united by the same purpose: to build a brand that honours its African roots while embracing the opportunities of the global fashion industry.
        </p>
        <p className="mt-3 max-w-[850px] text-[14px] leading-[1.8] text-[#D8E2DC]">
          Elims Clothings is more than a family business. It is a legacy in the making — a vision nurtured with love, strengthened by perseverance, and carried forward through shared commitment.
        </p>
        <div className="mt-8 border-t border-white/20 pt-6">
          <p className={`${SERIF} text-[20px] italic text-[#C9A98C] sm:text-[24px]`}>
            “Our roots define us. Our unity strengthens us. Our vision moves us forward.”
          </p>
          <p className={`${SERIF} mt-2 text-[16px] text-white/90`}>
            Welcome to Elims Clothings, where African heritage meets modern elegance.
          </p>
        </div>
      </div>
    </section>
  );
}
