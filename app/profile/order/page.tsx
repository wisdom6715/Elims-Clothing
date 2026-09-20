"use client";
import { useEffect, useState } from "react";
import { Search, ShoppingBag, ChevronDown, Loader2 } from "lucide-react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase.config";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { Order } from "../types";

const TABS: Order["status"][] = ["Purchased"];

// Each order carries its own currency (Stripe orders default to USD)
type OrderRow = Order & { currency: string };

const formatMoney = (value: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(Number(value) || 0);

const errorMessage = (code?: string) => {
  switch (code) {
    case "permission-denied":
      return "We couldn't load your orders because of a permissions issue. Please contact support.";
    case "unavailable":
      return "Network problem while loading your orders. Please check your connection.";
    default:
      return "We couldn't load your orders. Please try again.";
  }
};

export default function OrdersPage() {
  const { user, loading: userLoading } = useCurrentUser();
  const uid = user?.uid;

  const [activeTab, setActiveTab] = useState<Order["status"]>("Purchased");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Recently Added");

  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Live-fetch this user's orders, flattened to one row per item
  useEffect(() => {
    if (!uid) {
      setOrders([]);
      setOrdersLoading(false);
      return;
    }
    setOrdersLoading(true);
    setError(null);

    // No orderBy here: combining where("user_id") with orderBy("createdAt") needs a composite
    // index, and without it the query fails. We sort newest-first on the client instead.
    const q = query(collection(db, "orders"), where("user_id", "==", uid));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => {
          const data = d.data();
          const createdAt: Date | null =
            typeof data.createdAt?.toDate === "function" ? data.createdAt.toDate() : null;
          return { id: d.id, data, createdAt };
        });

        // Newest first
        docs.sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));

        const rows: OrderRow[] = [];
        docs.forEach(({ id, data, createdAt }) => {
          const dateStr = createdAt
            ? createdAt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
            : "";
          const currency = String(data.currency ?? "USD").toUpperCase();

          (data.items || []).forEach((item: any, idx: number) => {
            rows.push({
              id: `${id}_${idx}`,
              orderNumber: id.slice(0, 8).toUpperCase(),
              productName:
                typeof item.product === "string"
                  ? item.product
                  : item.product?.name ?? item.name ?? "Item",
              price: (Number(item.price) || 0) * (item.quantity ?? 1),
              status: "Purchased",
              date: dateStr,
              imageUrl:
                item.product?.imageUrls?.[0] ?? item.image ?? item.imageUrl ?? item.photoURL ?? null,
              currency,
            });
          });
        });

        setOrders(rows);
        setOrdersLoading(false);
      },
      (err) => {
        // Without this callback a failed query leaves the page on "Loading orders…" forever
        console.error("Failed to load orders:", err.code, err);
        setError(errorMessage(err.code));
        setOrdersLoading(false);
      }
    );

    return () => unsub();
  }, [uid]);

  const filtered = orders.filter(
    (o) =>
      o.status === activeTab &&
      (o.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // `orders` is already newest-first; adjust for the other sort modes
  const sorted = [...filtered];
  if (sortBy === "Price: High to Low") sorted.sort((a, b) => b.price - a.price);
  else if (sortBy === "Price: Low to High") sorted.sort((a, b) => a.price - b.price);
  else if (sortBy === "Oldest First") sorted.reverse();

  const loading = userLoading || ordersLoading;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-semibold text-gray-800">Orders</h1>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 whitespace-nowrap">Sort by:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:border-[#C9A96E] cursor-pointer"
            >
              <option>Recently Added</option>
              <option>Oldest First</option>
              <option>Price: High to Low</option>
              <option>Price: Low to High</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Product name or order number"
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:border-[#C9A96E] focus:ring-2 focus:ring-[#C9A96E]/20 transition-all"
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-all ${
                activeTab === tab
                  ? "text-[#C9A96E] border-b-2 border-[#C9A96E]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400 gap-2 text-sm">
          <Loader2 size={18} className="animate-spin" /> Loading orders…
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-20 text-sm text-rose-500 text-center">
          {error}
        </div>
      ) : !user ? (
        <div className="flex items-center justify-center py-20 text-sm text-gray-500">
          Please sign in to see your orders.
        </div>
      ) : sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center">
            <ShoppingBag size={28} className="text-[#C9A96E]" strokeWidth={1.5} />
          </div>
          <p className="text-gray-500 text-sm">No {activeTab.toLowerCase()} items found</p>
          {activeTab === "Purchased" && (
            <a href="#" className="text-sm font-medium text-[#C9A96E] hover:underline">Browse products →</a>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-14 h-14 rounded-lg bg-cream-100 shrink-0 flex items-center justify-center">
                  {order.imageUrl ? (
                    <img src={order.imageUrl} alt={order.productName} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <ShoppingBag size={20} className="text-[#C9A96E]" strokeWidth={1.5} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{order.productName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">#{order.orderNumber} · {order.date}</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:flex-col sm:items-end sm:text-right shrink-0 pl-[72px] sm:pl-0">
                <p className="text-sm font-semibold text-gray-800">{formatMoney(order.price, order.currency)}</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cream-100 text-[#A07840] font-medium">{order.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}