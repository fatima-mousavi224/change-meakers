import { Metadata } from "next";
import SignUpContainer from "./SignUpContainer";
import { getCurrentUser } from "@/utilities/getCurrentUser";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign up to your account",
};

export default async function LoginPage() {
  const currentUser = await getCurrentUser();
  if (currentUser && currentUser.role === "ADMIN") redirect("/admin");
  if (currentUser && currentUser.role === "USER") redirect("/dashboard");

  return (
    <div>
      <SignUpContainer user={currentUser} />
    </div>
  );
}
