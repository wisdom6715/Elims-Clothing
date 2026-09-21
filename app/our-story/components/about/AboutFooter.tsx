import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import { CONTAINER, Eyebrow, SERIF } from "./ui";

const COPYRIGHT_YEAR = 2025;

const COLLECTIONS = [
  { label: "Ancestral Silks", href: "/collections/ancestral-silks" },
  { label: "Handwoven Aso-Oke", href: "/collections/aso-oke" },
  { label: "Indigo Adire Atelier", href: "/collections/adire" },
  { label: "Harmattan Capsule", href: "/collections/harmattan" },
  { label: "Limited Artifacts", href: "/collections/limited" },
];

const CLIENT_CARE = [
  { label: "Textile Conservation", href: "/care/conservation" },
  { label: "Bespoke Fitting Guide", href: "/care/fitting" },
  { label: "Complimentary Shipping", href: "/care/shipping" },
  { label: "Returns & Archive Exchange", href: "/care/returns" },
  { label: "Authenticate Garment", href: "/care/authenticate" },
];

const LEGAL = [
  { label: "Terms of Curation", href: "/terms" },
  { label: "Privacy Treaty", href: "/privacy" },
  { label: "Artisanal Provenance", href: "/provenance" },
];

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <nav aria-label={title}>
      <Eyebrow className="text-[9px] text-[#4A554E]">{title}</Eyebrow>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-[11px] text-[#4A554E] transition-colors hover:text-[#144A3B]"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function AboutFooter() {
  return (
    <footer className="bg-[#F5F3EC]">
      <div
        className={`${CONTAINER} grid gap-12 pb-16 pt-20 md:grid-cols-2 lg:grid-cols-[1.5fr_0.9fr_0.9fr_1.2fr] lg:gap-14`}
      >
        {/* Newsletter */}
        <div>
          <Eyebrow className="text-[9px]">Atelier gazettes</Eyebrow>
          <h2 className={`${SERIF} mt-4 text-[26px] text-[#1F2A24]`}>
            The Elims Chronicle
          </h2>
          <p className="mt-4 max-w-[340px] text-[11.5px] leading-[1.8] text-[#4A554E]">
            Curated dispatches on ancestral textile preservation, private salon
            showings, and seasonal releases. Crafted without compromise.
          </p>
          <NewsletterForm />
          <p className="mt-4 text-[9px] text-[#8A928B]">
            Dispatches arrive bimonthly. Respect for privacy remains paramount.
          </p>
        </div>

        <LinkColumn title="Collections" links={COLLECTIONS} />
        <LinkColumn title="Client Care" links={CLIENT_CARE} />

        {/* La Maison */}
        <div>
          <Eyebrow className="text-[9px] text-[#4A554E]">La Maison</Eyebrow>
          <p className="mt-5 max-w-[260px] text-[11px] leading-[1.8] text-[#4A554E]">
            Elims Haute Couture is an architectural dialogue between West
            African artisanal legacy and contemporary silhouette discipline.
          </p>
          <address className="mt-5 text-[11px] not-italic leading-[1.8] text-[#4A554E]">
            <span className="font-semibold text-[#144A3B]">
              Elims Atelier Victoria Island
            </span>
            <br />
            42 Admiralty Sanctuary, Lagos
            <br />
            <a
              href="mailto:concierge@elims.luxury"
              className="text-[#144A3B] hover:underline"
            >
              concierge@elims.luxury
            </a>
          </address>
        </div>
      </div>

      <div className="border-t border-[#E3E0D5]">
        <div
          className={`${CONTAINER} flex flex-col items-start justify-between gap-4 py-6 sm:flex-row sm:items-center`}
        >
          <p className="text-[8px] uppercase tracking-[0.2em] text-[#5B655E]">
            © {COPYRIGHT_YEAR} Elims Haute Couture. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {LEGAL.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[8px] uppercase tracking-[0.2em] text-[#5B655E] transition-colors hover:text-[#144A3B]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
