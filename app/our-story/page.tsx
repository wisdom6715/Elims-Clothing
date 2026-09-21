import type { Metadata } from "next";
import FounderQuote from "./components/about/FounderQuote";
import Generations from "./components/about/Generations";
import GlobalJourney from "./components/about/GlobalJourney";
import Heritage from "./components/about/Heritage";
import Hero from "./components/about/Hero";
import Pillars from "./components/about/Pillars";
import { sans, serif } from "./components/about/fonts";
import { SANS } from "./components/about/ui";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Us | Elims Maison",
  description:
    "A dream woven with purpose, heritage and passion — the story behind Elims Clothings.",
};

export default function AboutPage() {
  return (
    <div
      className={`${serif.variable} ${sans.variable} ${SANS} min-h-screen bg-[#FAF9F4] text-[#1F2A24] antialiased`}
    > 
      <Header />
      <main className="mt-20">
        <Hero />
        <FounderQuote />
        <Heritage />
        <Pillars />
        <Generations />
        <GlobalJourney />
      </main>
      <Footer />
    </div>
  );
}
