"use client";

import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────

type Unit = "in" | "cm";
type Category = "fitted" | "free" | "girls" | "boys";

interface Measured {
  in: string;
  cm: string;
}

interface Column {
  key: string;
  label: string;
  plain?: boolean; // true = display the raw string value, no unit switching
}

// ─── Data (transcribed from the Elims Clothings size charts) ───────────────────────

const FITTED_COLUMNS: Column[] = [
  { key: "size", label: "Size", plain: true },
  { key: "uk", label: "UK", plain: true },
  { key: "us", label: "US", plain: true },
  { key: "eu", label: "EU", plain: true },
  { key: "bust", label: "Bust" },
  { key: "waist", label: "Waist" },
  { key: "hip", label: "Hip" },
  { key: "length", label: "Dress Length" },
];

const FITTED_ROWS: Record<string, string | Measured>[] = [
  { size: "S", uk: "8–10", us: "4–6", eu: "36–38", bust: { in: "34–36", cm: "86–91" }, waist: { in: "28–30", cm: "71–76" }, hip: { in: "38–40", cm: "97–102" }, length: { in: "56–58", cm: "142–147" } },
  { size: "M", uk: "12–14", us: "8–10", eu: "40–42", bust: { in: "38–40", cm: "97–102" }, waist: { in: "32–34", cm: "81–86" }, hip: { in: "42–44", cm: "107–112" }, length: { in: "58–60", cm: "147–152" } },
  { size: "L", uk: "16–18", us: "12–14", eu: "44–46", bust: { in: "42–44", cm: "107–112" }, waist: { in: "36–38", cm: "91–97" }, hip: { in: "46–48", cm: "117–122" }, length: { in: "60–62", cm: "152–157" } },
  { size: "XL", uk: "20", us: "16", eu: "48", bust: { in: "46–48", cm: "117–122" }, waist: { in: "40–42", cm: "102–107" }, hip: { in: "50–52", cm: "127–132" }, length: { in: "62–64", cm: "157–163" } },
  { size: "XXL", uk: "22–24", us: "18–20", eu: "50–52", bust: { in: "50–52", cm: "127–132" }, waist: { in: "44–46", cm: "112–117" }, hip: { in: "54–56", cm: "137–142" }, length: { in: "62–64", cm: "157–163" } },
];

const LENGTH_OPTIONS: { label: string; in: string; cm: string }[] = [
  { label: "Petite", in: "54–56", cm: "137–142" },
  { label: "Regular", in: "58–60", cm: "147–152" },
  { label: "Tall", in: "62–64", cm: "157–163" },
];

const FREE_COLUMNS: Column[] = [
  { key: "size", label: "Size", plain: true },
  { key: "uk", label: "UK", plain: true },
  { key: "bust", label: "Bust (fits up to)" },
  { key: "waist", label: "Waist (fits up to)" },
  { key: "hip", label: "Hip (fits up to)" },
];

const FREE_ROWS: Record<string, string | Measured>[] = [
  { size: "S", uk: "8–10", bust: { in: "42", cm: "107" }, waist: { in: "36", cm: "91" }, hip: { in: "44", cm: "112" } },
  { size: "M", uk: "12–14", bust: { in: "46", cm: "117" }, waist: { in: "40", cm: "102" }, hip: { in: "48", cm: "122" } },
  { size: "L", uk: "16–18", bust: { in: "50", cm: "127" }, waist: { in: "44", cm: "112" }, hip: { in: "52", cm: "132" } },
  { size: "XL", uk: "20", bust: { in: "54", cm: "137" }, waist: { in: "48", cm: "122" }, hip: { in: "56", cm: "142" } },
  { size: "XXL", uk: "22–24", bust: { in: "60", cm: "152" }, waist: { in: "54", cm: "137" }, hip: { in: "60", cm: "152" } },
];

const GIRLS_COLUMNS: Column[] = [
  { key: "size", label: "Size", plain: true },
  { key: "us", label: "US Size", plain: true },
  { key: "age", label: "Age", plain: true },
  { key: "height", label: "Height" },
  { key: "chest", label: "Chest" },
  { key: "waist", label: "Waist" },
  { key: "hip", label: "Hip" },
  { key: "shoulder", label: "Shoulder" },
  { key: "sleeve", label: "Sleeve" },
  { key: "length", label: "Dress Length" },
];

