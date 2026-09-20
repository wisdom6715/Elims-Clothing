"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, Minus, Plus, Ruler, Truck } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/firebase.config";
import CustomMeasurementFields, { type Measurement } from "@/components/CustomMeasurementFields";
import SizeGuideModal from "./SizeGuideModal";
import ProductReviews from "@/components/ProductReview";
import AddReviewForm, { StarRow, type PostedReview } from "./AddReviewForm";
import { useDiscount } from "@/hook/useDiscount";
import { applyDiscount, isDiscountActive } from "@/lib/discount";
import { resolveSizePrice, type SizePricing } from "@/app/console/admin/product/_components/type";
import { useCart } from "@/hook/useAddToCart";

interface Product { id: string; name: string; description: string; price: number; stock: number; sizes: string[]; colors: string[]; category: string; subCategory: string; sku: string; imageUrls: string[]; sizePricing?: SizePricing; }
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='1000' viewBox='0 0 800 1000'%3E%3Crect width='800' height='1000' fill='%23e5e8e0'/%3E%3Cpath d='M160 760 340 540l120 150 90-110 150 180' fill='none' stroke='%2392a59a' stroke-width='18'/%3E%3Ccircle cx='290' cy='315' r='48' fill='none' stroke='%2392a59a' stroke-width='18'/%3E%3C/svg%3E";
const formatPrice = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(value);
const isCustomSize = (size: string) => size.trim().toLowerCase() === "custom";

function swatchColor(color: string) { const known: Record<string, string> = { black: "#171717", white: "#ffffff", cream: "#f4ead7", beige: "#e2d0b5", navy: "#1b2a4a", tan: "#d2b48c", olive: "#708238", burgundy: "#6d1b2c", green: "#4e7967" }; return known[color.toLowerCase()] ?? color.toLowerCase(); }

// Card shown immediately after a successful submit, above the fetched
// reviews list — styled to match this page's own editorial theme rather
// than AddReviewForm's neutral palette, so it doesn't feel bolted on.
// Kept as a top-level component (never nested) so it stays visible to
// everything in this file.
function PostedReviewCard({ review }: { review: PostedReview }) {
  return (
    <div className="border border-[#d9ded3] rounded-xl px-5 py-6 mb-8 bg-[#f6f7f2]">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-[#0f473a]">{review.reviewerName}</p>
        <span className="text-[10px] tracking-[0.12em] uppercase text-[#8a958f]">
          Just posted
        </span>
      </div>
      <StarRow value={review.rating} size={18} />
      {review.comment && (
        <p className="text-sm text-[#567065] leading-relaxed mt-3">
          {review.comment}
        </p>
      )}
    </div>
  );
}

function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0); const hasMultiple = images.length > 1;
  const goTo = (next: number) => setIndex((next + images.length) % images.length);
  return <div className="lg:sticky lg:top-28"><div className="relative overflow-hidden rounded-[1.5rem] bg-[#eff0ea]"><div className="aspect-[0.82] overflow-hidden"><img src={images[index]} alt={`${alt}${hasMultiple ? ` — image ${index + 1}` : ""}`} className="h-full w-full object-contain" /></div>{hasMultiple && <><button type="button" onClick={() => goTo(index - 1)} aria-label="Previous image" className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0f473a] shadow-sm"><ChevronLeft size={18} /></button><button type="button" onClick={() => goTo(index + 1)} aria-label="Next image" className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0f473a] shadow-sm"><ChevronRight size={18} /></button><div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5">{images.map((_, itemIndex) => <button key={itemIndex} onClick={() => goTo(itemIndex)} aria-label={`View image ${itemIndex + 1}`} className={`h-1.5 rounded-full transition-all ${itemIndex === index ? "w-6 bg-[#0f473a]" : "w-1.5 bg-[#0f473a]/30"}`} />)}</div></>}</div>{hasMultiple && <div className="mt-3 flex gap-2 overflow-x-auto pb-1">{images.map((image, itemIndex) => <button key={`${image}-${itemIndex}`} onClick={() => goTo(itemIndex)} className={`h-16 w-14 shrink-0 overflow-hidden rounded-lg border transition-colors sm:h-20 sm:w-16 ${itemIndex === index ? "border-[#0f473a]" : "border-transparent"}`}><img src={image} alt="" className="h-full w-full object-cover" /></button>)}</div>}</div>;
}

function ProductSkeleton() { return <main className="store-shell py-8 sm:py-12"><div className="grid animate-pulse gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(340px,.75fr)]"><div className="aspect-[0.82] rounded-[1.5rem] bg-[#e5e8e0]" /><div className="space-y-5 pt-4"><div className="h-3 w-32 rounded bg-[#e5e8e0]" /><div className="h-12 w-4/5 rounded bg-[#e5e8e0]" /><div className="h-5 w-28 rounded bg-[#e5e8e0]" /><div className="h-20 rounded bg-[#e5e8e0]" /><div className="h-12 rounded bg-[#e5e8e0]" /></div></div></main>; }

