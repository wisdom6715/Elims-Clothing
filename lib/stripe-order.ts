import type Stripe from "stripe";
import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebase-admin";

export async function fulfillStripeSession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return { confirmed: false, orderId: null };
  const orderRef = session.metadata?.order_ref;
  if (!orderRef) throw new Error("Stripe Checkout Session is missing the order reference.");

  const adminDb = getAdminDb();
  const existing = await adminDb.collection("orders").where("stripe_session_id", "==", session.id).limit(1).get();
  if (!existing.empty) return { confirmed: true, orderId: existing.docs[0].id };

  const pendingRef = adminDb.collection("pending_payments").doc(orderRef);
  const pending = await pendingRef.get();
  if (!pending.exists) throw new Error("The pending checkout record was not found.");
  const data = pending.data()!;

  const order = await adminDb.collection("orders").add({
    user_id: data.uid ?? null,
    guest: Boolean(data.guest),
    username: data.customer?.name ?? "Customer",
    customer: data.customer ?? null,
    items: data.items ?? [],
    address: data.address ?? null,
    phone: data.phone ?? "",
    amount: data.amount ?? 0,
    currency: data.currency ?? "USD",
    status: "confirmed",
    payment_provider: "stripe",
    stripe_session_id: session.id,
    stripe_payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null,
    order_ref: orderRef,
    createdAt: FieldValue.serverTimestamp(),
  });

  if (data.uid) {
    const cartCollection = adminDb.collection("users").doc(data.uid).collection("add-to-cart");
    const batch = adminDb.batch();
    (data.items ?? []).forEach((item: { cartItemId?: string }) => {
      if (item.cartItemId) batch.delete(cartCollection.doc(item.cartItemId));
    });
    await batch.commit();
  }

  await pendingRef.set({ status: "confirmed", order_id: order.id, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  return { confirmed: true, orderId: order.id };
}
