import { NextRequest, NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { Resend } from "resend";
import { getAdminDb } from "@/lib/firebase-admin";

// ─── Brand config ────────────────────────────────────────────────────────────
const BRAND = "Elims Clothing's";
// Public site origin the review link is built against
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://elimsclothings.store";
// The sending domain must be verified in Resend
const FROM = `${BRAND} Orders <noreply@kgluxee.store>`;
// TODO: replace with the Elims Clothing's logo
const LOGO_URL =
  "https://firebasestorage.googleapis.com/v0/b/elims-clothing.firebasestorage.app/o/image.png?alt=media&token=c9bfafea-c3a7-4eb9-ae02-1d530c697302";

// Query param the product page looks for to open the review form
const REVIEW_QUERY_PARAM =
  "GhravexulnqzopmTyrakvulbexonqjzFarnivexoqplumZykrexiphazulvorqenathryxomqevulzankriphexodramulqazvynothrexipulmarkevonqzathryxulvexomqipanidrulzeforvynaqixomthrazulpeknivexorqazulmyrathopvexinulqazomryxevandulphorqaziknexulvyratomqevinaxulphorqazymexidravulnqorixepanqzomulvethryxakopvexinulmux";

// Only accept client-supplied image URLs from your own storage. Anything else is ignored
// and the image is looked up from the products collection instead.
const ALLOWED_IMAGE_HOSTS = ["firebasestorage.googleapis.com", "storage.googleapis.com"];

const isAllowedImageUrl = (url: unknown): url is string => {
  if (typeof url !== "string") return false;
  try {
    const u = new URL(url);
    return u.protocol === "https:" && ALLOWED_IMAGE_HOSTS.includes(u.hostname);
  } catch {
    return false;
  }
};

// ─── Email helpers ───────────────────────────────────────────────────────────
const esc = (v: unknown) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Order items don't consistently carry the same image field name
const getItemImage = (it: any): string | null =>
  it?.product?.imageUrls?.[0] ?? it?.image ?? it?.imageUrl ?? it?.photoURL ?? null;

const itemName = (it: any): string | null =>
  typeof it?.product === "string" ? it.product : it?.product?.name ?? it?.name ?? null;

const buildItemsHtml = (
  items: any[],
  highlight: { productId: string; imageUrl: string | null }
) =>
  items
    .map((it: any) => {
      // The item being reviewed falls back to the resolved product image
      const imageUrl =
        getItemImage(it) ?? (it.product_id === highlight.productId ? highlight.imageUrl : null);
      const label = `${itemName(it) ?? "Item"}${it.color ? ` (${it.color})` : ""}${
        it.size ? ` - ${it.size}` : ""
      }`;
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
                <td style="vertical-align:middle;">${esc(label)}</td>
              </tr>
            </table>
          </td>
          <td style="padding:8px 0;text-align:center;">${esc(it.quantity)}</td>
        </tr>`;
    })
    .join("");

const buildReviewRequestEmailHtml = ({
  name,
  itemsHtml,
  reviewUrl,
  productName,
  productImageUrl,
}: {
  name: string;
  itemsHtml: string;
  reviewUrl: string;
  productName: string | null;
  productImageUrl: string | null;
}) => `
  <div style="font-family: sans-serif; max-width: 560px; margin: auto;">
    <div style="text-align:center; margin-bottom:24px;">
      <img src="${LOGO_URL}" alt="${esc(BRAND)}" style="height:400px; width:400px" />
    </div>
    <h2 style="color:#A07840;">How was your order, ${esc(name)}?</h2>
    <p style="color:#333; line-height:1.6;">
      We hope you're loving what you ordered. It would mean a lot if you could
      take a minute to share a quick review — it helps other customers and
      helps our small team keep improving.
    </p>
    ${
      productImageUrl
        ? `<div style="text-align:center; margin:24px 0 8px;">
             <img src="${esc(productImageUrl)}" alt="${esc(productName ?? "Your item")}" width="200"
                  style="width:200px;max-width:100%;height:auto;border-radius:12px;" />
           </div>`
        : ""
    }
    ${
      productName
        ? `<p style="text-align:center; font-weight:600; margin:0 0 8px;">${esc(productName)}</p>`
        : ""
    }
    <table style="width:100%; border-collapse:collapse; margin-top:16px;">
      <thead>
        <tr style="border-bottom:1px solid #eee; text-align:left;">
          <th style="padding:8px 0;">Item</th>
          <th style="padding:8px 0;text-align:center;">Qty</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <div style="text-align:center; margin-top:32px;">
      <a href="${esc(reviewUrl)}"
         style="display:inline-block; background:#1A1A1A; color:#ffffff; text-decoration:none;
                padding:14px 32px; border-radius:8px; font-weight:600; font-size:14px;
                letter-spacing:0.03em; text-transform:uppercase;">
        Leave a review
      </a>
    </div>
    <div style="margin-top:28px; padding-top:20px; border-top:1px solid #eee; font-size:13px; color:#555; line-height:1.6;">
      <p style="margin:0; font-style:italic;">— The ${esc(BRAND)} team</p>
    </div>
  </div>
`;

// ─── Route ───────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { orderId, productId, imageUrl: clientImageUrl } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId." }, { status: 400 });
    }
    if (!productId) {
      return NextResponse.json({ error: "Missing productId." }, { status: 400 });
    }

    const adminDb = getAdminDb();

    // 1. Fetch the order
    const orderRef = adminDb.collection("orders").doc(orderId);
    const orderSnap = await orderRef.get();
    if (!orderSnap.exists) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
    const orderData = orderSnap.data()!;

    // 2. Buyer email/name. Stripe orders store the email on the order itself; guest orders have
    //    no user_id, so only look up the profile when there is one.
    const userSnap = orderData.user_id
      ? await adminDb.collection("users").doc(orderData.user_id).get()
      : null;
    const userData = userSnap?.data();
    const email: string | undefined = orderData.email ?? userData?.email;
    const name =
      userData?.displayName ||
      `${userData?.firstName ?? ""} ${userData?.lastName ?? ""}`.trim() ||
      orderData.username ||
      "there";

    if (!email) {
      return NextResponse.json(
        { error: "This buyer has no email on file." },
        { status: 400 }
      );
    }

    // 3. Resolve the product being reviewed: name + image.
    //    Priority for the image: URL passed by the admin page (validated) → products
    //    collection → whatever the order item snapshot stored.
    const items: any[] = orderData.items ?? [];
    const purchased = items.find((it) => it.product_id === productId);
    let productName: string | null = itemName(purchased);
    let productImageUrl: string | null = isAllowedImageUrl(clientImageUrl) ? clientImageUrl : null;

    if (!productImageUrl || !productName) {
      try {
        const productSnap = await adminDb.collection("products").doc(productId).get();
        const p = productSnap.data();
        if (!productImageUrl) {
          productImageUrl = p?.imageUrls?.[0] ?? p?.imageUrl ?? p?.image ?? p?.photoURL ?? null;
        }
        if (!productName) productName = p?.name ?? null;
      } catch (err) {
        console.error(`Couldn't load product ${productId} for review email:`, err);
      }
    }
    if (!productImageUrl) productImageUrl = getItemImage(purchased);

    // 4. Build the review link and email
    const reviewUrl = `${SITE_URL}/${productId}?${REVIEW_QUERY_PARAM}=true`;
    const itemsHtml = buildItemsHtml(items, { productId, imageUrl: productImageUrl });

    const { error: sendError } = await new Resend(process.env.RESEND_KEY).emails.send({
      from: FROM,
      to: email,
      subject: `How was your ${BRAND} order? Leave a review ✨`,
      html: buildReviewRequestEmailHtml({
        name,
        itemsHtml,
        reviewUrl,
        productName,
        productImageUrl,
      }),
    });

    if (sendError) {
      console.error("Review request email failed:", sendError);
      return NextResponse.json(
        { error: "Failed to send the review request email." },
        { status: 502 }
      );
    }

    // 5. Record that a review was requested (safe to call again for a resend)
    await orderRef.update({
      reviewRequestedAt: FieldValue.serverTimestamp(),
      reviewRequestCount: FieldValue.increment(1),
    });

    return NextResponse.json({ success: true, reviewUrl });
  } catch (err) {
    console.error("Request review failed:", err);
    return NextResponse.json(
      { error: "Something went wrong sending the review request." },
      { status: 500 }
    );
  }
}