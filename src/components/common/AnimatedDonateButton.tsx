import { DonateIcon } from "@/components/icons/Icons";
import { DONATE_URL } from "@/constant/donate";
import { cn } from "@/utilities/cn";
import Link from "next/link";

type AnimatedDonateButtonProps = {
  label?: string;
  className?: string;
  fullWidth?: boolean;
  onClick?: () => void;
};

export default function AnimatedDonateButton({
  label = "Donate",
  className,
  fullWidth = false,
  onClick,
}: AnimatedDonateButtonProps) {
  return (
    <Link
      href={DONATE_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden bg-primary-50 font-semibold text-white transition-colors duration-200 ease-out hover:bg-primary-200",
        fullWidth
          ? "flex w-full rounded-lg px-6 py-3.5 text-[14px]"
          : "rounded-[12px] px-6 py-2.5 text-[14px]",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/35 to-transparent"
      />
      <span className="relative z-10">{label.trim()}</span>
      <DonateIcon className="relative z-10 size-5 animate-heartbeat" />
    </Link>
  );
}
