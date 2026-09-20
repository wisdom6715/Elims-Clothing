import { NextResponse } from "next/server";
import Stripe from "stripe";
import { fulfillStripeSession } from "@/lib/order-session"; // adjust to wherever you saved it

// firebase-admin needs the Node runtime
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { session_id } = await req.json();
    if (typeof session_id !== "string" || !session_id.startsWith("cs_")) {
      return NextResponse.json({ error: "Invalid session id." }, { status: 400 });
    }

    // If you already have a shared Stripe client (e.g. "@/lib/stripe"), use that instead
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Only creates the order if Stripe says the session is paid. Safe to call repeatedly.
    const result = await fulfillStripeSession(session);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Order confirmation failed:", error);
    return NextResponse.json({ error: "Unable to confirm order." }, { status: 500 });
  }
}