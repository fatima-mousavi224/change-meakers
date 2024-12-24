import { User } from "@prisma/client";
import LoginForm from "./LoginForm";
import LoginLeftBanner from "./LoginLeftBanner";

export default function LoginContainer({ user }: { user: User | null }) {
  return (
    <div className="flex gap-[30px] h-screen relative">
      <LoginLeftBanner className="w-1/2 hidden lg:block" />
      <LoginForm className="w-full lg:w-1/2" user={user} />
    </div>
  );
}
