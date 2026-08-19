import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";

import firebaseApp from "./firebase";
import { uploadImageViaApi } from "./uploadImageViaApi";

const USE_FIREBASE_UPLOAD =
  process.env.NEXT_PUBLIC_USE_FIREBASE_UPLOAD === "true";

function shouldUseLocalFallback(error: unknown) {
  if (!error || typeof error !== "object") return true;

  const code = "code" in error ? String(error.code) : "";
  return code.startsWith("storage/") || code.length === 0;
}

async function uploadViaFirebase(file: File): Promise<string> {
  const storage = getStorage(firebaseApp);
  const storageRef = ref(
    storage,
    `card-images/${Date.now()}-${file.name.replace(/\s+/g, "-")}`
  );
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function uploadCardImage(file: File): Promise<string> {
  if (USE_FIREBASE_UPLOAD) {
    try {
      return await uploadViaFirebase(file);
    } catch (error) {
      if (!shouldUseLocalFallback(error)) {
        throw error;
      }

      console.warn(
        "Firebase upload unavailable, saving image via /api/upload instead."
      );
    }
  }

  return uploadImageViaApi(file, "card-images");
}
