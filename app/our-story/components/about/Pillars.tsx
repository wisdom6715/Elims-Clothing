import type { ComponentType } from "react";
import { LayersIcon, PenIcon, PinIcon, UsersIcon } from "./icons";
import { CONTAINER, SERIF } from "./ui";

type Pillar = {
  numeral: string;
  title: string;
  body: string;
  tag: string;
  Icon: ComponentType<{ className?: string }>;
};

const PILLARS: Pillar[] = [
  {
    numeral: "I",
    title: "African Creativity",
    body: "A legacy that celebrates African creativity. Uplifting indigenous master crafters into sovereign global art.",
    tag: "Unbound artistry",
    Icon: PenIcon,
  },
  {
    numeral: "II",
    title: "Authentic Confidence",
    body: "A legacy that inspires confidence. Dressing the wearer in silent majesty and unmistakable identity.",
    tag: "Inner statuesque",
    Icon: PinIcon,
  },
  {
    numeral: "III",
    title: "Cultural Honour",
    body: "A legacy that honours culture. Preserving provenance, dyeing vats, and ancient weaving rhythms intact.",
    tag: "Living lineage",
    Icon: LayersIcon,
  },
  {
    numeral: "IV",
    title: "Generational Continuity",
    body: "A legacy that can be passed from one generation to another. Wardrobe heirlooms resisting seasonal obsolescence.",
    tag: "Enduring value",
    Icon: UsersIcon,
  },
];

export default function Pillars() {
  return (
    <section className="bg-[#144A3B] py-20 text-white lg:py-28">
      <div className={CONTAINER}>
        <div className="text-center">
          <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#9DBFAE]">
            Our horizon
          </p>
          <h2
            className={`${SERIF} mt-5 text-[30px] font-light leading-[1.2] sm:text-[38px] lg:text-[42px]`}
          >
            The Heart of Elims Goes Beyond Fashion
          </h2>
          <p
            className={`${SERIF} mt-4 text-[16px] italic text-[#B9D2C5]`}
          >
            It is about creating a legacy.
          </p>
        </div>

        <ul className="mt-16 grid gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {PILLARS.map(({ numeral, title, body, tag, Icon }) => (
            <li
              key={numeral}
              className="border-l border-white/15 px-7 py-2 lg:px-8"
            >
              <p className="text-[8px] font-medium uppercase tracking-[0.22em] text-[#9DBFAE]">
                Pillar {numeral}
              </p>
              <h3 className={`${SERIF} mt-6 text-[24px] leading-[1.2]`}>
                {title}
              </h3>
              <p className="mt-4 text-[12px] leading-[1.8] text-white/60">
                {body}
              </p>
              <p className="mt-8 flex items-center gap-2 text-[8px] font-medium uppercase tracking-[0.2em] text-[#B9D2C5]">
                <Icon className="h-3.5 w-3.5" />
                {tag}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
