// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";
// import { withAuth } from "next-auth/middleware";
// const publicPaths = [
//   "/",
//   "/updates",
//   "/donate",
//   "/about",
//   "/mission&impact",
//   "/current-programs",
//   "/contact",
//   "/sign-up",
// ];

// export default withAuth(
//   async function middleware(req) {
//     const { nextUrl } = req;
//     const pathname = nextUrl.pathname;
//     const token = await getToken({ req, secret });

//     console.log("token", token);

//     const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

//     // if (!token && !isPublicPath) {
//     //   return NextResponse.redirect(new URL("/login", req.url));
//     // }
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token,
//     },
//   }
// );
// export const config = {
//   matcher: [
//     "/donate",
//     "/dashboard/:path*",
//     "/admin/:path*",
//     "/profile/:path*",
//     "/api/auth/callback/:path*",
//   ],
// };

// const secret = process.env.NEXTAUTH_SECRET;
