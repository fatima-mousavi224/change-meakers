import { compressImageForApiFallback } from "./compressImageClient";

export async function uploadImageViaApi(
  file: File,
  folder = "uploads"
): Promise<string> {
  const preparedFile = await compressImageForApiFallback(file);

  const formData = new FormData();
  formData.append("file", preparedFile);
  formData.append("folder", folder);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 413) {
      throw new Error(
        "This photo is too large for the server upload fallback. Try again — the admin panel should upload directly to cloud storage."
      );
    }

    const serverError = typeof data.error === "string" ? data.error : "";
    if (serverError.includes("ENOENT") || serverError.includes("mkdir")) {
      throw new Error(
        "Could not save the image on the server. The admin panel should upload directly to cloud storage — refresh the page and try again."
      );
    }

    throw new Error(serverError || "Failed to upload image");
  }

  return data.url as string;
}
