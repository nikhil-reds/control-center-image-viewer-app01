import type { ControlOption } from "../control-options";

type ControlCardProps = {
  option: ControlOption;
  isActive: boolean;
  isDisabled: boolean;
  onSelect: () => void;
};

export function ControlCard({ option, isActive, isDisabled, onSelect }: ControlCardProps) {
  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onSelect}
      className={`w-full flex flex-col items-start gap-2 p-5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden select-none cursor-pointer ${
        isActive
          ? "bg-gradient-to-r from-cyan-950/40 to-slate-900/60 border-cyan-500/50 shadow-[0_0_25px_rgba(6,182,212,0.15)]"
          : "bg-slate-900/40 border-white/5 hover:border-white/10 hover:bg-slate-900/60"
      } disabled:opacity-50 disabled:cursor-wait`}
    >
      {/* Active side bar indicator */}
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-teal-500" />
      )}

      <div className="w-full flex items-center justify-between">
        <span className="text-xl font-bold tracking-tight text-white">
          {option.label}
        </span>
        
        {isActive ? (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
        ) : (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        )}
      </div>

      <p className="text-xs text-slate-400 leading-relaxed font-light line-clamp-2">
        {option.tagline}
      </p>
    </button>
  );
}

