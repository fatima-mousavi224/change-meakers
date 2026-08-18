import BrandSocialIcon from "@/components/common/BrandSocialIcon";
import { cn } from "@/utilities/cn";
import Link from "next/link";
import type { IconType } from "react-icons";

type SocialIconButtonProps = {
  href: string;
  label: string;
  src?: string;
  Icon?: IconType;
  className?: string;
  iconClassName?: string;
};

export default function SocialIconButton({
  href,
  label,
  src,
  Icon,
  className,
  iconClassName,
}: SocialIconButtonProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-[12px] border border-gray-100/50 bg-[#F2F4F7] text-[#134C83] transition-[transform,background-color] duration-200 ease-out hover:scale-110 hover:bg-[#E4E7EC] active:scale-95",
        className
      )}
    >
      {src ? (
        <BrandSocialIcon
          src={src}
          size={28}
          className={cn("size-7", iconClassName)}
        />
      ) : Icon ? (
        <Icon className={cn("size-5 shrink-0", iconClassName)} aria-hidden />
      ) : null}
    </Link>
  );
}
