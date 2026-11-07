/**
 * Mandated Stripe Checkout payment methods in priority order:
 * 1. "card" (Direct Card + Apple Pay wallet at the top on Apple devices)
 * 2. "amazon_pay" (Amazon Pay)
 * LinkPay ("link") is strictly excluded.
 */
export const MANDATED_STRIPE_PAYMENT_METHODS = ["card", "amazon_pay"] as const;
export const FALLBACK_STRIPE_PAYMENT_METHODS = ["card"] as const;

export type StripeCheckoutItem = {
  product: string;
  product_id: string;
  price: number;
  quantity: number;
  color?: string | null;
  size?: string | null;
  imageUrl?: string | null;
  sizeMeasurements?: Array<{ type: string; value: string }> | null;
};

export function toMinorUnit(amount: number) {
  const normalized = Number(amount);
  if (!Number.isFinite(normalized) || normalized <= 0) {
    throw new Error("Each item must have a positive price.");
  }
  return Math.round(normalized * 100);
}

export function normalizeCheckoutQuantity(quantity: number) {
  const normalized = Math.floor(Number(quantity));
  if (!Number.isInteger(normalized) || normalized < 1 || normalized > 100) {
    throw new Error("Each item quantity must be between 1 and 100.");
  }
  return normalized;
}

export function itemLabel(item: StripeCheckoutItem) {
  const selections = [item.size, item.color].filter(Boolean).join(" · ");
  return selections ? `${item.product} — ${selections}` : item.product;
}

export function createLineItems(items: StripeCheckoutItem[], currency = "usd") {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Your bag is empty.");
  }
  return items.map((item) => {
    const validImage =
      item.imageUrl && /^https?:\/\//i.test(item.imageUrl)
        ? [item.imageUrl]
        : undefined;

    return {
      price_data: {
        currency,
        product_data: {
          name: itemLabel(item).slice(0, 120),
          metadata: { product_id: item.product_id },
          ...(validImage ? { images: validImage } : {}),
        },
        unit_amount: toMinorUnit(item.price),
      },
      quantity: normalizeCheckoutQuantity(item.quantity),
    };
  });
}
