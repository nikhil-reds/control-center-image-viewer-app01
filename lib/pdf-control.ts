export const mediaDocuments = [
  {
    id: "pdf-1",
    kind: "images",
    images: [
      "/CRT/5.png",
      "/CRT/6.png",
      "/CRT/7.png",
      "/CRT/8.png",
    ],
  },
  {
    id: "pdf-2",
    kind: "images",
    images: [
      "/MTU/1.png",
      "/MTU/2.png",
      "/MTU/3.png",
      "/MTU/4.png",
    ],
  },
  {
    id: "pdf-3",
    kind: "images",
    images: [
      "/STP/36.jpg",
      "/STP/37.jpg",
      "/STP/38.jpg",
      "/STP/39.jpg",
    ],
  },
] as const;

export type PdfId = (typeof mediaDocuments)[number]["id"];
export type PdfDirection = "previous" | "next";

export type PdfPageState = {
  page: number;
  totalPages: number | null;
  updatedAt: number;
};

export type PdfControlState = Record<PdfId, PdfPageState>;

export type PdfRemoteState = {
  activePdfId: PdfId | null;
  videoPlaying: boolean;
  documents: PdfControlState;
};

export function isPdfId(value: unknown): value is PdfId {
  return mediaDocuments.some((document) => document.id === value);
}

export function isPdfDirection(value: unknown): value is PdfDirection {
  return value === "previous" || value === "next";
}
