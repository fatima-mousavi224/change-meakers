import { getCurrentUser } from "@/utilities/getCurrentUser";
import { Metadata } from "next";
import LoginContainer from "./LoginContainer";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Log In",
  description: "Login in to your account",
};

export default async function LoginPage() {
  const currentUser = await getCurrentUser();
  if (currentUser && currentUser.role === "ADMIN") redirect("/admin");
  if (currentUser && currentUser.role === "USER") redirect("/dashboard");

  console.log("currentUser", currentUser);

  return (
    <div>
      <LoginContainer user={currentUser} />
    </div>
  );
}
