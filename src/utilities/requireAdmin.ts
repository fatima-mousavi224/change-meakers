import { NextResponse } from "next/server";
import { getCurrentUser } from "@/utilities/getCurrentUser";

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    return {
      user: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { user, error: null };
}
