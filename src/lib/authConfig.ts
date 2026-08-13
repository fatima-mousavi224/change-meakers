export const authSecret = process.env.NEXTAUTH_SECRET;

/** Must match how NextAuth names cookies in production (Vercel/https). */
export const useSecureAuthCookies =
  process.env.NEXTAUTH_URL?.startsWith("https://") ??
  process.env.VERCEL === "1";

export function getTokenRole(token: {
  role?: string;
  user?: { role?: string };
}) {
  return token.role ?? token.user?.role;
}
