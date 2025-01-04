"use client";
import Chart from "@/app/(admin-dashboard)/admin/_components/Chart";
import ProfileCard from "@/app/(admin-dashboard)/admin/_components/ProfileCard";
import { PaymentInfo, User } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

interface SummaryProps {
  numUsers: number;
  numPosts: number;
  numMembers: number;
  numAdmins: number;
  donations: PaymentInfo[];
  currentUser: User | null;
}

export default function Summary({
  numUsers,
  numPosts,
  numMembers,
  numAdmins,
  donations,
  currentUser,
}: SummaryProps) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const totalDonations = donations
    .filter(
      (donation) => new Date(donation.createdAt).getFullYear() === selectedYear
    )
    .reduce((total, donation) => total + donation.amount, 0);

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
      value: numAdmins,
      icon: "/images/Icon.svg",
    },
    {
      label: "Admin users",
      value: numMembers,
      icon: "/images/Icon (1).svg",
    },
  ];

  return (
    <div>
      <div className="grid xl:grid-cols-4 lg:grid-cols-2 grid-cols-1 gap-5 mb-5">
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
      <div className="grid w-full grid-cols-3 gap-5 mb-20">
        <div className="col-span-3 lg:col-span-2 h-[300px] bg-white rounded-[20px] p-4 overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-[#A3AED0]">Total Donations</span>{" "}
              <span className="text-[#252525] font-extrabold text-3xl">
                {totalDonations}$
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <select
                className="border-none outline-none focus:outline-none focus:border-none focus:ring-0 text-[#A3AED0] hover:cursor-pointer"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
              <Image
                src={"/images/Vector (6).svg"}
                alt="Graph"
                width={30}
                height={30}
              />
            </div>
          </div>
          <Chart donations={donations} selectedYear={selectedYear} />
        </div>
        <div className="col-span-3 lg:col-span-1 lg:h-[300px]">
          <ProfileCard currentUser={currentUser} />
        </div>
      </div>
    </div>
  );
}
