import type { ReactNode } from "react";

/** Font utilities — the CSS variables are set on the page wrapper in app/about/page.tsx */
export const SERIF = "font-[family-name:var(--font-about-serif)]";
export const SANS = "font-[family-name:var(--font-about-sans)]";

/** Shared page gutter + max width */
export const CONTAINER = "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12";

/** Tiny uppercase label used across the page */
export const EYEBROW =
  "text-[10px] font-medium uppercase leading-relaxed tracking-[0.2em] text-[#5B655E]";

export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`${EYEBROW} ${className}`}>{children}</p>;
}

export function GoldRule({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block h-px w-12 bg-[#B89B5E] ${className}`}
    />
  );
}

export function Dot({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-[3px] w-[3px] rounded-full bg-current ${className}`}
    />
  );
}
