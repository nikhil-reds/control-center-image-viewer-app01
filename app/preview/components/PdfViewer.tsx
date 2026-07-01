"use client";

import { useEffect, useRef, useState } from "react";
import type {
  PDFDocumentProxy,
  RenderTask,
} from "pdfjs-dist/types/src/display/api";
import type { PdfId } from "@/lib/pdf-control";
import styles from "../preview.module.css";

type PdfViewerProps = {
  pdfId: PdfId;
  src: string;
  pageNumber: number;
  onReady: (pdfId: PdfId, totalPages: number) => void;
};

export function PdfViewer({
  pdfId,
  src,
  pageNumber,
  onReady,
}: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const documentRef = useRef<PDFDocumentProxy | null>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const [status, setStatus] = useState("Loading PDF…");
  const [sizeVersion, setSizeVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let loadedDocument: PDFDocumentProxy | null = null;

    async function loadPdf() {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        loadedDocument = await pdfjs.getDocument({ url: src }).promise;

        if (cancelled) {
          await loadedDocument.cleanup();
          return;
        }

        documentRef.current = loadedDocument;
        onReady(pdfId, loadedDocument.numPages);
        setStatus("");
        setSizeVersion((version) => version + 1);
      } catch {
        if (!cancelled) setStatus("Unable to load PDF");
      }
    }

    void loadPdf();

    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
      documentRef.current = null;
      if (loadedDocument) void loadedDocument.cleanup();
    };
  }, [onReady, pdfId, src]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      setSizeVersion((version) => version + 1);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const pdf = documentRef.current;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!pdf || !container || !canvas) return;

    let cancelled = false;

    async function renderPage() {
      renderTaskRef.current?.cancel();
      const safePage = Math.min(pdf!.numPages, Math.max(1, pageNumber));
      const page = await pdf!.getPage(safePage);
      if (cancelled) return;

      const unscaled = page.getViewport({ scale: 1 });
      const fitScale = Math.min(
        container!.clientWidth / unscaled.width,
        container!.clientHeight / unscaled.height,
      );
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const viewport = page.getViewport({ scale: fitScale * pixelRatio });
      const context = canvas!.getContext("2d");
      if (!context) return;

      canvas!.width = Math.floor(viewport.width);
      canvas!.height = Math.floor(viewport.height);
      canvas!.style.width = `${Math.floor(viewport.width / pixelRatio)}px`;
      canvas!.style.height = `${Math.floor(viewport.height / pixelRatio)}px`;

      const renderTask = page.render({
        canvas: canvas!,
        canvasContext: context,
        viewport,
      });
      renderTaskRef.current = renderTask;

      try {
        await renderTask.promise;
      } catch (error) {
        if (!cancelled && (error as Error).name !== "RenderingCancelledException") {
          setStatus("Unable to render page");
        }
      }
    }

    void renderPage();
    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
    };
  }, [pageNumber, sizeVersion]);

  return (
    <section
      ref={containerRef}
      className={styles.viewer}
      aria-label={`${pdfId} preview, page ${pageNumber}`}
    >
      <canvas ref={canvasRef} />
      {status ? <span className={styles.viewerStatus}>{status}</span> : null}
    </section>
  );
}
