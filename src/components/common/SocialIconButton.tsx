import { cn } from "@/utilities/cn";
import Link from "next/link";
import type { IconType } from "react-icons";

type SocialIconButtonProps = {
  href: string;
  label: string;
  Icon: IconType;
  className?: string;
};

export default function SocialIconButton({
  href,
  label,
  Icon,
  className,
}: SocialIconButtonProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-[12px] border border-gray-100/50 bg-[#F2F4F7] text-[#134C83] transition-all duration-200 ease-out hover:scale-110 hover:bg-[#E4E7EC] active:scale-95",
        className
      )}
    >
      <Icon className="size-5" aria-hidden />
    </Link>
  );
}