const GIRLS_ROWS: Record<string, string | Measured>[] = [
  { size: "XXS", us: "2T", age: "2 yrs", height: { in: "33–35", cm: "84–89" }, chest: { in: "20–21", cm: "51–53" }, waist: { in: "19.5–20", cm: "50–51" }, hip: { in: "20–21", cm: "51–53" }, shoulder: { in: "8.5–9", cm: "22–23" }, sleeve: { in: "11–12", cm: "28–30" }, length: { in: "18–19", cm: "46–48" } },
  { size: "XS", us: "3T", age: "3 yrs", height: { in: "36–38", cm: "91–97" }, chest: { in: "21–22", cm: "53–56" }, waist: { in: "20–20.5", cm: "51–52" }, hip: { in: "21–22", cm: "53–56" }, shoulder: { in: "9–9.5", cm: "23–24" }, sleeve: { in: "12–13", cm: "30–33" }, length: { in: "20–21", cm: "51–53" } },
  { size: "XS", us: "4T", age: "4 yrs", height: { in: "39–41", cm: "99–104" }, chest: { in: "22–23", cm: "56–58" }, waist: { in: "20.5–21", cm: "52–53" }, hip: { in: "22–23", cm: "56–58" }, shoulder: { in: "9.5–10", cm: "24–25" }, sleeve: { in: "13–14", cm: "33–36" }, length: { in: "22–23", cm: "56–58" } },
  { size: "S", us: "5", age: "5 yrs", height: { in: "42–44", cm: "107–112" }, chest: { in: "23–24", cm: "58–61" }, waist: { in: "21–21.5", cm: "53–55" }, hip: { in: "23–24", cm: "58–61" }, shoulder: { in: "10–10.5", cm: "25–27" }, sleeve: { in: "14–15", cm: "36–38" }, length: { in: "24–25", cm: "61–64" } },
  { size: "S", us: "6", age: "6 yrs", height: { in: "45–47", cm: "114–119" }, chest: { in: "24–25", cm: "61–64" }, waist: { in: "21.5–22", cm: "55–56" }, hip: { in: "24–25", cm: "61–64" }, shoulder: { in: "10.5–11", cm: "27–28" }, sleeve: { in: "15–16", cm: "38–41" }, length: { in: "26–27", cm: "66–69" } },
  { size: "M", us: "7", age: "7 yrs", height: { in: "48–50", cm: "122–127" }, chest: { in: "25–26", cm: "64–66" }, waist: { in: "22–23", cm: "56–58" }, hip: { in: "25–26.5", cm: "64–67" }, shoulder: { in: "11–11.5", cm: "28–29" }, sleeve: { in: "16–17", cm: "41–43" }, length: { in: "28–29", cm: "71–74" } },
  { size: "M", us: "8", age: "8 yrs", height: { in: "51–53", cm: "130–135" }, chest: { in: "26–27.5", cm: "66–70" }, waist: { in: "23–24", cm: "58–61" }, hip: { in: "26.5–28", cm: "67–71" }, shoulder: { in: "11.5–12", cm: "29–30" }, sleeve: { in: "17–18", cm: "43–46" }, length: { in: "30–31", cm: "76–79" } },
  { size: "L", us: "10", age: "9–10 yrs", height: { in: "54–56", cm: "137–142" }, chest: { in: "27.5–29", cm: "70–74" }, waist: { in: "24–25", cm: "61–64" }, hip: { in: "28–30", cm: "71–76" }, shoulder: { in: "12–12.5", cm: "30–32" }, sleeve: { in: "18–19", cm: "46–48" }, length: { in: "32–34", cm: "81–86" } },
  { size: "L", us: "12", age: "11–12 yrs", height: { in: "57–59", cm: "145–150" }, chest: { in: "29–30.5", cm: "74–77" }, waist: { in: "25–26", cm: "64–66" }, hip: { in: "30–32", cm: "76–81" }, shoulder: { in: "12.5–13", cm: "32–33" }, sleeve: { in: "19–20", cm: "48–51" }, length: { in: "35–37", cm: "89–94" } },
  { size: "XL", us: "14", age: "13–14 yrs", height: { in: "60–62", cm: "152–157" }, chest: { in: "30.5–32", cm: "77–81" }, waist: { in: "26–27", cm: "66–69" }, hip: { in: "32–34", cm: "81–86" }, shoulder: { in: "13–13.5", cm: "33–34" }, sleeve: { in: "20–21", cm: "51–53" }, length: { in: "38–40", cm: "97–102" } },
  { size: "XXL", us: "16", age: "15–16 yrs", height: { in: "63–65", cm: "160–165" }, chest: { in: "32–34", cm: "81–86" }, waist: { in: "27–28.5", cm: "69–72" }, hip: { in: "34–36", cm: "86–91" }, shoulder: { in: "13.5–14", cm: "34–36" }, sleeve: { in: "21–22", cm: "53–56" }, length: { in: "41–43", cm: "104–109" } },
];

