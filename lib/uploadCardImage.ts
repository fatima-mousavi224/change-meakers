import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebaseApp from "./firebase";

const storage = getStorage(firebaseApp);

export async function uploadCardImage(file: File): Promise<string> {
  const storageRef = ref(storage, `card-images/${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}
