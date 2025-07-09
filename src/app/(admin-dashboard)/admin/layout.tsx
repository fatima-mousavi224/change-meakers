import { TabsProvider } from "@/components/context/TabsContext";
import NavBarAndSidebar from "@/components/navbar/NavBar&SideBar";
import { siteConfig } from "@/constant/config";
import "@/styles/globals.css";
import { getCurrentUser } from "@/utilities/getCurrentUser";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon-16x16.png",
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: `/favicon/site.webmanifest`,
  openGraph: {
    url: `${siteConfig.url}/images/og.jpg`,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [`${siteConfig.url}/images/og.jpg`],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/og.jpg`],
  },
  authors: [
    {
      name: "MarsCoders",
      url: "https://github.com/MarsCoders",
    },
  ],
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") redirect("/dashboard");

  return (
    <html lang="en">
      <body className="bg-dashboard_body_bg">
        <div>
          <Toaster position="bottom-right" />
          <TabsProvider>
            <NavBarAndSidebar currentUser={user} children={children} />
          </TabsProvider>
        </div>
      </body>
    </html>
  );
}
