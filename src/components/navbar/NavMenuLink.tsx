import { NAV_LINK_TYPOGRAPHY } from "@/constant/navStyles";
import { cn } from "@/utilities/cn";
import Link from "next/link";

type NavMenuLinkProps = {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
  variant?: "desktop" | "mobile";
};

export default function NavMenuLink({
  href,
  label,
  active,
  onClick,
  variant = "desktop",
}: NavMenuLinkProps) {
  if (variant === "mobile") {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          NAV_LINK_TYPOGRAPHY,
          "block rounded-xl px-4 py-3.5 text-left transition-colors duration-200 ease-in",
          active
            ? "bg-light_gray font-semibold text-primary-50"
            : "text-black_color hover:bg-gray-50"
        )}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        NAV_LINK_TYPOGRAPHY,
        "inline-flex items-center justify-center border-b-2 px-3 py-2.5 text-center transition-colors duration-200",
        active
          ? "border-primary-50 text-primary-50"
          : "border-transparent text-black_color hover:text-primary-50"
      )}
    >
      {label}
    </Link>
  );
}
