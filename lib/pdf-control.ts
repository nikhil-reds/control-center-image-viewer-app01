export const mediaDocuments = [
  {
    id: "pdf-1",
    kind: "images",
    images: [
      "/button01/Dasra%20%20NFSSM%20TDP__916%20and%20169%20%281%29.jpg",
    ],
  },
  {
    id: "pdf-3",
    kind: "images",
    images: [
      "/button03/2.jpg",
      "/button03/3.jpg",
      "/button03/4.jpg",
      "/button03/5.jpg",
      "/button03/6.jpg",
      "/button03/7.jpg",
      "/button03/8.jpg",
    ],
  },
  {
    id: "pdf-4",
    kind: "images",
    images: [
      "/button04/9.jpg",
      "/button04/10.jpg",
      "/button04/11.jpg",
      "/button04/12.jpg",
      "/button04/13.jpg",
      "/button04/14.jpg",
      "/button04/15.jpg",
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
