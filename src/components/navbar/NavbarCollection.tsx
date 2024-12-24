"use client";
import { Suspense, useState } from "react";
import MobileSidebar from "./MobileSidebar";
import MainNavbar from "./MainNavbar";
import { importantButtons, navigation } from "@/lib/data";
import { Post, User } from "@prisma/client";

interface NavbarProps {
  user: User | null;
  posts: Post[];
}

export default function NavbarCollection({ user, posts }: NavbarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div id="navbar">
      <Suspense fallback="loading...">
        <MobileSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          navigation={navigation}
          importantButtons={importantButtons}
          user={user}
        />
      </Suspense>
      <Suspense fallback="loading...">
        <MainNavbar
          navigation={navigation}
          importantBtns={importantButtons}
          setSidebarOpen={setSidebarOpen}
          user={user}
          posts={posts}
        />
      </Suspense>
    </div>
  );
}
