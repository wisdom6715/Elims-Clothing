"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Star,
  X,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/firebase.config";
import { useCurrentUser } from "@/hook/useCurrentUser";
import { Address } from "../types";
import {
  validateAddressDraft,
  type AddressFieldErrors,
  type AddressDraft,
} from "@/lib/checkout-validation";

export default function AddressesPage() {
  const { user } = useCurrentUser();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Address>>({});
  const [errors, setErrors] = useState<AddressFieldErrors>({});

  useEffect(() => {
    if (!user) return;

    const addrRef = collection(db, "users", user.uid, "address");
    const unsub = onSnapshot(
      addrRef,
      (snap) => {
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
        setLoading(false);
      },
      (err) => {
        console.error("Failed to load addresses:", err);
        toast.error("Failed to load addresses.");
        setLoading(false);
      },
    );

    return () => unsub();
  }, [user]);

  const startAdd = () => {
    setDraft({
      label: "",
      phone_number: user?.phone ? (user.dialCode ? `+${user.dialCode}${user.phone}` : user.phone) : "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "Nigeria",
      isDefault: false,
    });
    setErrors({});
    setAdding(true);
    setEditingId(null);
  };

  const startEdit = (addr: Address) => {
    setDraft({ ...addr });
    setErrors({});
    setEditingId(addr.id);
    setAdding(false);
  };

  const cancelForm = () => {
    setAdding(false);
    setEditingId(null);
    setDraft({});
    setErrors({});
  };

  const saveAdd = async () => {
    if (!user) {
      toast.error("Please wait a moment and try again.");
      return;
    }

    const validation = validateAddressDraft(draft, draft.phone_number);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error(
        validation.firstErrorMessage || "Please complete required address fields.",
      );
      if (validation.firstErrorField) {
        document.getElementById(`profile-addr-${validation.firstErrorField}`)?.focus();
      }
      return;
    }

    setSaving(true);
    try {
      const addrRef = collection(db, "users", user.uid, "address");

      if (draft.isDefault) {
        const batch = writeBatch(db);
        addresses
          .filter((a) => a.isDefault)
          .forEach((a) => batch.update(doc(addrRef, a.id), { isDefault: false }));
        await batch.commit();
      }

      await addDoc(addrRef, {
        userId: user.uid,
        label: draft.label?.trim() || "Address",
        phone_number: draft.phone_number?.trim() || "",
        street: draft.street!.trim(),
        city: draft.city!.trim(),
        state: draft.state?.trim() || "",
        zip: draft.zip?.trim() || "",
        country: draft.country!.trim(),
        isDefault: draft.isDefault || false,
        createdAt: serverTimestamp(),
      });

      toast.success("Address added");
      setAdding(false);
      setDraft({});
      setErrors({});
    } catch (err) {
      console.error("Failed to add address:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const saveEdit = async () => {
    if (!user || !editingId) return;

    const validation = validateAddressDraft(draft, draft.phone_number);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error(
        validation.firstErrorMessage || "Please complete required address fields.",
      );
      if (validation.firstErrorField) {
        document.getElementById(`profile-addr-${validation.firstErrorField}`)?.focus();
      }
      return;
    }

    setSaving(true);
    try {
      const addrRef = collection(db, "users", user.uid, "address");

      if (draft.isDefault) {
        const batch = writeBatch(db);
        addresses
          .filter((a) => a.isDefault && a.id !== editingId)
          .forEach((a) => batch.update(doc(addrRef, a.id), { isDefault: false }));
        await batch.commit();
      }

      await updateDoc(doc(addrRef, editingId), {
        userId: user.uid,
        label: draft.label?.trim() || "Address",
        phone_number: draft.phone_number?.trim() || "",
        street: draft.street!.trim(),
        city: draft.city!.trim(),
        state: draft.state?.trim() || "",
        zip: draft.zip?.trim() || "",
        country: draft.country!.trim(),
        isDefault: draft.isDefault ?? false,
        updatedAt: serverTimestamp(),
      });

      toast.success("Address updated");
      setEditingId(null);
      setDraft({});
      setErrors({});
    } catch (err) {
      console.error("Failed to update address:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const deleteAddr = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "address", id));
      toast.success("Address removed");
    } catch (err) {
      console.error("Failed to delete address:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const setDefault = async (id: string) => {
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

  const AddressForm = ({
    onSave,
    onCancel,
  }: {
    onSave: () => void;
    onCancel: () => void;
  }) => {
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
        placeholder: "e.g. +44 7930 478645 or +234...",
        required: true,
        type: "tel",
      },
      {
        key: "street",
        label: "Street Address",
        placeholder: "e.g. 22 Oliver House, High Street",
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
        placeholder: "e.g. United Kingdom, Nigeria, United States",
        required: true,
      },
    ];

    return (
      <div className="bg-white rounded-xl border border-[#0f473a]/20 shadow-sm p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-[#0f473a]">
            {adding ? "Add New Address" : "Edit Address"}
          </h3>
          <span className="text-xs text-gray-500">
            <span className="text-red-500 font-bold">*</span> = Compulsory
          </span>
        </div>
        <p className="mb-4 text-xs text-gray-500">
          Street, City, Country, and Phone are required for deliveries. State and ZIP code are optional.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {fields.map(({ key, label, placeholder, required, type, span }) => {
            const hasError = Boolean(errors[key]);
            const errorMsg = errors[key];

            return (
              <div key={key} className={span ? "sm:col-span-2" : ""}>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor={`profile-addr-${key}`}
                    className="block text-xs font-semibold uppercase tracking-wide text-gray-600"
                  >
                    {label}{" "}
                    {required ? (
                      <span className="text-red-500 font-bold">*</span>
                    ) : (
                      <span className="text-gray-400 lowercase">(optional)</span>
                    )}
                  </label>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                    {required ? "Compulsory" : "Optional"}
                  </span>
                </div>

                <input
                  id={`profile-addr-${key}`}
                  type={type || "text"}
                  value={(draft as Record<string, string>)[key] || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDraft((d) => ({ ...d, [key]: val }));
                    if (errors[key]) {
                      setErrors((prev) => ({ ...prev, [key]: undefined }));
                    }
                  }}
                  placeholder={placeholder}
                  disabled={saving}
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 transition-all focus:outline-none disabled:opacity-60 ${
                    hasError
                      ? "border-red-500 bg-red-50/30 focus:border-red-600 focus:ring-2 focus:ring-red-200"
                      : "border-gray-200 focus:border-[#0f473a] focus:ring-2 focus:ring-[#0f473a]/15"
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

          <div className="sm:col-span-2 flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isDefault"
              checked={!!draft.isDefault}
              onChange={(e) =>
                setDraft((d) => ({ ...d, isDefault: e.target.checked }))
              }
              disabled={saving}
              className="accent-[#0f473a] w-4 h-4"
            />
            <label htmlFor="isDefault" className="text-sm text-gray-600">
              Set as default address
            </label>
          </div>
        </div>

        <div className="flex gap-2 mt-5 pt-4 border-t border-gray-100">
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium bg-[#0f473a] text-white hover:bg-[#1a5a4a] transition-colors disabled:opacity-60 shadow-sm"
          >
            {saving ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Check size={13} />
            )}
            Save Address
          </button>
          <button
            onClick={onCancel}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            <X size={13} /> Cancel
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-semibold text-gray-800">Addresses</h1>
        <button
          onClick={startAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#0f473a] text-white hover:bg-[#1a5a4a] transition-colors whitespace-nowrap shadow-sm"
        >
          <Plus size={14} /> Add New Address
        </button>
      </div>

      {adding && <AddressForm onSave={saveAdd} onCancel={cancelForm} />}

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-sm text-gray-400">
          <Loader2 size={16} className="animate-spin" />
          Loading addresses…
        </div>
      ) : addresses.length === 0 && !adding ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center">
            <MapPin size={28} className="text-[#0f473a]" strokeWidth={1.5} />
          </div>
          <p className="text-gray-500 text-sm">No saved addresses yet</p>
          <button
            onClick={startAdd}
            className="text-sm font-medium text-[#0f473a] hover:underline"
          >
            Add your first address →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {addresses.map((addr) =>
            editingId === addr.id ? (
              <AddressForm
                key={addr.id}
                onSave={saveEdit}
                onCancel={cancelForm}
              />
            ) : (
              <div
                key={addr.id}
                className={`bg-white rounded-xl border shadow-sm p-5 ${
                  addr.isDefault ? "border-[#0f473a]/40" : "border-gray-100"
                }`}
              >
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cream-100 flex items-center justify-center">
                      <MapPin size={14} className="text-[#0f473a]" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-800">
                        {addr.label || "Address"}
                      </span>
                      {addr.isDefault && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[#0f473a]/10 text-[#0f473a] font-medium">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {!addr.isDefault && (
                      <button
                        onClick={() => setDefault(addr.id)}
                        title="Set as default"
                        className="p-1.5 rounded-lg text-gray-400 hover:text-[#0f473a] hover:bg-cream-100 transition-all"
                      >
                        <Star size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => startEdit(addr)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#0f473a] hover:bg-cream-100 transition-all"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => deleteAddr(addr.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600 leading-relaxed pl-10">
                  {addr.phone_number && <p>Phone: {addr.phone_number}</p>}
                  <p>{addr.street}</p>
                  <p>
                    {[
                      addr.city,
                      [addr.state, addr.zip].filter(Boolean).join(" "),
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                  <p>{addr.country}</p>
                </div>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
