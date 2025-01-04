import { getCurrentUser } from "@/utilities/getCurrentUser";
import AdminEditProfile from "./AdminEditProfile";

export default async function AdminProfilePage() {
  const user = await getCurrentUser();
  return (
    <div className="flex items-center justify-center w-full">
      <AdminEditProfile user={user} />
    </div>
  );
}
