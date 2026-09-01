import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** The former Flutterwave endpoint is deliberately retained as a safe compatibility route. */
export async function POST() {
  return NextResponse.json(
    { error: "This storefront now confirms payments through Stripe Checkout." },
    { status: 410 },
  );
}

