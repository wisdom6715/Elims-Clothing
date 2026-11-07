import type Stripe from "stripe";
import { FieldValue } from "firebase-admin/firestore";
import { Resend } from "resend";
import { getAdminDb } from "@/lib/firebase-admin";

// ─── Brand config ────────────────────────────────────────────────────────────
const BRAND = "Elims Clothings";
const BRAND_COLOR = "#0F473A";
const GOLD_ACCENT = "#C9A96E";

// The sending domain must be verified in Resend.
const FROM =
  process.env.RESEND_FROM_EMAIL ||
  `${BRAND} Orders <noreply@elimsclothings.store>`;

const ADMIN_ORDER_EMAIL =
  process.env.ADMIN_ORDER_EMAIL ||
  process.env.ADMIN_EMAIL ||
  "olayiwolaibrahim46@gmail.com";

// Elims Clothings logo
const LOGO_URL =
  "https://firebasestorage.googleapis.com/v0/b/elims-clothing.firebasestorage.app/o/image.png?alt=media&token=c9bfafea-c3a7-4eb9-ae02-1d530c697302";
const FOUNDER_SIGNATURE = `Bukola Salako, Founder & CEO, ${BRAND}`;

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
const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const getItemImage = (it: any): string | null =>
  it.imageUrl ?? it.image ?? it.photoURL ?? it.product?.imageUrls?.[0] ?? null;

const getItemName = (it: any): string =>
  typeof it.product === "string"
    ? it.product
    : it.product?.name ?? it.name ?? "Elims Garment";

const formatAddress = (a: any) => {
  if (!a) return "—";
  return [a.street, a.city, [a.state, a.zip].filter(Boolean).join(" "), a.country]
    .filter(Boolean)
    .map(esc)
    .join(", ");
};

/**
 * Ensures all ordered items have high-resolution images by looking up
 * products in Firestore if imageUrl is not in the line-item snapshot.
 */
async function resolveItemsWithImages(items: any[]) {
  const adminDb = getAdminDb();
  return await Promise.all(
    items.map(async (it: any) => {
      let imageUrl = getItemImage(it);
      if (!imageUrl && it.product_id) {
        try {
          const productDoc = await adminDb
            .collection("products")
            .doc(it.product_id)
            .get();
          if (productDoc.exists) {
            const data = productDoc.data();
            imageUrl =
              data?.imageUrls?.[0] ?? data?.imageUrl ?? data?.image ?? null;
          }
        } catch (err) {
          console.error("Could not resolve product image for email:", err);
        }
      }
      return {
        ...it,
        resolvedImage: imageUrl,
      };
    })
  );
}

