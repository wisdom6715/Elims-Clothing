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
import {
  getCheckoutValidationError,
  validateAddressDraft,
  type AddressFieldErrors,
  type AddressDraft,
} from "@/lib/checkout-validation";

export default function CheckoutPage() {
  const { user, loading: userLoading } = useCurrentUser();

  const { items, loading: itemsLoading, isGuest } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );

  // ── Inline address form state ──────────────────────────────────────────────
  const [addingAddr, setAddingAddr] = useState(false);
  const [editingAddrId, setEditingAddrId] = useState<string | null>(null);
  const [addrDraft, setAddrDraft] = useState<Partial<Address>>({});
  const [addrErrors, setAddrErrors] = useState<AddressFieldErrors>({});
  const [savingAddr, setSavingAddr] = useState(false);

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestAddress, setGuestAddress] = useState<Address | null>(null);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [phone, setPhone] = useState("");
  const [paying, setPaying] = useState(false);

  // Fetch saved addresses only for authenticated customers.
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

  // ── Address CRUD ──────────────────────────────────────────────────────────
  const startAddAddr = () => {
    setAddrDraft({
      label: "",
      phone_number: phone || "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "Nigeria",
      isDefault: isGuest || addresses.length === 0,
    });
    setAddrErrors({});
    setAddingAddr(true);
    setEditingAddrId(null);
  };

  const startEditAddr = (addr: Address) => {
    setAddrDraft({ ...addr });
    setAddrErrors({});
    setEditingAddrId(addr.id);
    setAddingAddr(false);
  };

  const cancelAddrForm = () => {
    setAddingAddr(false);
    setEditingAddrId(null);
    setAddrDraft({});
    setAddrErrors({});
  };

  const saveGuestAddr = (): Address | null => {
    const validation = validateAddressDraft(addrDraft, phone);
    if (!validation.isValid) {
      setAddrErrors(validation.errors);
      toast.error(
        validation.firstErrorMessage || "Please complete required address fields.",
      );
      if (validation.firstErrorField) {
        const el = document.getElementById(
          `addr-field-${validation.firstErrorField}`,
        );
        el?.focus();
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return null;
    }

    const nextAddress: Address = {
      id: "guest-checkout",
      label: addrDraft.label?.trim() || "Delivery address",
      phone_number: addrDraft.phone_number?.trim() || phone.trim(),
      street: addrDraft.street!.trim(),
      city: addrDraft.city!.trim(),
      state: addrDraft.state?.trim() || "",
      zip: addrDraft.zip?.trim() || "",
      country: addrDraft.country!.trim(),
      isDefault: true,
    };

    setGuestAddress(nextAddress);
    if (nextAddress.phone_number) {
      setPhone(nextAddress.phone_number);
    }
    setAddingAddr(false);
    setAddrDraft({});
    setAddrErrors({});
    toast.success("Delivery address saved for this order");
    return nextAddress;
  };

  const saveAddAddr = async (): Promise<Address | null> => {
    if (!user) {
      return saveGuestAddr();
    }

    const validation = validateAddressDraft(addrDraft, phone);
    if (!validation.isValid) {
      setAddrErrors(validation.errors);
      toast.error(
        validation.firstErrorMessage || "Please complete required address fields.",
      );
      if (validation.firstErrorField) {
        const el = document.getElementById(
          `addr-field-${validation.firstErrorField}`,
        );
        el?.focus();
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return null;
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

      const phoneToSave = addrDraft.phone_number?.trim() || phone.trim();
      const newDoc = await addDoc(addrRef, {
        userId: user.uid,
        label: addrDraft.label?.trim() || "Address",
        phone_number: phoneToSave,
        street: addrDraft.street!.trim(),
        city: addrDraft.city!.trim(),
        state: addrDraft.state?.trim() || "",
        zip: addrDraft.zip?.trim() || "",
        country: addrDraft.country!.trim(),
        isDefault: addrDraft.isDefault || false,
        createdAt: serverTimestamp(),
      });

      const savedAddress: Address = {
        id: newDoc.id,
        label: addrDraft.label?.trim() || "Address",
        phone_number: phoneToSave,
        street: addrDraft.street!.trim(),
        city: addrDraft.city!.trim(),
        state: addrDraft.state?.trim() || "",
        zip: addrDraft.zip?.trim() || "",
        country: addrDraft.country!.trim(),
        isDefault: addrDraft.isDefault || false,
      };

      if (phoneToSave) setPhone(phoneToSave);
      toast.success("Address added");
      setAddingAddr(false);
      setAddrDraft({});
      setAddrErrors({});
      setSelectedAddressId(newDoc.id);
      return savedAddress;
    } catch (err) {
      console.error("Failed to add address:", err);
      toast.error("Something went wrong. Please try again.");
      return null;
    } finally {
      setSavingAddr(false);
    }
  };

  const saveEditAddr = async (): Promise<Address | null> => {
    if (!user || !editingAddrId) return null;

    const validation = validateAddressDraft(addrDraft, phone);
    if (!validation.isValid) {
      setAddrErrors(validation.errors);
      toast.error(
        validation.firstErrorMessage || "Please complete required address fields.",
      );
      if (validation.firstErrorField) {
        const el = document.getElementById(
          `addr-field-${validation.firstErrorField}`,
        );
        el?.focus();
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return null;
    }

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

      const phoneToSave = addrDraft.phone_number?.trim() || phone.trim();
      await updateDoc(doc(addrRef, editingAddrId), {
        userId: user.uid,
        label: addrDraft.label?.trim() || "Address",
        phone_number: phoneToSave,
        street: addrDraft.street!.trim(),
        city: addrDraft.city!.trim(),
        state: addrDraft.state?.trim() || "",
        zip: addrDraft.zip?.trim() || "",
        country: addrDraft.country!.trim(),
        isDefault: addrDraft.isDefault ?? false,
        updatedAt: serverTimestamp(),
      });

      const updatedAddress: Address = {
        id: editingAddrId,
        label: addrDraft.label?.trim() || "Address",
        phone_number: phoneToSave,
        street: addrDraft.street!.trim(),
        city: addrDraft.city!.trim(),
        state: addrDraft.state?.trim() || "",
        zip: addrDraft.zip?.trim() || "",
        country: addrDraft.country!.trim(),
        isDefault: addrDraft.isDefault ?? false,
      };

      if (phoneToSave) setPhone(phoneToSave);
      toast.success("Address updated");
      setEditingAddrId(null);
      setAddrDraft({});
      setAddrErrors({});
      setSelectedAddressId(editingAddrId);
      return updatedAddress;
    } catch (err) {
      console.error("Failed to update address:", err);
      toast.error("Something went wrong. Please try again.");
      return null;
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

  // ── Address Form UI with clear compulsory / optional indicators ───────────
  const renderAddressForm = (onSave: () => void, onCancel: () => void) => {
    const fields: Array<{
      key: keyof AddressDraft;
      label: string;
      placeholder: string;
      required: boolean;
      type?: string;
      span?: boolean;
    }> = [
      {
        key: "label",
        label: "Address Label",
        placeholder: "e.g. Home, Office, Studio",
        required: false,
      },
      {
        key: "phone_number",
        label: "Phone Number",
        placeholder: "e.g. +44...",
        required: true,
        type: "tel",
      },
      {
        key: "street",
        label: "Street Address",
        placeholder: "e.g. 22 Baker Street",
        required: true,
        span: true,
      },
      {
        key: "city",
        label: "City",
        placeholder: "e.g. London, Lagos, New York",
        required: true,
      },
      {
        key: "state",
        label: "State / Province / County",
        placeholder: "e.g. Greater London (optional)",
        required: false,
      },
      {
        key: "zip",
        label: "ZIP / Postal Code",
        placeholder: "e.g. SW8 2SX (optional)",
        required: false,
      },
      {
        key: "country",
        label: "Country",
        placeholder: "e.g. United States, Nigeria, United Kingdom",
        required: true,
      },
    ];

    return (
      <div className="rounded-xl border border-[#d5dfd6] bg-[#f4f6f1] p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0f473a]">
            {addingAddr || isGuest ? "Delivery Address" : "Edit Address"}
          </h3>
          <span className="text-[11px] text-[#6a7c72]">
            <span className="text-red-500 font-bold">*</span> = Compulsory
          </span>
        </div>
        <p className="mb-4 text-xs text-[#52685e]">
          Street, City, Country, and Phone are required for delivery. State and ZIP code are optional.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {fields.map(({ key, label, placeholder, required, type, span }) => {
            const hasError = Boolean(addrErrors[key]);
            const errorMsg = addrErrors[key];

            return (
              <div key={key} className={span ? "sm:col-span-2" : ""}>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor={`addr-field-${key}`}
                    className="block text-[10px] font-semibold uppercase tracking-[0.11em] text-[#55695f]"
                  >
                    {label}{" "}
                    {required ? (
                      <span className="text-red-500 font-bold">*</span>
                    ) : (
                      <span className="text-[10px] lowercase text-[#85968d]">
                        (optional)
                      </span>
                    )}
                  </label>
                  {required ? (
                    <span className="text-[9px] font-medium uppercase tracking-wider text-[#7e9487]">
                      Compulsory
                    </span>
                  ) : (
                    <span className="text-[9px] font-medium uppercase tracking-wider text-[#9ba9a0]">
                      Optional
                    </span>
                  )}
                </div>

                <input
                  id={`addr-field-${key}`}
                  type={type || "text"}
                  value={(addrDraft as Record<string, string>)[key] || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAddrDraft((d) => ({ ...d, [key]: val }));
                    if (key === "phone_number") {
                      setPhone(val);
                    }
                    if (addrErrors[key]) {
                      setAddrErrors((prev) => ({ ...prev, [key]: undefined }));
                    }
                  }}
                  placeholder={placeholder}
                  disabled={savingAddr}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm text-[#0f473a] transition-all focus:outline-none disabled:opacity-60 ${
                    hasError
                      ? "border-red-500 bg-red-50/40 text-red-900 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                      : "border-[#c6d0c8] bg-white focus:border-[#0f473a] focus:ring-2 focus:ring-[#dce9db]"
                  }`}
                />

                {hasError && (
                  <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
                    {errorMsg}
                  </p>
                )}
              </div>
            );
          })}

          {!isGuest && (
            <div className="sm:col-span-2 flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isDefaultCheckout"
                checked={!!addrDraft.isDefault}
                onChange={(e) =>
                  setAddrDraft((d) => ({ ...d, isDefault: e.target.checked }))
                }
                disabled={savingAddr}
                className="accent-[#0f473a] w-4 h-4"
              />
              <label
                htmlFor="isDefaultCheckout"
                className="text-xs text-[#52685e]"
              >
                Set as default address for future orders
              </label>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5 pt-4 border-t border-[#d8e0d9]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSave}
              disabled={savingAddr}
              className="flex items-center gap-1.5 rounded-full bg-[#0f473a] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.11em] text-white shadow-sm transition-colors hover:bg-[#1e6151] disabled:opacity-60"
            >
              {savingAddr ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Check size={13} />
              )}
              Save Address
            </button>
            {(guestAddress || addresses.length > 0) && (
              <button
                type="button"
                onClick={onCancel}
                disabled={savingAddr}
                className="flex items-center gap-1.5 rounded-full border border-[#bdc9bf] bg-white px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.11em] text-[#527164] transition-colors hover:bg-[#f0f4f1] disabled:opacity-60"
              >
                <X size={13} /> Cancel
              </button>
            )}
          </div>
          <p className="text-[11px] text-[#6b8275]">
            Or continue below — your address will auto-save upon checkout.
          </p>
        </div>
      </div>
    );
  };

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

  const isFormOpen =
    addingAddr || Boolean(editingAddrId) || (isGuest && !guestAddress);

  const orderRef = useMemo(
    () =>
      user
        ? `ORDER_${user.uid.slice(0, 6)}_${Date.now()}`
        : `GUEST_ORDER_${Date.now()}`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user?.uid],
  );

  const handlePay = async () => {
    if (paying || savingAddr) return;

    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    if (isGuest) {
      if (!guestName.trim() || guestName.trim().length < 2) {
        toast.error("Please enter your full name.");
        document.getElementById("guest-name-input")?.focus();
        return;
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!guestEmail.trim() || !emailPattern.test(guestEmail.trim())) {
        toast.error("Please enter a valid email address.");
        document.getElementById("guest-email-input")?.focus();
        return;
      }
    }

    // Resolve delivery address: if the address form is currently open, or if no address
    // is selected yet, validate and auto-save the address draft.
    let effectiveAddress: Address | null = selectedAddress;

    if (isFormOpen || !effectiveAddress) {
      let saved: Address | null = null;
      if (editingAddrId) {
        saved = await saveEditAddr();
      } else {
        saved = await saveAddAddr();
      }

      if (!saved) {
        // Validation pointed to the exact missing field and showed the toast
        return;
      }
      effectiveAddress = saved;
    }

    const effectivePhone = (effectiveAddress?.phone_number || phone || "").trim();
    if (effectivePhone.length < 7) {
      toast.error("Please enter a valid contact phone number.");
      document.getElementById("checkout-phone-input")?.focus();
      return;
    }

    if (!acceptedPolicies) {
      toast.error(
        "Please accept the Terms, Refund Policy, and Privacy Policy to continue.",
      );
      return;
    }

    if (!effectiveAddress) {
      toast.error("Please enter your delivery address.");
      return;
    }

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
            imageUrl: item.imageUrl || null,
            sizeMeasurements: item.sizeMeasurements || null,
            ...(user ? { cartItemId: item.id } : {}),
          })),
          address: effectiveAddress,
          phone: effectivePhone,
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
        <div className="mb-8 border-b border-[#d9ded3] pb-6">
          <p className="eyebrow">Almost there</p>
          <h1 className="font-display mt-3 text-4xl leading-none text-[#0f473a] sm:text-5xl">
            Checkout.
          </h1>
        </div>

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
                        Full Name <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input
                        id="guest-name-input"
                        type="text"
                        value={guestName}
                        onChange={(event) => setGuestName(event.target.value)}
                        placeholder="Your full name"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#C9A96E] focus:ring-2 focus:ring-[#C9A96E]/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">
                        Email Address <span className="text-red-500 font-bold">*</span>
                      </label>
                      <input
                        id="guest-email-input"
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
                    <div className="flex items-start justify-between gap-3 rounded-xl border border-[#C9A96E] bg-[#C9A96E]/5 p-4 text-sm">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-800">
                            {guestAddress.label || "Delivery address"}
                          </p>
                          <span className="rounded-full bg-[#0f473a]/10 px-2 py-0.5 text-[10px] font-semibold text-[#0f473a]">
                            Saved for this order
                          </span>
                        </div>
                        <p className="mt-1 text-gray-600">
                          {[
                            guestAddress.street,
                            guestAddress.city,
                            [guestAddress.state, guestAddress.zip]
                              .filter(Boolean)
                              .join(" "),
                            guestAddress.country,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        {guestAddress.phone_number && (
                          <p className="mt-1 text-xs text-gray-500">
                            Phone: {guestAddress.phone_number}
                          </p>
                        )}
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
                    renderAddressForm(saveGuestAddr, cancelAddrForm)
                  )}
                </div>
              )}

              {!isGuest && (
                <>
                  {/* Address — fully inline */}
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
                          className="inline-block px-4 py-2 rounded-lg text-sm font-medium bg-[#0f473a] text-white hover:bg-[#1a5a4a] transition-colors"
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
                              className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                                selectedAddressId === addr.id
                                  ? "border-[#0f473a] bg-[#0f473a]/5"
                                  : "border-gray-100 hover:border-gray-200"
                              }`}
                            >
                              <input
                                type="radio"
                                name="address"
                                className="mt-1 accent-[#0f473a]"
                                checked={selectedAddressId === addr.id}
                                onChange={() => setSelectedAddressId(addr.id)}
                              />
                              <div className="text-sm flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <p className="font-semibold text-gray-800">
                                    {addr.label || "Address"}{" "}
                                    {addr.isDefault && (
                                      <span className="text-xs text-[#0f473a] font-medium">
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
                                        className="p-1 rounded-md text-gray-400 hover:text-[#0f473a] hover:bg-cream-100 transition-all"
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
                                      className="p-1 rounded-md text-gray-400 hover:text-[#0f473a] hover:bg-cream-100 transition-all"
                                    >
                                      <Pencil size={13} />
                                    </button>
                                  </div>
                                </div>
                                <p className="text-gray-500 mt-1">
                                  {[
                                    addr.street,
                                    addr.city,
                                    [addr.state, addr.zip]
                                      .filter(Boolean)
                                      .join(" "),
                                    addr.country,
                                  ]
                                    .filter(Boolean)
                                    .join(", ")}
                                </p>
                                {addr.phone_number && (
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    Phone: {addr.phone_number}
                                  </p>
                                )}
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
                  id="checkout-phone-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value;
                    setPhone(val);
                    if (addingAddr || editingAddrId) {
                      setAddrDraft((d) => ({ ...d, phone_number: val }));
                    }
                  }}
                  placeholder="+234 800 000 0000 or +44 7930 478645"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#C9A96E] focus:ring-2 focus:ring-[#C9A96E]/20 transition-all"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Used for courier delivery updates and payment confirmation.
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
                    className="mt-0.5 accent-[#0f473a]"
                  />
                  <span>
                    I have read and agree to the{" "}
                    <a
                      href="/terms-of-service"
                      target="_blank"
                      rel="noreferrer"
                      className="underline font-medium text-[#0f473a]"
                    >
                      Terms of Service
                    </a>
                    ,{" "}
                    <a
                      href="/refund-policy"
                      target="_blank"
                      rel="noreferrer"
                      className="underline font-medium text-[#0f473a]"
                    >
                      Refund and Return Policy
                    </a>
                    , and{" "}
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      rel="noreferrer"
                      className="underline font-medium text-[#0f473a]"
                    >
                      Privacy Policy
                    </a>
                    . I understand that payment is processed through Stripe
                    or the payment provider displayed at checkout, and Elims Clothings
                    does not store my full card number, CVV, PIN, or
                    online-banking password.
                  </span>
                </label>

                <button
                  onClick={handlePay}
                  disabled={paying || savingAddr || items.length === 0}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-[#0f473a] hover:bg-[#1a5a4a] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {paying || savingAddr ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : null}
                  {paying
                    ? "Opening secure Stripe checkout…"
                    : savingAddr
                    ? "Saving address details…"
                    : "Continue securely with Stripe"}
                </button>

                {isFormOpen ? (
                  <p className="text-xs text-[#466454] mt-2.5 text-center">
                    Your address will be automatically saved when continuing.
                  </p>
                ) : !selectedAddress ? (
                  <p className="text-xs text-[#a07840] mt-2.5 text-center">
                    Please add a delivery address above to continue
                  </p>
                ) : null}

                {!acceptedPolicies && (
                  <p className="text-xs text-[#8c7b64] mt-1.5 text-center">
                    Please accept the Terms & Policies to continue.
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
