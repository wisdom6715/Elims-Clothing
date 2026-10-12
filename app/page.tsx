import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PopularProducts from "@/components/PopularProducts";
import { CategoryRibbon, StoryTiles } from "@/components/EditorialTiles";
import CampaignHero from "@/components/CampaignHero";
import CampaignGallery from "@/components/CampaignGallery";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf7f0]">
      <Header />
      <main className="store-shell">
        {/* Campaign Hero Showcase (Women, Men, Children campaigns) */}
        <CampaignHero />

        {/* African Couture & Campaign Narrative */}
        <section
          id="stories"
          className="grid gap-7 border-b border-[#e2dcd2] py-14 sm:py-20 lg:grid-cols-[0.75fr_1.25fr] lg:items-end lg:py-24"
        >
          <div>
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#865d1d]">
              <span className="h-px w-6 bg-[#c89e47]" />
              <span>The Elims Approach</span>
            </div>
            <h2 className="font-garamond mt-4 text-4xl sm:text-5xl lg:text-6xl font-light text-[#144a3b] leading-[0.95]">
              African Heritage.<br />Timeless Elegance.
            </h2>
          </div>
          <div className="max-w-xl lg:pb-1">
            <p className="text-base leading-7 text-[#465b52] sm:text-lg">
              Born from a deep appreciation for culture, artistry, and refined style. Bringing together the richness of Adire, Aso-Oke, and Ankara with contemporary silhouettes and sovereign finishing for women, men, and children.
            </p>
            <div className="mt-7 flex flex-wrap gap-5 items-center">
              <Link
                href="/products/all"
                className="gold-pill-btn inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em]"
              >
                Browse Summer Collection <span>↗</span>
              </Link>
              <Link
                href="/about"
                className="editorial-link inline-flex text-[#865d1d] hover:text-[#144a3b]"
              >
                Discover Our Heritage <span>↗</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Categories with authentic campaign imagery */}
        <CategoryRibbon />

        {/* The 4 Editorial Campaign Looks from uploaded artwork */}
        <CampaignGallery />

        {/* Stories and Brand Philosophy */}
        <StoryTiles />

        {/* Popular / Best-selling pieces */}
        <PopularProducts />
      </main>
      <Footer />
    </div>
  );
}