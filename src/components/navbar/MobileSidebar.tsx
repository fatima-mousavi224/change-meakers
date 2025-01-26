import { Login } from "@/icons/Icons";
import { cn } from "@/utilities/cn";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { User } from "@prisma/client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment } from "react";
import { DonateIcon } from "../icons/Icons";
import logo from "../../../public/images/logo.jpg";

interface Props {
  sidebarOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  setSidebarOpen: (open: boolean) => void;
  navigation: Array<{ name: string; href: string; current?: boolean }>;
  importantButtons: Array<{ name: string; href: string }>;
  user: User | null;
}

type item = {
  [x: string]: any;
  href: string;
  name: string;
};

export default function MobileSidebar({
  sidebarOpen,
  setSidebarOpen,
  navigation,
  user,
}: Props) {
  const pathName = usePathname();
  const router = useRouter();
  const handleSignOut = () => {
    if (user) {
      signOut();
    } else {
      router.push("/login");
    }
  };

  return (
    <Transition.Root show={sidebarOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 lg:hidden"
        onClose={setSidebarOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/80" />
        </Transition.Child>

        <div className="fixed inset-0 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative flex flex-1 w-full max-w-xs mr-16">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 flex justify-center w-16 pt-5 left-full">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      className="w-6 h-6 text-white border-2 border-white rounded-md"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </Transition.Child>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="flex flex-col justify-between px-6 pb-4 overflow-y-auto bg-white grow gap-y-5 ring-1 ring-white/10">
                <div className="flex item-center justify-start flex-col">
                  {user !== null ? (
                    <div className="flex items-center gap-2 h-28 shrink-0 border-b">
                      {user.image ? (
                        <Image
                          height={1200}
                          width={1200}
                          src={user.image}
                          alt={user.name || "User Name"}
                          className="size-[53px] rounded-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center size-[53px] h-[53px] w-[53px] rounded-full bg-gray-200 text-gray-700 font-bold text-lg">
                          {user.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                      )}
                      <div>
                        <p className="text-[16px] font-bold">
                          {user.name ? user.name : ""}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 border-b h-[100px]">
                      <div className="sm:size-13 flex items-center">
                        <Link href="/" className="size-12">
                          <Image
                            src={logo}
                            height={1200}
                            width={1200}
                            alt="Change Makers Logo"
                          />
                        </Link>
                      </div>
                      <p className="text-primary-50 font-semibold text-sm text-nowrap">
                        Change Makers of the World
                      </p>
                    </div>
                  )}
                  <nav className="flex flex-col flex-1 border-b">
                    <ul
                      role="list"
                      className="flex flex-col flex-1 gap-y-7 my-8"
                    >
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item: item, index: number) => (
                            <li key={index}>
                              <Link
                                onClick={() => setSidebarOpen(false)}
                                href={item.href}
                                className={cn(
                                  pathName === item.href
                                    ? "text-primary-200 bg-light_gray font-semibold"
                                    : " hover:text-primary-200 hover:bg-light_gray font-medium",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 transition-colors duration-200 ease-in"
                                )}
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
                <div>
                  <div className="space-y-1 flex flex-col items-start">
                    <div className="flex lg:hidden w-full">
                      <div className="flex items-center justify-center mt-5 w-full">
                        <div className="justify-center lg:hidden flex text-sm px-8 py-2 bg-primary-50 w-full rounded-md text-white duration-300 font-semibold  hover:bg-primary-200 transition-all cursor-pointer">
                          <Link
                            href="https://www.gofundme.com/f/HelpAfghanGirlsLearn/donate?attribution_id=undefined&utm_campaign=unknown&utm_medium=customer&utm_source=website_widget"
                            className="flex items-center gap-2"
                            target="_blank"
                          >
                            Donate
                            <DonateIcon />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
