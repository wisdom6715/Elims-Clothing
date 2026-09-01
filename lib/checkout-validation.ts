export type CheckoutEligibility = {
  hasAddress: boolean;
  phone: string;
  itemCount: number;
  isGuest: boolean;
  name: string;
  email: string;
  acceptedPolicies: boolean;
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
