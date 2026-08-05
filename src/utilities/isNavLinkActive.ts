export function isNavLinkActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  if (href === "/apply") {
    return (
      pathname === "/apply" ||
      pathname === "/join" ||
      pathname.startsWith("/apply/")
    );
  }

  if (href === "/updates") {
    return pathname === "/updates" || pathname.startsWith("/updates/");
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
