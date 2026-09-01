import { describe, expect, it } from "vitest";
import { formatCurrency, isCustomSize, normalizeOrderQuantity } from "./storefront-utils";

describe("storefront utilities", () => {
  it("formats checkout totals as currency", () => {
    expect(formatCurrency(17.85)).toBe("$17.85");
  });

  it("recognizes custom-size selections regardless of casing", () => {
    expect(isCustomSize("Custom")).toBe(true);
    expect(isCustomSize("  custom ")).toBe(true);
    expect(isCustomSize("M")).toBe(false);
  });

  it("keeps editable cart quantities within the available stock", () => {
    expect(normalizeOrderQuantity(7, 3)).toBe(3);
    expect(normalizeOrderQuantity(0, 3)).toBe(1);
    expect(normalizeOrderQuantity(4, 0)).toBe(4);
  });
});
