import { getCurrentUser } from "@/utilities/getCurrentUser";
import EditProfile from "./_components/EditProfile";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  return (
    <div className="flex items-center justify-center w-full">
      <EditProfile user={user} />
    </div>
  );
}
