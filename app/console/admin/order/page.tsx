"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import {
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ShoppingBag,
  X,
} from "lucide-react";

// ---------- Types (matches the Stripe "orders" documents) ----------

interface OrderAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zip?: string;
  label?: string;
  phone_number?: string;
}

interface OrderItem {
  cartItemId?: string;
  color: string | null;
  price: number;
  product: string;
  product_id?: string;
  quantity: number;
  size: string | null;
  // Fallbacks in case the item snapshot stored an image itself
  image?: string | null;
  imageUrl?: string | null;
}

type OrderStatus = "confirmed" | "in_progress" | "delivered" | "cancelled" | string;

interface Order {
  docId: string; // Firestore document id (same as order_ref for Stripe orders)
  address: OrderAddress | null;
  amount: number;
  currency: string; // e.g. "USD"
  createdAt: Date | null;
  email: string | null;
  guest: boolean;
  items: OrderItem[];
  livemode: boolean; // false = Stripe test mode
  order_ref: string;
  phone: string;
  status: OrderStatus;
  stripe_payment_intent: string | null;
  stripe_session_id: string | null;
  user_id: string | null;
  username: string;
}

type StatusFilter = "all" | OrderStatus;

const PAGE_SIZE = 5;

// ---------- Status badge ----------

const STATUS_CONFIG: Record<
  string,
  { label: string; className: string; Icon: typeof Clock }
