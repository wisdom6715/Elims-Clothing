"use client";

import { useState, type FormEvent } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: connect to your newsletter endpoint
    setSent(true);
    setEmail("");
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex max-w-[380px]" noValidate>
      <label htmlFor="about-newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="about-newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setSent(false);
        }}
        placeholder="Enter your correspondence email"
        className="min-w-0 flex-1 border-b border-[#CFCBBB] bg-transparent py-3 text-[11px] text-[#1F2A24] outline-none placeholder:text-[#8A928B] focus:border-[#144A3B]"
      />
      <button
        type="submit"
        className="bg-[#144A3B] px-7 py-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#0F3A2E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#144A3B]"
      >
        {sent ? "Subscribed" : "Subscribe"}
      </button>
    </form>
  );
}
