/** Vercel API routes reject request bodies larger than ~4.5MB. */
const VERCEL_API_BODY_LIMIT = 4 * 1024 * 1024;
const MAX_DIMENSION = 3840;
const WEBP_QUALITY = 0.92;

function extensionMimeType(fileName: string): string | null {
  const extension = fileName.split(".").pop()?.toLowerCase();

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
      return null;
  }
}

function shouldSkipCompression(file: File) {
  const mime = file.type || extensionMimeType(file.name) || "";

  return (
    file.size <= VERCEL_API_BODY_LIMIT &&
    (mime === "image/jpeg" ||
      mime === "image/webp" ||
      mime === "image/png" ||
      mime === "image/gif")
  );
}

async function compressWithCanvas(file: File): Promise<File> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () =>
        reject(
          new Error(
            "Could not read this image. Save it as JPG or PNG and try again."
          )
        );
      element.src = objectUrl;
    });

    const longestSide = Math.max(image.naturalWidth, image.naturalHeight);
    const scale =
      longestSide > MAX_DIMENSION ? MAX_DIMENSION / longestSide : 1;
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not prepare image for upload.");
    }

    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (!result) {
            reject(new Error("Could not compress image for upload."));
            return;
          }

          resolve(result);
        },
        "image/webp",
        WEBP_QUALITY
      );
    });

    const baseName = file.name.replace(/\.[^.]+$/, "") || "upload";

    return new File([blob], `${baseName}.webp`, {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/** Primary admin uploads: keep the original file (Firebase has no app size cap). */
export async function compressImageForUpload(file: File): Promise<File> {
  return file;
}

/** Only used when Firebase fails and the file must go through /api/upload. */
export async function compressImageForApiFallback(file: File): Promise<File> {
  if (typeof window === "undefined") {
    return file;
  }

  if (shouldSkipCompression(file)) {
    return file;
  }

  return compressWithCanvas(file);
}
