import NavBarAndSidebar from "@/components/navbar/NavBar&SideBar";
import "@/styles/globals.css";
import { getCurrentUser } from "@/utilities/getCurrentUser";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  applicationName: "Change Makers",
  authors: [
    {
      name: "Mars Coders",
      url: "marscoder.com",
    },
  ],
  creator: "MarsCoders",
  description: "we make system and websites for companies.",
  keywords: [
    "Change Makers",
    "Change Makers of the world",
    "World Afghan Changers",
    "Change Makers girl",
    "Change Makers org",
    "Help and Change with yout",
    "Change Makers Youth",
    "Change Makers in the world",
  ],
  openGraph: {
    images: [
      {
        alt: "Changes Makers",
        height: 630,
        url: "./opengraph-image.png",
        width: 1200,
      },
    ],
  },
  publisher: "Change Makers",
  title: {
    default: "Change Makers Of the World Dashboard",
    template: "%s - Change Makers",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  // if (user?.role !== "ADMIN") redirect("/dashboard");

  return (
    <html lang="en">
      <body className="bg-dashboard_body_bg">
        <div>
          <Toaster position="bottom-right" />
          <NavBarAndSidebar currentUser={user} children={children} />
        </div>
      </body>
    </html>
  );
}
