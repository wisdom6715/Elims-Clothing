"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import { auth } from "@/lib/firebase.config";
import Image from "next/image";
import DiscountBanner from "./DiscountBanner";
import { useCart } from "@/hook/useAddToCart";

const navItems = [
  { label: "Collections", href: "/#collections" },
  { label: "New arrivals", href: "/products/all" },
  { label: "The edit", href: "/#stories" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { items } = useCart();

  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <DiscountBanner />
      <header className="sticky top-0 z-50 border-b border-[#dce0d6] bg-[#faf9f4]/95 backdrop-blur">
      <div className="store-shell flex h-16 items-center justify-between lg:h-20">
        
        {/* LOGO - LEFT */}
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label="Elims home"
        >
          <Image
            src="/logo1.png"
            alt="Elims"
            width={100}
            height={50}
            className="h-14 w-16 md:h-16 md:w-20"
          />
        </Link>

        {/* NAVIGATION + ACTIONS - RIGHT */}
        <div className="flex items-center gap-6">
          
          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[11px] font-semibold uppercase tracking-[0.11em] text-[#214c40] transition-opacity hover:opacity-55"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* DESKTOP + MOBILE ACTIONS */}
          <div className="flex items-center gap-4 text-[#174c40] sm:gap-5">
            
            {/* Search */}
            <Link
              href="/products/all"
              className="hidden lg:block"
              aria-label="Search products"
            >
              <Search
                size={18}
                strokeWidth={1.6}
              />
            </Link>

            {/* Account */}
            <button
              className="hidden lg:block"
              onClick={() =>
                router.push(
                  user ? "/profile/account" : "/login"
                )
              }
              aria-label="Account"
            >
              <UserRound
                size={18}
                strokeWidth={1.6}
              />
            </button>

            {/* Cart */}
            <button
              onClick={() => router.push("/cart")}
              aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
              className="relative"
            >
              <ShoppingBag
                size={19}
                strokeWidth={1.6}
              />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0f473a] px-1 text-[9px] font-semibold leading-none text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={
                menuOpen ? "Close menu" : "Open menu"
              }
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <X
                  size={21}
                  strokeWidth={1.7}
                />
              ) : (
                <Menu
                  size={21}
                  strokeWidth={1.7}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="absolute inset-x-0 top-full border-b border-[#dce0d6] bg-[#faf9f4] px-5 py-7 shadow-xl lg:hidden">
          <nav className="flex flex-col divide-y divide-[#dce0d6]">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="py-4 font-display text-3xl text-[#0f473a]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-7 flex gap-4 text-[10px] font-semibold uppercase tracking-[0.12em]">
            <button
              onClick={() =>
                router.push(
                  user ? "/profile/account" : "/login"
                )
              }
            >
              {user ? "Your account" : "Sign in"}
            </button>

            <Link href="/products/all">
              Shop all
            </Link>
          </div>
        </div>
      )}
    </header>
    </>
  );
}