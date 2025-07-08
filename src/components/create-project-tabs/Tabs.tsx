"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTabs } from "../context/TabsContext";

const tabs = [
  {
    name: "Card Components",
    href: "/card-components",
    pathName: "/card-components",
  },
  { name: "Hero", pathName: "/hero" },
  { name: "Status & Icon", pathName: "/status-icon" },
  { name: "Vission & Goal", pathName: "/vission-goal" },
  { name: "About Program", pathName: "/about-program" },
  { name: "Voice Calssroom", pathName: "/voice-classroom" },
  { name: "Media Block", pathName: "/media-block" },
  { name: "Offer", pathName: "/offer" },
  { name: "Team", pathName: "/team" },
  { name: "Students", pathName: "/students" },
  { name: "Quotation", pathName: "/quotation" },
  { name: "Photo Album", pathName: "/photo-album" },
  { name: "News Letter", pathName: "/news-letter" },
  { name: "Live Moments", pathName: "/live-moments" },
  { name: "Global Goals", pathName: "/global-goals" },
  { name: "Related Links", pathName: "/related-links" },
  { name: "Finalcall & Navigation", pathName: "/finalcall-and-navigation" },
];

export default function Tabs() {
  const { hiddenTabs } = useTabs();
  console.log("Hidden Tabs:", hiddenTabs);
  const visibleTabs = tabs.filter(tab => !hiddenTabs.includes(tab.pathName));
  const pathname = usePathname();
  const baseRoute = "/admin/project-and-initiative/new-project/";
  return (
    <div className="w-full space-y-3 mb-12">
      {/* Mobile: Dropdown */}
      <div className="block md:hidden">
        <select
          className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
          value={pathname}
          onChange={(e) => {
            const selectedTab = tabs.find((tab) => tab.name === e.target.value);
            if (selectedTab && selectedTab.href) {
              window.location.href = `${baseRoute}${selectedTab?.href.replace(
                /^\/+/,
                ""
              )}`;
            }
          }}
        >
          {visibleTabs.map((tab) =>
            tab.href ? (
              <option key={tab.name} value={tab.name}>
                {tab.name}
              </option>
            ) : (
              <option key={tab.name} value={tab.name}>
                {tab.name}
              </option>
            )
          )}
        </select>
      </div>

      {/* Desktop: Horizontal Tabs */}
      <div className="hidden md:flex flex-wrap gap-2 items-center">
        {visibleTabs.map((tab) => {
          // Highlight if current path matches tab.pathName
          const isPathActive = pathname.endsWith(tab.pathName);
          if (tab.href) {
            const fullPath = `${baseRoute}${tab.href.replace(/^\/+/, "")}`;
            return (
              <Link
                key={tab.name}
                href={fullPath}
                className={clsx(
                  "px-5 py-2 rounded-full text-sm font-medium border bg-gray-100 text-gray-400",
                  isPathActive &&
                    "!bg-blue-600 border-blue-600 text-white shadow"
                )}
              >
                {tab.name}
              </Link>
            );
             } else {
            return (
              <span
                key={tab.name}
                className={clsx(
                  "px-5 py-2 rounded-full text-sm font-medium border bg-gray-100 text-gray-400 cursor-not-allowed",
                  isPathActive &&
                    "text-gray-900  ring-1 ring-inset ring-gray-400"
                )}
              >
                {tab.name}
              </span>
            );
          } 
        })}
      </div>
    </div>
  );
}
