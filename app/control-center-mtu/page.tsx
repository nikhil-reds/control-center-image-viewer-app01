"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MtuControlPage() {
  const [isSending, setIsSending] = useState(false);

  // Activate MTU module on mount
  useEffect(() => {
    async function activateModule() {
      try {
        await fetch("/api/pdf-control", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "activate", pdfId: "pdf-2" }),
        });
      } catch {
        // Ignore API offline errors silently
      }
    }
    void activateModule();
  }, []);

  async function sendCommand(direction: "previous" | "next") {
    if (isSending) return;
    setIsSending(true);
    try {
      await fetch("/api/pdf-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "navigate",
          pdfId: "pdf-2",
          direction,
        }),
      });
    } catch {
      // Ignore API offline errors silently
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#030712] overflow-hidden text-slate-100 font-sans select-none">
      
      {/* Dark green radial glow matching screenshot */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          background: "radial-gradient(circle at center, rgba(16, 185, 129, 0.08) 0%, rgba(3, 7, 18, 0) 70%)"
        }}
      />
      
      {/* Floating Back Link to Portal */}
      <div className="absolute top-6 left-6 z-10">
        <Link 
          href="/control-center" 
          className="text-xs font-mono tracking-widest text-slate-500 hover:text-teal-400 transition-colors uppercase"
        >
          &larr; Control Center Home
        </Link>
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-4xl px-6 text-center space-y-6">
        
        {/* Large uppercase title with tracking matching the screenshot */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-[0.25em] text-[#a7f3d0] leading-tight select-none">
          MOBILE TREATMENT UNIT
        </h1>
        
        {/* Subtitle / Tagline */}
        <p className="text-xs md:text-sm text-slate-400 font-light tracking-wide max-w-lg">
          Portable Treatment. Lasting Impact.
        </p>

        {/* Circular buttons side-by-side */}
        <div className="flex gap-6 pt-4">
          <button
            type="button"
            aria-label="Previous slide"
            disabled={isSending}
            onClick={() => void sendCommand("previous")}
            className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full border border-teal-500/30 hover:border-teal-400 text-teal-400 hover:bg-teal-500/10 cursor-pointer transition-all duration-200 active:scale-90 disabled:opacity-40"
          >
            <svg 
              className="w-5 h-5 md:w-6 md:h-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Next slide"
            disabled={isSending}
            onClick={() => void sendCommand("next")}
            className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full border border-teal-500/30 hover:border-teal-400 text-teal-400 hover:bg-teal-500/10 cursor-pointer transition-all duration-200 active:scale-90 disabled:opacity-40"
          >
            <svg 
              className="w-5 h-5 md:w-6 md:h-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

      </div>

    </main>
  );
}
