"use client";
import { Instagram, Telegram } from "@/icons/Icons";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Post, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import logo from "../../../public/images/logo.jpg";
import { DonateIcon, Profile, Search, Setting } from "../icons/Icons";
import SearchResultList from "../search/SearchResult";

interface Props {
  navigation: Array<{ name: string; href: string; current?: boolean }>;
  importantBtns: Array<{ name: string; href: string }>;
  setSidebarOpen: (open: boolean) => void;
  user: User | null;
  posts: Post[];
}

type item = {
  href: string;
  name: string;
};

export default function MainNavBar({
  navigation,
  importantBtns,
  setSidebarOpen,
  user,
  posts,
}: Props) {
  const [open, setOpen] = useState(false);
  const params = useSearchParams();
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [searchInitiated, setSearchInitiated] = useState(false);

  const handleSearch = async (query: string) => {
    if (query.trim() === "") {
      setSearchResults([]);
      setSearchInitiated(false);
      return;
    }

    setSearchInitiated(true);
    const results = posts.filter((post) =>
      post.title.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(results);
  };

  useEffect(() => {
    const searchParam = params.get("search");
    if (searchParam === "o") {
      setOpen(true);
    } else if (searchParam === "c") {
      setOpen(false);
      setSearchResults([]);
    }
  }, [params]);

  const pathName = usePathname();
  // const dashboardTxt =
  //   user?.role === "ADMIN" ? "Admin Dashboard" : "User Dashboard";

  // const dashboardLink = user?.role === "ADMIN" ? "/admin" : "/dashboard";

  const handleSearchClick = () => {
    if (!open) {
      router.push("?search=open");
    }
  };

  const largeScreenSearchClick = () => {
    if (!open) {
      router.push("?search=o");
    }
  };

  return (
    <nav className="bg-white max-w-screen-2xl sm:px-4 px-2 mx-auto" id="#one">
      <div className="w-full border-b py-2">
        <div className="flex justify-between items-center p-2  h-16 gap-4">
          <div className="flex items-center justify-center sm:gap-4 gap-2">
            <div className="sm:size-14 size-9 flex items-center">
              <Link href="/" className="sm:size-14 size-9">
                <Image
                  src={logo}
                  height={800}
                  width={800}
                  alt="Change Makers Logo"
                />
              </Link>
            </div>
            <p className="text-primary-50 font-semibold sm:text-base text-xs text-nowrap">
              Change Makers of the World
            </p>

            <div className="relative">
              {/* laptop screen search */}
              <div
                className="flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end hidden lg:flex"
                onClick={largeScreenSearchClick}
              >
                <div className="grid w-full max-w-lg grid-cols-1 lg:max-w-xs">
                  <input
                    name="search"
                    type="search"
                    placeholder="Search"
                    onChange={(e) => handleSearch(e.target.value)}
                    className="outline-none border-none focus:outline-none focus:ring-0 w-full bg-transparent text-gray-700 col-start-1 row-start-1 block  rounded-[10px] lg:w-[300px] bg-white py-1.5 pl-10 pr-3 text-base  outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-primary-50 sm:text-sm/6"
                  />
                  <MagnifyingGlassIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400"
                  />
                </div>
              </div>

              {searchResults.length > 0 && params.get("search") === "o" && (
                <div className="absolute left-7 top-16 shadow-lg rounded-md p-4 z-50 bg-[#F2F2F2] text-primary-50 max-w-lg w-[400px] hidden lg:block">
                  <SearchResultList searchResults={searchResults} />
                </div>
              )}
              {searchResults.length === 0 &&
                searchInitiated &&
                params.get("search") === "o" && (
                  <div className="absolute left-7 top-16 shadow-lg rounded-md p-4 z-50 text-primary-50 bg-[#F2F2F2]  max-w-lg w-[400px] hidden lg:block">
                    No post found!
                  </div>
                )}
            </div>
            {/* laptop overlay of the seaarch bar */}
            {params.get("search") === "o" && (
              <div
                className="absolute inset-0 "
                onClick={() => {
                  setOpen(false);
                  router.push("?search=c");
                }}
              />
            )}
          </div>
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center gap-2 lg:hidden">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSearchClick}
                  className="text-sm font-bold duration-150 hover:scale-105 bg-[#F2F2F2] rounded-lg sm:p-2 sm:size-[34px] size-[30px] flex items-center justify-center"
                >
                  <Search className="size-4  duration-150 hover:scale-105" />
                </button>
                {user?.role === "ADMIN" && (
                  <Link
                    href={"/admin"}
                    className="text-sm font-bold duration-150 hover:scale-105 bg-[#F2F2F2] rounded-lg p-2 sm:size-[34px] size-[30px] flex items-center justify-center"
                  >
                    <Profile className=" size-4 duration-150 hover:scale-105" />
                  </Link>
                )}
              </div>
              <button
                className="text-sm font-bold duration-150 hover:scale-105 bg-[#F2F2F2] rounded-lg p-2 sm:size-[34px] size-[30px] flex items-center justify-center"
                aria-hidden="true"
                onClick={() => setSidebarOpen(true)}
              >
                <Setting className="size-3 duration-150 hover:scale-105" />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="justify-center hidden lg:flex text-sm px-8 py-2 bg-primary-50 rounded-md text-white duration-300 font-semibold  hover:bg-primary-200 transition-all cursor-pointer">
                {importantBtns.map((item: item, index: number) => (
                  <Link
                    key={index}
                    href={
                      "https://www.gofundme.com/f/HelpAfghanGirlsLearn/donate?attribution_id=undefined&utm_campaign=unknown&utm_medium=customer&utm_source=website_widget"
                    }
                    target="_blank"
                    className="flex items-center gap-2"
                  >
                    {item.name}
                    <DonateIcon />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full border-b py-5 lg:block hidden">
        <div className="items-center justify-between hidden gap-3 px-2 overflow-hidden lg:flex">
          <div className="flex items-center gap-3">
            {/* menu items  */}
            {navigation.map((item, index) => (
              <div key={index} className="">
                <Link
                  href={item.href}
                  className={`${
                    pathName == item.href
                      ? "text-primary-50 border-b-2 border-b-primary-50 px-2 py-1 font-medium text-base"
                      : "hover:text-primary-50 hover:border-b-2 hover:border-b-primary-50 px-2 py-1.5 font-medium transition-colors duration-300 text-base"
                  } `}
                >
                  {item.name}
                </Link>
              </div>
            ))}
          </div>

          <div className="space-x-3 flex items-center justify-center">
            <Link
              href={"https://t.me/cmworld_org"}
              className="text-sm font-bold duration-150 hover:scale-105 bg-[#F2F2F2] rounded-lg p-2"
              aria-hidden="true"
            >
              <Telegram className="w-6 h-6 duration-150 hover:scale-105" />
            </Link>
            <Link
              href={"https://www.instagram.com/cmw.world"}
              className="text-sm font-bold duration-150 hover:scale-105 bg-[#F2F2F2] rounded-lg p-2"
              aria-hidden="true"
            >
              <Instagram className="w-6 h-6 duration-150 hover:scale-105" />
            </Link>
            {user !== null && (
              <Link
                href="/admin"
                className="font-semibold text-sm text-primary-50 duration-150 hover:scale-105 bg-[#F2F2F2] rounded-lg w-full  p-2.5"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
