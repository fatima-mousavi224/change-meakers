import Image from "next/image";
import person from "../../../../../public/images/profile.jpg";
import { User } from "@prisma/client";

export default function ProfileCard({
  currentUser,
}: {
  currentUser: User | null;
}) {
  console.log("currentUser herehhher", currentUser);

  return (
    <div className="flex flex-col divide-y divide-gray-200 rounded-[20px] bg-white text-center h-full">
      <div className="flex flex-1 flex-col p-8">
        <Image
          alt=""
          src={currentUser?.image || person}
          className="mx-auto size-24 shrink-0 rounded-full"
          width={200}
          height={200}
        />
        <h3 className="mt-6 text-2xl font-bold text-gray-900">
          {currentUser?.name}
        </h3>
        <div className="mt-1 flex gap-1 justify-center items-center text-[#A3AED0]">
          <span>{currentUser?.role}</span>
        </div>
      </div>
    </div>
  );
}
