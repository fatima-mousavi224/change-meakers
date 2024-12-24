import LoginLeftBanner from "../../login/LoginLeftBanner";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetFormContainer({
  token,
}: {
  token: string | null;
}) {
  return (
    <div className="flex gap-[30px] h-screen">
      <LoginLeftBanner className="w-1/2 hidden lg:block" />
      <ResetPasswordForm className="w-full lg:w-1/2" token={token} />
    </div>
  );
}
