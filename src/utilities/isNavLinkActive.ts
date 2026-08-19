import { isInitiativeDetailPath } from "@/constant/initiatives";

export function isNavLinkActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/" || isInitiativeDetailPath(pathname);
  }

  if (href === "/opportunities") {
    return (
      pathname === "/opportunities" ||
      pathname.startsWith("/opportunities/")
    );
  }

  if (href === "/updates") {
    return (
      pathname === "/updates" ||
      (pathname.startsWith("/updates/") && !isInitiativeDetailPath(pathname))
    );
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
