import { describe, expect, it } from "vitest";
import { getCheckoutValidationError, type CheckoutEligibility } from "./checkout-validation";

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
    expect(getCheckoutValidationError({ ...validCustomer, isGuest: true, name: "A", email: "not-an-email" })).toBe("Please enter your full name.");
    expect(getCheckoutValidationError({ ...validCustomer, isGuest: true, name: "Amina Bello", email: "not-an-email" })).toBe("Please enter a valid email address.");
  });

  it("rejects missing delivery and policy prerequisites", () => {
    expect(getCheckoutValidationError({ ...validCustomer, hasAddress: false })).toBe("Please add a delivery address first.");
    expect(getCheckoutValidationError({ ...validCustomer, acceptedPolicies: false })).toBe("Please accept the Terms, Refund Policy, and Privacy Policy to continue.");
  });
});
