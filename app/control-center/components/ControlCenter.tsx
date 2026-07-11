"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { PdfDirection, PdfRemoteState, PdfId } from "@/lib/pdf-control";
import type { ControlOption } from "../control-options";
import { ControlCard } from "./ControlCard";
import { DetailScreen } from "./DetailScreen";

type ControlCenterProps = {
  options: ControlOption[];
};

export function ControlCenter({ options }: ControlCenterProps) {
  const [systemState, setSystemState] = useState<PdfRemoteState | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState("");

  // Sync state from server on mount and intervals
  async function syncState() {
    try {
      const response = await fetch("/api/pdf-control", { cache: "no-store" });
      if (response.ok) {
        const data = (await response.json()) as PdfRemoteState;
        setSystemState(data);
      }
    } catch {
      // Ignore API offline errors silently
    }
  }

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      void syncState();
    }, 0);
    const interval = setInterval(() => {
      void syncState();
    }, 1500);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);


  const selectedOption =
    options.find((opt) => opt.pdfId === systemState?.activePdfId) ?? null;
  const currentPage = selectedOption
    ? (systemState?.documents[selectedOption.pdfId]?.page ?? 1)
    : 1;

  async function selectOption(option: ControlOption) {
    if (isSending) return;

    setIsSending(true);
    setStatus("Opening…");

    try {
      const response = await fetch("/api/pdf-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "activate", pdfId: option.pdfId }),
      });

      if (!response.ok) throw new Error("Activation failed");
      const updatedState = (await response.json()) as PdfRemoteState;
      setSystemState(updatedState);
      setStatus("");
    } catch {
      setStatus("Unable to open preview");
    } finally {
      setIsSending(false);
    }
  }

  async function sendCommand(direction: PdfDirection) {
    if (!selectedOption || isSending) return;

    setIsSending(true);
    setStatus("Sending…");

    try {
      const response = await fetch("/api/pdf-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "navigate",
          pdfId: selectedOption.pdfId,
          direction,
        }),
      });

      if (!response.ok) throw new Error("Command failed");
      const result = (await response.json()) as {
        pdfId: PdfId;
        document: { page: number; totalPages: number | null; updatedAt: number };
      };

      // Instantly update local state for responsive feedback
      if (systemState) {
        setSystemState({
          ...systemState,
          documents: {
            ...systemState.documents,
            [result.pdfId]: result.document,
          },
        });
      }
      setStatus("Command sent");
    } catch {
      setStatus("Unable to reach preview");
    } finally {
      setIsSending(false);
    }
  }

  async function closePreview() {
    if (isSending) return;

    setIsSending(true);
    setStatus("Closing…");

    try {
      const response = await fetch("/api/pdf-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear" }),
      });

      if (!response.ok) throw new Error("Clear failed");
      const updatedState = (await response.json()) as PdfRemoteState;
      setSystemState(updatedState);
      setStatus("");
    } catch {
      setStatus("Unable to close preview");
    } finally {
      setIsSending(false);
    }
  }

  async function sendPlayback(playback: "play" | "pause") {
    if (!selectedOption || isSending) return;

    setIsSending(true);
    setStatus(playback === "play" ? "Playing…" : "Pausing…");

    try {
      const response = await fetch("/api/pdf-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "playback", playback }),
      });

      if (!response.ok) throw new Error("Playback command failed");
      setStatus(playback === "play" ? "Video playing" : "Video paused");
    } catch {
      setStatus("Unable to control video");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="relative min-h-screen w-full flex flex-col p-4 md:p-8 lg:p-12 bg-[#070b14] overflow-hidden text-slate-100">
      {/* Background blobs */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none animate-pulse-glow" />

      {/* Top Header - Hidden when a module is active */}
      {!selectedOption && (
        <header className="relative w-full max-w-7xl mx-auto flex items-center justify-between pb-6 mb-8 border-b border-white/5 z-10">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs font-mono font-bold tracking-wider"
            >
              &larr; PORTAL HOME
            </Link>
            <span className="text-slate-700">|</span>
            <h1 className="text-sm font-bold tracking-[0.1em] text-white">
              OPERATOR CONSOLE
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono text-slate-400">SYSTEM ONLINE</span>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      {selectedOption ? (
        /* When active: Show ONLY the DetailScreen buttons centered on the page */
        <div className="relative w-full max-w-3xl mx-auto flex-grow flex items-center justify-center z-10">
          <DetailScreen
            option={selectedOption}
            currentPage={currentPage}
            isSending={isSending}
            status={status}
            onNavigate={sendCommand}
            onPlayback={sendPlayback}
            onBack={closePreview}
          />
        </div>
      ) : (
        /* When inactive: Show sidebar selector and standby module layout */
        <section className="relative w-full max-w-7xl mx-auto flex-grow grid md:grid-cols-12 gap-8 z-10">
          {/* Left Side: Module Selector Sidebar */}
          <div className="col-span-full md:col-span-4 lg:col-span-3 flex flex-col gap-4">
            <span className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider px-1">
              Projection Modules
            </span>
            <div className="flex flex-col gap-3">
              {options.map((option) => (
                <ControlCard
                  key={option.id}
                  option={option}
                  isActive={false}
                  isDisabled={isSending}
                  onSelect={() => void selectOption(option)}
                />
              ))}
            </div>
          </div>

          {/* Right Side: Standby Desk (Hidden on mobile for clean screen view) */}
          <div className="hidden md:flex md:col-span-8 lg:col-span-9 rounded-3xl border border-white/5 bg-slate-900/10 backdrop-blur-xl p-6 md:p-8 min-h-[420px] items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center p-8 max-w-md space-y-4">
              <div className="w-16 h-16 rounded-full border border-dashed border-slate-700 flex items-center justify-center text-slate-600 animate-pulse-glow">
                <svg
                  className="w-8 h-8 text-cyan-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                No Module Active
              </h2>
              <p className="text-slate-400 text-sm font-light leading-relaxed">
                Click a module on the left side menu to project its schematics on the display wall and launch the tactile navigation console.
              </p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}


