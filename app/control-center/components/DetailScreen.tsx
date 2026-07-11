import type { PdfDirection } from "@/lib/pdf-control";
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
  isSending,
  onNavigate,
  onPlayback,
  onBack,
}: DetailScreenProps) {
  return (
    <div className="w-full min-h-[70vh] flex flex-col justify-between items-center py-8 px-4 select-none">
      {/* Top action bar: Just a clean, centered Back/Release button */}
      <div className="w-full flex justify-center">
        <button
          type="button"
          disabled={isSending}
          onClick={onBack}
          className="px-8 py-3.5 text-xs font-mono font-black tracking-widest text-slate-400 hover:text-white border border-white/10 hover:border-white/20 rounded-full bg-slate-900/40 hover:bg-slate-900/80 cursor-pointer disabled:opacity-50 disabled:cursor-wait transition-all shadow-lg active:scale-95"
        >
          &larr; SELECT MODULE
        </button>
      </div>

      {/* Center Control Pad: Huge, screen-filling tactile buttons */}
      <div className="w-full max-w-2xl my-auto flex gap-6 md:gap-8 justify-center items-center py-12">
        {option.controlKind === "video" ? (
          /* Video Playback Controls */
          <div className="flex gap-6 w-full max-w-md">
            <button
              type="button"
              disabled={isSending}
              onClick={() => onPlayback("play")}
              className="flex-1 aspect-square max-w-[200px] flex flex-col items-center justify-center gap-3 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-400/50 hover:bg-cyan-500/20 text-cyan-400 cursor-pointer disabled:opacity-50 disabled:cursor-wait active:scale-95 shadow-xl transition-all duration-200"
            >
              <svg className="w-12 h-12 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span className="text-xs font-mono font-bold tracking-widest">PLAY</span>
            </button>
            
            <button
              type="button"
              disabled={isSending}
              onClick={() => onPlayback("pause")}
              className="flex-1 aspect-square max-w-[200px] flex flex-col items-center justify-center gap-3 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-white/20 hover:bg-slate-900 text-white cursor-pointer disabled:opacity-50 disabled:cursor-wait active:scale-95 shadow-xl transition-all duration-200"
            >
              <svg className="w-12 h-12 fill-current" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
              <span className="text-xs font-mono font-bold tracking-widest">PAUSE</span>
            </button>
          </div>
        ) : (
          /* Slide Navigation Pad - Two huge buttons side by side */
          <div className="flex gap-6 md:gap-8 w-full">
            {/* PREV BUTTON */}
            <button
              type="button"
              aria-label="Previous slide"
              disabled={isSending}
              onClick={() => onNavigate("previous")}
              className="flex-1 aspect-[4/5] md:aspect-square flex flex-col items-center justify-center gap-4 rounded-[2rem] bg-slate-900/40 border border-white/5 hover:border-cyan-500/40 hover:bg-slate-900/80 active:scale-95 text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all duration-200 shadow-2xl"
            >
              <svg
                className="w-12 h-12 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-slate-400">
                PREV
              </span>
            </button>

            {/* NEXT BUTTON */}
            <button
              type="button"
              aria-label="Next slide"
              disabled={isSending}
              onClick={() => onNavigate("next")}
              className="flex-1 aspect-[4/5] md:aspect-square flex flex-col items-center justify-center gap-4 rounded-[2rem] bg-slate-900/40 border border-white/5 hover:border-cyan-500/40 hover:bg-slate-900/80 active:scale-95 text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all duration-200 shadow-2xl"
            >
              <svg
                className="w-12 h-12 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-slate-400">
                NEXT
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Muted Tag: Very subtle confirmation of active module */}
      <div className="text-[10px] font-mono tracking-widest text-slate-600 uppercase">
        Active: {option.label}
      </div>
    </div>
  );
}
