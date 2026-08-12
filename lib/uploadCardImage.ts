import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";

import firebaseApp from "./firebase";
import { uploadImageViaApi } from "./uploadImageViaApi";

const storage = getStorage(firebaseApp);

function shouldUseLocalFallback(error: unknown) {
  if (!error || typeof error !== "object") return true;

  const code = "code" in error ? String(error.code) : "";
  return code.startsWith("storage/") || code.length === 0;
}

export async function uploadCardImage(file: File): Promise<string> {
  try {
    const storageRef = ref(
      storage,
      `card-images/${Date.now()}-${file.name.replace(/\s+/g, "-")}`
    );
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    if (!shouldUseLocalFallback(error)) {
      throw error;
    }

    console.warn("Firebase upload unavailable, saving image locally instead.");
    return uploadImageViaApi(file, "card-images");
  }
}
