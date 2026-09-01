import { describe, expect, it } from "vitest";
import { createLineItems, itemLabel, normalizeCheckoutQuantity, toMinorUnit } from "./stripe-checkout-utils";

describe("Stripe checkout utilities", () => {
  it("converts dollar values to Stripe minor units", () => {
    expect(toMinorUnit(17.85)).toBe(1785);
  });

  it("limits each checkout item to a valid positive quantity", () => {
    expect(normalizeCheckoutQuantity(2)).toBe(2);
    expect(() => normalizeCheckoutQuantity(0)).toThrow("between 1 and 100");
  });

  it("keeps selected product options in Stripe line-item names", () => {
    const item = { product: "Fuchsia Bloom", product_id: "sku_1", price: 17.85, quantity: 1, size: "M", color: "Pink" };
    expect(itemLabel(item)).toBe("Fuchsia Bloom — M · Pink");
    expect(createLineItems([item])[0]?.price_data.unit_amount).toBe(1785);
  });
});