export default function ProductDetail() {
  const params = useParams(); const productId = params?.product_id as string;
  const [product, setProduct] = useState<Product | null>(null); 
  const [loading, setLoading] = useState(true); const [notFound, setNotFound] = useState(false); 
  const [selectedSize, setSelectedSize] = useState(""); const [selectedColor, setSelectedColor] = useState(""); 
  const [measurements, setMeasurements] = useState<Measurement[]>([]); const [quantity, setQuantity] = useState(1); 
  const [openSection, setOpenSection] = useState<"details" | "shipping" | null>(null); 
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const { addToCart, isAdding } = useCart(); const { discount } = useDiscount();

  // ?review=true switches on the "add a review" input (e.g. from a
  // review-request email link). Mirrors the pattern used on the other
  // product-detail variant — everything else here is unchanged.
  const searchParams = useSearchParams();
  const showReviewInput = searchParams.get("GhravexulnqzopmTyrakvulbexonqjzFarnivexoqplumZykrexiphazulvorqenathryxomqevulzankriphexodramulqazvynothrexipulmarkevonqzathryxulvexomqipanidrulzeforvynaqixomthrazulpeknivexorqazulmyrathopvexinulqazomryxevandulphorqaziknexulvyratomqevinaxulphorqazymexidravulnqorixepanqzomulvethryxakopvexinulmux") === "true";

  // Holds the review the user just posted so it renders immediately above
  // the fetched list, with no refetch/remount delay.
  const [justPostedReview, setJustPostedReview] = useState<PostedReview | null>(null);

  useEffect(() => { if (!productId) return; getDoc(doc(db, "products", productId)).then((snapshot) => { 
    if (!snapshot.exists()) { setNotFound(true); 
      return;   
    } 
    const value = { id: snapshot.id, ...snapshot.data() } as Product; setProduct(value); setSelectedSize(value.sizes?.[0] ?? ""); 
    setSelectedColor(value.colors?.[0] ?? ""); }).catch((error) => { console.error("Failed to fetch product:", error); 
    setNotFound(true); }).finally(() => setLoading(false)); }, 
    [productId]
  );

  useEffect(() => { 
    if (!isCustomSize(selectedSize)) setMeasurements([]); }, 
  [selectedSize]);

  if (loading) return <ProductSkeleton />;

  if (notFound || !product) 
    return <main className="store-shell py-28 text-center">
      <p className="font-display text-4xl text-[#0f473a]">This piece is no longer here.</p>
      <a className="editorial-link mt-6 inline-flex text-[#0f473a]" href="/products/all">Return to the collection</a>
    </main>;
  const sizes = product.sizes ?? []; const colors = product.colors ?? []; const gallery = product.imageUrls?.length ? product.imageUrls : [PLACEHOLDER_IMAGE]; const soldOut = product.stock === 0; const customSelected = isCustomSize(selectedSize); const sizeBasePrice = resolveSizePrice(product, selectedSize); const effectivePrice = applyDiscount(sizeBasePrice, discount); const priceChanged = isDiscountActive(discount) && effectivePrice !== sizeBasePrice;
  const handleAddToCart = async () => { if (sizes.length > 0 && !selectedSize) { toast.error("Please select a size."); return; } if (customSelected && (measurements.length === 0 || measurements.some((item) => !item.value.trim()))) { toast.error("Please complete your custom measurements."); return; } if (colors.length > 0 && !selectedColor) { toast.error("Please select a color."); return; } await addToCart({ id: product.id, name: product.name, price: effectivePrice, imageUrl: gallery[0], stock: product.stock, size: selectedSize || undefined, color: selectedColor || undefined, sizeMeasurements: customSelected ? measurements : null, quantity }); };
  const infoSections = [{ key: "details" as const, title: "Details & composition", body: `SKU: ${product.sku} · ${product.category}${product.subCategory ? ` · ${product.subCategory}` : ""}${colors.length ? ` · Available colours: ${colors.join(", ")}` : ""}` }, { key: "shipping" as const, title: "Delivery & returns", body: "Delivery timing and return eligibility follow the current store policy. Review the checkout information or contact support if you need help before placing an order." }];
  return <main className="store-shell py-5 sm:py-8 lg:py-12">
    <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6b7d73]"><span>{product.category}</span><span className="mx-2">/</span><span>{product.subCategory}</span><span className="mx-2">/</span><span className="text-[#0f473a]">{product.name}</span></p><div className="grid gap-9 lg:grid-cols-[minmax(0,1.12fr)_minmax(340px,.75fr)] lg:gap-14"><ProductGallery images={gallery} alt={product.name} /><section className="lg:py-2"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow text-[#718077]">{product.subCategory || product.category}</p><h1 className="font-display mt-3 text-4xl leading-[0.94] text-[#0f473a] sm:text-5xl">{product.name}</h1></div>{soldOut ? <span className="rounded-full bg-[#eee4dd] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#97523d]">Sold out</span> : <span className="rounded-full bg-[#e2eadb] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#3f6b54]">In stock</span>}</div><div className="mt-5 flex items-baseline gap-3">{priceChanged && <span className="text-sm text-[#8a958f] line-through">{formatPrice(sizeBasePrice)}</span>}<span className="text-xl font-semibold text-[#0f473a]">{formatPrice(effectivePrice)}</span>{priceChanged && <span className="rounded-full bg-[#b55f4c] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-white">{discount?.percentage}% off</span>}</div><p className="mt-6 max-w-xl text-sm leading-6 text-[#567065]">{product.description}</p><div className="mt-8 border-t border-[#d9ded3] pt-7">{sizes.length > 0 && <div><div className="mb-3 flex items-center justify-between"><span className="eyebrow text-[#0f473a]">Select size</span><button onClick={() => setSizeGuideOpen(true)} className="flex items-center gap-1 text-[11px] font-medium text-[#527164] underline underline-offset-4"><Ruler size={13} /> Size guide</button></div><div className="grid grid-cols-4 gap-2">{sizes.map((size) => <button key={size} onClick={() => setSelectedSize(size)} className={`min-h-11 rounded-lg border px-2 text-sm font-medium transition-colors ${selectedSize === size ? "border-[#0f473a] bg-[#0f473a] text-white" : "border-[#c6d0c8] text-[#275549] hover:border-[#0f473a]"}`}>{size}</button>)}</div></div>}{customSelected && <div className="mt-5 rounded-xl border border-[#d3ddd3] bg-[#f6f7f2] p-4"><p className="eyebrow text-[#0f473a]">Custom measurements <span className="text-[#b55f4c]">*</span></p><p className="mt-2 text-xs leading-5 text-[#64776d]">Add the measurements requested for your piece before adding it to the bag.</p><div className="mt-4"><CustomMeasurementFields measurements={measurements} onChange={setMeasurements} /></div></div>}{colors.length > 0 && <div className="mt-7"><div className="mb-3 flex items-center justify-between"><span className="eyebrow text-[#0f473a]">Colour</span><span className="text-xs capitalize text-[#687b71]">{selectedColor}</span></div><div className="flex flex-wrap gap-2.5">{colors.map((color) => <button key={color} title={color} aria-label={`Select ${color}`} onClick={() => setSelectedColor(color)} className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-transform ${selectedColor === color ? "scale-110 border-[#0f473a]" : "border-transparent"}`}><span className="h-8 w-8 rounded-full border border-black/10" style={{ backgroundColor: swatchColor(color) }} /></button>)}</div></div>}<div className="mt-8 flex items-center justify-between border-y border-[#d9ded3] py-5"><span className="eyebrow text-[#0f473a]">Quantity</span><div className="flex items-center rounded-full border border-[#bdc9bf] bg-white"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="flex h-10 w-10 items-center justify-center text-[#0f473a]" aria-label="Decrease quantity"><Minus size={15} /></button><span className="w-8 text-center text-sm font-semibold">{quantity}</span><button onClick={() => setQuantity((value) => Math.min(Math.max(1, product.stock), value + 1))} disabled={soldOut} className="flex h-10 w-10 items-center justify-center text-[#0f473a] disabled:opacity-30" aria-label="Increase quantity"><Plus size={15} /></button></div></div><button onClick={handleAddToCart} disabled={soldOut || isAdding(product.id)} className="mt-5 flex w-full items-center justify-center rounded-full bg-[#0f473a] px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#1e6151] disabled:cursor-not-allowed disabled:bg-[#b6c0b6]">{soldOut ? "Sold out" : isAdding(product.id) ? "Adding to bag..." : `Add to bag — ${formatPrice(effectivePrice * quantity)}`}</button><div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-[#687b71]"><Truck size={14} /> Delivery options shown at checkout</div></div><div className="mt-8 border-t border-[#d9ded3]">{infoSections.map((section) => <div key={section.key} className="border-b border-[#d9ded3]"><button onClick={() => setOpenSection((current) => current === section.key ? null : section.key)} className="flex w-full items-center justify-between py-4 text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0f473a]">{section.title}<ChevronDown size={16} className={`transition-transform ${openSection === section.key ? "rotate-180" : ""}`} /></button>{openSection === section.key && <p className="pb-5 text-sm leading-6 text-[#60756b]">{section.body}</p>}</div>)}</div></section></div><SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} /><section className="mt-14 border-t border-[#d9ded3] pt-10">{showReviewInput && <AddReviewForm productId={productId} productName={product.name} onSubmitted={setJustPostedReview} />}{justPostedReview && <PostedReviewCard review={justPostedReview} />}<ProductReviews product_id={productId} /></section></main>;
}