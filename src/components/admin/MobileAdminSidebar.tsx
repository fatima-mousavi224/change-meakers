import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

import { FaRegListAlt } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { LuUserCog } from "react-icons/lu";
import {
  MdOutlinePersonAddAlt1,
  MdOutlinePostAdd,
  MdOutlineAdminPanelSettings,
} from "react-icons/md";

const menuItems = [
  { id: 1, label: "Home", icon: IoHomeOutline, link: "/admin" },
  {
    id: 2,
    label: "Add a post",
    icon: MdOutlinePostAdd,
    link: "/admin/add-post",
  },
  {
    id: 3,
    label: "Manage posts",
    icon: FaRegListAlt,
    link: "/admin/manage-posts",
  },
  {
    id: 4,
    label: "Add team members",
    icon: MdOutlinePersonAddAlt1,
    link: "/admin/add-team-members",
  },
  {
    id: 5,
    label: "Manage team members",
    icon: LuUserCog,
    link: "/admin/manage-team-members",
  },
  {
    id: 6,
    label: "Add new admin",
    icon: MdOutlineAdminPanelSettings,
    link: "/admin/add-new-admin",
  },
];
export default function MobileAdminSidebar() {
  const [expanded, setExpanded] = useState(false);
  const pathName = usePathname();
  const windowWidth = useRef(0);
  const resizeTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleResize = () => {
      windowWidth.current = window.innerWidth;
      setExpanded(false);
    };

    handleResize();

    const handleResizeWithTimeout = () => {
      clearTimeout(resizeTimeout.current);
      resizeTimeout.current = setTimeout(handleResize, 200);
    };

    window.addEventListener("resize", handleResizeWithTimeout);

    return () => {
      clearTimeout(resizeTimeout.current);
      window.removeEventListener("resize", handleResizeWithTimeout);
    };
  }, []);

  const handleSelectItem = () => {
    setExpanded(!expanded);
  };

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="flex">
      {expanded && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10">
          <div className="fixed z-20 right-0 p-1" onClick={toggleSidebar}>
            {expanded && <FaXmark className="text-xl text-white" />}
          </div>
        </div>
      )}
      <div
        className={`flex-col overflow-y-auto ${
          expanded ? "w-72 flex z-50" : "w-0 hidden"
        } items-center shadow-lg bg-slate-200 transition-all duration-300 ${
          windowWidth.current < 1024 ? "fixed top-0 left-0 h-screen" : ""
        }`}
      >
        <div className="w-1/2 flex flex-col items-center gap-10 px-4">
          <div className="flex items-center justify-center relative pt-7">
            <span
              onClick={toggleSidebar}
              className={`absolute ${
                expanded ? "-right-[1.2rem]" : "-right-1"
              } text-3xl top-2 cursor-pointer`}
            ></span>
          </div>
          {menuItems.map((item) => (
            <Link href={item.link} key={item.id}>
              <div
                className={`flex ${
                  expanded
                    ? "w-60 justify-start items-center gap-2"
                    : "w-16 justify-center"
                } p-2 rounded-md ${
                  pathName === item.link
                    ? "bg-slate-100  hover:bg-none"
                    : "hover:bg-slate-400 hover:text-white"
                }`}
                onClick={() => handleSelectItem}
              >
                <div
                  className={`${
                    !expanded && "text-center flex justify-center items-center"
                  }`}
                >
                  <item.icon className="text-2xl" />
                </div>
                <div className={`${expanded ? "block" : "hidden"}`}>
                  {item.label}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {!expanded && (
        <div
          className="absolute top-24 left-4 z-50 text-gray-600 cursor-pointer"
          onClick={toggleSidebar}
        >
          {windowWidth.current < 1024 && <FaBars className="text-xl" />}
        </div>
      )}
    </div>
  );
}
