"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { auth } from "@/lib/firebase.config";

const navItems = [
  { label: "Collections", href: "/#collections" },
  { label: "New arrivals", href: "/products/all" },
  { label: "The edit", href: "/#stories" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => onAuthStateChanged(auth, setUser), []);
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-[#dce0d6] bg-[#faf9f4]/95 backdrop-blur">
      <div className="store-shell grid h-16 grid-cols-[1fr_auto_1fr] items-center lg:h-20">
        <div className="flex items-center gap-6">
          <button className="lg:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
            {menuOpen ? <X size={21} strokeWidth={1.7} /> : <Menu size={21} strokeWidth={1.7} />}
          </button>
          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => <Link className="text-[11px] font-semibold uppercase tracking-[0.11em] text-[#214c40] transition-opacity hover:opacity-55" href={item.href} key={item.label}>{item.label}</Link>)}
          </nav>
        </div>
        <Link href="/" className="font-display text-3xl tracking-[-0.08em] text-[#0f473a] sm:text-4xl" aria-label="Elims home">ELIMS</Link>
        <div className="flex items-center justify-end gap-4 text-[#174c40] sm:gap-5">
          <Link href="/products/all" className="hidden lg:block" aria-label="Search products"><Search size={18} strokeWidth={1.6} /></Link>
          <button className="hidden lg:block" onClick={() => router.push(user ? "/profile/account" : "/login")} aria-label="Account"><UserRound size={18} strokeWidth={1.6} /></button>
          <button onClick={() => router.push("/cart")} aria-label="Cart"><ShoppingBag size={19} strokeWidth={1.6} /></button>
        </div>
      </div>
      {menuOpen && (
        <div className="absolute inset-x-0 top-full border-b border-[#dce0d6] bg-[#faf9f4] px-5 py-7 shadow-xl lg:hidden">
          <nav className="flex flex-col divide-y divide-[#dce0d6]">
            {navItems.map((item) => <Link onClick={() => setMenuOpen(false)} href={item.href} key={item.label} className="py-4 font-display text-3xl text-[#0f473a]">{item.label}</Link>)}
          </nav>
          <div className="mt-7 flex gap-4 text-[10px] font-semibold uppercase tracking-[0.12em]">
            <button onClick={() => router.push(user ? "/profile/account" : "/login")}>{user ? "Your account" : "Sign in"}</button>
            <Link href="/products/all">Shop all</Link>
          </div>
        </div>
      )}
    </header>
  );
}
