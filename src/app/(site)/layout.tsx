import { Metadata } from "next";
import * as React from "react";

import "@/styles/globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import prisma from "@/lib/prismaDB";
import Footer from "@/components/footer/Footer";
import SearchModal from "@/components/search/SearchModal";
import { getCurrentUser } from "@/utilities/getCurrentUser";
import NavBar from "../../components/navbar/NavBar";
import { Toaster } from "react-hot-toast";

import { siteConfig } from "@/constant/config";

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const posts = await prisma.post.findMany();

  return (
    <html>
      <body className={plusJakartaSans.className}>
        <Toaster
          toastOptions={{
            style: {
              background: "rgb(51, 65, 85) ",
              color: "#fff",
            },
          }}
        />
        <React.Suspense fallback="loading...">
          <NavBar user={user} posts={posts} />
        </React.Suspense>
        <React.Suspense fallback="loading...">
          <SearchModal posts={posts} />
        </React.Suspense>
        {children}
        <Footer />
      </body>
    </html>
  );
}