const BOYS_COLUMNS: Column[] = [
  { key: "size", label: "Size", plain: true },
  { key: "us", label: "US Size", plain: true },
  { key: "age", label: "Age", plain: true },
  { key: "height", label: "Height" },
  { key: "chest", label: "Chest" },
  { key: "waist", label: "Waist" },
  { key: "hip", label: "Hip" },
  { key: "shoulder", label: "Shoulder" },
  { key: "sleeve", label: "Sleeve" },
  { key: "length", label: "Trouser Inseam" },
];

const BOYS_ROWS: Record<string, string | Measured>[] = [
  { size: "XXS", us: "2T", age: "2 yrs", height: { in: "33–35", cm: "84–89" }, chest: { in: "20–21", cm: "51–53" }, waist: { in: "19.5–20", cm: "50–51" }, hip: { in: "20–21", cm: "51–53" }, shoulder: { in: "8.5–9", cm: "22–23" }, sleeve: { in: "11–12", cm: "28–30" }, length: { in: "12–13", cm: "30–33" } },
  { size: "XS", us: "3T", age: "3 yrs", height: { in: "36–38", cm: "91–97" }, chest: { in: "21–22", cm: "53–56" }, waist: { in: "20–20.5", cm: "51–52" }, hip: { in: "21–22", cm: "53–56" }, shoulder: { in: "9–9.5", cm: "23–24" }, sleeve: { in: "12–13", cm: "30–33" }, length: { in: "14–15", cm: "36–38" } },
  { size: "XS", us: "4T", age: "4 yrs", height: { in: "39–41", cm: "99–104" }, chest: { in: "22–23", cm: "56–58" }, waist: { in: "20.5–21", cm: "52–53" }, hip: { in: "22–23", cm: "56–58" }, shoulder: { in: "9.5–10", cm: "24–25" }, sleeve: { in: "13–14", cm: "33–36" }, length: { in: "16–17", cm: "41–43" } },
  { size: "S", us: "5", age: "5 yrs", height: { in: "42–44", cm: "107–112" }, chest: { in: "23–24", cm: "58–61" }, waist: { in: "21–21.5", cm: "53–55" }, hip: { in: "23–24", cm: "58–61" }, shoulder: { in: "10–10.5", cm: "25–27" }, sleeve: { in: "14–15", cm: "36–38" }, length: { in: "18–19", cm: "46–48" } },
  { size: "S", us: "6", age: "6 yrs", height: { in: "45–47", cm: "114–119" }, chest: { in: "24–25", cm: "61–64" }, waist: { in: "21.5–22", cm: "55–56" }, hip: { in: "24–25", cm: "61–64" }, shoulder: { in: "10.5–11", cm: "27–28" }, sleeve: { in: "15–16", cm: "38–41" }, length: { in: "20–21", cm: "51–53" } },
  { size: "M", us: "7", age: "7 yrs", height: { in: "48–50", cm: "122–127" }, chest: { in: "25–26", cm: "64–66" }, waist: { in: "22–23", cm: "56–58" }, hip: { in: "25–26.5", cm: "64–67" }, shoulder: { in: "11–11.5", cm: "28–29" }, sleeve: { in: "16–17", cm: "41–43" }, length: { in: "22–23", cm: "56–58" } },
  { size: "M", us: "8", age: "8 yrs", height: { in: "51–53", cm: "130–135" }, chest: { in: "26–27.5", cm: "66–70" }, waist: { in: "23–24", cm: "58–61" }, hip: { in: "26.5–28", cm: "67–71" }, shoulder: { in: "11.5–12", cm: "29–30" }, sleeve: { in: "17–18", cm: "43–46" }, length: { in: "24–25", cm: "61–64" } },
  { size: "L", us: "10", age: "9–10 yrs", height: { in: "54–56", cm: "137–142" }, chest: { in: "27.5–29", cm: "70–74" }, waist: { in: "24–25", cm: "61–64" }, hip: { in: "28–30", cm: "71–76" }, shoulder: { in: "12–12.5", cm: "30–32" }, sleeve: { in: "18–19", cm: "46–48" }, length: { in: "26–27", cm: "66–69" } },
  { size: "L", us: "12", age: "11–12 yrs", height: { in: "57–59", cm: "145–150" }, chest: { in: "29–30.5", cm: "74–77" }, waist: { in: "25–26", cm: "64–66" }, hip: { in: "30–32", cm: "76–81" }, shoulder: { in: "12.5–13", cm: "32–33" }, sleeve: { in: "19–20", cm: "48–51" }, length: { in: "28–29", cm: "71–74" } },
  { size: "XL", us: "14", age: "13–14 yrs", height: { in: "60–62", cm: "152–157" }, chest: { in: "30.5–32", cm: "77–81" }, waist: { in: "26–27", cm: "66–69" }, hip: { in: "32–34", cm: "81–86" }, shoulder: { in: "13–13.5", cm: "33–34" }, sleeve: { in: "20–21", cm: "51–53" }, length: { in: "30–31", cm: "76–79" } },
  { size: "XXL", us: "16", age: "15–16 yrs", height: { in: "63–65", cm: "160–165" }, chest: { in: "32–34", cm: "81–86" }, waist: { in: "27–28.5", cm: "69–72" }, hip: { in: "34–36", cm: "86–91" }, shoulder: { in: "13.5–14", cm: "34–36" }, sleeve: { in: "21–22", cm: "53–56" }, length: { in: "32–33", cm: "81–84" } },
];

