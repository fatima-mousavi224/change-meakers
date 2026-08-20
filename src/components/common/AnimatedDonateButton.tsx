import { DonateIcon } from "@/components/icons/Icons";
import { DONATE_ENABLED, DONATE_URL } from "@/constant/donate";
import { cn } from "@/utilities/cn";
import Link from "next/link";

type AnimatedDonateButtonProps = {
  label?: string;
  className?: string;
  fullWidth?: boolean;
  onClick?: () => void;
};

const buttonClassName = (
  fullWidth: boolean,
  className?: string,
  disabled?: boolean
) =>
  cn(
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden bg-primary-50 font-semibold text-white transition-colors duration-200 ease-out",
    disabled
      ? "cursor-default"
      : "hover:bg-primary-200",
    fullWidth
      ? "flex w-full rounded-lg px-6 py-3.5 text-[14px]"
      : "rounded-[12px] px-6 py-2.5 text-[14px]",
    className
  );

const buttonContent = (label: string) => (
  <>
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/35 to-transparent"
    />
    <span className="relative z-10">{label.trim()}</span>
    <DonateIcon className="relative z-10 size-5 animate-heartbeat" />
  </>
);

export default function AnimatedDonateButton({
  label = "Donate",
  className,
  fullWidth = false,
  onClick,
}: AnimatedDonateButtonProps) {
  if (!DONATE_ENABLED) {
    return (
      <button
        type="button"
        aria-disabled="true"
        onClick={DONATE_ENABLED ? onClick : undefined}
        className={buttonClassName(fullWidth, className, true)}
      >
        {buttonContent(label)}
      </button>
    );
  }

  return (
    <Link
      href={DONATE_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={buttonClassName(fullWidth, className)}
    >
      {buttonContent(label)}
    </Link>
  );
}