const buildItemsHtml = (items: any[], currency: string) =>
  items
    .map((it: any) => {
      const name = getItemName(it);
      const imageUrl = it.resolvedImage || getItemImage(it);
      const price = Number(it.paymentPrice ?? it.price) || 0;
      const quantity = Math.max(1, Number(it.quantity) || 1);
      const lineTotal = price * quantity;

      const sizeLabel = it.size
        ? `<span style="display:inline-block; background-color:#FAF8F3; color:#0F473A; border:1px solid #E7E2D6; padding:2px 8px; border-radius:4px; font-weight:600; font-size:12px;">Size: ${esc(it.size)}</span>`
        : "";

      const colorLabel = it.color
        ? `<span style="display:inline-block; background-color:#FAF8F3; color:#52685E; border:1px solid #E7E2D6; padding:2px 8px; border-radius:4px; font-size:12px; margin-left:4px;">Color: ${esc(it.color)}</span>`
        : "";

      const customMeasurements =
        Array.isArray(it.sizeMeasurements) && it.sizeMeasurements.length > 0
          ? `<div style="margin-top:6px; font-size:11px; color:#52685E; line-height:1.4;">
               <strong style="color:#0F473A;">Custom Measurements:</strong> ${it.sizeMeasurements
                 .map((m: any) => `${esc(m.type)}: ${esc(m.value)}`)
                 .join(" · ")}
             </div>`
          : "";

      const imageCell = imageUrl
        ? `<td width="72" valign="top" style="padding:14px 14px 14px 0; vertical-align:top;">
             <img src="${esc(imageUrl)}" width="72" height="72" alt="${esc(name)}"
                  style="width:72px; height:72px; object-fit:cover; border-radius:8px; border:1px solid #E5E7EB; display:block;" />
           </td>`
        : `<td width="72" valign="top" style="padding:14px 14px 14px 0; vertical-align:top;">
             <div style="width:72px; height:72px; background-color:#F4F6F1; border-radius:8px; border:1px solid #E5E7EB; text-align:center; line-height:72px; font-size:24px;">👗</div>
           </td>`;

      return `
        <tr style="border-bottom:1px solid #F0F2EE;">
          ${imageCell}
          <td valign="top" style="padding:14px 12px 14px 0; vertical-align:top;">
            <p style="margin:0 0 6px 0; font-size:15px; font-weight:600; color:#0F473A; line-height:1.3;">
              ${esc(name)}
            </p>
            <div style="margin-bottom:4px;">
              ${sizeLabel}
              ${colorLabel}
            </div>
            ${customMeasurements}
            <p style="margin:6px 0 0 0; font-size:13px; color:#6B7D73;">
              Qty: <strong style="color:#0F473A;">${esc(quantity)}</strong> &times; ${formatMoney(price, currency)}
            </p>
          </td>
          <td valign="top" align="right" style="padding:14px 0; vertical-align:top; text-align:right; white-space:nowrap;">
            <span style="font-size:15px; font-weight:700; color:#0F473A;">
              ${formatMoney(lineTotal, currency)}
            </span>
          </td>
        </tr>`;
    })
    .join("");

