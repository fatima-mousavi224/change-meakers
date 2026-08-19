"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { buildUpdateDetailHref } from "@/utilities/updateDetailHref";

export function useUpdateDetailHref(
  post: { id: string; shortId?: string | null },
) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return useMemo(() => {
    const query = searchParams.toString();
    const returnPath = query ? `${pathname}?${query}` : pathname;
    const skipReturnPath =
      pathname === "/updates" || pathname.startsWith("/updates/");

    return buildUpdateDetailHref(
      post,
      skipReturnPath ? undefined : returnPath,
    );
  }, [pathname, post, searchParams]);
}
