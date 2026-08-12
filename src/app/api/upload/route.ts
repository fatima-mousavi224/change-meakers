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
    const message =
      err instanceof Error ? err.message : "Failed to upload image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
