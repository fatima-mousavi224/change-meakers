import { NextResponse } from "next/server";

import { saveUploadedImage } from "@/lib/uploadImageServer";
import { requireAdmin } from "@/utilities/requireAdmin";

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = (formData.get("folder") as string | null) ?? "uploads";

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const url = await saveUploadedImage(file, folder);

    return NextResponse.json({ url }, { status: 201 });
  } catch (err) {
    console.error("Upload failed:", err);
    let message =
      err instanceof Error ? err.message : "Failed to upload image";

    if (message.includes("Cannot use public access on a private store")) {
      message =
        "Your Vercel Blob store is private, but this site needs a public store for member and content images. In Vercel → Storage, create a new Blob store with Public access, connect it to this project, redeploy, then try again.";
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
