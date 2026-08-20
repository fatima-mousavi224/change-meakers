import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";

import firebaseApp from "./firebase";
import { compressImageForApiFallback } from "./compressImageClient";
import { uploadImageViaApi } from "./uploadImageViaApi";

function sanitizeFileName(name: string) {
  return name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "") || "image";
}

async function uploadViaFirebase(file: File, folder: string): Promise<string> {
  const storage = getStorage(firebaseApp);
  const storageRef = ref(
    storage,
    `${folder}/${Date.now()}-${sanitizeFileName(file.name)}`
  );
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function uploadCardImage(
  file: File,
  folder = "card-images"
): Promise<string> {
  if (typeof window !== "undefined") {
    try {
      return await uploadViaFirebase(file, folder);
    } catch (error) {
      console.warn(
        "Firebase upload unavailable, saving image via /api/upload instead.",
        error
      );
    }
  }

  const preparedFile = await compressImageForApiFallback(file);
  return uploadImageViaApi(preparedFile, folder);
}
