import Image from "next/image";
import type { PdfDirection } from "@/lib/pdf-control";
import { mediaDocuments } from "@/lib/pdf-control";
import type { ControlOption } from "../control-options";

type DetailScreenProps = {
  option: ControlOption;
  currentPage: number;
  isSending: boolean;
  status: string;
  onNavigate: (direction: PdfDirection) => void;
  onPlayback: (playback: "play" | "pause") => void;
  onBack: () => void;
};

export function DetailScreen({
  option,
  currentPage,
  isSending,
  status,
  onNavigate,
  onPlayback,
  onBack,
}: DetailScreenProps) {
  // Find images list for current option
  const documentDef = mediaDocuments.find((doc) => doc.id === option.pdfId);
  const images = documentDef?.images ?? [];
  const totalPages = images.length;
  
  // Safe image path resolution
  const safeIndex = Math.min(totalPages - 1, Math.max(0, currentPage - 1));
  const activeImageSrc = images[safeIndex] ?? "";

  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <div className="w-full flex flex-col gap-6 md:gap-8">
      {/* Top action bar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
          <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase">
            LIVE PROJECTION ENGAGED
          </span>
        </div>

        <button
          type="button"
          disabled={isSending}
          onClick={onBack}
          className="px-4 py-2 text-xs font-mono font-bold tracking-wider text-rose-400 hover:text-rose-300 border border-rose-500/20 hover:border-rose-500/40 rounded-lg bg-rose-950/20 hover:bg-rose-950/40 cursor-pointer disabled:opacity-50 disabled:cursor-wait transition-all"
        >
          RELEASE SCREEN (RESET)
        </button>
      </div>

      {/* Screen Meta Title */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          {option.label}
        </h1>
        <p className="text-slate-400 text-sm mt-1">{option.tagline}</p>
      </div>

      {/* Grid: Preview Monitor & Controls */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left/Top: Live Feed Monitor Mockup */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <span className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
            Operator Feed Monitor
          </span>
          
          <div className="relative aspect-video w-full rounded-2xl border-4 border-slate-900 bg-slate-950 shadow-2xl overflow-hidden group">
            {/* Monitor Chrome Inner Border */}
            <div className="absolute inset-0 border border-white/10 rounded-[12px] z-20 pointer-events-none" />
            
            {/* Screen Content */}
            {activeImageSrc ? (
              <div className="relative w-full h-full">
                <Image
                  src={activeImageSrc}
                  alt={`Preview of slide ${currentPage}`}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                />
                
                {/* Glow Backdrop */}
                <div className="absolute inset-0 bg-cyan-500/5 mix-blend-color-dodge opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
                <span className="text-xs font-mono text-slate-500">Connecting to feed...</span>
              </div>
            )}

            {/* Screen Glass reflection layer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-10" />

            {/* Live Indicator overlay */}
            <div className="absolute top-4 left-4 z-20 px-2 py-1 rounded bg-black/80 backdrop-blur border border-white/10 text-[9px] font-mono font-bold text-white flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              MONITOR_01 // LIVE_VIEW
            </div>

            {/* Slide Count Overlay */}
            <div className="absolute bottom-4 right-4 z-20 px-2 py-1 rounded bg-black/80 backdrop-blur border border-white/10 text-[9px] font-mono font-bold text-white">
              SLIDE {currentPage} / {totalPages}
            </div>
          </div>
        </div>

        {/* Right/Bottom: Tactile Command Center pad */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono font-semibold text-slate-500 uppercase tracking-wider">
              Tactile Control Desk
            </span>

            <div className="p-6 md:p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md flex flex-col items-center justify-center gap-6 shadow-xl">
              {option.controlKind === "video" ? (
                /* Video Playback Controls */
                <div className="flex gap-6 w-full max-w-xs">
                  <button
                    type="button"
                    disabled={isSending}
                    onClick={() => onPlayback("play")}
                    className="flex-1 py-4 flex flex-col items-center gap-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-400/40 hover:bg-cyan-500/20 text-cyan-400 cursor-pointer disabled:opacity-50 disabled:cursor-wait transition-all"
                  >
                    <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span className="text-xs font-mono font-semibold">PLAY</span>
                  </button>
                  <button
                    type="button"
                    disabled={isSending}
                    onClick={() => onPlayback("pause")}
                    className="flex-1 py-4 flex flex-col items-center gap-2 rounded-xl bg-slate-800/40 border border-white/5 hover:border-white/20 hover:bg-slate-800 text-white cursor-pointer disabled:opacity-50 disabled:cursor-wait transition-all"
                  >
                    <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                    <span className="text-xs font-mono font-semibold">PAUSE</span>
                  </button>
                </div>
              ) : (
                /* Slide Navigation Pad */
                <div className="w-full flex flex-col gap-6">
                  {/* Big Trackpad Slider Buttons */}
                  <div className="flex gap-4 w-full">
                    {/* PREV BUTTON */}
                    <button
                      type="button"
                      aria-label="Previous slide"
                      disabled={isSending || isFirstPage}
                      onClick={() => onNavigate("previous")}
                      className="flex-1 py-6 flex flex-col items-center justify-center gap-3 rounded-2xl bg-slate-950/40 border border-white/5 hover:border-cyan-500/40 hover:bg-slate-900/60 active:scale-[0.98] text-white disabled:opacity-20 disabled:pointer-events-none cursor-pointer transition-all duration-200"
                    >
                      <svg
                        className="w-6 h-6 text-cyan-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="text-xs font-mono font-bold tracking-widest text-slate-400">
                        PREVIOUS
                      </span>
                    </button>

                    {/* NEXT BUTTON */}
                    <button
                      type="button"
                      aria-label="Next slide"
                      disabled={isSending || isLastPage}
                      onClick={() => onNavigate("next")}
                      className="flex-1 py-6 flex flex-col items-center justify-center gap-3 rounded-2xl bg-slate-950/40 border border-white/5 hover:border-cyan-500/40 hover:bg-slate-900/60 active:scale-[0.98] text-white disabled:opacity-20 disabled:pointer-events-none cursor-pointer transition-all duration-200"
                    >
                      <svg
                        className="w-6 h-6 text-cyan-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="text-xs font-mono font-bold tracking-widest text-slate-400">
                        NEXT
                      </span>
                    </button>
                  </div>

                  {/* Trackbar page display */}
                  <div className="w-full flex items-center justify-between text-xs font-mono px-1">
                    <span className="text-slate-500">START</span>
                    <div className="flex-1 mx-4 h-1.5 rounded-full bg-slate-950 overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-300"
                        style={{
                          width: `${((currentPage - 1) / Math.max(1, totalPages - 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-slate-500">END</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Console Log status bar */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              Sync Console Log
            </span>
            <div className="p-3 bg-slate-950/80 border border-white/5 rounded-xl text-xs font-mono text-slate-400 min-h-[3rem] flex items-center px-4">
              {isSending ? (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  <span className="text-cyan-400">{status || "Sending command..."}</span>
                </div>
              ) : (
                <span className="text-emerald-400">
                  {status ? `• ${status.toUpperCase()}` : "• COMPLETED: IDLE AND STANDBY"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
