import { SITE_CONTAINER_CLASS } from "@/constant/siteContainer";
import { cn } from "@/utilities/cn";

type SiteContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
};

export default function SiteContainer({
  children,
  className,
  as: Tag = "div",
}: SiteContainerProps) {
  return (
    <Tag className={cn(SITE_CONTAINER_CLASS, className)}>{children}</Tag>
  );
}
