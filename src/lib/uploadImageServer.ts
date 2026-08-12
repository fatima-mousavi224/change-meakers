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

export async function saveUploadedImage(
  file: File,
  folder = "uploads"
): Promise<string> {
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

  const safeFolder = sanitizeFolder(folder);
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", safeFolder);

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, fileName), optimized);

  return `/uploads/${safeFolder}/${fileName}`;
}
