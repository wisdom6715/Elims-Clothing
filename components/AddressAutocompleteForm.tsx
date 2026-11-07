"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Navigation,
  ChevronDown,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import type { Address } from "@/types/checkout";
import type {
  AddressDraft,
  AddressFieldErrors,
} from "@/lib/checkout-validation";
import {
  filterCountries,
  filterStatesForCountry,
  filterCitiesForCountry,
  matchCanonicalCountry,
  searchAddressSuggestions,
  detectAddressFromGeolocation,
  type AddressSuggestion,
  type CountryOption,
} from "@/lib/address-autocomplete";

interface AddressAutocompleteFormProps {
  idPrefix?: string;
  title?: string;
  draft: Partial<Address>;
  errors: AddressFieldErrors;
  saving?: boolean;
  showDefaultCheckbox?: boolean;
  defaultCheckboxLabel?: string;
  showCancelButton?: boolean;
  showAutoSaveHint?: boolean;
  onChangeField: (key: keyof AddressDraft, value: string) => void;
  onBulkUpdate: (updates: Partial<Address>) => void;
  onToggleDefault?: (checked: boolean) => void;
  onSave: () => void;
  onCancel?: () => void;
}

export default function AddressAutocompleteForm({
  idPrefix = "addr-field",
  title = "Delivery Address",
  draft,
  errors,
  saving = false,
  showDefaultCheckbox = true,
  defaultCheckboxLabel = "Set as default address for future orders",
  showCancelButton = false,
  showAutoSaveHint = false,
  onChangeField,
  onBulkUpdate,
  onToggleDefault,
  onSave,
  onCancel,
}: AddressAutocompleteFormProps) {
  const [activeDropdown, setActiveDropdown] = useState<
    "street" | "city" | "state" | "country" | null
  >(null);

  const [streetSuggestions, setStreetSuggestions] = useState<
    AddressSuggestion[]
  >([]);
  const [loadingStreet, setLoadingStreet] = useState(false);
  const [locating, setLocating] = useState(false);

  // Track whether user is actively filtering the country/state/city input
  const [countryFilterActive, setCountryFilterActive] = useState(false);
  const [stateFilterActive, setStateFilterActive] = useState(false);
  const [cityFilterActive, setCityFilterActive] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const suppressStreetSearchRef = useRef(false);

  // Close dropdowns when clicking outside the form
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced live street/address autocomplete
  useEffect(() => {
    if (suppressStreetSearchRef.current) {
      suppressStreetSearchRef.current = false;
      return;
    }

    const query = (draft.street || "").trim();
    if (query.length < 3 || activeDropdown !== "street") {
      setStreetSuggestions([]);
      setLoadingStreet(false);
      return;
    }

    const controller = new AbortController();
    setLoadingStreet(true);

    const timer = setTimeout(async () => {
      try {
        const results = await searchAddressSuggestions(
          query,
          draft.country,
          controller.signal,
        );
        if (!controller.signal.aborted) {
          setStreetSuggestions(results);
        }
      } catch {
        if (!controller.signal.aborted) {
          setStreetSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingStreet(false);
        }
      }
    }, 260);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [draft.street, draft.country, activeDropdown]);

  // Filtered lists for Country, State/Province, and City
  const countryOptions: CountryOption[] = filterCountries(
    countryFilterActive ? draft.country || "" : "",
  );

  const stateOptions: string[] = filterStatesForCountry(
    draft.country || "",
    stateFilterActive ? draft.state || "" : "",
  );

  const cityOptions: string[] = filterCitiesForCountry(
    draft.country || "",
    cityFilterActive ? draft.city || "" : "",
  );

  const handleSelectAddressSuggestion = (suggestion: AddressSuggestion) => {
    suppressStreetSearchRef.current = true;
    const updates: Partial<Address> = {
      street: suggestion.street || draft.street || "",
    };
    if (suggestion.city) updates.city = suggestion.city;
    if (suggestion.state) updates.state = suggestion.state;
    if (suggestion.zip) updates.zip = suggestion.zip;
    if (suggestion.country) updates.country = suggestion.country;

    onBulkUpdate(updates);
    setStreetSuggestions([]);
    setActiveDropdown(null);
    toast.success("Address details auto-filled");
  };

  const handleSelectCountry = (option: CountryOption) => {
    const updates: Partial<Address> = {
      country: option.name,
    };
    onBulkUpdate(updates);
    setCountryFilterActive(false);
    setActiveDropdown(null);
  };

  const handleSelectState = (stateName: string) => {
    onChangeField("state", stateName);
    setStateFilterActive(false);
    setActiveDropdown(null);
  };

  const handleSelectCity = (cityName: string) => {
    onChangeField("city", cityName);
    setCityFilterActive(false);
    setActiveDropdown(null);
  };

  const handleUseCurrentLocation = async () => {
    if (locating || saving) return;
    setLocating(true);
    try {
      const detected = await detectAddressFromGeolocation();
      if (!detected) {
        toast.error(
          "Could not detect your location. Please allow location access or type your address below.",
        );
        return;
      }

      suppressStreetSearchRef.current = true;
      const updates: Partial<Address> = {};
      if (detected.street) updates.street = detected.street;
      if (detected.city) updates.city = detected.city;
      if (detected.state) updates.state = detected.state;
      if (detected.zip) updates.zip = detected.zip;
      if (detected.country) updates.country = detected.country;

      onBulkUpdate(updates);
      setActiveDropdown(null);
      toast.success("Location detected! Please verify your street details.");
    } catch {
      toast.error(
        "Unable to access location. Please type your address or select from suggestions.",
      );
    } finally {
      setLocating(false);
    }
  };

  const renderFieldHeader = (
    key: keyof AddressDraft,
    label: string,
    required: boolean,
  ) => (
    <div className="flex items-center justify-between mb-1">
      <label
        htmlFor={`${idPrefix}-${key}`}
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
  );

  const renderError = (key: keyof AddressDraft) => {
    const errorMsg = errors[key];
    if (!errorMsg) return null;
    return (
      <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500" />
        {errorMsg}
      </p>
    );
  };

  const getInputClass = (key: keyof AddressDraft, hasRightIcon = false) => {
    const hasError = Boolean(errors[key]);
    return `w-full rounded-lg border px-3 py-2.5 ${
      hasRightIcon ? "pr-9" : ""
    } text-sm text-[#0f473a] transition-all focus:outline-none disabled:opacity-60 ${
      hasError
        ? "border-red-500 bg-red-50/40 text-red-900 focus:border-red-600 focus:ring-2 focus:ring-red-200"
        : "border-[#c6d0c8] bg-white focus:border-[#0f473a] focus:ring-2 focus:ring-[#dce9db]"
    }`;
  };

  return (
    <div
      ref={containerRef}
      className="rounded-xl border border-[#d5dfd6] bg-[#f4f6f1] p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0f473a]">
            {title}
          </h3>
          <p className="mt-0.5 text-xs text-[#52685e]">
            Street, City, Country, and Phone are required. State and ZIP code
            are optional.
          </p>
        </div>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={locating || saving}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#0f473a]/25 bg-white px-3 py-1.5 text-[11px] font-semibold text-[#0f473a] shadow-sm transition-all hover:border-[#0f473a] hover:bg-[#0f473a]/5 disabled:opacity-60"
        >
          {locating ? (
            <Loader2 size={12} className="animate-spin text-[#0f473a]" />
          ) : (
            <Navigation size={12} className="text-[#C9A96E]" />
          )}
          {locating ? "Detecting location…" : "Use My Current Location"}
        </button>
      </div>

      <div className="mb-3.5 flex items-center justify-between text-[11px] text-[#6a7c72]">
        <span>
          Start typing your street or country to see instant suggestions.
        </span>
        <span>
          <span className="text-red-500 font-bold">*</span> = Compulsory
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* 1. Label (Optional) */}
        <div>
          {renderFieldHeader("label", "Address Label", false)}
          <input
            id={`${idPrefix}-label`}
            type="text"
            autoComplete="off"
            value={draft.label || ""}
            onChange={(e) => onChangeField("label", e.target.value)}
            onFocus={() => setActiveDropdown(null)}
            placeholder="e.g. Home, Office, Studio"
            disabled={saving}
            className={getInputClass("label")}
          />
          {renderError("label")}
        </div>

        {/* 2. Phone Number (Compulsory) */}
        <div>
          {renderFieldHeader("phone_number", "Phone Number", true)}
          <input
            id={`${idPrefix}-phone_number`}
            type="tel"
            autoComplete="tel"
            value={draft.phone_number || ""}
            onChange={(e) => onChangeField("phone_number", e.target.value)}
            onFocus={() => setActiveDropdown(null)}
            placeholder="e.g. +1 555 234 5678 or +44 7930 478645"
            disabled={saving}
            className={getInputClass("phone_number")}
          />
          {renderError("phone_number")}
        </div>

        {/* 3. Country (Compulsory - with instant search & autocomplete) */}
        <div className="relative">
          {renderFieldHeader("country", "Country", true)}
          <div className="relative">
            <input
              id={`${idPrefix}-country`}
              type="text"
              autoComplete="country-name"
              value={draft.country || ""}
              onFocus={() => {
                setCountryFilterActive(false);
                setActiveDropdown("country");
              }}
              onChange={(e) => {
                setCountryFilterActive(true);
                setActiveDropdown("country");
                onChangeField("country", e.target.value);
              }}
              onBlur={() => {
                // Normalize close exact aliases like "USA" -> "United States" or "UK" -> "United Kingdom"
                const raw = (draft.country || "").trim();
                if (raw) {
                  const canonical = matchCanonicalCountry(raw);
                  if (canonical && canonical !== raw) {
                    onChangeField("country", canonical);
                  }
                }
              }}
              placeholder="Type or select country (e.g. United States, UK, Nigeria)"
              disabled={saving}
              className={getInputClass("country", true)}
            />
            {draft.country ? (
              <button
                type="button"
                tabIndex={-1}
                onClick={() => {
                  onChangeField("country", "");
                  setCountryFilterActive(true);
                  setActiveDropdown("country");
                  document.getElementById(`${idPrefix}-country`)?.focus();
                }}
                title="Clear country"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-700"
              >
                <X size={14} />
              </button>
            ) : (
              <button
                type="button"
                tabIndex={-1}
                onClick={() =>
                  setActiveDropdown((prev) =>
                    prev === "country" ? null : "country",
                  )
                }
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-700"
              >
                <ChevronDown size={15} />
              </button>
            )}
          </div>
          {renderError("country")}

          {activeDropdown === "country" && countryOptions.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-xl border border-[#c6d0c8] bg-white py-1 shadow-xl">
              <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                Select Country
              </div>
              {countryOptions.map((c) => {
                const isSelected =
                  (draft.country || "").toLowerCase() === c.name.toLowerCase();
                return (
                  <button
                    key={c.code}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectCountry(c);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors ${
                      isSelected
                        ? "bg-[#0f473a]/10 font-semibold text-[#0f473a]"
                        : "text-gray-700 hover:bg-[#f4f6f1]"
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[11px] text-gray-400">
                      {c.dialCode}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. State / Province / County (Optional - with country-aware suggestions) */}
        <div className="relative">
          {renderFieldHeader("state", "State / Province / County", false)}
          <div className="relative">
            <input
              id={`${idPrefix}-state`}
              type="text"
              autoComplete="address-level1"
              value={draft.state || ""}
              onFocus={() => {
                setStateFilterActive(false);
                setActiveDropdown("state");
              }}
              onChange={(e) => {
                setStateFilterActive(true);
                setActiveDropdown("state");
                onChangeField("state", e.target.value);
              }}
              placeholder="e.g. California, Greater London, Lagos (optional)"
              disabled={saving}
              className={getInputClass("state", stateOptions.length > 0)}
            />
            {stateOptions.length > 0 && (
              <button
                type="button"
                tabIndex={-1}
                onClick={() =>
                  setActiveDropdown((prev) =>
                    prev === "state" ? null : "state",
                  )
                }
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-700"
              >
                <ChevronDown size={15} />
              </button>
            )}
          </div>
          {renderError("state")}

          {activeDropdown === "state" && stateOptions.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-xl border border-[#c6d0c8] bg-white py-1 shadow-xl">
              <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                Suggested States / Regions
                {draft.country ? ` (${draft.country})` : ""}
              </div>
              {stateOptions.map((st) => {
                const isSelected =
                  (draft.state || "").toLowerCase() === st.toLowerCase();
                return (
                  <button
                    key={st}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectState(st);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors ${
                      isSelected
                        ? "bg-[#0f473a]/10 font-semibold text-[#0f473a]"
                        : "text-gray-700 hover:bg-[#f4f6f1]"
                    }`}
                  >
                    <span>{st}</span>
                    {isSelected && <Check size={12} className="text-[#0f473a]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. Street Address (Compulsory - with live geocoding address autocomplete) */}
        <div className="sm:col-span-2 relative">
          {renderFieldHeader("street", "Street Address", true)}
          <div className="relative">
            <input
              id={`${idPrefix}-street`}
              type="text"
              autoComplete="street-address"
              value={draft.street || ""}
              onFocus={() => setActiveDropdown("street")}
              onChange={(e) => {
                setActiveDropdown("street");
                onChangeField("street", e.target.value);
              }}
              placeholder="Start typing street address (e.g. 22 Baker Street, 350 5th Ave)..."
              disabled={saving}
              className={getInputClass("street", loadingStreet)}
            />
            {loadingStreet && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Loader2 size={14} className="animate-spin" />
              </div>
            )}
          </div>
          {renderError("street")}

          {activeDropdown === "street" && streetSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-y-auto rounded-xl border border-[#c6d0c8] bg-white py-1 shadow-xl">
              <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                Address Suggestions (Click to auto-fill)
              </div>
              {streetSuggestions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectAddressSuggestion(item);
                  }}
                  className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left text-xs text-gray-700 transition-colors hover:bg-[#f4f6f1] border-b border-gray-50 last:border-b-0"
                >
                  <MapPin
                    size={14}
                    className="mt-0.5 shrink-0 text-[#0f473a]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 truncate">
                      {item.street}
                    </p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {[item.city, item.state, item.zip, item.country]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 6. City (Compulsory - with country-aware city suggestions) */}
        <div className="relative">
          {renderFieldHeader("city", "City", true)}
          <div className="relative">
            <input
              id={`${idPrefix}-city`}
              type="text"
              autoComplete="address-level2"
              value={draft.city || ""}
              onFocus={() => {
                setCityFilterActive(false);
                setActiveDropdown("city");
              }}
              onChange={(e) => {
                setCityFilterActive(true);
                setActiveDropdown("city");
                onChangeField("city", e.target.value);
              }}
              placeholder="e.g. New York, London, Lagos"
              disabled={saving}
              className={getInputClass("city", cityOptions.length > 0)}
            />
            {cityOptions.length > 0 && (
              <button
                type="button"
                tabIndex={-1}
                onClick={() =>
                  setActiveDropdown((prev) => (prev === "city" ? null : "city"))
                }
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-700"
              >
                <ChevronDown size={15} />
              </button>
            )}
          </div>
          {renderError("city")}

          {activeDropdown === "city" && cityOptions.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-52 overflow-y-auto rounded-xl border border-[#c6d0c8] bg-white py-1 shadow-xl">
              <div className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                Suggested Cities
                {draft.country ? ` (${draft.country})` : ""}
              </div>
              {cityOptions.map((ct) => {
                const isSelected =
                  (draft.city || "").toLowerCase() === ct.toLowerCase();
                return (
                  <button
                    key={ct}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectCity(ct);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors ${
                      isSelected
                        ? "bg-[#0f473a]/10 font-semibold text-[#0f473a]"
                        : "text-gray-700 hover:bg-[#f4f6f1]"
                    }`}
                  >
                    <span>{ct}</span>
                    {isSelected && <Check size={12} className="text-[#0f473a]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 7. ZIP / Postal Code (Optional) */}
        <div>
          {renderFieldHeader("zip", "ZIP / Postal Code", false)}
          <input
            id={`${idPrefix}-zip`}
            type="text"
            autoComplete="postal-code"
            value={draft.zip || ""}
            onFocus={() => setActiveDropdown(null)}
            onChange={(e) => onChangeField("zip", e.target.value)}
            placeholder="e.g. 10001, SW8 2SX (optional)"
            disabled={saving}
            className={getInputClass("zip")}
          />
          {renderError("zip")}
        </div>

        {showDefaultCheckbox && onToggleDefault && (
          <div className="sm:col-span-2 flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id={`${idPrefix}-isDefault`}
              checked={!!draft.isDefault}
              onChange={(e) => onToggleDefault(e.target.checked)}
              disabled={saving}
              className="accent-[#0f473a] w-4 h-4"
            />
            <label
              htmlFor={`${idPrefix}-isDefault`}
              className="text-xs text-[#52685e]"
            >
              {defaultCheckboxLabel}
            </label>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5 pt-4 border-t border-[#d8e0d9]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-full bg-[#0f473a] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.11em] text-white shadow-sm transition-colors hover:bg-[#1e6151] disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Check size={13} />
            )}
            Save Address
          </button>
          {showCancelButton && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-full border border-[#bdc9bf] bg-white px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.11em] text-[#527164] transition-colors hover:bg-[#f0f4f1] disabled:opacity-60"
            >
              <X size={13} /> Cancel
            </button>
          )}
        </div>
        {showAutoSaveHint && (
          <p className="text-[11px] text-[#6b8275]">
            Or continue below — your address will auto-save upon checkout.
          </p>
        )}
      </div>
    </div>
  );
}
