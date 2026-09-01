export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(Number(amount || 0));
}

export function isCustomSize(size: string | null | undefined) {
  return (size ?? "").trim().toLowerCase() === "custom";
}

export function normalizeOrderQuantity(quantity: number, stock: number) {
  const safeQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
  const safeStock = Math.max(0, Math.floor(Number(stock) || 0));
  return safeStock > 0 ? Math.min(safeQuantity, safeStock) : safeQuantity;
}
