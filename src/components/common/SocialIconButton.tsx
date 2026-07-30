import { cn } from "@/utilities/cn";
import Image from "next/image";
import Link from "next/link";

type SocialIconButtonProps = {
  href: string;
  label: string;
  src: string;
  className?: string;
};

export default function SocialIconButton({
  href,
  label,
  src,
  className,
}: SocialIconButtonProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-[12px] border border-gray-100/50 bg-[#F2F4F7] transition-all duration-200 ease-out hover:scale-110 hover:bg-[#E4E7EC] active:scale-95",
        className
      )}
    >
      <Image
        src={src}
        alt={`${label} icon`}
        width={20}
        height={20}
        className="size-5 object-contain"
      />
    </Link>
  );
}
