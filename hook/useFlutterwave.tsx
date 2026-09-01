"use client";

import { useCallback } from "react";

/**
 * Compatibility shim retained at the original Kgluxee hook path.
 * Checkout now redirects through the Stripe server route, so no payment SDK is
 * loaded in the browser and legacy callers receive a safe no-op instead.
 */
export default function useCheckoutPayment() {
  const handleFlutterPayment = useCallback(() => {
    console.warn("This checkout has moved to secure Stripe Checkout.");
  }, []);

  return {
    handleFlutterPayment,
    scriptReady: false,
    hasPublicKey: false,
  };
}
