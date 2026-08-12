"use client";

import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface ToggleAdminBtnProps {
  user: User;
  toggleAdminRole: (
    userId: string
  ) => Promise<{ success: boolean; message: string }>;
}

export default function ToggleAdminBtn({
  user,
  toggleAdminRole,
}: ToggleAdminBtnProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const result = await toggleAdminRole(user.id);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error toggling admin role:", error);
      toast.error("An error occurred while updating the user role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className="block rounded-md bg-primary-50 px-2 py-1 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-50 disabled:cursor-not-allowed disabled:opacity-70 "
    >
      {isLoading
        ? "Updating..."
        : user.role === "ADMIN"
        ? "Remove Admin"
        : "Make Admin"}
    </button>
  );
}
