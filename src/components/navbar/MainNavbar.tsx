"use client";
import AnimatedDonateButton from "@/components/common/AnimatedDonateButton";
import SocialIconButton from "@/components/common/SocialIconButton";
import SiteContainer from "@/components/common/SiteContainer";
import { socialLinks } from "@/constant/socialLinks";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type { Post, User } from "@/types/database";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import logo from "../../../public/images/logo.jpg";
import { Profile, Search, Setting } from "../icons/Icons";
import SearchResultList from "../search/SearchResult";
import NavMenuLink from "./NavMenuLink";
import { isNavLinkActive } from "@/utilities/isNavLinkActive";

interface Props {
  navigation: Array<{ name: string; href: string; current?: boolean }>;
  importantBtns: Array<{ name: string; href: string }>;
  setSidebarOpen: (open: boolean) => void;
  user: User | null;
  posts: Post[];
}

export default function MainNavBar({
  navigation,
  setSidebarOpen,
  user,
  posts,
}: Props) {
  const params = useSearchParams();
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [searchInitiated, setSearchInitiated] = useState(false);
  const pathName = usePathname();

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
    if (searchParam === "c") {
      setSearchResults([]);
    }
  }, [params]);

  const handleSearchClick = () => {
    router.push("?search=open");
  };

  const largeScreenSearchClick = () => {
    router.push("?search=o");
  };

  return (
    <nav className="w-full bg-white" id="#one">
      <SiteContainer>
        {/* Top row: logo | search | donate */}
        <div className="border-b border-gray-200">
          <div className="flex h-[72px] items-center gap-4 lg:gap-6">
            <div className="flex min-w-0 flex-1 items-center gap-4 lg:gap-6">
              <Link href="/" className="flex shrink-0 items-center gap-3">
                <div className="size-12 shrink-0 overflow-hidden rounded-full sm:size-14">
                  <Image
                    src={logo}
                    height={800}
                    width={800}
                    alt="Change Makers Logo"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="hidden text-nowrap text-sm font-semibold text-primary-50 sm:block">
                  Change Makers of the World
                </p>
              </Link>

              <div className="relative hidden lg:block">
                <div
                  className="w-[492px] shrink-0"
                  onClick={largeScreenSearchClick}
                >
                  <div className="relative">
                    <MagnifyingGlassIcon
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      name="search"
                      type="search"
                      placeholder="Search"
                      onChange={(e) => handleSearch(e.target.value)}
                      className="block w-full rounded-[10px] border border-[#F2F2F2] bg-white py-2.5 pl-11 pr-4 text-[14px] leading-[20px] text-gray-700 placeholder:text-gray-400 focus:border-primary-50 focus:outline-none focus:ring-1 focus:ring-primary-50"
                    />
                  </div>
                </div>

                {searchResults.length > 0 && params.get("search") === "o" && (
                  <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-[492px] rounded-md bg-light_gray p-4 text-primary-50 shadow-lg">
                    <SearchResultList searchResults={searchResults} />
                  </div>
                )}
                {searchResults.length === 0 &&
                  searchInitiated &&
                  params.get("search") === "o" && (
                    <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-[492px] rounded-md bg-light_gray p-4 text-primary-50 shadow-lg">
                      No post found!
                    </div>
                  )}
              </div>
            </div>

            {params.get("search") === "o" && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => router.push("?search=c")}
                aria-hidden="true"
              />
            )}

            <div className="ml-auto flex shrink-0 items-center gap-2">
              <div className="flex items-center gap-2 lg:hidden">
                <button
                  onClick={handleSearchClick}
                  className="flex size-[34px] items-center justify-center rounded-lg bg-light_gray sm:size-[34px]"
                  aria-label="Search"
                >
                  <Search className="size-4" />
                </button>
                {user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex size-[34px] items-center justify-center rounded-lg bg-light_gray"
                    aria-label="Admin dashboard"
                  >
                    <Profile className="size-4" />
                  </Link>
                )}
                <button
                  className="flex size-[34px] items-center justify-center rounded-lg bg-light_gray"
                  aria-label="Open menu"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Setting className="size-3" />
                </button>
              </div>

              <AnimatedDonateButton className="hidden rounded-[12px] lg:inline-flex" />
            </div>
          </div>
        </div>

        {/* Bottom row: nav links | social icons */}
        <div className="hidden border-b border-gray-200 py-3 lg:block">
          <div className="flex items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-1 -mb-px">
              {navigation.map((item) => (
                <NavMenuLink
                  key={item.name}
                  href={item.href}
                  label={item.name}
                  active={isNavLinkActive(pathName, item.href)}
                  variant="desktop"
                />
              ))}
            </div>

            <div className="flex shrink-0 items-center gap-3">
              {socialLinks.map(({ href, label, src }) => (
                <SocialIconButton
                  key={label}
                  href={href}
                  label={label}
                  src={src}
                />
              ))}
              {user !== null && (
                <Link
                  href="/admin"
                  className="rounded-xl bg-gray-100 px-3 py-2 text-[14px] font-medium leading-[20px] text-primary-50 transition-colors hover:bg-gray-200"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      </SiteContainer>
    </nav>
  );
}
