import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

import { authSecret, getTokenRole } from "@/lib/authConfig";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    secret: authSecret,
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized: ({ token, req }) => {
        if (!token) {
          return false;
        }

        if (req.nextUrl.pathname.startsWith("/admin")) {
          return (
            getTokenRole(
              token as { role?: string; user?: { role?: string } },
            ) === "ADMIN"
          );
        }

        return true;
      },
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/profile/:path*"],
};
