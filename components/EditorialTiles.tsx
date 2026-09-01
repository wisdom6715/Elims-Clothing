import Link from "next/link";
import Image from "next/image";

const categoryCards = [
  {
    title: "Women",
    subtitle: "Ease, expressed",
    tone: "text-[#fffdf7]",
    href: "/products/women",
    image: "/women.jpg",
    label: "Explore women's styles",
  },
  {
    title: "Men",
    subtitle: "Quiet confidence",
    tone: "text-[#fffdf7]",
    href: "/products/men",
    image: "/men.jpg",
    label: "Explore men's styles",
  },
  {
    title: "Children",
    subtitle: "Small moments, big joy",
    tone: "text-[#fffdf7]",
    href: "/products/children",
    image: "/children.jpg",
    label: "Explore children's styles",
  },
  {
    title: "Accessories",
    subtitle: "The finishing thread",
    tone: "text-[#fffdf7]",
    href: "/products/accessories",
    image: "/jewellery.jpg",
    label: "Explore accessories",
  },
];

const stories = [
  {
    eyebrow: "The edit",
    title: "A softer way to arrive",
    body: "Thoughtful layers, generous proportions, and pieces that move naturally through your day.",
    tone: "bg-[#f1eee6] text-[#123f35]",
  },
  {
    eyebrow: "Made for living",
    title: "Comfort in every thread",
    body: "A considered wardrobe with a grounded point of view, built around the feeling of being at home in what you wear.",
    tone: "bg-[#d3baa2] text-[#3f2b20]",
  },
];

export function CategoryRibbon() {
  return (
    <section id="collections" className="py-16 sm:py-20 lg:py-28">
      <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Shop by collection</p>
          <h2 className="display-title mt-3">A wardrobe for every rhythm.</h2>
        </div>
        <Link href="/products/all" className="editorial-link w-fit">
          View all pieces <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {categoryCards.map((card) => (
          <Link
            href={card.href}
            key={card.title}
            aria-label={card.label}
            className={`group relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-[1.5rem] p-5 transition-transform duration-300 hover:-translate-y-1 sm:min-h-[270px] sm:p-7 ${card.tone}`}
          >
            {/* Background image */}
            <Image
              src={card.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-top object-cover transition-transform duration-500 group-hover:scale-105"
              priority={false}
            />

            {/* Overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

            <span className="relative z-10 text-[10px] font-semibold uppercase tracking-[0.16em] opacity-90">
              {card.subtitle}
            </span>
            <div className="relative z-10 flex items-end justify-between gap-2">
              <h3 className="font-display text-3xl leading-[0.9] sm:text-4xl">{card.title}</h3>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-current text-base transition-transform duration-300 group-hover:-rotate-45">
                ↗
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function StoryTiles() {
  return (
    <section className="grid gap-4 border-y border-[#d9ded3] py-6 sm:gap-5 sm:py-8 lg:grid-cols-2">
      {stories.map((story) => (
        <article key={story.title} className={`rounded-[1.5rem] p-7 sm:p-10 ${story.tone}`}>
          <p className="eyebrow opacity-75">{story.eyebrow}</p>
          <h2 className="font-display mt-7 max-w-md text-3xl leading-[0.98] sm:text-4xl">{story.title}</h2>
          <p className="mt-5 max-w-md text-sm leading-6 opacity-80 sm:text-base">{story.body}</p>
          <Link href="/products/all" className="editorial-link mt-7 inline-flex">
            Discover the collection <span aria-hidden="true">↗</span>
          </Link>
        </article>
      ))}
    </section>
  );
}