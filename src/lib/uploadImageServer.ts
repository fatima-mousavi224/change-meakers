import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

import sharp from "sharp";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function sanitizeFolder(folder: string) {
  return folder.replace(/[^a-zA-Z0-9-_]/g, "") || "uploads";
}

function inferMimeType(file: File) {
  if (file.type && file.type !== "application/octet-stream") {
    return file.type;
  }

  const extension = file.name.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    default:
      return file.type || "application/octet-stream";
  }
}

async function optimizeImage(file: File) {
  const mimeType = inferMimeType(file);

  if (!ALLOWED_TYPES.has(mimeType)) {
    throw new Error("Invalid file type. Use JPG, PNG, WEBP, or GIF.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const optimized = await sharp(buffer)
      .rotate()
      .resize({
        width: 3840,
        height: 3840,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 88 })
      .toBuffer();

    return optimized;
  } catch (error) {
    console.error("Image optimization failed:", error);
    throw new Error(
      "Could not process this image. Try saving it as JPG or PNG and upload again."
    );
  }
}

function getBlobAccess(): "public" | "private" {
  return process.env.BLOB_ACCESS === "private" ? "private" : "public";
}

async function saveToBlob(
  optimized: Buffer,
  safeFolder: string,
  fileName: string
): Promise<string> {
  const blob = await put(`${safeFolder}/${fileName}`, optimized, {
    access: getBlobAccess(),
    contentType: "image/webp",
    addRandomSuffix: true,
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
  const safeFolder = sanitizeFolder(folder);
  const mimeType = inferMimeType(file);
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;

  if (!ALLOWED_TYPES.has(mimeType)) {
    throw new Error("Invalid file type. Use JPG, PNG, WEBP, or GIF.");
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const optimized = await optimizeImage(file);
    return saveToBlob(optimized, safeFolder, fileName);
  }

  if (process.env.VERCEL === "1") {
    throw new Error(
      "Image upload is not set up yet. In Vercel → your project → Storage → Create Blob store (Public) → Redeploy production, then try again."
    );
  }

  const optimized = await optimizeImage(file);
  return saveToLocalDisk(optimized, safeFolder, fileName);
}
