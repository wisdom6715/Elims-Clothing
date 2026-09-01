"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CART_STORAGE_KEY } from "@/hook/useAddToCart";

export default function StripeCheckoutSuccessPage() {
  const router = useRouter();
  const params = useSearchParams();
  const sessionId = params?.get("session_id") ?? null;
  const [status, setStatus] = useState<"loading" | "confirmed" | "pending" | "error">("loading");
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) { setStatus("error"); return; }
    let cancelled = false;
    const verify = async () => {
      try {
        const response = await fetch(`/api/stripe/checkout-status?session_id=${encodeURIComponent(sessionId)}`);
        const data = await response.json();
        if (cancelled) return;
        if (!response.ok) { setStatus("error"); return; }
        if (data.confirmed) {
          window.localStorage.removeItem(CART_STORAGE_KEY);
          setOrderId(data.orderId ?? null);
          setStatus("confirmed");
        } else {
          setStatus("pending");
        }
      } catch { if (!cancelled) setStatus("error"); }
    };
    verify();
    return () => { cancelled = true; };
  }, [sessionId]);

  const content = status === "confirmed" ? { title: "Order confirmed!", body: "Your payment has been verified and your order is now being prepared." } : status === "pending" ? { title: "Payment received.", body: "We are confirming your payment. This page will update once the order is ready." } : status === "error" ? { title: "We could not verify that payment yet.", body: "Please contact support with your Stripe confirmation if this message persists." } : { title: "Confirming your order…", body: "We are securely verifying your Stripe payment." };
  return <div className="min-h-screen bg-[#faf9f4]"><Header /><main className="store-shell flex min-h-[65vh] items-center justify-center py-16"><section className="max-w-lg rounded-[1.5rem] border border-[#d8e1d8] bg-white p-8 text-center sm:p-12">{status === "loading" ? <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#0f473a]" /> : <CheckCircle2 className="mx-auto h-12 w-12 text-[#0f473a]" />}<p className="eyebrow mt-6">Secure Stripe Checkout</p><h1 className="font-display mt-3 text-4xl leading-none text-[#0f473a]">{content.title}</h1><p className="mt-4 text-sm leading-6 text-[#5e7167]">{content.body}</p>{orderId && <p className="mt-5 text-xs text-[#718077]">Order reference: <span className="font-mono text-[#0f473a]">{orderId}</span></p>}<button onClick={() => router.push("/")} className="mt-8 rounded-full bg-[#0f473a] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.13em] text-white hover:bg-[#1e6151]">Continue shopping</button></section></main><Footer /></div>;
}
