"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function useProjectId() {
  const searchParams = useSearchParams();
  const urlId = searchParams?.get("id");
  const [projectId, setProjectId] = useState<string | null>(null);

  useEffect(() => {
    const id =
      urlId ||
      (typeof window !== "undefined"
        ? localStorage.getItem("projectId")
        : null);

    if (id && typeof window !== "undefined") {
      localStorage.setItem("projectId", id);
    }

    setProjectId(id);
  }, [urlId]);

  return projectId;
}
