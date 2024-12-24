import { Metadata } from "next";
import ForgotPasswordContainer from "./ForgotPasswordContainer";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Forgot password to your account",
};

export default function LoginPage() {
  return (
    <div>
      <ForgotPasswordContainer />
    </div>
  );
}