> = {
  confirmed: {
    label: "Confirmed",
    className: "bg-emerald-50 text-emerald-700",
    Icon: CheckCircle2,
  },
  in_progress: {
    label: "In progress",
    className: "bg-stone-200 text-stone-700",
    Icon: Clock,
  },
  delivered: {
    label: "Delivered",
    className: "bg-emerald-50 text-emerald-700",
    Icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-rose-50 text-rose-600",
    Icon: XCircle,
  },
};

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-stone-200 text-stone-700",
    Icon: Clock,
  };
  const { label, className, Icon } = config;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${className}`}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
      {label}
    </span>
  );
}

// ---------- Formatting helpers ----------

// Each order carries its own currency (defaults to USD)
function formatMoney(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(Number(value) || 0);
}

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const AVATAR_COLORS = [
  "bg-stone-200 text-stone-700",
  "bg-amber-100 text-amber-800",
  "bg-rose-100 text-rose-600",
  "bg-sky-100 text-sky-700",
];

function avatarColorFor(seed: string) {
  const idx = seed.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

// Converts a Firestore Timestamp (or plain object with seconds) to a JS Date safely.
function toDate(value: any): Date | null {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  if (typeof value.seconds === "number") return new Date(value.seconds * 1000);
  if (value instanceof Date) return value;
  return null;
}

// ---------- Product images (fetched by product_id from the "products" collection) ----------

// Simple in-memory cache so reopening an order (or the same product on several orders)
// doesn't hit Firestore again
const productImageCache = new Map<string, string | null>();

async function fetchProductImage(productId: string): Promise<string | null> {
  if (productImageCache.has(productId)) return productImageCache.get(productId)!;
  try {
    const snap = await getDoc(doc(db, "products", productId));
    const data = snap.exists() ? snap.data() : null;
    // Adjust this if your product documents store the image under a different field
    const url: string | null =
      data?.imageUrls?.[0] ?? data?.imageUrl ?? data?.image ?? data?.photoURL ?? null;
    productImageCache.set(productId, url); // also caches "product deleted / no image"
    return url;
  } catch (err) {
    console.error(`Failed to fetch product ${productId}:`, err);
    return null; // not cached, so a later open can retry
  }
}

// One read per unique product_id in the order (n+1 for now)
function useProductImages(items: OrderItem[]) {
  const ids = useMemo(
    () =>
      Array.from(
        new Set(items.map((i) => i.product_id).filter((id): id is string => Boolean(id)))
      ),
    [items]
  );
  const [images, setImages] = useState<Record<string, string | null>>({});

  useEffect(() => {
    let cancelled = false;
    Promise.all(ids.map(async (id) => [id, await fetchProductImage(id)] as const)).then(
      (entries) => {
        if (!cancelled) setImages(Object.fromEntries(entries));
      }
    );
    return () => {
      cancelled = true;
    };
  }, [ids]);

  return images;
}

function ItemThumb({
  src,
  pending,
  alt,
}: {
  src: string | null;
  pending: boolean;
  alt: string;
}) {
  if (pending) {
    return <div className="h-12 w-12 shrink-0 animate-pulse rounded-lg bg-stone-100" />;
  }
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-stone-100">
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <ShoppingBag className="h-5 w-5 text-stone-400" strokeWidth={1.5} />
      )}
    </div>
  );
}

// ---------- Order details modal ----------

function OrderDetailsModal({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) {
  const images = useProductImages(order.items);
  const itemsTotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const stripeUrl = order.stripe_payment_intent
    ? `https://dashboard.stripe.com/${order.livemode ? "" : "test/"}payments/${order.stripe_payment_intent}`
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-stone-100 px-8 py-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
              Order
            </p>
            <h2 className="mt-1 break-all font-serif text-2xl font-medium text-stone-900">
              {order.order_ref}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-8 px-8 py-6">
          {/* Summary */}
          <div className="flex flex-wrap items-center gap-4">
            <StatusBadge status={order.status} />
            {!order.livemode && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
                Test order
              </span>
            )}
            <span className="text-sm text-stone-500">
              Placed {formatDate(order.createdAt)}
            </span>
          </div>

          {/* Customer */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">
              Customer
            </h3>
            <div className="mt-3 flex items-center gap-3">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${avatarColorFor(
                  order.username
                )}`}
              >
                {getInitials(order.username)}
              </span>
              <div>
                <p className="font-medium text-stone-900">
                  {order.username}
                  {order.guest && (
                    <span className="ml-2 text-xs font-normal text-stone-400">
                      (guest)
                    </span>
                  )}
                </p>
                {order.email && (
                  <p className="text-sm text-stone-500">{order.email}</p>
                )}
                {order.phone && (
                  <p className="text-sm text-stone-500">{order.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">
              Shipping address
            </h3>
            <div className="mt-3 rounded-xl bg-stone-50 p-4 text-sm text-stone-700">
              {order.address ? (
                <>
                  {order.address.label && (
                    <p className="font-medium capitalize">{order.address.label}</p>
                  )}
                  <p className="mt-1">{order.address.street}</p>
                  <p>
                    {order.address.city}, {order.address.state}{" "}
                    {order.address.zip ?? ""}
                  </p>
                  <p>{order.address.country}</p>
                  {order.address.phone_number && (
                    <p className="mt-1 text-stone-500">
                      {order.address.phone_number}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-stone-500">No address on file.</p>
              )}
            </div>
          </div>

          {/* Items */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">
              Items ({order.items.length})
            </h3>
            <div className="mt-3 divide-y divide-stone-100 rounded-xl border border-stone-100">
              {order.items.map((item, i) => {
                const id = item.product_id;
                const pending = Boolean(id) && !(id! in images);
                const src = (id ? images[id] : null) ?? item.imageUrl ?? item.image ?? null;
                return (
                  <div
                    key={item.cartItemId ?? `${item.product_id ?? item.product}-${i}`}
                    className="flex items-center justify-between gap-4 px-4 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <ItemThumb src={src} pending={pending} alt={item.product} />
                      <div className="min-w-0">
                        <p className="font-medium text-stone-900">
                          {item.product}
                        </p>
                        <p className="text-xs text-stone-500">
                          Qty {item.quantity}
                          {item.color ? ` · ${item.color}` : ""}
                          {item.size ? ` · Size ${item.size}` : ""}
                        </p>
                      </div>
                    </div>
                    <p className="whitespace-nowrap font-semibold text-stone-800">
                      {formatMoney(item.price * item.quantity, order.currency)}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex justify-between border-t border-stone-100 px-1 pt-3 text-sm">
              <span className="text-stone-500">Items total</span>
              <span className="font-semibold text-stone-800">
                {formatMoney(itemsTotal, order.currency)}
              </span>
            </div>
            <div className="mt-1 flex justify-between px-1 text-sm">
              <span className="text-stone-500">Amount paid</span>
              <span className="font-semibold text-stone-900">
                {formatMoney(order.amount, order.currency)}
              </span>
            </div>
          </div>

          {/* Payment */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-400">
              Payment
            </h3>
            <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-stone-400">Stripe payment intent</dt>
                <dd className="break-all text-stone-700">
                  {order.stripe_payment_intent ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-stone-400">Checkout session</dt>
                <dd className="break-all text-stone-700">
                  {order.stripe_session_id ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-stone-400">Order ref (order_ref)</dt>
                <dd className="break-all text-stone-700">{order.order_ref}</dd>
              </div>
              <div>
                <dt className="text-stone-400">User ID</dt>
                <dd className="break-all text-stone-700">
                  {order.user_id ?? "Guest checkout"}
                </dd>
              </div>
              <div>
                <dt className="text-stone-400">Mode</dt>
                <dd className="text-stone-700">
                  {order.livemode ? "Live" : "Test"}
                </dd>
              </div>
            </dl>
            {stripeUrl && (
              <a
                href={stripeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-semibold text-stone-900 underline underline-offset-4 hover:text-stone-600"
              >
                View in Stripe →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Page ----------

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const ordersQuery = query(
          collection(db, "orders"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(ordersQuery);
        const fetched: Order[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            docId: doc.id,
            address: data.address ?? null,
            amount: Number(data.amount) || 0,
            currency: String(data.currency ?? "USD").toUpperCase(),
            createdAt: toDate(data.createdAt),
            email: data.email ?? data.customer?.email ?? null,
            guest: Boolean(data.guest),
            items: data.items ?? [],
            livemode: data.livemode !== false, // orders without the field count as live
            order_ref: data.order_ref ?? doc.id,
            phone: data.phone ?? "",
            status: data.status,
            stripe_payment_intent: data.stripe_payment_intent ?? null,
            stripe_session_id: data.stripe_session_id ?? null,
            user_id: data.user_id ?? null,
            username: data.username ?? data.customer?.name ?? "Customer",
          };
        });
        setOrders(fetched);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Couldn't load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q.length === 0 ||
        [
          order.username,
          order.email,
          order.order_ref,
          order.stripe_payment_intent,
          order.stripe_session_id,
        ].some((field) => field?.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  const totalResults = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));
  const pageOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function handleExportCsv() {
    const header = [
      "Order Ref",
      "Customer",
      "Email",
      "Phone",
      "Date",
      "Status",
      "Items",
      "Amount",
      "Currency",
      "Stripe Payment Intent",
      "Mode",
    ];
    const rows = filteredOrders.map((o) => [
      o.order_ref,
      o.username,
      o.email ?? "",
      o.phone,
      formatDate(o.createdAt),
      o.status,
      String(o.items.length),
      o.amount.toFixed(2),
      o.currency,
      o.stripe_payment_intent ?? "",
      o.livemode ? "Live" : "Test",
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "customer-orders.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12 sm:px-10 lg:px-16">
      <div>
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div className="max-w-xl">
            <h1 className="font-serif text-5xl font-medium tracking-tight text-stone-900">
              Customer Orders
            </h1>
            <p className="mt-4 text-base leading-relaxed text-stone-500">
              Manage and monitor your transaction history. Filter by status or
              search for specific customer details to streamline your
              fulfillment process.
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as StatusFilter);
                  setCurrentPage(1);
                }}
                className="appearance-none rounded-lg border border-stone-300 bg-white py-2.5 pl-4 pr-9 text-sm font-semibold uppercase tracking-wide text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900"
              >
                <option value="all">Status: All</option>
                <option value="confirmed">Status: Confirmed</option>
                <option value="in_progress">Status: In progress</option>
                <option value="delivered">Status: Delivered</option>
                <option value="cancelled">Status: Cancelled</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search orders..."
                className="w-full rounded-lg border-0 bg-stone-100 py-2.5 pl-10 pr-4 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 sm:w-64"
              />
            </div>
          </div>
        </div>

        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={filteredOrders.length === 0}
            className="rounded-lg bg-stone-900 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-stone-200 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left">
              <thead>
                <tr className="bg-stone-50 text-xs font-semibold uppercase tracking-wider text-stone-500">
                  <th className="px-8 py-4">Order Ref</th>
                  <th className="px-4 py-4">Customer</th>
                  <th className="px-4 py-4">Date</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Products</th>
                  <th className="px-8 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-8 py-12 text-center text-sm text-stone-400"
                    >
                      Loading orders…
                    </td>
                  </tr>
                )}

                {!loading && error && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-8 py-12 text-center text-sm text-rose-500"
                    >
                      {error}
                    </td>
                  </tr>
                )}

                {!loading && !error && pageOrders.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-8 py-12 text-center text-sm text-stone-400"
                    >
                      No orders match your filters.
                    </td>
                  </tr>
                )}

                {!loading &&
                  !error &&
                  pageOrders.map((order) => (
                    <tr
                      key={order.docId}
                      onClick={() => setSelectedOrder(order)}
                      className="cursor-pointer text-stone-800 transition hover:bg-stone-50"
                    >
                      <td className="whitespace-nowrap px-8 py-6 font-medium">
                        {order.order_ref.length > 18
                          ? `${order.order_ref.slice(0, 18)}…`
                          : order.order_ref}
                        {!order.livemode && (
                          <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-amber-800">
                            Test
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-6">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColorFor(
                              order.username ?? ""
                            )}`}
                          >
                            {getInitials(order.username ?? "?")}
                          </span>
                          <span className="font-medium">
                            {order.username}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-6 text-stone-600">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-6">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-6 text-stone-600">
                        {order.items.length} item
                        {order.items.length === 1 ? "" : "s"}
                      </td>
                      <td className="whitespace-nowrap px-8 py-6 text-right font-semibold">
                        {formatMoney(order.amount, order.currency)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Footer / pagination */}
          <div className="flex flex-col items-center justify-between gap-4 bg-stone-50 px-8 py-4 sm:flex-row">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
              {totalResults === 0
                ? "No results"
                : `Showing ${(currentPage - 1) * PAGE_SIZE + 1} to ${Math.min(
                    currentPage * PAGE_SIZE,
                    totalResults
                  )} of ${totalResults} results`}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous page"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-stone-300 text-stone-500 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-semibold transition ${
                      page === currentPage
                        ? "bg-stone-900 text-white"
                        : "text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                type="button"
                aria-label="Next page"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="flex h-8 w-8 items-center justify-center rounded-md border border-stone-300 text-stone-500 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </main>
  );
}