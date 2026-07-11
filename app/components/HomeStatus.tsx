"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { controlOptions } from "../control-center/control-options";
import { type PdfRemoteState } from "@/lib/pdf-control";

export function HomeStatus() {
  const [systemState, setSystemState] = useState<PdfRemoteState | null>(null);
  const [latency, setLatency] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(true);

  async function fetchStatus() {
    const startTime = performance.now();
    try {
      const response = await fetch("/api/pdf-control", { cache: "no-store" });
      if (!response.ok) throw new Error("Offline");
      const data = (await response.json()) as PdfRemoteState;
      setSystemState(data);
      setIsConnected(true);
      setLatency(Math.round(performance.now() - startTime));
    } catch {
      setIsConnected(false);
      setLatency(0);
    }
  }

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      void fetchStatus();
    }, 0);
    const interval = setInterval(() => {
      void fetchStatus();
    }, 1500);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const activeOption = controlOptions.find((opt) => opt.pdfId === systemState?.activePdfId);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12">
      {/* System Status Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 md:p-6 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3.5 w-3.5">
            {isConnected ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </>
            ) : (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
              </>
            )}
          </span>
          <div>
            <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">System Status</p>
            <p className="text-sm font-semibold text-white">
              {isConnected ? "CONNECTED & ONLINE" : "SYSTEM OFFLINE"}
            </p>
          </div>
        </div>

        <div className="flex gap-8">
          <div>
            <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Sync Latency</p>
            <p className="text-sm font-semibold font-mono text-cyan-400">
              {isConnected ? `${latency} ms` : "--"}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Active Projection</p>
            <p className="text-sm font-semibold text-teal-400">
              {systemState?.activePdfId ? activeOption?.label ?? systemState.activePdfId : "Idle Video Loop"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Portals Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Card 1: Operator Control Center */}
        <Link
          href="/control-center"
          className="group relative flex flex-col justify-between overflow-hidden p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950/80 hover:border-cyan-500/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] transition-all duration-300 transform hover:-translate-y-1.5"
        >
          {/* Subtle light leak effect */}
          <div className="absolute -right-16 -top-16 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all duration-300" />
          
          <div className="space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:scale-110 group-hover:border-cyan-400 transition-all duration-300">
              <svg
                className="w-7 h-7 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M21 12H3M12 3v18" />
                <circle cx="7.5" cy="7.5" r="1.5" className="fill-cyan-400" />
                <circle cx="16.5" cy="7.5" r="1.5" className="fill-cyan-400" />
                <circle cx="7.5" cy="16.5" r="1.5" className="fill-cyan-400" />
                <circle cx="16.5" cy="16.5" r="1.5" className="fill-cyan-400" />
              </svg>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                Control Center Console &rarr;
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Open the tactile operator interface to project system schematics (CRT, MTU, STP) onto the screens. Page through documents, control slides, and manage playback.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-cyan-400/80 font-mono tracking-wider uppercase group-hover:text-cyan-300 transition-colors">
              Access Remote Controller
            </span>
            <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            </div>
          </div>
        </Link>

        {/* Card 2: Live Preview Presentation Wall */}
        <a
          href="/preview"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex flex-col justify-between overflow-hidden p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950/80 hover:border-teal-500/50 hover:shadow-[0_0_40px_rgba(20,184,166,0.15)] transition-all duration-300 transform hover:-translate-y-1.5"
        >
          {/* Subtle light leak effect */}
          <div className="absolute -right-16 -top-16 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all duration-300" />

          <div className="space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center group-hover:scale-110 group-hover:border-teal-400 transition-all duration-300">
              <svg
                className="w-7 h-7 text-teal-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-bold tracking-tight text-white group-hover:text-teal-300 transition-colors">
                Launch Presentation Wall &rarr;
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Open the live projector screen. Designed to run full-screen on presentation displays, this view automatically updates and transitions slides when triggered by the operator.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <span className="text-xs text-teal-400/80 font-mono tracking-wider uppercase group-hover:text-teal-300 transition-colors">
              Open Display Screen (New Tab)
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5">
                Target: Display
              </span>
            </div>
          </div>
        </a>
      </div>

    </div>

  );
}
