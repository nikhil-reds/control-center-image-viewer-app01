"use client";

import { useState } from "react";
import type { PdfDirection } from "@/lib/pdf-control";
import type { ControlOption } from "../control-options";
import styles from "../control-center.module.css";
import { ControlCard } from "./ControlCard";
import { DetailScreen } from "./DetailScreen";

type ControlCenterProps = {
  options: ControlOption[];
};

export function ControlCenter({ options }: ControlCenterProps) {
  const [selectedOption, setSelectedOption] = useState<ControlOption | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState("");

  async function sendCommand(direction: PdfDirection) {
    if (!selectedOption || isSending) return;

    setIsSending(true);
    setStatus("Sending…");

    try {
      const response = await fetch("/api/pdf-control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfId: selectedOption.pdfId, direction }),
      });

      if (!response.ok) throw new Error("Command failed");
      setStatus("Command sent");
    } catch {
      setStatus("Unable to reach preview");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden="true" />
      {selectedOption ? (
        <DetailScreen
          option={selectedOption}
          isSending={isSending}
          status={status}
          onNavigate={sendCommand}
          onBack={() => {
            setSelectedOption(null);
            setStatus("");
          }}
        />
      ) : (
        <section className={styles.controls} aria-label="Treatment options">
          {options.map((option) => (
            <ControlCard
              key={option.id}
              option={option}
              onSelect={() => setSelectedOption(option)}
            />
          ))}
        </section>
      )}
    </main>
  );
}
