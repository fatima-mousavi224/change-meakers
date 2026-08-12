"use client";

import ProfileCard from "@/app/(admin-dashboard)/admin/_components/ProfileCard";
import { User } from "@prisma/client";
import Image from "next/image";

interface SummaryProps {
  numUsers: number;
  numPosts: number;
  numMembers: number;
  numAdmins: number;
  numOpportunities: number;
  currentUser: User | null;
}

export default function Summary({
  numUsers,
  numPosts,
  numMembers,
  numAdmins,
  numOpportunities,
  currentUser,
}: SummaryProps) {
  const summaryData = [
    {
      label: "Posts",
      value: numPosts,
      icon2: "/images/big-graph.svg",
      isDifferent: true,
    },
    {
      label: "Users",
      value: numUsers,
      icon: "/images/Group 41.svg",
      icon2: "/images/Graph.svg",
    },
    {
      label: "Team members",
      value: numMembers,
      icon: "/images/Icon.svg",
    },
    {
      label: "Admin users",
      value: numAdmins,
      icon: "/images/Icon (1).svg",
    },
    {
      label: "Opportunities",
      value: numOpportunities,
      icon: "/images/Icon.svg",
    },
  ];

  return (
    <div>
      <div className="grid xl:grid-cols-5 lg:grid-cols-3 grid-cols-1 gap-5 mb-5">
        {summaryData.map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-[20px] p-4 w-full flex justify-between gap-4 "
          >
            <div className="flex gap-2 items-center">
              {item.icon && (
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={56}
                  height={56}
                  className="flex-shrink-0"
                />
              )}
              <div>
                <h3 className="text-[#A3AED0] text-sm font-medium ">
                  {item.label}
                </h3>
                <p className="font-extrabold text-2xl">{item.value}</p>
              </div>
            </div>
            {item.icon2 && (
              <Image
                src={item.icon2 || ""}
                alt="Graph"
                width={100}
                height={100}
                className="size-20"
              />
            )}
          </div>
        ))}
      </div>
      <div className="mb-20 lg:max-w-md">
        <ProfileCard currentUser={currentUser} />
      </div>
    </div>
  );
}
