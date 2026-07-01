export const pdfDocuments = [
  { id: "pdf-1", src: "/pdf01.pdf" },
  { id: "pdf-2", src: "/pdf02.pdf" },
  { id: "pdf-3", src: "/pdf03.pdf" },
] as const;

export type PdfId = (typeof pdfDocuments)[number]["id"];
export type PdfDirection = "previous" | "next";

export type PdfPageState = {
  page: number;
  totalPages: number | null;
  updatedAt: number;
};

export type PdfControlState = Record<PdfId, PdfPageState>;

export function isPdfId(value: unknown): value is PdfId {
  return pdfDocuments.some((document) => document.id === value);
}

export function isPdfDirection(value: unknown): value is PdfDirection {
  return value === "previous" || value === "next";
}
