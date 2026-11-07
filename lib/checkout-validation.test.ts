import { describe, expect, it } from "vitest";
import {
  getCheckoutValidationError,
  validateAddressDraft,
  type CheckoutEligibility,
  type AddressDraft,
} from "./checkout-validation";
import {
  filterCountries,
  filterStatesForCountry,
  filterCitiesForCountry,
  matchCanonicalCountry,
} from "./address-autocomplete";

const validCustomer: CheckoutEligibility = {
  hasAddress: true,
  phone: "+2348000000000",
  itemCount: 1,
  isGuest: false,
  name: "",
  email: "",
  acceptedPolicies: true,
};

describe("checkout eligibility", () => {
  it("allows an authenticated customer with an address, phone, cart item, and policy consent", () => {
    expect(getCheckoutValidationError(validCustomer)).toBeNull();
  });

  it("requires guest contact details before creating a payment session", () => {
    expect(
      getCheckoutValidationError({
        ...validCustomer,
        isGuest: true,
        name: "A",
        email: "not-an-email",
      }),
    ).toBe("Please enter your full name.");
    expect(
      getCheckoutValidationError({
        ...validCustomer,
        isGuest: true,
        name: "Amina Bello",
        email: "not-an-email",
      }),
    ).toBe("Please enter a valid email address.");
  });

  it("rejects missing delivery and policy prerequisites", () => {
    expect(
      getCheckoutValidationError({ ...validCustomer, hasAddress: false }),
    ).toBe("Please add a delivery address first.");
    expect(
      getCheckoutValidationError({ ...validCustomer, acceptedPolicies: false }),
    ).toBe("Please accept the Terms, Refund Policy, and Privacy Policy to continue.");
  });
});

describe("validateAddressDraft", () => {
  const completeAddress: AddressDraft = {
    label: "Home",
    phone_number: "+447930478645",
    street: "22 Oliver House",
    city: "London",
    state: "Greater London",
    zip: "SW8 2SX",
    country: "United Kingdom",
  };

  it("validates a full address successfully", () => {
    const result = validateAddressDraft(completeAddress);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("allows state, zip, and label to be omitted (optional fields)", () => {
    const minimalAddress: AddressDraft = {
      phone_number: "+447930478645",
      street: "22 Oliver House",
      city: "London",
      country: "United Kingdom",
    };
    const result = validateAddressDraft(minimalAddress);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("points directly to missing street address", () => {
    const missingStreet: AddressDraft = {
      phone_number: "+447930478645",
      city: "London",
      country: "United Kingdom",
    };
    const result = validateAddressDraft(missingStreet);
    expect(result.isValid).toBe(false);
    expect(result.errors.street).toBe("Please enter your street address.");
    expect(result.firstErrorField).toBe("street");
    expect(result.firstErrorMessage).toBe("Please enter your street address.");
  });

  it("points directly to missing city", () => {
    const missingCity: AddressDraft = {
      phone_number: "+447930478645",
      street: "22 Oliver House",
      country: "United Kingdom",
    };
    const result = validateAddressDraft(missingCity);
    expect(result.isValid).toBe(false);
    expect(result.errors.city).toBe("Please enter your city.");
    expect(result.firstErrorField).toBe("city");
    expect(result.firstErrorMessage).toBe("Please enter your city.");
  });

  it("points directly to missing country", () => {
    const missingCountry: AddressDraft = {
      phone_number: "+447930478645",
      street: "22 Oliver House",
      city: "London",
    };
    const result = validateAddressDraft(missingCountry);
    expect(result.isValid).toBe(false);
    expect(result.errors.country).toBe("Please enter or select your country.");
    expect(result.firstErrorField).toBe("country");
  });

  it("points directly to missing phone number when neither draft nor fallback is provided", () => {
    const missingPhone: AddressDraft = {
      street: "22 Oliver House",
      city: "London",
      country: "United Kingdom",
    };
    const result = validateAddressDraft(missingPhone, "");
    expect(result.isValid).toBe(false);
    expect(result.errors.phone_number).toBe(
      "Please enter your phone number (at least 7 digits).",
    );
    expect(result.firstErrorField).toBe("phone_number");
  });

  it("uses fallbackPhone when draft.phone_number is not entered", () => {
    const addressWithoutPhone: AddressDraft = {
      street: "22 Oliver House",
      city: "London",
      country: "United Kingdom",
    };
    const result = validateAddressDraft(addressWithoutPhone, "+447930478645");
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });
});

describe("address autocomplete helpers", () => {
  it("brings up United States and United Kingdom when typing 'United'", () => {
    const matches = filterCountries("United").map((c) => c.name);
    expect(matches).toContain("United States");
    expect(matches).toContain("United Kingdom");
    expect(matches).toContain("United Arab Emirates");
  });

  it("matches country aliases like USA and UK", () => {
    expect(matchCanonicalCountry("USA")).toBe("United States");
    expect(matchCanonicalCountry("uk")).toBe("United Kingdom");
    expect(matchCanonicalCountry("Nigeria")).toBe("Nigeria");
  });

  it("returns US states when United States is selected", () => {
    const states = filterStatesForCountry("United States", "Cal");
    expect(states).toContain("California");
  });

  it("returns cities for selected country", () => {
    const ukCities = filterCitiesForCountry("United Kingdom", "Lon");
    expect(ukCities).toContain("London");
  });
});

