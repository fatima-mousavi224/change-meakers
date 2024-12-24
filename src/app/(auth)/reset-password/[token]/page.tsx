import { Metadata } from "next";
import ResetFormContainer from "./ResetFormContainer";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset password to your account",
};

export default function ResetPasswordPage({
  params,
}: {
  params: { token: string };
}) {
  return (
    <div>
      <ResetFormContainer token={params.token} />
    </div>
  );
}
