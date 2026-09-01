# Stripe Checkout Setup

The storefront retains the existing Kgluxee Next.js and Firebase structure. Stripe is used only on the server to create hosted Checkout Sessions and verify the final payment event. A browser-side Stripe publishable key is therefore not required for this hosted Checkout implementation.

| Variable | Required purpose | Where it is used |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | Creates and retrieves Stripe Checkout Sessions. | `lib/stripe.ts` and the server-side Stripe API routes. |
| `STRIPE_WEBHOOK_SECRET` | Verifies that received webhook payloads were signed by Stripe. | `app/api/stripe/webhook/route.ts`. |
| `FIREBASE_PROJECT_ID` | Existing Firebase Admin project identity. | Existing secure order and cart routes. |
| `FIREBASE_CLIENT_EMAIL` | Existing Firebase Admin service-account email. | Existing secure order and cart routes. |
| `FIREBASE_PRIVATE_KEY` | Existing Firebase Admin service-account key. | Existing secure order and cart routes. |

Add the Stripe values to the project `.env` file. The secret key must never be placed in a `NEXT_PUBLIC_*` variable or otherwise exposed to the browser.

## Stripe Dashboard configuration

After deploying the storefront, create one Stripe webhook endpoint using the public URL below and subscribe it to the indicated event types.

| Stripe setting | Value |
| --- | --- |
| Endpoint URL | `https://your-domain.example/api/stripe/webhook` |
| Required events | `checkout.session.completed`, `checkout.session.async_payment_succeeded` |
| Signing secret destination | `STRIPE_WEBHOOK_SECRET` in the server environment |

The webhook validates Stripe’s signature from the raw request body before confirming an order and clearing Firebase cart entries. The checkout success page also retrieves the hosted Checkout Session and uses the same idempotent fulfillment routine, so a completed payment can be confirmed even if a customer returns before webhook delivery. Stripe recommends server-created Checkout Sessions and webhook-based fulfillment for hosted Checkout payments.[1] [2]

## Customer flow

The current checkout page validates the existing guest or authenticated customer details, delivery address, phone number, and policy acknowledgment. It then calls the server-side Checkout Session endpoint and redirects the customer to Stripe. Upon successful payment, Stripe returns to `/cart/checkout/success?session_id=…`; the order is verified, written to the existing `orders` collection, and the relevant authenticated cart entries are removed.

## References

[1]: https://docs.stripe.com/api/checkout/sessions "Stripe Checkout Sessions API"
[2]: https://docs.stripe.com/webhooks "Stripe webhook verification and fulfillment guidance"