const emailShell = (inner: string) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${esc(BRAND)}</title>
    </head>
    <body style="margin:0; padding:0; background-color:#FAF9F4; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#1F2A24;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF9F4; padding:24px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#FFFFFF; border-radius:16px; overflow:hidden; border:1px solid #E5E7EB; box-shadow:0 4px 12px rgba(0,0,0,0.03);">
              <!-- Brand Header -->
              <tr>
                <td align="center" style="background-color:#0F473A; padding:32px 24px; text-align:center;">
                  <img src="${LOGO_URL}" alt="${esc(BRAND)}" width="150" style="max-width:150px; max-height:70px; height:auto; display:inline-block; margin-bottom:8px;" />
                  <p style="margin:0; color:#C9A96E; font-size:11px; text-transform:uppercase; letter-spacing:2px; font-weight:600;">
                    African Heritage Meets Modern Elegance
                  </p>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding:32px 28px;">
                  ${inner}
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color:#FAF9F4; border-top:1px solid #E5E7EB; padding:24px; text-align:center; font-size:12px; color:#6B7D73; line-height:1.6;">
                  <p style="margin:0 0 6px 0; font-weight:600; color:#0F473A; text-transform:uppercase; letter-spacing:1px;">
                    ${esc(BRAND)}
                  </p>
                  <p style="margin:0 0 8px 0;">
                    Style for Every Generation · Women · Men · Children
                  </p>
                  <p style="margin:0; color:#9CA3AF; font-size:11px;">
                    Questions about your order? Contact us anytime at support@elimsclothings.store
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>`;

// ─── Buyer Confirmation Email ───────────────────────────────────────────────
const buildBuyerEmailHtml = ({
  name,
  amount,
  currency,
  address,
  phone,
  itemsHtml,
  orderId,
}: {
  name: string;
  amount: number;
  currency: string;
  address: any;
  phone: string;
  itemsHtml: string;
  orderId: string;
}) =>
  emailShell(`
    <div style="text-align:center; margin-bottom:28px;">
      <span style="display:inline-block; padding:6px 14px; background-color:#EBF5F0; color:#0F473A; font-size:12px; font-weight:700; border-radius:20px; text-transform:uppercase; letter-spacing:1px; margin-bottom:12px;">
        ✓ Order Confirmed
      </span>
      <h1 style="margin:8px 0; font-size:24px; color:#0F473A; font-family:Georgia, serif; font-weight:600;">
        Your Order Has Been Confirmed!
      </h1>
      <p style="margin:0; color:#52685E; font-size:15px; line-height:1.6;">
        Dear <strong>${esc(name)}</strong>, thank you for your order with <strong>${esc(BRAND)}</strong>. Your payment was successful and your pieces are officially in production.
      </p>
    </div>

    <!-- Order Metadata Box -->
    <div style="background-color:#FAF9F4; border:1px solid #E7E2D6; border-radius:10px; padding:14px 18px; margin-bottom:24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;">
        <tr>
          <td style="color:#6B7D73; padding:3px 0;">Order Reference:</td>
          <td align="right" style="font-weight:700; color:#0F473A; font-family:monospace; padding:3px 0;">#${esc(orderId.slice(0, 8).toUpperCase())}</td>
        </tr>
        <tr>
          <td style="color:#6B7D73; padding:3px 0;">Payment Status:</td>
          <td align="right" style="font-weight:600; color:#0F473A; padding:3px 0;">Paid via Stripe Secure Checkout</td>
        </tr>
      </table>
    </div>

    <!-- Items Section -->
    <h2 style="font-size:16px; color:#0F473A; margin:0 0 8px 0; text-transform:uppercase; letter-spacing:1px; font-weight:700;">
      Order Summary
    </h2>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${itemsHtml}
    </table>

    <!-- Totals -->
    <div style="margin-top:20px; padding-top:16px; border-top:2px solid #E5E7EB;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px; color:#52685E;">
        <tr>
          <td style="padding:4px 0;">Subtotal</td>
          <td align="right" style="padding:4px 0; font-weight:600; color:#0F473A;">${formatMoney(amount, currency)}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;">Delivery</td>
          <td align="right" style="padding:4px 0; color:#6B7D73;">Calculated with delivery confirmation</td>
        </tr>
        <tr>
          <td style="padding:10px 0 4px 0; font-size:18px; font-weight:700; color:#0F473A; border-top:1px solid #E5E7EB;">Total Paid</td>
          <td align="right" style="padding:10px 0 4px 0; font-size:20px; font-weight:700; color:#0F473A; border-top:1px solid #E5E7EB;">${formatMoney(amount, currency)}</td>
        </tr>
      </table>
    </div>

    <!-- Delivery Details -->
    <div style="margin-top:28px; background-color:#FAF9F4; border:1px solid #E7E2D6; border-radius:10px; padding:18px;">
      <h3 style="margin:0 0 10px 0; font-size:14px; text-transform:uppercase; letter-spacing:1px; color:#0F473A; font-weight:700;">
        📦 Delivery Details
      </h3>
      <p style="margin:0 0 4px 0; font-size:14px; font-weight:600; color:#1F2A24;">${esc(name)}</p>
      <p style="margin:0 0 4px 0; font-size:13px; color:#52685E;">${formatAddress(address)}</p>
      ${phone ? `<p style="margin:0; font-size:13px; color:#52685E;">Phone: ${esc(phone)}</p>` : ""}
    </div>

    <!-- Sign off -->
    <div style="margin-top:32px; padding-top:20px; border-top:1px solid #F0F2EE; font-size:13px; color:#52685E; line-height:1.7;">
      <p style="margin:0 0 10px 0;">
        Every single piece is tailored with care, pride, and passion. We will be in touch with updates as your order progresses.
      </p>
      <p style="margin:0; font-style:italic; font-weight:600; color:#0F473A;">
        — ${esc(FOUNDER_SIGNATURE)}
      </p>
    </div>
  `);

// ─── Admin Notification Email ───────────────────────────────────────────────
const buildAdminEmailHtml = ({
  name,
  email,
  phone,
  amount,
  currency,
  address,
  itemsHtml,
  orderId,
  sessionId,
  paymentIntentId,
  livemode,
}: {
  name: string;
  email: string | null;
  phone: string;
  amount: number;
  currency: string;
  address: any;
  itemsHtml: string;
  orderId: string;
  sessionId: string;
  paymentIntentId: string | null;
  livemode: boolean;
}) => {
  const dashboardBase = `https://dashboard.stripe.com/${livemode ? "" : "test/"}`;
  const stripeLink = paymentIntentId
    ? `${dashboardBase}payments/${paymentIntentId}`
    : `${dashboardBase}payments`;

  return emailShell(`
    <div style="margin-bottom:24px;">
      <div style="background-color:#0F473A; color:#FFFFFF; border-radius:8px; padding:12px 16px; margin-bottom:16px;">
        <span style="font-size:11px; text-transform:uppercase; letter-spacing:1px; color:#C9A96E; font-weight:700;">Admin Alert</span>
        <h1 style="margin:4px 0 0 0; font-size:20px; color:#FFFFFF; font-weight:600;">
          🚨 New Customer Order Confirmed!
        </h1>
      </div>
      ${
        livemode
          ? ""
          : `<div style="background-color:#FFF4CC; border:1px solid #FFE082; color:#856404; padding:8px 12px; border-radius:6px; font-size:12px; font-weight:600; margin-bottom:14px;">
               🧪 TEST ORDER (Stripe Test Mode)
             </div>`
      }
      <p style="margin:0; font-size:14px; color:#52685E; line-height:1.6;">
        A customer has completed payment. The order has been verified by Stripe and saved to the database.
      </p>
    </div>

    <!-- Customer Details Card -->
    <div style="background-color:#FAF9F4; border:1px solid #E7E2D6; border-radius:10px; padding:16px; margin-bottom:24px;">
      <h3 style="margin:0 0 8px 0; font-size:13px; text-transform:uppercase; letter-spacing:1px; color:#0F473A; font-weight:700;">
        👤 Customer Information
      </h3>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px; line-height:1.6;">
        <tr>
          <td style="color:#6B7D73; width:120px;">Customer Name:</td>
          <td style="font-weight:600; color:#1F2A24;">${esc(name)}</td>
        </tr>
        <tr>
          <td style="color:#6B7D73;">Email:</td>
          <td><a href="mailto:${esc(email ?? "")}" style="color:#0F473A; font-weight:600;">${esc(email ?? "None provided")}</a></td>
        </tr>
        <tr>
          <td style="color:#6B7D73;">Phone:</td>
          <td><a href="tel:${esc(phone)}" style="color:#0F473A; font-weight:600;">${esc(phone || "None provided")}</a></td>
        </tr>
        <tr>
          <td style="color:#6B7D73; vertical-align:top; padding-top:4px;">Delivery Address:</td>
          <td style="color:#1F2A24; padding-top:4px;">${formatAddress(address)}</td>
        </tr>
      </table>
    </div>

    <!-- Items Section -->
    <h3 style="margin:0 0 8px 0; font-size:13px; text-transform:uppercase; letter-spacing:1px; color:#0F473A; font-weight:700;">
      🛍️ Ordered Products
    </h3>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      ${itemsHtml}
    </table>

    <!-- Total Paid -->
    <div style="margin-top:16px; padding:14px 18px; background-color:#FAF9F4; border:1px solid #E7E2D6; border-radius:10px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:16px; font-weight:700; color:#0F473A;">Total Paid by Customer</td>
          <td align="right" style="font-size:20px; font-weight:700; color:#0F473A;">${formatMoney(amount, currency)}</td>
        </tr>
      </table>
    </div>

    <!-- Admin Links -->
    <div style="margin-top:24px; padding-top:16px; border-top:1px solid #E5E7EB;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:12px; color:#6B7D73;">
        <tr>
          <td style="padding:3px 0;">Order Reference:</td>
          <td align="right" style="font-family:monospace; color:#0F473A; font-weight:700;">#${esc(orderId)}</td>
        </tr>
        <tr>
          <td style="padding:3px 0;">Stripe Session:</td>
          <td align="right" style="font-family:monospace; color:#6B7D73;">${esc(sessionId)}</td>
        </tr>
        <tr>
          <td style="padding:6px 0 0 0;" colspan="2">
            <a href="${stripeLink}" target="_blank" rel="noreferrer" style="display:inline-block; background-color:#0F473A; color:#FFFFFF; text-decoration:none; padding:8px 16px; border-radius:6px; font-weight:600; font-size:12px; margin-top:8px;">
              View Payment in Stripe Dashboard &rarr;
            </a>
          </td>
        </tr>
      </table>
    </div>
  `);
};

