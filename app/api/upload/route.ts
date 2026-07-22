import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const METADATA_PATH = path.join(UPLOAD_DIR, "metadata.json");

interface Asset {
  id: string;
  name: string;
  filename: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: number;
}

async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  try {
    await fs.access(METADATA_PATH);
  } catch {
    await fs.writeFile(METADATA_PATH, JSON.stringify([]));
  }
}

async function readMetadata(): Promise<Asset[]> {
  await ensureUploadDir();
  try {
    const data = await fs.readFile(METADATA_PATH, "utf-8");
    return JSON.parse(data) as Asset[];
  } catch {
    return [];
  }
}

async function writeMetadata(assets: Asset[]): Promise<void> {
  await ensureUploadDir();
  await fs.writeFile(METADATA_PATH, JSON.stringify(assets, null, 2));
}

export async function GET() {
  try {
    const assets = await readMetadata();
    return NextResponse.json(assets);
  } catch (error) {
    console.error("GET assets error:", error);
    return NextResponse.json({ error: "Failed to load assets" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureUploadDir();
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const currentAssets = await readMetadata();
    const newAssets: Asset[] = [];

    for (const file of files) {
      if (!file || !(file instanceof File)) continue;

      const buffer = Buffer.from(await file.arrayBuffer());
      const timestamp = Date.now();
      const ext = path.extname(file.name);
      const baseName = path.basename(file.name, ext);
      
      // Sanitize base name to make it filesystem safe
      const sanitizedName = baseName.replace(/[^a-zA-Z0-9-_]/g, "_");
      const uuid = crypto.randomUUID();
      const uniqueFilename = `${sanitizedName}-${uuid}${ext}`;
      const filePath = path.join(UPLOAD_DIR, uniqueFilename);

      await fs.writeFile(filePath, buffer);

      const asset: Asset = {
        id: uuid,
        name: file.name,
        filename: uniqueFilename,
        url: `/uploads/${uniqueFilename}`,
        size: file.size,
        type: file.type || "application/octet-stream",
        uploadedAt: timestamp,
      };

      newAssets.push(asset);
    }

    const updatedAssets = [...newAssets, ...currentAssets];
    await writeMetadata(updatedAssets);

    return NextResponse.json({ success: true, assets: newAssets });
  } catch (error) {
    console.error("POST upload error:", error);
    return NextResponse.json({ error: "Failed to upload files" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json() as { id?: string };
    if (!id) {
      return NextResponse.json({ error: "Missing asset ID" }, { status: 400 });
    }

    const currentAssets = await readMetadata();
    const assetToDelete = currentAssets.find((a) => a.id === id);

    if (!assetToDelete) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const filePath = path.join(UPLOAD_DIR, assetToDelete.filename);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.warn(`File already deleted or inaccessible: ${filePath}`, err);
    }

    const updatedAssets = currentAssets.filter((a) => a.id !== id);
    await writeMetadata(updatedAssets);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE asset error:", error);
    return NextResponse.json({ error: "Failed to delete asset" }, { status: 500 });
  }
}
