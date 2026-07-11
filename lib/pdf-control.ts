export const mediaDocuments = [
  {
    id: "pdf-1",
    kind: "images",
    images: [
      "/ZONE 2 Images/CRT/5.png",
      "/ZONE 2 Images/CRT/6.png",
      "/ZONE 2 Images/CRT/7.png",
      "/ZONE 2 Images/CRT/8.png",
    ],
  },
  {
    id: "pdf-2",
    kind: "images",
    images: [
      "/ZONE 2 Images/MTU/1.png",
      "/ZONE 2 Images/MTU/2.png",
      "/ZONE 2 Images/MTU/3.png",
      "/ZONE 2 Images/MTU/4.png",
    ],
  },
  {
    id: "pdf-3",
    kind: "images",
    images: [
      "/ZONE 2 Images/STP/36.jpg",
      "/ZONE 2 Images/STP/37.jpg",
      "/ZONE 2 Images/STP/38.jpg",
      "/ZONE 2 Images/STP/39.jpg",
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
