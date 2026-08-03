import SiteContainer from "@/components/common/SiteContainer";
import FooterSocialLinks from "@/components/footer/FooterSocialLinks";
import {
  FOOTER_COPYRIGHT_START_YEAR,
  FOOTER_MOBILE_NAV_LINKS,
  FOOTER_NAV_LINKS,
} from "@/constant/footerNavLinks";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/logo.jpg";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightText = `Copyright © ${FOOTER_COPYRIGHT_START_YEAR}—${currentYear} Change Makers of the World`;

  return (
    <footer className="mt-10 bg-[#F5F5F5]">
      {/* Mobile layout */}
      <div className="lg:hidden">
        <SiteContainer className="px-6 py-10">
          <Link href="/" className="flex flex-col items-center">
            <Image
              src={logo}
              alt="Change Makers of the World logo"
              width={72}
              height={72}
              className="size-[72px] rounded-full object-cover"
            />
            <span className="mt-4 text-center font-plusJakartaSans text-[18px] font-bold leading-snug text-[#252525]">
              Change Makers of the World
            </span>
          </Link>

          <nav className="mt-8 flex flex-col items-center gap-5">
            {FOOTER_MOBILE_NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="font-plusJakartaSans text-[15px] font-medium text-[#717171] transition-colors duration-200 hover:text-primary-50"
              >
                {label}
              </Link>
            ))}
          </nav>
        </SiteContainer>

        <div className="w-full border-b border-[#DDDDDD]" aria-hidden="true" />

        <SiteContainer className="px-6 py-8">
          <FooterSocialLinks className="justify-center gap-3" />
        </SiteContainer>

        <div className="w-full border-b border-[#DDDDDD]" aria-hidden="true" />

        <SiteContainer className="flex flex-col items-center gap-4 px-6 py-8">
          <Link
            href="/privacy-policy"
            className="font-plusJakartaSans text-[14px] font-medium text-[#717171] transition-colors duration-200 hover:text-primary-50"
          >
            Privacy Policy
          </Link>
          <p className="text-center font-plusJakartaSans text-[13px] text-[#717171]">
            {copyrightText}
          </p>
        </SiteContainer>
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:block">
        <SiteContainer className="py-8 lg:py-10">
          <div className="flex flex-row items-center justify-between">
            <Link href="/" className="flex items-center gap-4">
              <Image
                src={logo}
                alt="Change Makers of the World logo"
                width={64}
                height={64}
                className="size-[60px] rounded-full object-cover"
              />
              <span className="font-plusJakartaSans text-[17px] font-bold text-[#252525]">
                Change Makers of the World
              </span>
            </Link>

            <nav className="flex flex-wrap items-center justify-end gap-x-8">
              {FOOTER_NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="font-plusJakartaSans text-[15px] font-medium text-[#252525] transition-colors duration-200 hover:text-primary-50"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </SiteContainer>

        <div className="w-full border-b border-[#DDDDDD]" aria-hidden="true" />

        <SiteContainer className="py-8 lg:py-10">
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-plusJakartaSans text-base font-semibold text-[#252525]">
                Follow Us
              </span>
              <FooterSocialLinks />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-x-4 text-right font-plusJakartaSans text-[14px] text-[#717171]">
              <span>{copyrightText}</span>
              <Link
                href="/privacy-policy"
                className="transition-colors duration-200 hover:text-primary-50"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </SiteContainer>
      </div>
    </footer>
  );
}
