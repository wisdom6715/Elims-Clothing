import Footer from "@/components/Footer";
import Header from "@/components/Header";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Return & Exchange Policy — Elims Clothing's",
  description:
    "Return window, store credit terms, item condition requirements, final sale exclusions, and return shipping information for Elims Clothing's.",
};

const EFFECTIVE_DATE = "21 August 2026";
const SUPPORT_EMAIL = "hello@elimselothings.store";

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF7] text-neutral-900">
      <Header />
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-10 lg:px-16">
        <header className="mb-12 border-b border-neutral-200 pb-8">
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-neutral-400">
            CUSTOMER PROTECTION
          </p>
          <h1 className="font-serif text-5xl text-neutral-900 sm:text-6xl">
            Return & Exchange Policy
          </h1>
          <p className="mt-5 text-xs font-medium tracking-[0.1em] text-neutral-500">
            EFFECTIVE: {EFFECTIVE_DATE}
          </p>
        </header>

        <div className="mb-10 border border-neutral-200 bg-white p-6">
          <h2 className="mb-4 font-serif text-2xl text-neutral-900">
            The short version
          </h2>
          <ol className="list-decimal space-y-3 pl-5 text-[15px] leading-relaxed text-neutral-700">
            <li>
              All return requests must be initiated within{" "}
              <strong>14 days of the delivery date</strong> shown on your
              tracking number.
            </li>
            <li>
              We do not issue cash or credit card refunds. Approved returns
              receive a digital <strong>Elims Clothing's Store Credit</strong>{" "}
              via email, which never expires.
            </li>
            <li>
              Items must be unworn, unwashed, and returned with all original
              tags attached and free of stains, odors, or signs of use.
            </li>
            <li>
              Clearance, markdown, flash sale items, bodysuits, swimwear,
              undergarments, and accessories are final sale and cannot be
              returned or exchanged.
            </li>
            <li>
              You are responsible for your own return shipping costs and
              arrangements. We do not provide prepaid return labels.
            </li>
          </ol>
        </div>

        <div className="space-y-12 text-[15px] leading-relaxed text-neutral-700">
          <Section title="1. Return window">
            <p>
              All return requests must be initiated within{" "}
              <strong>14 days of the delivery date</strong> shown on your
              tracking number. Requests submitted after this period are
              outside this policy and may be refused.
            </p>
          </Section>

          <Section title="2. Store credit & exchanges">
            <p>
              We do not issue cash or credit card refunds. Approved returns
              will be issued a digital{" "}
              <strong>Elims Clothing's Store Credit</strong> sent to you by
              email.
            </p>
            <p className="mt-4">
              Store credit does not expire and can be used on any future
              purchase. If you need a different size or colour, please return
              your item for store credit and place a new order — we do not
              process direct exchanges.
            </p>
          </Section>

          <Section title="3. Condition of items">
            <p>
              To qualify for store credit, clothing must meet the following
              strict criteria:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-5">
              <li>
                <strong>Unworn &amp; unwashed:</strong> Items must be in
                their original, unaltered condition.
              </li>
              <li>
                <strong>Tags attached:</strong> All original brand and price
                tags must still be securely attached.
              </li>
              <li>
                <strong>Flawless:</strong> Items must be free of makeup,
                deodorant stains, perfume, pet hair, or smoke odours.
              </li>
            </ul>
            <p className="mt-4">
              We inspect every returned item. Items that do not meet these
              conditions will not qualify for store credit and may be sent
              back to you.
            </p>
          </Section>

          <Section title="4. Final sale items">
            <p>
              For hygienic and clearance reasons, the following items cannot
              be returned or exchanged:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-5">
              <li>Clearance, markdown, or flash sale items.</li>
              <li>
                Bodysuits, swimwear, undergarments, and accessories.
              </li>
            </ul>
          </Section>

          <Section title="5. How to start a return & shipping costs">
            <p>
              To start a return, please email{" "}
              <strong>{SUPPORT_EMAIL}</strong> with your order number.
            </p>
            <p className="mt-4">
              <strong>Mail-in returns:</strong> Customers are responsible for
              their own return shipping arrangements and costs. Elims
              Clothing's does not provide prepaid return labels.
            </p>
            <p className="mt-4">
              We highly recommend using a trackable shipping service (like
              USPS, UPS, or FedEx). Elims Clothing's is not responsible for
              packages that are lost or damaged in transit back to us.
            </p>
          </Section>

          <Section title="6. Agreement">
            <p>
              By submitting a return, you agree to this Return Policy. You
              understand that Elims Clothing's does not offer cash or credit
              card refunds, that all qualified returns receive store credit
              only within 14 days of delivery, and that you are responsible
              for covering your own return shipping costs.
            </p>
          </Section>
        </div>
      </div>
      <Footer />
    </main>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-neutral-200 pt-8">
      <h2 className="mb-4 font-serif text-3xl text-neutral-900">{title}</h2>
      {children}
    </section>
  );
}