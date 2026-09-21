import { Manrope, Newsreader } from "next/font/google";

export const serif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-about-serif",
  display: "swap",
});

export const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-about-sans",
  display: "swap",
});
