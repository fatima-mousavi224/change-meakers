import { cert, getApps, initializeApp, type ServiceAccount } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";

const STORAGE_BUCKET =
  process.env.FIREBASE_STORAGE_BUCKET || "change-makers-bc230.appspot.com";

function initFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountJson) {
    return null;
  }

  const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;

  return initializeApp({
    credential: cert(serviceAccount),
    storageBucket: STORAGE_BUCKET,
  });
}

function sanitizeFolder(folder: string) {
  return folder.replace(/[^a-zA-Z0-9-_/]/g, "") || "uploads";
}

function sanitizeFileName(name: string) {
  return name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "") || "image";
}

export function isFirebaseAdminConfigured() {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
}

export async function uploadBufferToFirebaseStorage(
  buffer: Buffer,
  folder: string,
  originalName: string,
  contentType: string
): Promise<string> {
  if (!initFirebaseAdmin()) {
    throw new Error("Firebase admin is not configured on the server.");
  }

  const safeFolder = sanitizeFolder(folder);
  const objectPath = `postImages/${safeFolder}/${Date.now()}-${sanitizeFileName(originalName)}`;
  const bucket = getStorage().bucket(STORAGE_BUCKET);
  const file = bucket.file(objectPath);

  await file.save(buffer, {
    metadata: {
      contentType,
      cacheControl: "public, max-age=31536000, immutable",
    },
    resumable: false,
  });

  try {
    await file.makePublic();
  } catch {
    // Bucket may already serve public objects via rules.
  }

  return `https://storage.googleapis.com/${STORAGE_BUCKET}/${objectPath}`;
}
