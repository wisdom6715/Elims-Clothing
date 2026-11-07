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
import AddressAutocompleteForm from "@/components/AddressAutocompleteForm";
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
      country: "",
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

  const renderAddressForm = (onSave: () => void, onCancel: () => void) => (
    <AddressAutocompleteForm
      idPrefix="profile-addr"
      title={adding ? "Add New Address" : "Edit Address"}
      draft={draft}
      errors={errors}
      saving={saving}
      showDefaultCheckbox={true}
      defaultCheckboxLabel="Set as default address"
      showCancelButton={true}
      showAutoSaveHint={false}
      onChangeField={(key, val) => {
        setDraft((d) => ({ ...d, [key]: val }));
        if (errors[key]) {
          setErrors((prev) => ({ ...prev, [key]: undefined }));
        }
      }}
      onBulkUpdate={(updates) => {
        setDraft((d) => ({ ...d, ...updates }));
        setErrors((prev) => {
          const next = { ...prev };
          for (const k of Object.keys(updates) as Array<keyof AddressDraft>) {
            delete next[k];
          }
          return next;
        });
      }}
      onToggleDefault={(checked) =>
        setDraft((d) => ({ ...d, isDefault: checked }))
      }
      onSave={onSave}
      onCancel={onCancel}
    />
  );

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

      {adding && renderAddressForm(saveAdd, cancelForm)}

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
              <div key={addr.id}>
                {renderAddressForm(saveEdit, cancelForm)}
              </div>
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