async function sendOrderEmails(args: {
  orderId: string;
  email: string | null;
  name: string;
  phone: string;
  amount: number;
  currency: string;
  address: any;
  items: any[];
  sessionId: string;
  paymentIntentId: string | null;
  livemode: boolean;
}) {
  const { orderId, email, name, phone, amount, currency, address, items } = args;
  const resend = getResend();
  const shortId = orderId.slice(0, 8).toUpperCase();
  const itemsHtml = buildItemsHtml(items, currency);
  const jobs: { who: string; promise: Promise<any> }[] = [];

  // 1. Send confirmation email to the buyer
  if (email && email.includes("@")) {
    jobs.push({
      who: "buyer",
      promise: resend.emails.send({
        from: FROM,
        to: email.trim(),
        subject: `Your ${BRAND} Order is Confirmed! — #${shortId}`,
        html: buildBuyerEmailHtml({
          name,
          amount,
          currency,
          address,
          phone,
          itemsHtml,
          orderId,
        }),
      }),
    });
  }

  // 2. Send notification email to the admin
  if (ADMIN_ORDER_EMAIL && ADMIN_ORDER_EMAIL.includes("@")) {
    jobs.push({
      who: "admin",
      promise: resend.emails.send({
        from: FROM,
        to: ADMIN_ORDER_EMAIL.trim(),
        subject: `🚨 New Order: #${shortId} — ${esc(name)} (${formatMoney(amount, currency)})`,
        html: buildAdminEmailHtml({
          name,
          email,
          phone,
          amount,
          currency,
          address,
          itemsHtml,
          orderId,
          sessionId: args.sessionId,
          paymentIntentId: args.paymentIntentId,
          livemode: args.livemode,
        }),
      }),
    });
  }

  const results = await Promise.allSettled(jobs.map((j) => j.promise));
  results.forEach((r, i) => {
    const who = jobs[i].who;
    if (r.status === "rejected") {
      console.error(`Order confirmation email failed (${who}):`, r.reason);
    } else if (r.value?.error) {
      console.error(`Order confirmation email failed (${who}):`, r.value.error);
    } else {
      console.log(`Order confirmation email successfully sent (${who}) for order #${shortId}`);
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
  const rawItems: any[] = data.items ?? [];
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  // Logged-in customers: fall back to their profile for name/email
  let profile: any = null;
  if (data.uid) {
    try {
      profile = (await adminDb.collection("users").doc(data.uid).get()).data() ?? null;
    } catch {
      profile = null;
    }
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

  const phone: string =
    data.phone ||
    data.customer?.phone ||
    session.customer_details?.phone ||
    data.address?.phone_number ||
    profile?.phone ||
    "";

  // Resolve product images for all items
  const items = await resolveItemsWithImages(rawItems);

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
    try {
      const cartCollection = adminDb.collection("users").doc(data.uid).collection("add-to-cart");
      const batch = adminDb.batch();
      items.forEach((item: { cartItemId?: string }) => {
        if (item.cartItemId) batch.delete(cartCollection.doc(item.cartItemId));
      });
      await batch.commit();
    } catch (cleanupErr) {
      console.error("Cart cleanup failed:", cleanupErr);
    }
  }

  await pendingRef.set(
    { status: "confirmed", order_id: orderDoc.id, updatedAt: FieldValue.serverTimestamp() },
    { merge: true }
  );

  // Send emails to both buyer and admin
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
