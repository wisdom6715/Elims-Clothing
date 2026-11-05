"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ZoomIn, Maximize2, Download } from "lucide-react";

export default function SizeGuideModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const raf = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setIsVisible(false);
      setIsZoomed(false);
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
      if (e.key === "Escape") {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [shouldRender, isZoomed, onClose]);

  if (!shouldRender) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Elims Clothings Measurements & Size Guide"
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-4xl bg-[#FAF8F3] rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col transition-all duration-300 ease-out border border-[#E7E2D6] ${
            isVisible
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0"
          }`}
        >
          {/* Header */}
          <div className="bg-[#111110] px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center font-serif text-sm font-semibold tracking-wider text-[#C9A96E]">
                EC
              </span>
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-medium tracking-wide text-white">
                  Size Chart &amp; Measurements
                </h2>
                <p className="text-[10px] sm:text-[11px] tracking-[0.16em] uppercase text-[#C9A96E]">
                  Elims Clothings — Style for Every Generation
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsZoomed(true)}
                title="View Fullscreen"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white transition-colors"
              >
                <Maximize2 size={13} />
                <span>Fullscreen</span>
              </button>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                aria-label="Close size guide"
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Modal Content — Measurements Image */}
          <div className="overflow-y-auto p-4 sm:p-6 flex-1 flex flex-col items-center">
            <div className="w-full relative rounded-xl overflow-hidden border border-[#D5DFD6] bg-white shadow-sm group">
              {/* Clickable Image to view enlarged */}
              <button
                type="button"
                onClick={() => setIsZoomed(true)}
                className="w-full relative block cursor-zoom-in text-left focus:outline-none"
                title="Click to view full image"
              >
                <img
                  src="/size-chart.jpg"
                  alt="Elims Clothings Girls and Boys Size Chart and Measurements"
                  className="w-full h-auto object-contain block select-none"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                    <ZoomIn size={14} /> Tap or click to enlarge
                  </span>
                </div>
              </button>
            </div>

            {/* Bottom info bar */}
            <div className="w-full mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#52685E] px-1">
              <p className="leading-relaxed">
                <span className="font-semibold text-[#0F473A]">Tip:</span> Click on the chart above to zoom in or view full-screen on mobile and desktop.
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsZoomed(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#C6D0C8] bg-white text-[#0F473A] font-semibold text-[11px] hover:bg-[#F0F4F1] transition-colors"
                >
                  <ZoomIn size={13} /> Enlarge Image
                </button>
                <a
                  href="/size-chart.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F473A] text-white font-semibold text-[11px] hover:bg-[#1E6151] transition-colors"
                >
                  <Download size={13} /> Open Full File
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox / Zoom Overlay */}
      {isZoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full size measurements chart"
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-2 sm:p-6"
        >
          <button
            type="button"
            onClick={() => setIsZoomed(false)}
            aria-label="Close enlarged chart"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors shadow-lg"
          >
            <X size={20} />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-full max-w-full overflow-auto flex items-center justify-center"
          >
            <img
              src="/size-chart.jpg"
              alt="Elims Clothings Size Chart, Full Resolution"
              className="max-h-[95vh] max-w-[98vw] w-auto h-auto rounded-lg object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
