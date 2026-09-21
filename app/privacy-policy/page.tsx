import Footer from "@/components/Footer";
import Header from "@/components/Header";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Privacy Policy — Elims Clothing's",
  description:
    "How Elims clothing's collects, uses, shares, stores, and protects personal information under U.S. federal and state privacy laws.",
};

const EFFECTIVE_DATE = "21 September 2026";
const PRIVACY_EMAIL = "privacy@elimsclothing.store";
const SUPPORT_EMAIL = "hello@elimsclothing.store";
const BUSINESS_ADDRESS = "";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <Header />
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-10 lg:px-16">
        <header className="mb-12 border-b border-neutral-200 pb-8">
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-neutral-400">
            LEGAL &amp; TRANSPARENCY
          </p>
          <h1 className="font-serif text-5xl italic tracking-tight text-neutral-900 sm:text-6xl">
            Privacy Policy
          </h1>
          <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-neutral-600">
            This policy explains, in plain language, what personal information
            elimsclothing collects, why we use it, which service providers
            receive it, how long we keep it, and how you can exercise your
            privacy rights.
          </p>
          <p className="mt-5 text-xs font-medium tracking-[0.15em] text-neutral-400">
            EFFECTIVE: {EFFECTIVE_DATE} · VERSION 4.0
          </p>
        </header>

        <div className="space-y-12 text-[15px] leading-relaxed text-neutral-700">
          <Section title="1. Who controls your data">
            <p>
              elimsclothing, operated by
              <strong> Elims Clothing's LLC</strong>, is the
              business responsible for personal information collected through
              the elimsclothing website, online store, customer-support
              channels, and related services. Our commercial address is
              <strong> {BUSINESS_ADDRESS}</strong>.
            </p>
            <p className="mt-4">
              Privacy requests should be sent to our privacy contact at{" "}
              <strong>{PRIVACY_EMAIL}</strong>. Customer service requests may
              be sent to <strong>{SUPPORT_EMAIL}</strong>.
            </p>
            <p className="mt-4">
              This policy is designed to provide the transparency required by
              United States federal and state privacy laws that apply to our
              business, including Section 5 of the Federal Trade Commission
              Act, the California Online Privacy Protection Act (CalOPPA), the
              California Consumer Privacy Act as amended by the California
              Privacy Rights Act (CCPA), comparable comprehensive state privacy
              laws (such as those of Virginia, Colorado, Connecticut, Utah,
              Texas, and Oregon), the Children&apos;s Online Privacy Protection
              Act (COPPA), and the CAN-SPAM Act. General information about
              consumer privacy is available from the{" "}
              <a
                href="https://www.ftc.gov/"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Federal Trade Commission
              </a>{" "}
              and, for California residents, the{" "}
              <a
                href="https://oag.ca.gov/privacy/ccpa"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                California Attorney General
              </a>
              . Where a newer law or binding regulation applies, that law or
              regulation prevails.
            </p>
          </Section>

          <Section title="2. Personal data we collect">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-300">
                    <th className="px-3 py-3 font-semibold text-neutral-900">
                      Category
                    </th>
                    <th className="px-3 py-3 font-semibold text-neutral-900">
                      Examples
                    </th>
                    <th className="px-3 py-3 font-semibold text-neutral-900">
                      How collected
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-neutral-200">
                    <td className="px-3 py-3 font-medium">
                      Identity and contact
                    </td>
                    <td className="px-3 py-3">
                      Name, email, telephone number, account details
                    </td>
                    <td className="px-3 py-3">
                      Account, checkout, customer support, newsletter
                    </td>
                  </tr>
                  <tr className="border-b border-neutral-200">
                    <td className="px-3 py-3 font-medium">
                      Order and delivery
                    </td>
                    <td className="px-3 py-3">
                      Products, sizes, measurements, delivery address, order
                      history
                    </td>
                    <td className="px-3 py-3">
                      Cart, checkout, order fulfilment, returns
                    </td>
                  </tr>
                  <tr className="border-b border-neutral-200">
                    <td className="px-3 py-3 font-medium">
                      Payment and transaction
                    </td>
                    <td className="px-3 py-3">
                      Amount, currency, transaction reference, payment status
                    </td>
                    <td className="px-3 py-3">
                      Stripe and other payment providers
                    </td>
                  </tr>
                  <tr className="border-b border-neutral-200">
                    <td className="px-3 py-3 font-medium">Device and usage</td>
                    <td className="px-3 py-3">
                      IP address, browser, device type, pages viewed, time zone,
                      logs
                    </td>
                    <td className="px-3 py-3">
                      Cookies, local storage, security logs, analytics
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 font-medium">Communications</td>
                    <td className="px-3 py-3">
                      Messages, reviews, support records, return photographs
                    </td>
                    <td className="px-3 py-3">
                      Email, forms, chat, customer-support channels
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-5">
              We do not ask for your full card number, CVV, PIN, or
              online-banking password. Payment credentials are entered directly
              into the payment provider&apos;s secure environment and are
              handled under that provider&apos;s privacy and security terms.
            </p>
            <p className="mt-4">
              For California residents, these categories correspond to the
              CCPA categories of identifiers, customer records, commercial
              information, internet or other electronic network activity, and
              inferences drawn from that information. We do not knowingly
              collect sensitive personal information as defined by the CCPA
              (such as government identifiers, precise geolocation, or account
              log-in credentials combined with a password) beyond what is
              needed to provide the services you request.
            </p>
          </Section>

          <Section title="3. Why we use personal data and our business purposes">
            <p>
              We use only the information reasonably necessary and proportionate
              for the purpose described. Depending on the activity, we use
              personal information to perform a contract with you, to take steps
              you request before a contract, to comply with legal obligations,
              for our legitimate business purposes in operating and securing the
              store, or with your consent where the law requires it.
            </p>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-300">
                    <th className="px-3 py-3 font-semibold text-neutral-900">
                      Purpose
                    </th>
                    <th className="px-3 py-3 font-semibold text-neutral-900">
                      Legal or business basis
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-neutral-200">
                    <td className="px-3 py-3">Create and manage an account</td>
                    <td className="px-3 py-3">
                      Contract or requested pre-contract steps
                    </td>
                  </tr>
                  <tr className="border-b border-neutral-200">
                    <td className="px-3 py-3">
                      Process orders, payments, delivery, returns, and refunds
                    </td>
                    <td className="px-3 py-3">
                      Contract; legal obligations; fraud prevention
                    </td>
                  </tr>
                  <tr className="border-b border-neutral-200">
                    <td className="px-3 py-3">
                      Respond to questions and support requests
                    </td>
                    <td className="px-3 py-3">
                      Contract or legitimate business purpose
                    </td>
                  </tr>
                  <tr className="border-b border-neutral-200">
                    <td className="px-3 py-3">
                      Secure the website, prevent fraud, and maintain records
                    </td>
                    <td className="px-3 py-3">
                      Legitimate business purpose; legal obligation
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3">
                      Send optional marketing communications
                    </td>
                    <td className="px-3 py-3">
                      Your consent where required (for example, marketing text
                      messages); you may opt out free of charge at any time
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="4. Consent and marketing choices">
            <p>
              Where we rely on consent, it must be freely given, specific,
              informed, and unambiguous. A checkout purchase is not conditional
              on agreeing to optional marketing. Marketing emails are sent in
              accordance with the CAN-SPAM Act and include a working
              unsubscribe link and our postal address; we process opt-out
              requests within ten business days. We send marketing text
              messages only with your prior express written consent as required
              by the Telephone Consumer Protection Act, and you may stop them at
              any time by replying STOP. You may also withdraw marketing consent
              by contacting <strong>{PRIVACY_EMAIL}</strong>. Withdrawal does
              not affect processing already carried out lawfully before
              withdrawal. Transactional messages about your order or account
              may still be sent.
            </p>
            <p className="mt-4">
              We do not sell your personal information, and we do not share it
              for cross-context behavioral advertising. We will not use your
              data for unrelated purposes without additional notice or, where
              required, your consent. If our practices change, we will update
              this policy and provide a &ldquo;Do Not Sell or Share My Personal
              Information&rdquo; link and any other opt-out mechanisms the law
              requires.
            </p>
          </Section>

          <Section title="5. Cookies, local storage, and similar technology">
            <p>
              We use essential cookies and browser local storage to keep you
              signed in, protect sessions, remember preferences, maintain a
              guest shopping cart, prevent fraud, and operate checkout. For
              example, the guest cart may be stored on your device until you
              remove it, complete checkout, or sign in and synchronize it to
              your account.
            </p>
            <p className="mt-4">
              If we use non-essential analytics or advertising cookies, we will
              provide the required notice and an opt-out mechanism (and consent
              where the law requires it) before activating them. We treat
              recognized opt-out preference signals, such as the Global Privacy
              Control, as valid requests to opt out of the sale or sharing of
              personal information where the law requires. Because there is no
              uniform industry standard, our site does not currently change its
              practices in response to &ldquo;Do Not Track&rdquo; browser
              signals. You can control cookies through your browser, but
              disabling essential storage may prevent cart or checkout functions
              from working.
            </p>
          </Section>

          <Section title="6. Who receives personal data">
            <p>
              We disclose personal information only where necessary for the
              purposes in this policy, to service providers and contractors
              bound by a written contract that limits their use of the
              information, and subject to confidentiality and security
              obligations.
            </p>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-300">
                    <th className="px-3 py-3 font-semibold text-neutral-900">
                      Provider or recipient
                    </th>
                    <th className="px-3 py-3 font-semibold text-neutral-900">
                      Purpose
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-neutral-200">
                    <td className="px-3 py-3">
                      Stripe or the payment provider shown at checkout
                    </td>
                    <td className="px-3 py-3">
                      Payment authorization, settlement, fraud monitoring,
                      refunds, and transaction support
                    </td>
                  </tr>
                  <tr className="border-b border-neutral-200">
                    <td className="px-3 py-3">
                      Firebase / Google Cloud services used by elimsclothing
                    </td>
                    <td className="px-3 py-3">
                      Authentication, database, hosting, storage, security, and
                      application operation
                    </td>
                  </tr>
                  <tr className="border-b border-neutral-200">
                    <td className="px-3 py-3">
                      Courier, logistics, and customs partners
                    </td>
                    <td className="px-3 py-3">
                      Delivery, tracking, customs clearance, and returns
                    </td>
                  </tr>
                  <tr className="border-b border-neutral-200">
                    <td className="px-3 py-3">
                      Professional advisers, law enforcement, and government
                      authorities
                    </td>
                    <td className="px-3 py-3">
                      Legal compliance, responding to lawful requests, dispute
                      resolution, fraud investigation, or protection of rights
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3">
                      Analytics or marketing providers, if enabled
                    </td>
                    <td className="px-3 py-3">
                      Only the measurement or marketing functions disclosed at
                      the time of collection
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-5">
              We do not authorize service providers to use your personal
              information for their own unrelated marketing. If our business is
              sold, merged, or reorganized, personal information may be
              transferred to the successor entity, which must honor this policy
              or give you notice of any material change.
            </p>
          </Section>

          <Section title="7. Where data is processed and transferred">
            <p>
              Personal information is primarily processed and stored in the
              United States. Some providers that support payment, hosting,
              authentication, security, email, analytics, or delivery may
              process personal information in other countries. Where we
              transfer information across borders, we use contractual and
              technical safeguards appropriate to the risk, and we will not
              transfer more data than necessary for the stated purpose.
            </p>
            <p className="mt-4">
              By placing an order that requires an overseas payment, hosting,
              courier, or customs provider, you acknowledge that the data needed
              for that service may be processed in the provider&apos;s country.
              If you access our services from outside the United States, you
              understand that your information will be transferred to and
              processed in the United States. Contact{" "}
              <strong>{PRIVACY_EMAIL}</strong> if you need information about the
              safeguards for a specific transfer.
            </p>
          </Section>

          <Section title="8. Retention">
            <p>
              We keep personal information only for as long as reasonably
              necessary for the purpose collected, including order fulfilment,
              customer support, fraud prevention, accounting, tax, legal claims,
              and regulatory obligations. As a guide, order and payment records
              are retained for the period required by federal and state tax,
              accounting, payment-network, and other legal rules; support and
              return records are retained for as long as needed to resolve the
              matter and defend or establish a claim; and account data is
              deleted or anonymized after account closure unless a lawful
              retention reason remains.
            </p>
            <p className="mt-4">
              When retention is no longer required, we securely delete,
              anonymize, or irreversibly de-identify the data. Backups may
              retain deleted data for a limited disaster-recovery cycle before
              secure overwriting.
            </p>
          </Section>

          <Section title="9. Security and data breaches">
            <p>
              We use reasonable technical and organizational measures
              appropriate to the risk, including access controls,
              authentication, least privilege, provider security controls,
              encrypted connections, monitoring, backups, and staff
              confidentiality obligations. Payment card credentials are handled
              by the payment provider and are not stored by elimsclothing in full.
            </p>
            <p className="mt-4">
              No online system is completely risk-free. If we identify a
              security breach involving personal information, we will
              investigate, contain, document, and remedy it, and notify
              affected individuals, state attorneys general, and other
              regulators as required by applicable state breach-notification
              laws, without unreasonable delay. We will communicate practical
              steps you can take and provide a contact for questions.
            </p>
          </Section>

          <Section title="10. Your privacy rights">
            <p>
              Depending on where you live, and subject to applicable legal
              exceptions and identity verification, you may have the right to
              know and access the personal information we hold about you and
              how it is used and disclosed; correct inaccurate information;
              delete your personal information; obtain a portable copy of your
              data; opt out of the sale or sharing of personal information,
              targeted advertising, and certain profiling; limit the use of
              sensitive personal information; and withdraw consent where we
              rely on it. You may object to direct marketing free of charge. We
              will not discriminate or retaliate against you for exercising any
              of these rights.
            </p>
            <p className="mt-4">
              Send a request to <strong>{PRIVACY_EMAIL}</strong> with the
              subject
              <strong> “Data Rights Request”</strong>, the right you wish to
              exercise, the email or order identifier connected with your
              request, and any details needed to locate the data. We may request
              reasonable information to verify your identity by matching it to
              information we already hold. We will confirm receipt within ten
              business days and respond within <strong>45 days</strong> of
              receiving a verifiable request; where the law allows and it is
              reasonably necessary, we may extend this once by a further 45
              days and will tell you why. If a request is complex, excessive, or
              repetitive, we will explain any lawful limitation or refusal and
              the reason.
            </p>
            <p className="mt-4">
              <strong>Authorized agents.</strong> You may designate an
              authorized agent to submit a request on your behalf. We may
              require written proof of the agent&apos;s authority and may
              verify your identity directly with you.
            </p>
            <p className="mt-4">
              <strong>Appeals.</strong> If we decline to act on your request
              and your state&apos;s law gives you a right to appeal, you may
              reply to our response, or email <strong>{PRIVACY_EMAIL}</strong>{" "}
              with the subject <strong>“Appeal”</strong>, and we will respond in
              writing within the time required by law. If your appeal is denied,
              you may contact your state attorney general.
            </p>
            <p className="mt-4">
              <strong>California residents.</strong> In addition to the rights
              above, under California&apos;s &ldquo;Shine the Light&rdquo; law
              you may request information about personal information disclosed
              to third parties for their direct marketing purposes. We do not
              disclose personal information to third parties for their own
              direct marketing purposes.{" "}
              <strong>Nevada residents</strong> may submit a request to opt out
              of the sale of covered information; we do not sell it.
            </p>
          </Section>

          <Section title="11. Children">
            <p>
              The Services are not directed to children under 18. We do not
              knowingly collect personal information from children under 13, in
              accordance with COPPA, and we do not sell or share the personal
              information of anyone we know to be under 16. If you believe a
              child has provided personal information, contact
              <strong> {PRIVACY_EMAIL}</strong> so we can review and delete it
              where appropriate.
            </p>
          </Section>

          <Section title="12. Complaints and remedies">
            <p>
              If you believe we have handled your personal information
              improperly, contact us first at <strong>{PRIVACY_EMAIL}</strong>.
              We will review the complaint, provide a written response, and take
              corrective action where appropriate. If you are not satisfied, you
              may contact your state attorney general, the California Privacy
              Protection Agency (for California residents), the Federal Trade
              Commission, or another competent regulatory or judicial authority
              in accordance with applicable law.
            </p>
          </Section>

          <Section title="13. Changes to this policy">
            <p>
              We may update this policy when our services, providers,
              technology, or legal obligations change. We will publish the new
              effective date at the top of the policy. For material changes, we
              will provide a prominent notice or direct communication where
              required, and we will not use previously collected personal
              information for materially different purposes without any notice
              or consent the law requires.
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
      <h2 className="mb-4 font-serif text-3xl italic text-neutral-900">
        {title}
      </h2>
      {children}
    </section>
  );
}