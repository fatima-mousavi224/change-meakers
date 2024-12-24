import { cn } from "@/utilities/cn";

interface SocialButtonProps {
  className?: string;
  icon: any;
  text: string;
  onClick?: () => void;
}

export default function SocialButton({
  className,
  icon,
  text,
  onClick,
}: SocialButtonProps) {
  const Icon = icon;
  return (
    <button
      className={cn(
        "border rounded-[40px] flex items-center  gap-4 border-black px-4 py-2 justify-center shrink-0",
        className
      )}
      onClick={onClick}
    >
      <Icon className="size-6 text-[#47ACDF] " />
      <span>{text}</span>
    </button>
  );
}
