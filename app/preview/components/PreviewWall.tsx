"use client";

import { useCallback, useEffect, useState } from "react";
import {
  pdfDocuments,
  type PdfControlState,
  type PdfId,
} from "@/lib/pdf-control";
import styles from "../preview.module.css";
import { PdfViewer } from "./PdfViewer";

const initialPages = Object.fromEntries(
  pdfDocuments.map((document) => [document.id, 1]),
) as Record<PdfId, number>;

export function PreviewWall() {
  const [pages, setPages] = useState(initialPages);
  const [apiOnline, setApiOnline] = useState(true);

  const refreshPages = useCallback(async () => {
    try {
      const response = await fetch("/api/pdf-control", { cache: "no-store" });
      if (!response.ok) throw new Error("State request failed");

      const data = (await response.json()) as { documents: PdfControlState };
      setPages(
        Object.fromEntries(
          pdfDocuments.map((document) => [
            document.id,
            data.documents[document.id].page,
          ]),
        ) as Record<PdfId, number>,
      );
      setApiOnline(true);
    } catch {
      setApiOnline(false);
    }
  }, []);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => void refreshPages(), 0);
    const timer = window.setInterval(() => void refreshPages(), 700);
    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
    };
  }, [refreshPages]);

  const registerPageCount = useCallback(
    async (pdfId: PdfId, totalPages: number) => {
      await fetch("/api/pdf-control", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfId, totalPages }),
      }).catch(() => undefined);
    },
    [],
  );

  return (
    <main className={styles.wall}>
      <span className={styles.connection} data-online={apiOnline}>
        {apiOnline ? "Connected" : "Reconnecting"}
      </span>
      {pdfDocuments.map((document) => (
        <PdfViewer
          key={document.id}
          pdfId={document.id}
          src={document.src}
          pageNumber={pages[document.id]}
          onReady={registerPageCount}
        />
      ))}
    </main>
  );
}
