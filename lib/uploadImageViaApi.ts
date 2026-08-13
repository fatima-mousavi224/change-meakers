import { compressImageForUpload } from "./compressImageClient";

export async function uploadImageViaApi(
  file: File,
  folder = "uploads"
): Promise<string> {
  const preparedFile = await compressImageForUpload(file);

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
        "This photo is too large to upload. Try a smaller image or save it as JPG before uploading."
      );
    }

    throw new Error(data.error || "Failed to upload image");
  }

  return data.url as string;
}
