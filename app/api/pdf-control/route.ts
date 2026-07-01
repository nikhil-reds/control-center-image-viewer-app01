import {
  isPdfDirection,
  isPdfId,
  pdfDocuments,
  type PdfControlState,
} from "@/lib/pdf-control";

export const dynamic = "force-dynamic";

const globalState = globalThis as typeof globalThis & {
  pdfControlState?: PdfControlState;
};

function createInitialState(): PdfControlState {
  return Object.fromEntries(
    pdfDocuments.map((document) => [
      document.id,
      { page: 1, totalPages: null, updatedAt: Date.now() },
    ]),
  ) as PdfControlState;
}

const state = (globalState.pdfControlState ??= createInitialState());

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function GET() {
  return json({ documents: state });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    pdfId?: unknown;
    direction?: unknown;
  } | null;

  if (!body || !isPdfId(body.pdfId) || !isPdfDirection(body.direction)) {
    return json({ error: "Invalid PDF command" }, 400);
  }

  const document = state[body.pdfId];
  const lastPage = document.totalPages ?? Number.MAX_SAFE_INTEGER;
  const nextPage =
    body.direction === "next" ? document.page + 1 : document.page - 1;

  document.page = Math.min(lastPage, Math.max(1, nextPage));
  document.updatedAt = Date.now();

  return json({ pdfId: body.pdfId, document });
}

export async function PATCH(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    pdfId?: unknown;
    totalPages?: unknown;
  } | null;

  if (
    !body ||
    !isPdfId(body.pdfId) ||
    typeof body.totalPages !== "number" ||
    !Number.isInteger(body.totalPages) ||
    body.totalPages < 1
  ) {
    return json({ error: "Invalid PDF page count" }, 400);
  }

  const document = state[body.pdfId];
  document.totalPages = body.totalPages;
  document.page = Math.min(document.page, body.totalPages);
  document.updatedAt = Date.now();

  return json({ pdfId: body.pdfId, document });
}
