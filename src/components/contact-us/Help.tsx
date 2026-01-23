"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Call, LinkIcon, Message } from "../icons/Icons";

export default function Help() {
  const [showPhoneTooltip, setShowPhoneTooltip] = useState(false);
  const [showSocialTooltip, setShowSocialTooltip] = useState(false);

  return (
    <div className="flex flex-col lg:justify-between lg:h-[469px] gap-5">
      <div className="space-y-3">
        <h3 className="text-base text-primary-50">Get In Touch</h3>
        <h1 className="xl:text-5xl lg:text-4xl text-2xl">
          We’re here to help!
        </h1>
        <p className="text-lg font-medium text-paragraph_color">
          Please let us know how we can assist.
        </p>
      </div>
      <div className="flex lg:flex-col flex-row lg:gap-8 gap-4">
        {/* Email Section */}
        <Link
          href="mailto:info@cmworld.org"
          className="flex items-center gap-3"
        >
          <div className="w-[44px] h-[44px] rounded-[10px] bg-primary-50 bg-opacity-20 flex items-center justify-center">
            <Message />
          </div>
          <p className="text-paragraph_color text-xl hidden lg:block">
            info@cmworld.org
          </p>
        </Link>

        {/* Phone Section */}
        {/* <div
          className="relative flex items-center lg:gap-3 "
          onMouseEnter={() => setShowPhoneTooltip(true)}
          onMouseLeave={() => setShowPhoneTooltip(false)}
        >
          <div className="w-[44px] h-[44px] rounded-[10px] bg-primary-50 bg-opacity-20 flex items-center justify-center">
            <Call />
          </div>
          <div className="lg:hidden">
            {showPhoneTooltip && (
              <div className="absolute left-12 top-0 bg-white shadow-md p-2 rounded-md z-10 w-40">
                <p className="text-paragraph_color text-sm mb-1">
                  <Link href="tel:+14172685815">+1 (417) 268-5815</Link>
                </p>
                <p className="text-paragraph_color text-sm">
                  <Link href="tel:+4915213737840">+49 1521 3737840</Link>
                </p>
              </div>
            )}
          </div>
          <div className="hidden lg:flex gap-3 text-paragraph_color text-xl">
            <Link href="tel:+14172685815">+1 (417) 268-5815</Link>/
            <Link href="tel:+4915213737840">+49 1521 3737840</Link>
          </div>
        </div> 
        */}

        {/* Social Links Section */}
        <div
          className="relative flex items-center lg:gap-3"
          onMouseEnter={() => setShowSocialTooltip(true)}
          onMouseLeave={() => setShowSocialTooltip(false)}
        >
          <div className="w-[44px] h-[44px] rounded-[10px] bg-primary-50 bg-opacity-20 flex items-center justify-center">
            <LinkIcon />
          </div>
          {/* Tooltip for Social on Mobile */}
          <div className="lg:hidden">
            {showSocialTooltip && (
              <div className="absolute left-12 top-0 bg-white shadow-md p-2 rounded-md z-10">
                <p className="text-paragraph_color text-sm mb-1">
                  <Link href="https://www.instagram.com/cmw.world/">
                    Instagram
                  </Link>
                </p>
                <p className="text-paragraph_color text-sm mb-1">
                  <Link href="https://www.youtube.com/@cmw_world">YouTube</Link>
                </p>
                <p className="text-paragraph_color text-sm">
                  <Link href="https://www.linkedin.com/company/cmw-world/">
                    LinkedIn
                  </Link>
                </p>
              </div>
            )}
          </div>
          {/* Direct Content for Social on Larger Screens */}
          <div className="hidden lg:flex gap-3 text-paragraph_color text-xl">
            <p>Follow on:</p>
            <Link
              href="https://www.instagram.com/cmw.world/"
              className="text-primary-50"
            >
              Instagram
            </Link>{" "}
            |{" "}
            <Link
              href="https://www.youtube.com/@cmw_world"
              className="text-primary-50"
            >
              YouTube
            </Link>{" "}
            |{" "}
            <Link
              href="https://www.linkedin.com/company/cmw-world/"
              className="text-primary-50"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
