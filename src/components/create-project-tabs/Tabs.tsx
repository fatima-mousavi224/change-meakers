"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState } from "react";

const tabs = [
  { name: "Card Components", href: "/card-components" },
  { name: "Hero", href: "/hero" },
  { name: "Status & Icon", href: "/status-icon" },
  { name: "Vission & Goal", href: "/vission-goal" },
  { name: "About Program", href: "/about-program" },
  { name: "Voice Calssroom", href: "/voice-classroom" },
  { name: "Media Block", href: "/media-block" },
  { name: "Offer", href: "/offer" },
  { name: "Team", href: "/team" },
  { name: "Students", href: "/students" },
  { name: "Quotation", href: "/quotation" },
  { name: "Photo Album", href: "/photo-album" },
  { name: "News Letter", href: "/news-letter" },
  { name: "Live Moments", href: "/live-moments" },
  { name: "Global Goals", href: "/global-goals" },
  { name: "Related Links", href: "/related-links" },
  { name: "Finalcall & Navigation", href: "/finalcall-and-navigation" },
];

export default function Tabs() {
  const pathname = usePathname();
  const baseRoute = "/admin/project-and-initiative/new-project/";
  const [selectedTab, setSelectedTab] = useState("");

  return (
    <div className="w-full space-y-3 mb-12">
      {/* Mobile: Dropdown */}
      <div className="block md:hidden">
        <select
          className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
          value={pathname}
          onChange={(e) => (window.location.href = e.target.value)}
        >
          {tabs.map((tab) => {
            const fullPath = `${baseRoute}${tab.href.replace(/^\/+/, "")}`;
            return (
              <option key={tab.name} value={fullPath}>
                {tab.name}
              </option>
            );
          })}
        </select>
      </div>

      {/* Desktop: Horizontal Tabs */}
      <div className="hidden md:flex flex-wrap gap-2 items-center">
        {tabs.map((tab) => {
          const fullPath = `${baseRoute}${tab.href.replace(/^\/+/, "")}`;
          const isActive = pathname.startsWith(fullPath);

          return (
            <Link
              key={tab.name}
              href={fullPath}
              className={clsx(
                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                isActive
                  ? "bg-white border-blue-500 text-blue-600 shadow"
                  : "bg-amber-50 border border-amber-400 text-gray-600 hover:bg-white hover:text-black"
              )}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
