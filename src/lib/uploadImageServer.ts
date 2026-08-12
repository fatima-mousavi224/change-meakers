import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

import sharp from "sharp";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function sanitizeFolder(folder: string) {
  return folder.replace(/[^a-zA-Z0-9-_]/g, "") || "uploads";
}

async function optimizeImage(file: File) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File exceeds 10MB limit");
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Invalid file type. Use JPG, PNG, WEBP, or GIF.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const optimized = await sharp(buffer)
    .rotate()
    .resize({
      width: 1920,
      height: 1920,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toBuffer();

  return optimized;
}

async function saveToBlob(
  optimized: Buffer,
  safeFolder: string,
  fileName: string
): Promise<string> {
  const blob = await put(`${safeFolder}/${fileName}`, optimized, {
    access: "public",
    contentType: "image/webp",
    addRandomSuffix: false,
  });

  return blob.url;
}

async function saveToLocalDisk(
  optimized: Buffer,
  safeFolder: string,
  fileName: string
): Promise<string> {
  const uploadDir = path.join(process.cwd(), "public", "uploads", safeFolder);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), optimized);

  return `/uploads/${safeFolder}/${fileName}`;
}

export async function saveUploadedImage(
  file: File,
  folder = "uploads"
): Promise<string> {
  const optimized = await optimizeImage(file);
  const safeFolder = sanitizeFolder(folder);
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return saveToBlob(optimized, safeFolder, fileName);
  }

  return saveToLocalDisk(optimized, safeFolder, fileName);
}
