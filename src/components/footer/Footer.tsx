import SiteContainer from "@/components/common/SiteContainer";
import FooterSocialLinks from "@/components/footer/FooterSocialLinks";
import {
  FOOTER_COPYRIGHT_START_YEAR,
  FOOTER_NAV_LINKS,
} from "@/constant/footerNavLinks";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/logo.jpg";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-10 bg-[#F5F5F5]">
      <SiteContainer className="py-8 lg:py-10">
        <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:items-center">
          <Link href="/" className="flex items-center gap-3 sm:gap-4">
            <Image
              src={logo}
              alt="Change Makers of the World logo"
              width={64}
              height={64}
              className="size-14 rounded-full object-cover sm:size-[60px]"
            />
            <span className="font-plusJakartaSans text-base font-bold text-[#252525] sm:text-[17px]">
              Change Makers of the World
            </span>
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 lg:justify-end lg:gap-x-8">
            {FOOTER_NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="font-plusJakartaSans text-[14px] font-medium text-[#252525] transition-colors duration-200 hover:text-primary-50 sm:text-[15px]"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </SiteContainer>

      <div className="w-full border-b border-[#DDDDDD]" aria-hidden="true" />

      <SiteContainer className="py-8 lg:py-10">
        <div className="flex flex-col items-center justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:justify-start">
            <span className="font-plusJakartaSans text-[15px] font-semibold text-[#252525] sm:text-base">
              Follow Us
            </span>
            <FooterSocialLinks />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center font-plusJakartaSans text-[13px] text-[#717171] sm:text-[14px] lg:justify-end">
            <span>{`Copyright © ${FOOTER_COPYRIGHT_START_YEAR}—${currentYear} Change Makers of the World`}</span>
            <Link
              href="/privacy-policy"
              className="transition-colors duration-200 hover:text-primary-50"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </SiteContainer>
    </footer>
  );
}
