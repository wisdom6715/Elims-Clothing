import Link from "next/link";

const footerGroups = [
  { heading: "Discover", links: [{ label: "All pieces", href: "/products/all" }, { label: "New arrivals", href: "/products/all" }, { label: "Your cart", href: "/cart" }] },
  { heading: "Customer care", links: [{ label: "Privacy Policy", href: "/privacy-policy" }, { label: "Terms of Service", href: "/terms-of-service" }, { label: "Refund Policy", href: "/refund-policy" }] },
  { heading: "Company", links: [{ label: "About", href: "/about" }, { label: "Our Story", href: "/our-story" }, { label: "Contact", href: "mailto:hello@elims.com" }] },
];

export default function Footer() {
  return <footer className="mt-8 border-t border-[#d9ded3] bg-[#f1eee6] px-4 text-[#0f473a] md:px-16 lg:px-32"><div className="mx-auto max-w-[1400px] py-12 sm:py-16"><div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)]"><div><Link href="/" className="font-display text-4xl tracking-[-0.08em]">ELIMS</Link><p className="mt-4 max-w-xs text-sm leading-6 text-[#5f7169]">Thoughtful pieces for the everyday you are creating.</p></div>{footerGroups.map((group) => <div key={group.heading}><h2 className="mb-4 text-[10px] font-bold uppercase tracking-[0.14em]">{group.heading}</h2><ul className="space-y-3">{group.links.map((link) => <li key={link.label}>{link.href.startsWith("mailto:") ? <a href={link.href} className="text-sm text-[#5f7169] transition-colors hover:text-[#0f473a]">{link.label}</a> : <Link href={link.href} className="text-sm text-[#5f7169] transition-colors hover:text-[#0f473a]">{link.label}</Link>}</li>)}</ul></div>)}</div><div className="mt-12 flex flex-col gap-3 border-t border-[#d3d8ce] pt-5 text-[10px] font-medium uppercase tracking-[0.1em] text-[#6d7d75] sm:flex-row sm:justify-between"><span>© 2026 Elims. All rights reserved.</span><span>Crafted with comfort in mind.</span></div></div></footer>;
}
