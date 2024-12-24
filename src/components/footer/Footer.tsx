import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/images/logo.jpg";
import {
  Facebook,
  Instagrams,
  Telegrams,
  Twitter,
  Whatsapp,
  Youtube,
} from "@/icons/Icons";

export default function Footer() {
  return (
    <footer className="relative bg-[#F2F2F2] mt-4 lg:py-0 p-4">
      {/*  Logo */}
      <div className="lg:flex-row flex flex-col lg:gap-8 gap-4 justify-between lg:py-8  lg:border-b-2 border-b-0 border-[#BEBEBE] max-w-screen-2xl mx-auto">
        <div className="flex lg:flex-row flex-col items-center sm:space-x-4 space-y-4">
          <Image src={logo} alt="Logo" className="rounded-full w-16 h-16" />
          <span className="lg:text-lg text-sm font-bold mt-2 sm:mt-0">
            Change Makers of the World
          </span>
        </div>
        {/* links */}
        <nav className="flex lg:flex-row text-gray-500  flex-col items-center gap-3 shrink-0 lg:text-[16px] lg:text-sm">
          <Link
            href="/"
            className="hover:text-opacity-80 duration-200 transition-all "
          >
            Home
          </Link>
          <Link
            href="/about"
            className="hover:text-opacity-80 duration-200 transition-all "
          >
            About
          </Link>
          <Link
            href="/mission&impact"
            className="hover:text-opacity-80 duration-200 transition-all "
          >
            Mission & Impact
          </Link>
          <Link
            href="/current-programs"
            className="hover:text-opacity-80 duration-200 transition-all "
          >
            Current Programs
          </Link>

          <Link
            href="/updates"
            className="hover:text-opacity-80 duration-200 transition-all "
          >
            Updates
          </Link>
          <Link
            href="/contact"
            className="hover:text-opacity-80 duration-200 transition-all "
          >
            Contact
          </Link>
          <Link
            href="/donate"
            className="hover:text-opacity-80 duration-200 transition-all"
          >
            Donate
          </Link>
        </nav>
      </div>
      {/* logos */}
      <div className=" flex lg:flex-row flex-col justify-between max-w-screen-2xl mx-auto items-center lg:py-8 py-4">
        <div className="items-center justify-center py-4 lg:py-0  lg:gap-4 gap-1 p-2 flex border-y-2 lg:mb-0 mb-2 lg:border-y-0">
          <h2 className="lg:text-xl text-sm text-black p-1 hidden sm:block">
            FOLLOW US
          </h2>
          <Link
            target="_blank"
            href={"https://www.x.com/cmw_world"}
            className="hover:scale-110 duration-200"
          >
            <Twitter className="size-6" />
          </Link>
          <Link
            target="_blank"
            href={"https://www.instagram.com/cmw.world"}
            className="hover:scale-110 duration-200 "
          >
            <Instagrams className="size-6" />
          </Link>
          <Link
            target="_blank"
            href={"https://www.facebook.com/cmw.world"}
            className="hover:scale-110 duration-200 "
          >
            <Facebook className="size-6" />
          </Link>
          <Link
            target="_blank"
            href={"https://t.me/cmworld_org"}
            className="hover:scale-110 duration-200 "
          >
            <Telegrams className="size-6" />
          </Link>
          <Link
            href="https://wa.me/14172685815?text=Hi%2C%20can%20you%20help%20me%3F"
            className="hover:scale-110 duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Whatsapp className="size-6" />
          </Link>
          <Link
            target="_blank"
            href={"https://youtube.com/@cmw_world"}
            className="hover:scale-110 duration-200"
          >
            <Youtube className="size-6" />
          </Link>
        </div>

        {/* copy right */}
        <div className="sm:flex hidden lg:flex-row flex-col gap-4 text-center justify-center text-gray-400">
          <p className="text-sm ">
            {`Copyright © ${new Date().getFullYear()} Change Makers of the World`}{" "}
          </p>
          <Link
            href="/privacy-policy"
            className="text-sm text-gray-400 cursor-pointer sm:mt-0 mt-2"
          >
            Privacy Policy
          </Link>
          <p className="text-sm text-gray-400">
            WhatsApp and Phone:
            <Link
              href="https://wa.me/14172685815?text=Hi%2C%20can%20you%20help%20me%3F"
              className="pl-1"
            >
              +1 (417) 268-5815
            </Link>
          </p>
        </div>
        {/* copy right mobile */}
        <div className="sm:hidden flex lg:flex-row flex-col gap-4 text-center justify-center text-gray-400">
          <Link
            href="/privacy-policy"
            className="text-sm text-gray-400 cursor-pointer sm:mt-0 mt-2"
          >
            Privacy Policy
          </Link>
          <p className="text-sm text-gray-400">
            WhatsApp and Phone:
            <Link
              href="https://wa.me/14172685815?text=Hi%2C%20can%20you%20help%20me%3F"
              className="pl-1"
            >
              +1 (417) 268-5815
            </Link>
          </p>
          <p className="text-sm ">
            {`Copyright © ${new Date().getFullYear()} Change Makers of the World`}{" "}
          </p>
        </div>
      </div>
    </footer>
  );
}
