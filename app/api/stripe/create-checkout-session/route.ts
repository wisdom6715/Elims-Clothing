import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";
import {
  createLineItems,
  MANDATED_STRIPE_PAYMENT_METHODS,
  FALLBACK_STRIPE_PAYMENT_METHODS,
  type StripeCheckoutItem,
} from "@/lib/stripe-checkout-utils";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckoutPayload = {
  uid?: string;
  guest: boolean;
  customer: { name: string; email: string };
  items: Array<StripeCheckoutItem & { cartItemId?: string }>;
  address: Record<string, string>;
  phone: string;
  amount: number;
  currency?: string;
  orderRef: string;
  origin: string;
};

function trustedOrigin(value: string) {
  try {
    const url = new URL(value);
    return `${url.protocol}//${url.host}`;
  } catch {
    throw new Error("A valid storefront origin is required.");
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as CheckoutPayload;
    const { customer, items, address, phone, orderRef, uid, guest } = payload;
    const currency = (payload.currency || "usd").toLowerCase();
    const origin = trustedOrigin(payload.origin);

    if (!orderRef || !customer?.name?.trim() || !customer?.email?.trim() || !address?.street || !phone?.trim()) {
      return NextResponse.json({ error: "Complete your customer, delivery, and contact details first." }, { status: 400 });
    }

    const lineItems = createLineItems(items, currency);
    const amount = lineItems.reduce((sum, item) => sum + Number(item.price_data.unit_amount) * Number(item.quantity), 0) / 100;
    const adminDb = getAdminDb();
    const pendingRef = adminDb.collection("pending_orders").doc(orderRef);
    const existing = await pendingRef.get();

    if (existing.exists && existing.data()?.stripe_session_url) {
      return NextResponse.json({ url: existing.data()?.stripe_session_url, sessionId: existing.data()?.stripe_session_id });
    }

    await pendingRef.set({
      order_ref: orderRef,
      uid: uid ?? null,
      guest: Boolean(guest),
      customer: { name: customer.name.trim(), email: customer.email.trim() },
      items,
      address,
      phone: phone.trim(),
      amount,
      currency: currency.toUpperCase(),
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    const stripe = getStripe();
    const baseSessionParams = {
      mode: "payment" as const,
      customer_email: customer.email.trim(),
      billing_address_collection: "auto" as const,
      line_items: lineItems,
      success_url: `${origin}/cart/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart/checkout?cancelled=1`,
      metadata: { order_ref: orderRef, uid: uid ?? "", guest: String(Boolean(guest)) },
    };

    // Mandate only Card, Apple Pay (via "card"), and Amazon Pay as the top priority options.
    // LinkPay ("link") is completely excluded.
    let session;
    try {
      session = await stripe.checkout.sessions.create({
        ...baseSessionParams,
        payment_method_types: [...MANDATED_STRIPE_PAYMENT_METHODS],
      });
    } catch (pmErr: any) {
      // If Amazon Pay is not yet activated in the Stripe Dashboard for this account/currency,
      // gracefully fall back to ["card"] (Card + Apple Pay, still excluding LinkPay).
      const msg = String(pmErr?.message || "").toLowerCase();
      if (msg.includes("amazon_pay") || msg.includes("payment_method_types")) {
        console.warn(
          "Amazon Pay not active on this Stripe account/currency; falling back to Card & Apple Pay:",
          pmErr?.message,
        );
        session = await stripe.checkout.sessions.create({
          ...baseSessionParams,
          payment_method_types: [...FALLBACK_STRIPE_PAYMENT_METHODS],
        });
      } else {
        throw pmErr;
      }
    }

    if (!session.url) throw new Error("Stripe did not provide a Checkout URL.");
    await pendingRef.set({ stripe_session_id: session.id, stripe_session_url: session.url, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Unable to create Stripe Checkout Session:", error);
    const message = error instanceof Error ? error.message : "Unable to start secure checkout.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
