import LoginLeftBanner from "../login/LoginLeftBanner";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function SignUpContainer() {
  return (
    <div className="flex gap-[30px] h-screen">
      <LoginLeftBanner className="w-1/2 hidden lg:block" />
      <ForgotPasswordForm className="w-full lg:w-1/2" />
    </div>
  );
}
