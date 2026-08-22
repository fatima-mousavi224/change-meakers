import { compressImageForApiFallback } from "./compressImageClient";
import { uploadImageViaApi } from "./uploadImageViaApi";

/** Upload an admin image through /api/upload (Vercel Blob in production). */
export async function uploadCardImage(
  file: File,
  folder = "card-images"
): Promise<string> {
  const preparedFile =
    typeof window !== "undefined"
      ? await compressImageForApiFallback(file)
      : file;

  return uploadImageViaApi(preparedFile, folder);
}
