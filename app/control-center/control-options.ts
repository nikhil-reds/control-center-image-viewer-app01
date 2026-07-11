import type { PdfId } from "@/lib/pdf-control";

export type ControlOption = {
  id: string;
  pdfId: PdfId;
  label: string;
  shortName: string;
  tagline: string;
  controlKind: "pages" | "video";
};

export const controlOptions: ControlOption[] = [
  {
    id: "community-reinvented-toilet",
    pdfId: "pdf-1",
    label: "CRT",
    shortName: "CRT",
    tagline: "Community-led sanitation. Lasting impact.",
    controlKind: "pages",
  },
  {
    id: "mobile-treatment-unit",
    pdfId: "pdf-2",
    label: "MTU",
    shortName: "MTU",
    tagline: "Portable treatment. Lasting impact.",
    controlKind: "pages",
  },
  {
    id: "onsite-treatment-plant",
    pdfId: "pdf-3",
    label: "STP",
    shortName: "STP",
    tagline: "Onsite treatment. Lasting impact.",
    controlKind: "pages",
  },
];