const HOW_TO_MEASURE: Record<Category, { label: string; body: string }[]> = {
  fitted: [
    { label: "Bust", body: "Measure around the fullest part of your bust." },
    { label: "Waist", body: "Measure around the smallest part of your waist." },
    { label: "Hip", body: "Measure around the fullest part of your hips." },
    { label: "Length", body: "Measure from the shoulder (or highest point) down to your desired length." },
  ],
  free: [
    { label: "Bust", body: "Measure around the fullest part of your bust." },
    { label: "Waist", body: "Measure around the smallest part of your waist." },
    { label: "Hip", body: "Measure around the fullest part of your hips." },
  ],
  girls: [
    { label: "Height", body: "Measure from the top of the head to the floor without shoes." },
    { label: "Chest", body: "Measure around the fullest part of the chest." },
    { label: "Waist", body: "Measure around the natural waistline." },
    { label: "Dress Length", body: "Measure from the shoulder down to the desired hemline." },
  ],
  boys: [
    { label: "Height", body: "Measure from the top of the head to the floor without shoes." },
    { label: "Chest", body: "Measure around the fullest part of the chest." },
    { label: "Waist", body: "Measure around the natural waistline." },
    { label: "Trouser Inseam", body: "Measure from the crotch seam along the inside leg to the ankle." },
  ],
};

// ─── Small building blocks ─────────────────────────────────────────────────

function cell(value: string | Measured | undefined, unit: Unit) {
  if (value === undefined) return "—";
  if (typeof value === "string") return value;
  return value[unit];
}

