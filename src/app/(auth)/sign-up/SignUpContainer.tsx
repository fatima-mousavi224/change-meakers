"use client";

import { User } from "@prisma/client";
import LoginLeftBanner from "../login/LoginLeftBanner";
import SignUpForm from "./SignUpForm";
import VerificationModal from "@/components/verification-modal/VerificationModal";
import { useState } from "react";

interface SignUpContainerProps {
  user: User | null;
}

type UserData = {
  name: string;
  email: string;
  password: string;
  verifyCode: string;
};

export default function SignUpContainer({ user }: SignUpContainerProps) {
  console.log(user);
  // modal states
  const [open, setOpen] = useState(false);
  const handleCloseModal = () => setOpen(false);
  const handleOpenModal = () => setOpen(true);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    verifyCode: "",
  });

  const handleSetUserData = (data: UserData) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  return (
    <div className="flex gap-[30px] h-screen">
      <LoginLeftBanner className="w-1/2 hidden lg:block" />
      <SignUpForm
        className="w-full lg:w-1/2"
        user={user}
        handleOpenModal={handleOpenModal}
        handleSetUserData={handleSetUserData}
      />
      <VerificationModal
        handleCloseModal={handleCloseModal}
        open={open}
        userData={userData}
        user={user}
      />
    </div>
  );
}
