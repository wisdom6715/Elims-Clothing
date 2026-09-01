import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { fulfillStripeSession } from "@/lib/stripe-order";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("session_id");
    if (!sessionId) return NextResponse.json({ error: "Missing Stripe Checkout Session." }, { status: 400 });
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    const result = await fulfillStripeSession(session);
    return NextResponse.json({ paymentStatus: session.payment_status, ...result });
  } catch (error) {
    console.error("Stripe checkout status error:", error);
    const message = error instanceof Error ? error.message : "Unable to verify Stripe Checkout.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
