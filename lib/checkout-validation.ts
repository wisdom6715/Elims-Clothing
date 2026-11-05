export type CheckoutEligibility = {
  hasAddress: boolean;
  phone: string;
  itemCount: number;
  isGuest: boolean;
  name: string;
  email: string;
  acceptedPolicies: boolean;
};

export type AddressDraft = {
  id?: string;
  label?: string;
  phone_number?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  isDefault?: boolean;
};

export type AddressRequiredField = "phone_number" | "street" | "city" | "country";

export type AddressFieldErrors = Partial<Record<keyof AddressDraft, string>>;

export type AddressValidationResult = {
  isValid: boolean;
  errors: AddressFieldErrors;
  firstErrorField?: AddressRequiredField;
  firstErrorMessage?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getCheckoutValidationError(input: CheckoutEligibility) {
  if (input.itemCount < 1) return "Your bag is empty.";
  if (!input.hasAddress) return "Please add a delivery address first.";
  if (input.phone.trim().length < 7) return "Please enter a valid phone number.";
  if (input.isGuest && input.name.trim().length < 2) return "Please enter your full name.";
  if (input.isGuest && !emailPattern.test(input.email.trim())) return "Please enter a valid email address.";
  if (!input.acceptedPolicies) return "Please accept the Terms, Refund Policy, and Privacy Policy to continue.";
  return null;
}

/**
 * Validates address fields for delivery.
 * Compulsory: Street Address, City, Country, Phone Number.
 * Optional: State, ZIP Code, Label.
 */
export function validateAddressDraft(
  draft: AddressDraft | null | undefined,
  fallbackPhone?: string
): AddressValidationResult {
  const errors: AddressFieldErrors = {};
  let firstErrorField: AddressRequiredField | undefined;
  let firstErrorMessage: string | undefined;

  const setFirst = (field: AddressRequiredField, message: string) => {
    if (!firstErrorMessage) {
      firstErrorField = field;
      firstErrorMessage = message;
    }
  };

  const phone = (draft?.phone_number || fallbackPhone || "").trim();
  const street = (draft?.street || "").trim();
  const city = (draft?.city || "").trim();
  const country = (draft?.country || "").trim();

  // Validate phone number
  const phoneDigits = phone.replace(/\D/g, "");
  if (!phone || phoneDigits.length < 7) {
    const msg = "Please enter your phone number (at least 7 digits).";
    errors.phone_number = msg;
    setFirst("phone_number", msg);
  }

  // Validate street address
  if (!street) {
    const msg = "Please enter your street address.";
    errors.street = msg;
    setFirst("street", msg);
  }

  // Validate city
  if (!city) {
    const msg = "Please enter your city.";
    errors.city = msg;
    setFirst("city", msg);
  }

  // Validate country
  if (!country) {
    const msg = "Please enter or select your country.";
    errors.country = msg;
    setFirst("country", msg);
  }

  // State, ZIP code, and Label are explicitly optional!

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    firstErrorField,
    firstErrorMessage,
  };
}
