import AnimatedDonateButton from "@/components/common/AnimatedDonateButton";
import SocialIconButton from "@/components/common/SocialIconButton";
import { socialLinks } from "@/constant/socialLinks";
import { mobileNavigation } from "@/lib/data";
import { isNavLinkActive } from "@/utilities/isNavLinkActive";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { User } from "@prisma/client";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import NavMenuLink from "./NavMenuLink";

interface Props {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  navigation: Array<{ name: string; href: string; current?: boolean }>;
  importantButtons: Array<{ name: string; href: string }>;
  user: User | null;
}

export default function MobileSidebar({
  sidebarOpen,
  setSidebarOpen,
}: Props) {
  const pathName = usePathname();

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <Transition.Root show={sidebarOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/50" />
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
            <Dialog.Panel className="relative flex h-full w-full max-w-[300px] flex-col bg-white shadow-xl">
              <div className="flex min-h-full flex-col px-6 pb-8 pt-6">
                <button
                  type="button"
                  onClick={closeSidebar}
                  className="mb-10 inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-primary-50 transition-colors duration-200 hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <XMarkIcon className="size-5 stroke-[1.75]" aria-hidden="true" />
                </button>

                <nav className="flex flex-col">
                  {mobileNavigation.map((item) => (
                    <NavMenuLink
                      key={item.name}
                      href={item.href}
                      label={item.name}
                      active={isNavLinkActive(pathName, item.href)}
                      onClick={closeSidebar}
                      variant="mobile"
                    />
                  ))}
                </nav>

                <div className="mt-auto pt-12">
                  <div className="border-t border-gray-200 pt-6">
                    <AnimatedDonateButton fullWidth onClick={closeSidebar} />
                  </div>

                  <div className="mt-6 flex items-center justify-center gap-1.5">
                    {socialLinks.map(({ href, label, Icon }) => (
                      <SocialIconButton
                        key={label}
                        href={href}
                        label={label}
                        Icon={Icon}
                      />
                    ))}
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