function SizeTable({
  columns,
  rows,
  unit,
}: {
  columns: Column[];
  rows: Record<string, string | Measured>[];
  unit: Unit;
}) {
  return (
    <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
      <table className="w-full min-w-[560px] sm:min-w-0 border-collapse text-sm">
        <thead>
          <tr className="bg-neutral-900 text-white">
            {columns.map((col) => (
              <th
                key={col.key}
                className="py-3 px-3 text-left font-medium text-[11px] tracking-[0.12em] uppercase first:rounded-tl-md last:rounded-tr-md whitespace-nowrap"
              >
                {col.label}
                {!col.plain && (
                  <span className="ml-1 normal-case text-neutral-400">
                    ({unit})
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`py-3 px-3 whitespace-nowrap border-b border-neutral-200 ${
                    col.key === "size" || col.key === "age"
                      ? "font-semibold text-neutral-900"
                      : "text-neutral-600"
                  }`}
                >
                  {cell(row[col.key], unit)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main modal ─────────────────────────────────────────────────────────────

const CATEGORY_LABELS: { key: Category; label: string }[] = [
  { key: "fitted", label: "Fitted Outfits" },
  { key: "free", label: "Free Styles" },
  { key: "girls", label: "Girls (2T–16)" },
  { key: "boys", label: "Boys (2T–16)" },
];

export default function SizeGuideModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const [unit, setUnit] = useState<Unit>("in");
  const [category, setCategory] = useState<Category>("fitted");
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Mount → animate in. Animate out → unmount after the transition ends.
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const raf = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setIsVisible(false);
      const t = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!shouldRender) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [shouldRender, onClose]);

  if (!shouldRender) return null;

  const columns =
    category === "fitted"
      ? FITTED_COLUMNS
      : category === "free"
      ? FREE_COLUMNS
      : category === "girls"
      ? GIRLS_COLUMNS
      : BOYS_COLUMNS;
  const rows =
    category === "fitted"
      ? FITTED_ROWS
      : category === "free"
      ? FREE_ROWS
      : category === "girls"
      ? GIRLS_ROWS
      : BOYS_ROWS;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Size guide"
        onClick={(e) => e.stopPropagation()}
        className={`w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col transition-all duration-300 ease-out ${
          isVisible
            ? "translate-y-0 sm:scale-100 opacity-100"
            : "translate-y-full sm:translate-y-4 sm:scale-95 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="bg-neutral-900 px-5 sm:px-8 pt-6 pb-5 relative">
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close size guide"
            className="absolute right-4 top-4 w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white font-serif text-sm font-semibold tracking-wide">
              EC
            </span>
            <div>
              <p className="font-serif text-xl sm:text-2xl text-white leading-tight">
                Size Guide
              </p>
              <p className="text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-neutral-400">
                Elims Clothings — Luxury in every detail
              </p>
            </div>
          </div>
        </div>

        {/* Tabs row */}
        <div className="flex items-center justify-between gap-3 px-5 sm:px-8 py-3 border-b border-neutral-200 bg-neutral-50">
          <div className="flex gap-1 overflow-x-auto">
            {CATEGORY_LABELS.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setCategory(c.key)}
                className={`px-3 py-1.5 text-xs whitespace-nowrap rounded-full border transition-colors ${
                  category === c.key
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "border-neutral-300 text-neutral-700 hover:border-neutral-900"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="flex-shrink-0 flex rounded-full border border-neutral-900 overflow-hidden text-xs">
            {(["in", "cm"] as Unit[]).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`px-3 py-1.5 uppercase tracking-wide transition-colors ${
                  unit === u
                    ? "bg-neutral-900 text-white"
                    : "text-neutral-700 hover:bg-neutral-900/5"
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-5 sm:px-8 py-5 flex-1">
          <SizeTable columns={columns} rows={rows} unit={unit} />

          {category === "fitted" && (
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-xs text-neutral-600">
              <span className="uppercase tracking-[0.12em] text-[11px] font-medium text-neutral-900">
                Length options:
              </span>
              {LENGTH_OPTIONS.map((l) => (
                <span key={l.label}>
                  {l.label}{" "}
                  <span className="text-neutral-500">
                    {unit === "in" ? l.in : l.cm} {unit}
                  </span>
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 border-t border-neutral-200 pt-4">
            <p className="text-[11px] tracking-[0.15em] uppercase font-medium text-neutral-900 mb-2">
              How to measure
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-neutral-600">
              {HOW_TO_MEASURE[category].map((m) => (
                <div key={m.label}>
                  <p className="font-medium text-neutral-800 mb-0.5">{m.label}</p>
                  <p className="leading-snug">{m.body}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-5 text-[11px] text-neutral-500 leading-relaxed">Please Note:</p>
          <p className="mt-2 text-[11px] text-neutral-500 leading-relaxed">
            Fitted Dresses: Measurements may vary by ±1 inch (±2.5 cm) due to handmade tailoring,
            fabric type, and design details. For the best fit, compare your own
            measurements against this guide before placing your order. Need a
            custom fit? Contact us for made-to-measure sizing.
          </p>
          <p className="mt-1 text-[11px] text-neutral-500 leading-relaxed">For Boubou, Kaftan etc: All free sizes include 6-8 inches (15-20 cm) of ease on the burst, waist and hip measurements to achieve our signature flowing luxury fit</p>
        </div>
      </div>
    </div>
  );
}