import type { PdfDirection } from "@/lib/pdf-control";
import type { ControlOption } from "../control-options";
import styles from "../control-center.module.css";

type DetailScreenProps = {
  option: ControlOption;
  isSending: boolean;
  status: string;
  onNavigate: (direction: PdfDirection) => void;
  onBack: () => void;
};

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={styles.chevron}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

export function DetailScreen({
  option,
  isSending,
  status,
  onNavigate,
  onBack,
}: DetailScreenProps) {
  return (
    <section className={styles.detail} aria-labelledby="detail-title">
      <button type="button" className={styles.backButton} onClick={onBack}>
        Back
      </button>

      <div className={styles.detailContent}>
        <h1 id="detail-title">{option.shortName}</h1>
        <p>{option.tagline}</p>
        <div className={styles.pdfControls} aria-label="PDF navigation">
          <button
            type="button"
            aria-label="Previous PDF page"
            disabled={isSending}
            onClick={() => onNavigate("previous")}
          >
            <Chevron direction="left" />
          </button>
          <button
            type="button"
            aria-label="Next PDF page"
            disabled={isSending}
            onClick={() => onNavigate("next")}
          >
            <Chevron direction="right" />
          </button>
        </div>
        <p className={styles.commandStatus} aria-live="polite">
          {status}
        </p>
      </div>
    </section>
  );
}
