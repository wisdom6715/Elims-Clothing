import type Stripe from "stripe";
import { FieldValue } from "firebase-admin/firestore";
import { Resend } from "resend";
import { getAdminDb } from "@/lib/firebase-admin";

// ─── Brand config ────────────────────────────────────────────────────────────
const BRAND = "Elims Clothing's";
const BRAND_COLOR = "#A07840";
// The sending domain must be verified in Resend. Swap it if you move to an Elims domain.
const FROM = `${BRAND} Orders <noreply@kgluxee.store>`;
const ADMIN_ORDER_EMAIL = "olayiwolaibrahim46@gmail.com";
// TODO: replace with the Elims Clothing's logo
const LOGO_URL =
  "https://firebasestorage.googleapis.com/v0/b/elims-clothing.firebasestorage.app/o/image.png?alt=media&token=c9bfafea-c3a7-4eb9-ae02-1d530c697302";
// TODO: fill in the founder's name
const FOUNDER_SIGNATURE = `— Bukola Salako, Founder & CEO, ${BRAND}`;

// Created lazily so a missing key can't crash the build
const getResend = () => new Resend(process.env.RESEND_KEY);

// ─── Money helpers (any currency, defaults to USD) ───────────────────────────
export const formatMoney = (value: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(Number(value) || 0);

// Stripe amounts are in the smallest currency unit (cents for USD, whole units for JPY, etc.)
const fromMinorUnits = (amount: number, currency: string) => {
  const digits =
    new Intl.NumberFormat("en-US", { style: "currency", currency })
      .resolvedOptions().maximumFractionDigits ?? 2;
  return amount / 10 ** digits;
};

// ─── HTML helpers ────────────────────────────────────────────────────────────
// Customer-provided text goes into HTML emails, so escape it
const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const getItemImage = (it: any): string | null =>
  it.product?.imageUrls?.[0] ?? it.image ?? it.imageUrl ?? it.photoURL ?? null;

const itemLabel = (it: any) => {
  const name =
    typeof it.product === "string" ? it.product : it.product?.name ?? it.name ?? "Item";
  return `${name}${it.color ? ` (${it.color})` : ""}${it.size ? ` - ${it.size}` : ""}`;
};

const formatAddress = (a: any) =>
  a ? [a.street, a.city, a.state, a.country].filter(Boolean).map(esc).join(", ") : "—";

const buildItemsHtml = (items: any[], currency: string) =>
  items
    .map((it: any) => {
      const imageUrl = getItemImage(it);
      const thumbCell = imageUrl
        ? `<td style="padding-right:10px; width:48px;">
             <img src="${esc(imageUrl)}" width="48" height="48" alt=""
                  style="width:48px;height:48px;object-fit:cover;border-radius:6px;display:block;" />
           </td>`
        : "";
      return `
        <tr>
          <td style="padding:8px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
              <tr>
                ${thumbCell}
                <td style="vertical-align:middle;">${esc(itemLabel(it))}</td>
              </tr>
            </table>
          </td>
          <td style="padding:8px 0;text-align:center;">${esc(it.quantity)}</td>
          <td style="padding:8px 0;text-align:right;">${formatMoney(it.paymentPrice ?? it.price, currency)}</td>
        </tr>`;
    })
    .join("");

const itemsTable = (itemsHtml: string) => `
  <table style="width:100%; border-collapse:collapse; margin-top:16px;">
    <thead>
      <tr style="border-bottom:1px solid #eee; text-align:left;">
        <th style="padding:8px 0;">Item</th>
        <th style="padding:8px 0;text-align:center;">Qty</th>
        <th style="padding:8px 0;text-align:right;">Price</th>
      </tr>
    </thead>
    <tbody>${itemsHtml}</tbody>
  </table>`;

const emailShell = (inner: string) => `
  <div style="font-family: sans-serif; max-width: 560px; margin: auto;">
    <div style="text-align:center; margin-bottom:24px;">
      <img src="${LOGO_URL}" alt="${esc(BRAND)}" style="height:400px; width:400px" />
    </div>
    ${inner}
  </div>`;

// ─── Emails ──────────────────────────────────────────────────────────────────
const buildBuyerEmailHtml = ({
  name, amount, currency, address, itemsHtml, orderId,
}: {
  name: string; amount: number; currency: string;
  address: any; itemsHtml: string; orderId: string;
}) =>
  emailShell(`
    <h1 style="color:${BRAND_COLOR}; font-size:26px; margin:0 0 12px;">🎉 YES!! Your order is confirmed, ${esc(name)}!</h1>
    <p style="font-size:16px; line-height:1.6;">
      We are <strong>SO excited</strong> right now, honestly, we're doing a little happy dance over here! 💃🕺
      Your payment went through perfectly and your <strong>${esc(BRAND)}</strong> order is officially in the works! ✨
    </p>
    <p style="line-height:1.6;">
      We'll reach out to you very soon about the delivery cost and how you'll receive your goodies.
      Get ready, something amazing is on its way to you! 🛍️
    </p>
    ${itemsTable(itemsHtml)}
    <p style="margin-top:16px; font-weight:700; font-size:18px;">Total: ${formatMoney(amount, currency)} 🙌</p>
    <p style="margin-top:8px; color:#666; font-size:13px;">Delivering to: ${formatAddress(address)}</p>
    <div style="margin-top:28px; padding-top:20px; border-top:1px solid #eee; font-size:14px; color:#555; line-height:1.7;">
      <p style="margin:0 0 8px;">
        From the bottom of our hearts: <strong>THANK YOU!!!</strong> 💛 Every single order means the world to our
        small team, and you choosing ${esc(BRAND)} absolutely made our day. We can't wait for you to rock your new pieces!
      </p>
      <p style="margin:0; font-style:italic;">${esc(FOUNDER_SIGNATURE)}</p>
    </div>
    <p style="margin-top:24px; color:#000; font-size:12px;">Order ID: ${esc(orderId)}</p>
  `);

const buildAdminEmailHtml = ({
  name, email, phone, amount, currency, address, itemsHtml, orderId,
  sessionId, paymentIntentId, livemode,
}: {
  name: string; email: string | null; phone: string; amount: number; currency: string;
  address: any; itemsHtml: string; orderId: string;
  sessionId: string; paymentIntentId: string | null; livemode: boolean;
}) => {
  const dashboardBase = `https://dashboard.stripe.com/${livemode ? "" : "test/"}`;
  const stripeLink = paymentIntentId
    ? `${dashboardBase}payments/${paymentIntentId}`
    : `${dashboardBase}payments`;
  return emailShell(`
    <h1 style="color:${BRAND_COLOR}; font-size:26px; margin:0 0 12px;">🚨🎉 CHA-CHING!! New order — #${esc(orderId.slice(0, 8).toUpperCase())}</h1>
    <p style="font-size:16px; line-height:1.6; margin:0 0 16px;">
      <strong>TEAM, WE HAVE A NEW ORDER!!!</strong> 🥳🥳 Stripe has verified the payment and the order is locked in.
      Time to pack something beautiful and make another customer's day! 🚀
    </p>
    ${livemode ? "" : `<p style="background:#FFF4CC; padding:8px 12px; border-radius:6px; font-size:13px;">🧪 This is a <strong>TEST</strong> order (Stripe test mode).</p>`}

    <h3 style="margin:0 0 8px; font-size:14px;">👤 Our awesome customer</h3>
    <p style="margin:0 0 4px;">${esc(name)}${email ? ` — ${esc(email)}` : ""}</p>
    <p style="margin:0 0 16px;">${esc(phone) || "No phone provided"}</p>

    <h3 style="margin:0 0 8px; font-size:14px;">🛍️ What they ordered</h3>
    ${itemsTable(itemsHtml)}
    <p style="margin:16px 0; font-weight:700; font-size:20px;">Total: ${formatMoney(amount, currency)} 💰🔥</p>

    <h3 style="margin:0 0 8px; font-size:14px;">📦 Delivery address</h3>
    <p style="margin:0 0 16px; color:#333;">${formatAddress(address)}</p>

    <p style="margin:0 0 16px; font-size:13px;"><a href="https://elimsclothing.com" style="color:${BRAND_COLOR};">View in dashboard →</a></p>

    <p style="margin-top:20px; font-size:16px;"><strong>Let's gooo!!! 🎊</strong></p>
    <p style="margin-top:24px; color:#000; font-size:12px;">Order ID: ${esc(orderId)}</p>
  `);
};

async function sendOrderEmails(args: {
  orderId: string; email: string | null; name: string; phone: string;
  amount: number; currency: string; address: any; items: any[];
  sessionId: string; paymentIntentId: string | null; livemode: boolean;
}) {
  const { orderId, email, name, phone, amount, currency, address, items } = args;
  const resend = getResend();
  const shortId = orderId.slice(0, 8).toUpperCase();
  const itemsHtml = buildItemsHtml(items, currency);
  const jobs: { who: string; promise: Promise<any> }[] = [];

  if (email) {
    jobs.push({
      who: "buyer",
      promise: resend.emails.send({
        from: FROM,
        to: email,
        subject: `🎉 Yay! Your ${BRAND} order is confirmed — #${shortId}`,
        html: buildBuyerEmailHtml({ name, amount, currency, address, itemsHtml, orderId }),
      }),
    });
  }

  jobs.push({
    who: "admin",
    promise: resend.emails.send({
      from: FROM,
      to: ADMIN_ORDER_EMAIL,
      subject: `🚀 NEW ORDER!!! #${shortId} — ${formatMoney(amount, currency)} 🎉`,
      html: buildAdminEmailHtml({
        name, email, phone, amount, currency, address, itemsHtml, orderId,
        sessionId: args.sessionId,
        paymentIntentId: args.paymentIntentId,
        livemode: args.livemode,
      }),
    }),
  });

  const results = await Promise.allSettled(jobs.map((j) => j.promise));
  results.forEach((r, i) => {
    const who = jobs[i].who;
    if (r.status === "rejected") {
      console.error(`Order confirmation email failed (${who}):`, r.reason);
    } else if (r.value?.error) {
      // Resend returns { data, error } instead of throwing on API errors
      console.error(`Order confirmation email failed (${who}):`, r.value.error);
    }
  });
}

// ─── Fulfillment ─────────────────────────────────────────────────────────────
export async function fulfillStripeSession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return { confirmed: false, orderId: null };
  const orderRef = session.metadata?.order_ref;
  if (!orderRef) throw new Error("Stripe Checkout Session is missing the order reference.");

  const adminDb = getAdminDb();

  // Already fulfilled? (the webhook and the success page can both land here)
  const existing = await adminDb
    .collection("orders")
    .where("stripe_session_id", "==", session.id)
    .limit(1)
    .get();
  if (!existing.empty) return { confirmed: true, orderId: existing.docs[0].id };

  const pendingRef = adminDb.collection("pending_orders").doc(orderRef);
  const pending = await pendingRef.get();
  if (!pending.exists) throw new Error("The pending checkout record was not found.");
  const data = pending.data()!;

  // Stripe is the source of truth for money: currency and total come from the session
  const currency = String(session.currency ?? data.currency ?? "usd").toUpperCase();
  const amount =
    session.amount_total != null
      ? fromMinorUnits(session.amount_total, currency)
      : Number(data.amount) || 0;
  const items: any[] = data.items ?? [];
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  // Logged-in customers: fall back to their profile for name/email
  let profile: any = null;
  if (data.uid) {
    profile = (await adminDb.collection("users").doc(data.uid).get()).data() ?? null;
  }
  const email: string | null =
    session.customer_details?.email ??
    session.customer_email ??
    data.customer?.email ??
    profile?.email ??
    null;
  const name: string =
    data.customer?.name ||
    session.customer_details?.name ||
    profile?.displayName ||
    `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim() ||
    "Customer";
  const phone: string = data.phone ?? "";

  // Using order_ref as the document ID makes this idempotent: if two requests race,
  // only one create() succeeds, so only one order and one set of emails.
  const orderDoc = adminDb.collection("orders").doc(orderRef);
  try {
    await orderDoc.create({
      user_id: data.uid ?? null,
      guest: Boolean(data.guest),
      username: name,
      customer: data.customer ?? null,
      email,
      items,
      address: data.address ?? null,
      phone,
      amount,
      currency,
      status: "confirmed",
      payment_provider: "stripe",
      stripe_session_id: session.id,
      stripe_payment_intent: paymentIntentId,
      livemode: session.livemode,
      order_ref: orderRef,
      createdAt: FieldValue.serverTimestamp(),
    });
  } catch (err: any) {
    if (err?.code === 6) return { confirmed: true, orderId: orderDoc.id }; // ALREADY_EXISTS
    throw err;
  }

  // Cart cleanup: anything added mid-checkout is left untouched
  if (data.uid) {
    const cartCollection = adminDb.collection("users").doc(data.uid).collection("add-to-cart");
    const batch = adminDb.batch();
    items.forEach((item: { cartItemId?: string }) => {
      if (item.cartItemId) batch.delete(cartCollection.doc(item.cartItemId));
    });
    await batch.commit();
  }

  await pendingRef.set(
    { status: "confirmed", order_id: orderDoc.id, updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  );

  // Never fail a paid order over an email problem
  try {
    await sendOrderEmails({
      orderId: orderDoc.id,
      email,
      name,
      phone,
      amount,
      currency,
      address: data.address ?? null,
      items,
      sessionId: session.id,
      paymentIntentId,
      livemode: session.livemode,
    });
  } catch (err) {
    console.error("Order confirmation emails could not be sent:", err);
  }

  return { confirmed: true, orderId: orderDoc.id };
}