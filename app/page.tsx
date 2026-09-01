import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PopularProducts from "@/components/PopularProducts";
import { CategoryRibbon, StoryTiles } from "@/components/EditorialTiles";
import { HeroCarousel, ImageCarousel } from "@/components/InterCarousel";

const heroImages = ["/women.jpg", "/men.jpg", "/children.jpg", "/jewellery.jpg"];
const outdoorImages = ["/men.jpg", "/children.jpg", "/women.jpg"];
const casualImages = ["/children.jpg", "/women.jpg", "/men.jpg"];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf9f4]">
      <Header />
      <main className="store-shell">
        <section className="grid gap-4 py-4 sm:py-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(260px,0.72fr)] lg:gap-5">
          <article className="relative min-h-[600px] overflow-hidden rounded-[1.7rem] bg-[radial-gradient(circle_at_78%_24%,rgba(230,226,197,.55),transparent_20%),linear-gradient(122deg,#234f43_0%,#668570_43%,#b5c0a6_100%)] p-6 sm:min-h-[600px] sm:p-10 lg:min-h-[620px] lg:p-12">
            {/* Slanted hero carousel, right side, with loader */}
            <HeroCarousel
              images={heroImages}
              alt="Seasonal outfit highlights"
              intervalMs={4000}
              wrapperClassName="absolute -right-14 top-1/2 h-[90%] w-[82%] -translate-y-1/2 rotate-6 overflow-hidden rounded-[2.25rem] shadow-2xl ring-1 ring-white/15 sm:-right-10 sm:w-[50%] lg:w-[42%]"
            />

            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(21,64,51,.62),rgba(21,64,51,.08)_65%,rgba(21,64,51,.06))]" />
            <div className="absolute -bottom-12 right-6 h-72 w-72 rounded-full border border-white/20 sm:h-96 sm:w-96" />
            <div className="absolute -bottom-3 right-16 h-52 w-52 rounded-full border border-white/10 sm:h-72 sm:w-72" />
            <div className="relative z-10 flex h-full max-w-sm flex-col justify-between text-white">
              <p className="eyebrow text-white/75">New season, softer lines</p>
              <div>
                <h1 className="font-display text-5xl leading-[0.88] tracking-[-0.05em] sm:text-6xl lg:text-7xl">Color of<br />summer<br />outfit.</h1>
                <p className="mt-5 max-w-xs text-sm leading-6 text-white/85 sm:text-base">A thoughtfully curated collection to make getting dressed feel natural again.</p>
                <Link href="/products/all" className="mt-7 inline-flex items-center rounded-full bg-[#0f473a] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.13em] text-white transition-colors hover:bg-[#173f35]">View collection <span className="ml-3 text-base leading-none">↗</span></Link>
              </div>
            </div>
          </article>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-5">
            <Link href="/products/all" className="group relative min-h-[280px] overflow-hidden rounded-[1.7rem] bg-[#e9dfcf] p-6 text-[#124237] sm:min-h-[280px] lg:min-h-[300px]">
              <ImageCarousel images={outdoorImages} alt="Outdoor active looks" intervalMs={4000} />
              <div className="absolute inset-0 bg-black/25" />
              <span className="relative z-10 eyebrow text-white/90">Move more freely</span><h2 className="relative z-10 font-display mt-8 max-w-[8rem] text-4xl leading-[0.84] text-white">Outdoor<br />active</h2><span className="absolute bottom-6 right-6 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white text-white transition-transform group-hover:-rotate-45">↗</span>
            </Link>
            <Link href="/products/all" className="group relative min-h-[280px] overflow-hidden rounded-[1.7rem] bg-[#b55f4c] p-6 text-[#fffaf4] sm:min-h-[280px] lg:min-h-[300px]">
              <ImageCarousel images={casualImages} alt="Casual comfort looks" intervalMs={4000} />
              <div className="absolute inset-0 bg-black/25" />
              <span className="relative z-10 eyebrow text-white/90">Effortless, every day</span><h2 className="relative z-10 font-display mt-8 max-w-[9rem] text-4xl leading-[0.84] text-white">Casual<br />comfort</h2><span className="absolute bottom-6 right-6 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white text-white transition-transform group-hover:-rotate-45">↗</span>
            </Link>
          </div>
        </section>
        <section id="stories" className="grid gap-7 border-b border-[#d9ded3] py-14 sm:py-20 lg:grid-cols-[0.75fr_1.25fr] lg:items-end lg:py-24">
          <div><p className="eyebrow">The Elims approach</p><h2 className="display-title mt-4">Casual<br />inspirations.</h2></div>
          <div className="max-w-xl lg:pb-1"><p className="text-base leading-7 text-[#38574d] sm:text-lg">Our favourite combinations for a wardrobe that supports your day, from its first quiet moment to wherever it carries you next.</p><Link href="/products/all" className="editorial-link mt-7 inline-flex text-[#0f473a]">Browse inspirations <span aria-hidden="true">↗</span></Link></div>
        </section>
        <CategoryRibbon />

        <StoryTiles />
        <PopularProducts />
      </main>
      <Footer />
    </div>
  );
}