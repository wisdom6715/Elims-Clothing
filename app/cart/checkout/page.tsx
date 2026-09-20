"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import {
  MapPin,
  Phone,
  CheckCircle2,
  Loader2,
  Plus,
  Pencil,
  Star,
  X,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { db } from "@/lib/firebase.config";
import { useCurrentUser } from "@/hook/useCurrentUser";
import type { Address } from "@/types/checkout";
import { useCart } from "@/hook/useAddToCart";
import { formatCurrency } from "@/lib/storefront-utils";
import { getCheckoutValidationError } from "@/lib/checkout-validation";

export default function CheckoutPage() {
  const { user, loading: userLoading } = useCurrentUser();

  const { items, loading: itemsLoading, isGuest } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );

  // ── Inline address form state (mirrors AddressesPage exactly) ──────────
  const [addingAddr, setAddingAddr] = useState(false);
  const [editingAddrId, setEditingAddrId] = useState<string | null>(null);
  const [addrDraft, setAddrDraft] = useState<Partial<Address>>({});
  const [savingAddr, setSavingAddr] = useState(false);

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestAddress, setGuestAddress] = useState<Address | null>(null);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [phone, setPhone] = useState("");
  const [paying, setPaying] = useState(false);

  // Fetch saved addresses only for authenticated customers. Guests use the
  // one-time address entered during this checkout and never write it to
  // Firestore.
  useEffect(() => {
    if (userLoading) return;

    if (!user) {
      setAddresses([]);
      setSelectedAddressId(null);
      setAddressesLoading(false);
      return;
    }

    const addrRef = collection(db, "users", user.uid, "address");
    const unsub = onSnapshot(addrRef, (snap) => {
      const rows: Address[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          label: data.label ?? "",
          phone_number: data.phone_number ?? "",
          street: data.street ?? "",
          city: data.city ?? "",
          state: data.state ?? "",
          zip: data.zip ?? "",
          country: data.country ?? "",
          isDefault: !!data.isDefault,
        };
      });
      setAddresses(rows);
      const def = rows.find((a) => a.isDefault) ?? rows[0];
      setSelectedAddressId((prev) => prev ?? def?.id ?? null);
      setAddressesLoading(false);
    });
    return () => unsub();
  }, [user, userLoading]);

  // Prefill phone from profile or selected address
  useEffect(() => {
    if (phone) return;
    const selected = addresses.find((a) => a.id === selectedAddressId);
    if (selected?.phone_number) setPhone(selected.phone_number);
    else if (user?.phone)
      setPhone(user.dialCode ? `+${user.dialCode}${user.phone}` : user.phone);
  }, [selectedAddressId, addresses, user, phone]);

  // ── Address CRUD — identical logic to AddressesPage ─────────────────────
  const startAddAddr = () => {
    setAddrDraft({
      label: "",
      phone_number: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "Nigeria",
      isDefault: isGuest || addresses.length === 0,
    });
    setAddingAddr(true);
    setEditingAddrId(null);
  };

  const startEditAddr = (addr: Address) => {
    setAddrDraft({ ...addr });
    setEditingAddrId(addr.id);
    setAddingAddr(false);
  };

  const cancelAddrForm = () => {
    setAddingAddr(false);
    setEditingAddrId(null);
    setAddrDraft({});
  };

  const saveGuestAddr = () => {
    const nextAddress: Address = {
      id: "guest-checkout",
      label: addrDraft.label || "Delivery address",
      phone_number: addrDraft.phone_number || phone,
      street: addrDraft.street || "",
      city: addrDraft.city || "",
      state: addrDraft.state || "",
      zip: addrDraft.zip || "",
      country: addrDraft.country || "",
      isDefault: true,
    };

    if (
      !nextAddress.street ||
      !nextAddress.city ||
      !nextAddress.state ||
      !nextAddress.country
    ) {
      toast.error("Please complete your delivery address.");
      return;
    }

    setGuestAddress(nextAddress);
    setPhone(nextAddress.phone_number);
    setAddingAddr(false);
    setAddrDraft({});
    toast.success("Delivery address saved for this order");
  };

  const saveAddAddr = async () => {
    if (!user) {
      saveGuestAddr();
      return;
    }
    setSavingAddr(true);
    try {
      const addrRef = collection(db, "users", user.uid, "address");

      if (addrDraft.isDefault) {
        const batch = writeBatch(db);
        addresses
          .filter((a) => a.isDefault)
          .forEach((a) =>
            batch.update(doc(addrRef, a.id), { isDefault: false }),
          );
        await batch.commit();
      }

      const newDoc = await addDoc(addrRef, {
        userId: user.uid,
        label: addrDraft.label || "Address",
        phone_number: addrDraft.phone_number || "",
        street: addrDraft.street || "",
        city: addrDraft.city || "",
        state: addrDraft.state || "",
        zip: addrDraft.zip || "",
        country: addrDraft.country || "",
        isDefault: addrDraft.isDefault || false,
        createdAt: serverTimestamp(),
      });

      toast.success("Address added");
      setAddingAddr(false);
      setAddrDraft({});
      // Immediately select the newly created address for this order
      setSelectedAddressId(newDoc.id);
    } catch (err) {
      console.error("Failed to add address:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSavingAddr(false);
    }
  };

  const saveEditAddr = async () => {
    if (!user || !editingAddrId) return;
    setSavingAddr(true);
    try {
      const addrRef = collection(db, "users", user.uid, "address");

      if (addrDraft.isDefault) {
        const batch = writeBatch(db);
        addresses
          .filter((a) => a.isDefault && a.id !== editingAddrId)
          .forEach((a) =>
            batch.update(doc(addrRef, a.id), { isDefault: false }),
          );
        await batch.commit();
      }

      await updateDoc(doc(addrRef, editingAddrId), {
        userId: user.uid,
        label: addrDraft.label ?? "",
        phone_number: addrDraft.phone_number ?? "",
        street: addrDraft.street ?? "",
        city: addrDraft.city ?? "",
        state: addrDraft.state ?? "",
        zip: addrDraft.zip ?? "",
        country: addrDraft.country ?? "",
        isDefault: addrDraft.isDefault ?? false,
        updatedAt: serverTimestamp(),
      });

      toast.success("Address updated");
      setEditingAddrId(null);
      setAddrDraft({});
    } catch (err) {
      console.error("Failed to update address:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSavingAddr(false);
    }
  };

  const setDefaultAddr = async (id: string) => {
    if (!user) return;
    try {
      const addrRef = collection(db, "users", user.uid, "address");
      const batch = writeBatch(db);
      addresses.forEach((a) =>
        batch.update(doc(addrRef, a.id), { isDefault: a.id === id }),
      );
      await batch.commit();
    } catch (err) {
      console.error("Failed to set default address:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Same inline form UI as AddressesPage, reused here
  const renderAddressForm = (onSave: () => void, onCancel: () => void) => (
    <div className="rounded-xl border border-[#d5dfd6] bg-[#f4f6f1] p-5">
      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0f473a]">
        {addingAddr || isGuest ? "Add New Address" : "Edit Address"}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          ["Label", "label", "e.g. Home, Office"],
          ["Phone Number", "phone_number", "+234"],
          ["Street Address", "street", "123 Main Street"],
          ["City", "city", "Lagos"],
          ["State", "state", "Lagos State"],
          ["ZIP Code", "zip", "100001"],
          ["Country", "country", "Nigeria"],
        ].map(([label, key, placeholder]) => (
          <div key={key} className={key === "street" ? "sm:col-span-2" : ""}>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.11em] text-[#6a7c72]">
              {label}
            </label>
            <input
              type="text"
              value={(addrDraft as Record<string, string>)[key] || ""}
              onChange={(e) =>
                setAddrDraft((d) => ({ ...d, [key]: e.target.value }))
              }
              placeholder={placeholder}
              disabled={savingAddr}
              className="w-full rounded-lg border border-[#c6d0c8] bg-white px-3 py-2.5 text-sm text-[#0f473a] transition-all focus:border-[#0f473a] focus:outline-none focus:ring-2 focus:ring-[#dce9db] disabled:opacity-60"
            />
          </div>
        ))}
        <div className="sm:col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="isDefaultCheckout"
            checked={!!addrDraft.isDefault}
            onChange={(e) =>
              setAddrDraft((d) => ({ ...d, isDefault: e.target.checked }))
            }
            disabled={savingAddr}
            className="accent-[#0f473a]"
          />
          <label htmlFor="isDefaultCheckout" className="text-sm text-[#52685e]">
            Set as default address
          </label>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={onSave}
          disabled={savingAddr}
          className="flex items-center gap-1.5 rounded-full bg-[#0f473a] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.11em] text-white transition-colors hover:bg-[#1e6151] disabled:opacity-60"
        >
          {savingAddr ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Check size={13} />
          )}
          Save Address
        </button>
        <button
          onClick={onCancel}
          disabled={savingAddr}
          className="flex items-center gap-1.5 rounded-full border border-[#bdc9bf] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.11em] text-[#527164] transition-colors hover:bg-white disabled:opacity-60"
        >
          <X size={13} /> Cancel
        </button>
      </div>
    </div>
  );

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );
  const selectedAddress = isGuest
    ? guestAddress
    : (addresses.find((address) => address.id === selectedAddressId) ?? null);
  const checkoutName =
    user?.displayName ||
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
    guestName.trim();
  const checkoutEmail = user?.email ?? guestEmail.trim();
  const checkoutValidationError = getCheckoutValidationError({
    hasAddress: Boolean(selectedAddress),
    phone,
    itemCount: items.length,
    isGuest,
    name: checkoutName,
    email: checkoutEmail,
    acceptedPolicies,
  });
  const canPay = !checkoutValidationError && !paying;

  const orderRef = useMemo(
    () =>
      user
        ? `ORDER_${user.uid.slice(0, 6)}_${Date.now()}`
        : `GUEST_ORDER_${Date.now()}`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user?.uid],
  );

  const handlePay = async () => {
    if (!canPay) {
      toast.error(checkoutValidationError || "Please complete checkout details first.");
      return;
    }
    if (!selectedAddress || !checkoutEmail || !checkoutName) return;
    setPaying(true);
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(user ? { uid: user.uid } : {}),
          guest: isGuest,
          customer: { name: checkoutName, email: checkoutEmail },
          items: items.map((item) => ({
            product: item.name,
            product_id: item.product_id,
            price: item.price,
            quantity: item.quantity,
            color: item.color,
            size: item.size,
            ...(user ? { cartItemId: item.id } : {}),
          })),
          address: selectedAddress,
          phone,
          amount: total,
          currency: "usd",
          orderRef,
          origin: window.location.origin,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.url) {
        toast.error(data.error || "Unable to start secure Stripe Checkout.");
        return;
      }
      window.location.assign(data.url);
    } catch (error) {
      console.error("Stripe Checkout redirect failed:", error);
      toast.error("Unable to start secure Stripe Checkout. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  const loading = userLoading || itemsLoading || addressesLoading;

  return (
    <div className="elims-checkout min-h-screen bg-[#faf9f4]">
      <Header />
      <div className="store-shell py-8 sm:py-12 lg:py-16">
        <div className="mb-8 border-b border-[#d9ded3] pb-6"><p className="eyebrow">Almost there</p><h1 className="font-display mt-3 text-4xl leading-none text-[#0f473a] sm:text-5xl">Checkout.</h1></div>
        {isGuest && !loading && (
          <div className="mb-6 rounded-xl border border-[#d5e0d2] bg-[#edf3e9] px-4 py-3 text-sm leading-6 text-[#466454]">
            You are checking out as a guest. No account is required. Your cart
            is being read from this device, and your order details will be used
            only to process delivery, payment, and order support.
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-24 text-sm text-[#6c7e74]">
            <Loader2 size={18} className="animate-spin" /> Loading checkout…
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-[1.5rem] border border-dashed border-[#bdc9bf] bg-[#f4f5f0] py-24">
            <p className="font-display text-3xl text-[#0f473a]">
              Your cart is empty
            </p>
            <a
              href="/"
              className="rounded-full bg-[#0f473a] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.13em] text-white"
            >
              Browse products →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
            {/* Left: items + address + phone */}
            <div className="flex flex-col gap-5">
              {/* Items */}
              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-[#dce1d8] bg-white px-4 py-3 sm:px-5"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="flex h-16 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#eff0ea] sm:w-16">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded bg-gray-100" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#0f473a]">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-xs text-[#687b71]">
                          {[item.size, item.color].filter(Boolean).join(" · ")}
                          {item.size || item.color ? " · " : ""}Qty{" "}
                          {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-[#0f473a]">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {isGuest && (
                <div className="border border-gray-100 rounded-2xl bg-white shadow-sm p-6">
                  <h2 className="text-sm font-semibold text-gray-800 mb-4">
                    Guest Checkout Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                    <div>
                      <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(event) => setGuestName(event.target.value)}
                        placeholder="Your full name"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#C9A96E] focus:ring-2 focus:ring-[#C9A96E]/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={(event) => setGuestEmail(event.target.value)}
                        placeholder="you@example.com"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#C9A96E] focus:ring-2 focus:ring-[#C9A96E]/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <MapPin size={15} className="text-[#C9A96E]" /> Delivery
                      Address
                    </h3>
                    {guestAddress && !addingAddr && (
                      <button
                        type="button"
                        onClick={startAddAddr}
                        className="flex items-center gap-1.5 text-xs font-medium text-[#C9A96E] hover:underline"
                      >
                        <Pencil size={13} /> Edit Address
                      </button>
                    )}
                  </div>

                  {guestAddress && !addingAddr ? (
                    <div className="flex items-start justify-between gap-3 rounded-xl border border-[#C9A96E] bg-[#C9A96E]/5 p-3 text-sm">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {guestAddress.label}
                        </p>
                        <p className="mt-0.5 text-gray-500">
                          {guestAddress.street}, {guestAddress.city},{" "}
                          {guestAddress.state} {guestAddress.zip},{" "}
                          {guestAddress.country}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={startAddAddr}
                        className="text-xs font-medium text-[#A07840] hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  ) : (
                    renderAddressForm(saveAddAddr, cancelAddrForm)
                  )}
                </div>
              )}

              {!isGuest && (
                <>
                  {/* Address — fully inline, no route-outs */}
                  <div className="border border-gray-100 rounded-2xl bg-white shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                        <MapPin size={15} className="text-[#C9A96E]" /> Delivery
                        Address
                      </h2>
                      {!addingAddr && !editingAddrId && (
                        <button
                          onClick={startAddAddr}
                          className="flex items-center gap-1.5 text-xs font-medium text-[#C9A96E] hover:underline"
                        >
                          <Plus size={13} /> Add New Address
                        </button>
                      )}
                    </div>

                    {(addingAddr || editingAddrId) && (
                      <div className="mb-4">
                        {renderAddressForm(
                          addingAddr ? saveAddAddr : saveEditAddr,
                          cancelAddrForm,
                        )}
                      </div>
                    )}

                    {addresses.length === 0 && !addingAddr ? (
                      <div className="text-center py-6">
                        <p className="text-sm text-gray-500 mb-2">
                          You need an address to check out.
                        </p>
                        <button
                          onClick={startAddAddr}
                          className="inline-block px-4 py-2 rounded-lg text-sm font-medium bg-[#C9A96E] text-white hover:bg-[#A07840] transition-colors"
                        >
                          Add an address
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {addresses.map((addr) =>
                          editingAddrId === addr.id ? null : (
                            <label
                              key={addr.id}
                              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                selectedAddressId === addr.id
                                  ? "border-[#C9A96E] bg-[#C9A96E]/5"
                                  : "border-gray-100 hover:border-gray-200"
                              }`}
                            >
                              <input
                                type="radio"
                                name="address"
                                className="mt-1 accent-[#C9A96E]"
                                checked={selectedAddressId === addr.id}
                                onChange={() => setSelectedAddressId(addr.id)}
                              />
                              <div className="text-sm flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <p className="font-semibold text-gray-800">
                                    {addr.label}{" "}
                                    {addr.isDefault && (
                                      <span className="text-xs text-[#A07840]">
                                        (Default)
                                      </span>
                                    )}
                                  </p>
                                  <div className="flex items-center gap-1">
                                    {!addr.isDefault && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setDefaultAddr(addr.id);
                                        }}
                                        title="Set as default"
                                        className="p-1 rounded-md text-gray-400 hover:text-[#C9A96E] hover:bg-cream-100 transition-all"
                                      >
                                        <Star size={13} />
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        startEditAddr(addr);
                                      }}
                                      className="p-1 rounded-md text-gray-400 hover:text-[#C9A96E] hover:bg-cream-100 transition-all"
                                    >
                                      <Pencil size={13} />
                                    </button>
                                  </div>
                                </div>
                                <p className="text-gray-500 mt-0.5">
                                  {addr.street}, {addr.city}, {addr.state}{" "}
                                  {addr.zip}, {addr.country}
                                </p>
                              </div>
                            </label>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Phone */}
              <div className="border border-gray-100 rounded-2xl bg-white shadow-sm p-6">
                <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-3">
                  <Phone size={15} className="text-[#C9A96E]" /> Contact Phone
                  Number
                </h2>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#C9A96E] focus:ring-2 focus:ring-[#C9A96E]/20 transition-all"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Used for delivery updates and payment confirmation.
                </p>
              </div>
            </div>

            {/* Right: summary */}
            <div className="lg:col-span-1">
              <div className="border border-gray-100 rounded-2xl bg-white shadow-sm p-6 sticky top-6">
                <h2 className="text-sm font-semibold text-gray-800 mb-4">
                  Order Summary
                </h2>
                <div className="flex flex-col gap-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-800">
                      {formatCurrency(total)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="font-medium text-gray-800">
                      Calculated at delivery
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between mb-6">
                  <span className="text-base font-semibold text-gray-900">
                    Total
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(total)}
                  </span>
                </div>

                <label className="mb-5 flex items-start gap-2 text-xs leading-relaxed text-gray-600">
                  <input
                    type="checkbox"
                    checked={acceptedPolicies}
                    onChange={(event) =>
                      setAcceptedPolicies(event.target.checked)
                    }
                    className="mt-0.5 accent-[#C9A96E]"
                  />
                  <span>
                    I have read and agree to the{" "}
                    <a
                      href="/terms-of-service"
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      Terms of Service
                    </a>
                    ,{" "}
                    <a
                      href="/refund-policy"
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      Refund and Return Policy
                    </a>
                    , and{" "}
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      Privacy Policy
                    </a>
                    . I understand that payment is processed through Stripe
                    or the payment provider displayed at checkout, and Elims Clothing's
                    does not store my full card number, CVV, PIN, or
                    online-banking password.
                  </span>
                </label>

                <button
                  onClick={handlePay}
                  disabled={!canPay}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#C9A96E] hover:bg-[#A07840] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {paying ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : null}
                  {paying ? "Opening secure checkout…" : "Continue securely with Stripe"}
                </button>
                {!selectedAddress && (
                  <p className="text-xs text-red-400 mt-2 text-center">
                    Add a delivery address to continue
                  </p>
                )}
                {selectedAddress && phone.trim().length < 7 && (
                  <p className="text-xs text-red-400 mt-2 text-center">
                    Enter a valid phone number to continue
                  </p>
                )}
                {!acceptedPolicies && (
                  <p className="text-xs text-red-400 mt-2 text-center">
                    Accept the Terms, Refund Policy, and Privacy Policy to
                    continue.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
