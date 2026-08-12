"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTabs } from "../context/TabsContext";

const tabs = [
  { name: "Card Components", pathName: "/card-components" },
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
  const visibleTabs = tabs.filter((tab) => !hiddenTabs.includes(tab.pathName));
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams?.toString();
  const hasQuery = queryString && queryString.length > 0;
  const baseRoute = "/admin/project-and-initiative/new-project";

  return (
    <div className="w-full space-y-3 mb-12">
      <div className="block md:hidden">
        <select
          className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm"
          value={pathname}
          onChange={(e) => {
            window.location.href = e.target.value;
          }}
        >
          {visibleTabs.map((tab) => {
            const fullPathBase = `${baseRoute}${tab.pathName}`;
            const fullPath = hasQuery
              ? `${fullPathBase}?${queryString}`
              : fullPathBase;
            return (
              <option key={tab.name} value={fullPath}>
                {tab.name}
              </option>
            );
          })}
        </select>
      </div>

      <div className="hidden md:flex flex-wrap gap-2 items-center">
        {visibleTabs.map((tab) => {
          const isPathActive = pathname.endsWith(tab.pathName);
          const fullPathBase = `${baseRoute}${tab.pathName}`;
          const fullPath = hasQuery
            ? `${fullPathBase}?${queryString}`
            : fullPathBase;

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
        })}
      </div>
    </div>
  );
}
