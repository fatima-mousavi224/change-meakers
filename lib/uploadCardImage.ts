import { getAuth, signInAnonymously } from "firebase/auth";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import firebaseApp from "./firebase";
import { compressImageForApiFallback } from "./compressImageClient";
import { uploadImageViaApi } from "./uploadImageViaApi";

function sanitizeFileName(name: string) {
  return name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "") || "image";
}

function sanitizeFolder(folder: string) {
  return folder.replace(/[^a-zA-Z0-9-_/]/g, "") || "uploads";
}

function getFirebaseErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") {
    return "Unknown Firebase upload error";
  }

  const code = "code" in error ? String(error.code) : "";
  const message = "message" in error ? String(error.message) : "";

  if (code === "storage/unauthorized") {
    return "Firebase Storage rejected the upload. Anonymous sign-in or storage rules may need to be enabled.";
  }

  return message || code || "Firebase upload failed";
}

async function ensureFirebaseAuth() {
  const auth = getAuth(firebaseApp);

  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
}

async function uploadViaFirebase(file: File, folder: string): Promise<string> {
  await ensureFirebaseAuth();

  const storage = getStorage(firebaseApp);
  const objectPath = `postImages/${sanitizeFolder(folder)}/${Date.now()}-${sanitizeFileName(file.name)}`;
  const storageRef = ref(storage, objectPath);

  await new Promise<void>((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type || undefined,
    });

    uploadTask.on("state_changed", () => undefined, reject, () => resolve());
  });

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
      console.warn("Firebase client upload failed, trying /api/upload instead.", error);

      try {
        const preparedFile = await compressImageForApiFallback(file);
        return await uploadImageViaApi(preparedFile, folder);
      } catch (apiError) {
        throw new Error(
          `${getFirebaseErrorMessage(error)} Server upload also failed: ${
            apiError instanceof Error ? apiError.message : "Unknown error"
          }`
        );
      }
    }
  }

  const preparedFile = await compressImageForApiFallback(file);
  return uploadImageViaApi(preparedFile, folder);
}
