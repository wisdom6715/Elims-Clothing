"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BagIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "./icons";
import { CONTAINER, Dot, SERIF } from "./ui";

const NAV = [
  { label: "Collections", href: "/collections" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "The Edit", href: "/the-edit" },
  { label: "About Us", href: "/about", active: true },
  { label: "Our Story", href: "/our-story" },
  { label: "Care", href: "/care" },
];

export default function AboutHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-[#FAF9F4]">
      {/* Utility bar */}
      <div className="border-b border-[#E7E4D9]">
        <div
          className={`${CONTAINER} flex h-9 items-center justify-between text-[9px] uppercase tracking-[0.2em] text-[#4A554E]`}
        >
          <p className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              Lagos <Dot /> London <Dot /> Paris
            </span>
            <span className="hidden text-[#8C7B48] sm:inline">
              Bespoke Couture &amp; Heritage Textiles
            </span>
          </p>
          <p className="hidden items-center gap-4 md:flex">
            <span>Currency: EUR (€)</span>
            <span aria-hidden="true" className="h-3 w-px bg-[#D9D5C7]" />
            <Link href="/contact" className="hover:text-[#144A3B]">
              Atelier Direct
            </Link>
          </p>
        </div>
      </div>

      {/* Main bar */}
      <div className={`${CONTAINER} flex h-[76px] items-center`}>
        <Link href="/" className="flex items-end gap-2" aria-label="Elims Maison home">
          <span
            className={`${SERIF} text-[34px] leading-none tracking-[0.01em] text-[#144A3B]`}
          >
            ELIMS
          </span>
          <span className="mb-[3px] text-[7px] uppercase tracking-[0.3em] text-[#4A554E]">
            Maison
          </span>
        </Link>

        <nav aria-label="Primary" className="ml-16 hidden flex-1 lg:block">
          <ul className="flex items-center gap-9">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={item.active ? "page" : undefined}
                  className={`text-[10px] uppercase tracking-[0.18em] transition-colors hover:text-[#144A3B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#144A3B] ${
                    item.active
                      ? "border-b border-[#144A3B] pb-1 font-semibold text-[#144A3B]"
                      : "text-[#4A554E]"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-5">
          <button
            type="button"
            aria-label="Search"
            className="text-[#1F2A24] transition-colors hover:text-[#144A3B]"
          >
            <SearchIcon className="h-[18px] w-[18px]" />
          </button>
          <Link
            href="/cart"
            aria-label="Shopping bag"
            className="relative text-[#1F2A24] transition-colors hover:text-[#144A3B]"
          >
            <BagIcon className="h-[18px] w-[18px]" />
            <span
              aria-hidden="true"
              className="absolute -right-1.5 -top-1.5 h-2.5 w-2.5 rounded-full bg-[#144A3B]"
            />
          </Link>
          <Link
            href="/account"
            aria-label="Account"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#144A3B] text-white"
          >
            <UserIcon className="h-4 w-4" />
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden"
          >
            {open ? (
              <CloseIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          aria-label="Mobile"
          className="border-t border-[#E7E4D9] bg-[#FAF9F4] lg:hidden"
        >
          <ul className={`${CONTAINER} flex flex-col py-2`}>
            {NAV.map((item) => (
              <li key={item.href} className="border-b border-[#EFECE2] last:border-0">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block py-3 text-[11px] uppercase tracking-[0.18em] ${
                    item.active ? "font-semibold text-[#144A3B]" : "text-[#4A554E]"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
