import { Post, User } from "@prisma/client";
import Navbar from "./NavbarCollection";
import { Suspense } from "react";

interface NavBarProps {
  user: User | null;
  posts: Post[];
}

export default function NavBar({ user, posts }: NavBarProps) {
  return (
    <Suspense fallback="loading...">
      <Navbar user={user} posts={posts} />
    </Suspense>
  );
}
