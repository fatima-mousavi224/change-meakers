import { cn } from "@/utilities/cn";
import Image from "next/image";

type BrandSocialIconProps = {
  src: string;
  className?: string;
  size?: number;
};

export default function BrandSocialIcon({
  src,
  className,
  size = 28,
}: BrandSocialIconProps) {
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", className)}
      aria-hidden
      unoptimized
    />
  );
}
