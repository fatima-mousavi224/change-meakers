export function isNavLinkActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  if (href === "/apply") {
    return pathname === "/apply" || pathname === "/join";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
