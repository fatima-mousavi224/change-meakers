import { cn } from "@/utilities/cn";

type SectionHeadingProps = {
  title: string;
  className?: string;
};

export default function SectionHeading({ title, className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-8 flex items-center gap-6 lg:mb-10", className)}>
      <h2 className="shrink-0 font-plusJakartaSans text-[22px] font-bold text-[#000000] sm:text-[34px] lg:text-[36px]">
        {title}
      </h2>
      <div className="mt-2 flex min-w-0 flex-1 items-center">
        <div className="h-0 flex-1 self-center border-t border-[#9E9E9E]" />

        <span className="mx-5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#9E9E9E] bg-white">
          <span className="h-2 w-2 rounded-full bg-[#9E9E9E]" />
        </span>

        <div className="h-0 w-6 self-center border-t border-[#9E9E9E] md:w-24" />
      </div>
    </div>
  );
}
