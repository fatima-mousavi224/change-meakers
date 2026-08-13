import { getCurrentUser } from "@/utilities/getCurrentUser";
import { Metadata } from "next";
import LoginContainer from "./LoginContainer";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Log In",
  description: "Login in to your account",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { callbackUrl?: string };
}) {
  const currentUser = await getCurrentUser();
  const callbackUrl = searchParams?.callbackUrl;
  const adminDestination =
    callbackUrl && callbackUrl.startsWith("/admin") ? callbackUrl : "/admin";

  if (currentUser && currentUser.role === "ADMIN") redirect(adminDestination);
  if (currentUser && currentUser.role === "USER") redirect("/dashboard");

  return (
    <div>
      <LoginContainer user={currentUser} />
    </div>
  );
}
