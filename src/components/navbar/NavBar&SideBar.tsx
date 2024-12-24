"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  TransitionChild,
} from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { User } from "@prisma/client";
import { ArrowLeft, Home, LogOut, UserRoundPen } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaRegListAlt } from "react-icons/fa";
import { LuUserCog } from "react-icons/lu";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { TbHeartCheck } from "react-icons/tb";

const navigation = [
  { name: "Home", href: "/admin", icon: Home },
  { name: "Manage Posts", href: "/admin/manage-posts", icon: FaRegListAlt },
  {
    name: "Team Members",
    href: "/admin/manage-team-members",
    icon: LuUserCog,
  },
  {
    name: "Admins",
    href: "/admin/manage-admins",
    icon: MdOutlineAdminPanelSettings,
  },
  {
    name: "Donations",
    href: "/admin/donations",
    icon: TbHeartCheck,
  },
  {
    name: "Account",
    href: "/admin/profile",
    icon: UserRoundPen,
  },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

interface SidebarProps {
  currentUser: User | null;
  children: React.ReactNode;
}

export default function NavBarAndSidebar({
  currentUser,
  children,
}: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <div>
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-50 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="-m-2.5 p-2.5"
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="h-6 w-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                <div className=" flex gap-2.5 items-center border-b-2 border-b-[#F4F7FE] p-4">
                  <Link href="/" className="flex h-16 shrink-0 items-center">
                    <Image
                      alt="Change Makers of the world Logo"
                      src="/images/logo.jpg"
                      className="h-12 w-auto rounded-full "
                      width={50}
                      height={50}
                    />
                  </Link>
                  <div className="text-primary-50">
                    <h2 className="text-xl font-bold ">Change Makers</h2>
                    <p className="text-xs font-medium ">Admin Dashboard</p>
                  </div>
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li
                          key={item.name}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <Link
                            href={item.href}
                            className={classNames(
                              pathname === item.href
                                ? "bg-gradient-to-r from-[#134C83] to-[#4497E8] text-white fill-white"
                                : "text-paragraph_color hover:text-paragraph_color/80 ",
                              "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                            )}
                          >
                            <item.icon
                              aria-hidden="true"
                              className={classNames(
                                pathname === item.href
                                  ? "text-white"
                                  : "text-paragraph_color",
                                "h-6 w-6 shrink-0"
                              )}
                            />
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto flex flex-col space-y-1">
                      <li>
                        <Link
                          href={"/"}
                          className="-m-2.5 mt-2  p-2 font-semibold text-primary-50 items-center  gap-1 text-sm flex lg:hidden"
                        >
                          <ArrowLeft className="size-5" /> Back to Website
                        </Link>
                      </li>
                      <li
                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-paragraph_color  hover:text-paragraph_color/80  hover:cursor-pointer"
                        onClick={() => signOut()}
                      >
                        <LogOut
                          aria-hidden="true"
                          className="h-6 w-6 shrink-0 text-paragraph_color group-hover:text-paragraph_color/80"
                        />
                        Log out
                      </li>
                    </div>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
            <div className=" flex gap-2.5 items-center border-b-2 border-b-[#F4F7FE] p-4">
              <Link href="/" className="flex h-16 shrink-0 items-center">
                <Image
                  alt="Change Makers of the world Logo"
                  src="/images/logo.jpg"
                  className="h-12 w-auto rounded-full "
                  width={50}
                  height={50}
                />
              </Link>
              <div className="text-primary-50">
                <h2 className="text-lg sm:text-xl font-bold ">Change Makers</h2>
                <p className="text-xs font-medium ">Admin Dashboard</p>
              </div>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            pathname === item.href
                              ? "bg-gradient-to-r from-[#134C83] to-[#4497E8] text-white "
                              : "text-paragraph_color hover:text-paragraph_color/80",
                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              pathname === item.href
                                ? "text-white"
                                : "text-paragraph_color group-hover:text-paragraph_color/80",
                              "h-6 w-6 shrink-0"
                            )}
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>

                <li
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-paragraph_color  hover:text-paragraph_color/80 mt-auto hover:cursor-pointer"
                  onClick={() => signOut()}
                >
                  <LogOut
                    aria-hidden="true"
                    className="h-6 w-6 shrink-0 text-paragraph_color group-hover:text-paragraph_color/80"
                  />
                  Log out
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200  px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 bg-white">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>

            {/* Separator */}
            <div
              aria-hidden="true"
              className="h-6 w-px bg-gray-900/10 lg:hidden"
            />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <form
                action="#"
                method="GET"
                className="relative flex flex-1 opacity-0"
              >
                <label htmlFor="search-field" className="sr-only">
                  Search
                </label>
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
                />
              </form>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <Link
                  href={"/"}
                  className="-m-2.5  p-2 text-primary-100 lg:block hidden bg-[#F3F4F6] hover:bg-[#F3F4F6]/50 rounded-[10px] font-bold text-xs"
                >
                  Back to Website
                </Link>

                {/* Separator */}
                <div
                  aria-hidden="true"
                  className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
                />

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>

                    {currentUser?.image ? (
                      <Image
                        src={currentUser?.image}
                        alt="profile"
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-900"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-900">
                        {currentUser?.name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                    )}
                    <span className=" flex items-center">
                      <span
                        aria-hidden="true"
                        className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                      >
                        {currentUser?.name}
                      </span>
                    </span>
                  </MenuButton>
                </Menu>
              </div>
            </div>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}
