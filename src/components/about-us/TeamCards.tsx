


"use client";

import {
  INITIAL_VISIBLE_COUNT,
  type LeadershipMember,
  type LeadershipSocialLink,
  type LeadershipSocialType,
} from "@/constant/aboutLeadership";
import { cn } from "@/utilities/cn";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaFacebookF, FaGlobe } from "react-icons/fa6";
import { motion } from "framer-motion";

const FOOTER_HEIGHT = 92;
const HOVER_TOP_GAP = 29;

const SOCIAL_ICON_SRC: Partial<Record<LeadershipSocialType, string>> = {
  linkedin: "/icons/linkdin.png",
  instagram: "/icons/instagram.png",
  x: "/icons/twiter.png",
};

const SOCIAL_LABELS: Record<LeadershipSocialType, string> = {
  website: "Website",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  x: "X",
  facebook: "Facebook",
};

function LeadershipSocialIcon({
  social,
}: {
  social: LeadershipSocialLink;
}) {
  const label = SOCIAL_LABELS[social.type];
  const iconSrc = SOCIAL_ICON_SRC[social.type];

  return (
    <motion.div
      whileHover={{
        scale: 1.12,
        y: -3,
        rotate: 2,
      }}
      whileTap={{
        scale: 0.95,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 15,
      }}
      className="inline-flex"
    >
      <Link
        href={social.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="flex size-10 items-center justify-center rounded-[10px] bg-[#134C8333] text-[#134C83] transition-all duration-300 hover:bg-[#C5DFF5] hover:shadow-[0_8px_20px_rgba(19,76,131,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        {social.type === "website" ? (
          <FaGlobe className="size-5" />
        ) : social.type === "facebook" ? (
          <FaFacebookF className="size-5" />
        ) : iconSrc ? (
          <Image
            src={iconSrc}
            alt=""
            width={16}
            height={16}
            className="size-6 object-contain"
            aria-hidden
          />
        ) : null}
      </Link>
    </motion.div>
  );
}

function CardPortrait({ member }: { member: LeadershipMember }) {
  return (
    <Image
      src={member.image}
      alt={member.name}
      fill
      className="object-cover"
      style={{
        objectPosition: member.imageObjectPosition ?? "50% 15%",
      }}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    />
  );
}

function LeadershipCard({
  member,
  showRoleInFooter,
}: {
  member: LeadershipMember;
  showRoleInFooter: boolean;
}) {
  const [isActive, setIsActive] = useState(false);

  return (
    <article
      className="relative h-[400px] w-full max-w-[300px] cursor-pointer overflow-hidden rounded-[15px] bg-white shadow-[0_4px_20px_rgba(19,76,131,0.1)] sm:h-[420px] sm:max-w-none sm:w-[calc(50%-10px)] lg:h-[440px] lg:w-[calc(33.333%-22px)]"
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onFocus={() => setIsActive(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsActive(false);
        }
      }}
      onClick={() => setIsActive((current) => !current)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setIsActive((current) => !current);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${member.name} profile`}
    >
      {/* Image */}
      <div className="absolute inset-0 overflow-hidden bg-[#E8EEF4]">
        <CardPortrait member={member} />
      </div>

      {/* Default footer */}
      {!isActive ? (
        <div
          className="absolute inset-x-0 bottom-0 flex flex-col bg-white"
          style={{ height: FOOTER_HEIGHT }}
        >
          <div className="h-[5px] w-full shrink-0 bg-[#134C83]" />

          <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
            <h3 className="font-plusJakartaSans text-[15px] font-medium text-[#252525] sm:text-[18px]">
              {member.name}
            </h3>

            {showRoleInFooter && member.role ? (
              <p className="mt-1 font-plusJakartaSans text-[12px] text-[#717171] sm:text-[14px]">
                {member.role}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Hover overlay */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 flex flex-col overflow-hidden rounded-b-[15px] border-t-[5px] border-[#134C83] will-change-transform transition-transform duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          isActive
            ? "pointer-events-auto translate-y-0"
            : "pointer-events-none translate-y-full"
        )}
        style={{ top: HOVER_TOP_GAP }}
        aria-hidden={!isActive}
      >
        <div className="relative flex min-h-0 flex-1 flex-col bg-white/75 px-4 pb-5 pt-4 text-center backdrop-blur-[3px] sm:px-5">
          <h3 className="font-plusJakartaSans text-[16px] font-normal text-[#252525] sm:text-[20px]">
            {member.name}
          </h3>

          {member.role ? (
            <p className="mt-1 font-plusJakartaSans text-[13px] font-normal text-[#252525] sm:text-[14px]">
              {member.role}
            </p>
          ) : null}

          <p className="mt-3 flex-1 overflow-y-auto font-plusJakartaSans text-[12px] font-normal leading-[20px] text-[#0A4062] sm:text-[15px] sm:leading-[22px]">
            {member.bio}
          </p>

          {member.socials.length > 0 ? (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {member.socials.map((social) => (
                <LeadershipSocialIcon
                  key={social.type}
                  social={social}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function TeamCards({ members }: { members: LeadershipMember[] }) {
  const [showAll, setShowAll] = useState(false);

  const visibleMembers = showAll
    ? members
    : members.slice(0, INITIAL_VISIBLE_COUNT);

  const canToggle =
    members.length > INITIAL_VISIBLE_COUNT;

return (
  <div className="space-y-10">
    <div className="mx-auto flex w-full max-w-[1100px] flex-wrap justify-center gap-5 px-4 sm:gap-6 sm:px-0 lg:gap-8">
      {visibleMembers.map((member) => (
        <LeadershipCard
          key={member.id}
          member={member}
          showRoleInFooter={showAll}
        />
      ))}
    </div>

    {canToggle ? (
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setShowAll((current) => !current)}
          className="group inline-flex w-fit items-center gap-2 rounded-xl border border-[#D0D5DD] px-5 py-2.5 font-plusJakartaSans text-[13px] font-medium text-black_color transition-colors duration-200 hover:border-primary-50 hover:bg-primary-50 hover:text-white sm:text-[14px]"
        >
          <span>{showAll ? "Show Less" : "View More"}</span>

          <ArrowRightIcon
            className={cn(
              "size-4 stroke-[2] transition-transform duration-200",
              showAll
                ? "rotate-[-90deg] group-hover:-translate-y-1"
                : "group-hover:translate-x-1"
            )}
            aria-hidden
          />
        </button>
      </div>
    ) : null}
  </div>
);}