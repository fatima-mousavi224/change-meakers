import { Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import { siteConfig } from "@/constant/config";
import { Metadata } from "next";

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
const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={plusJakartaSans.className}>
        {" "}
        <Toaster
          toastOptions={{
            style: {
              background: "rgb(19, 76, 131)",
              color: "#fff",
            },
          }}
          position="bottom-right"
        />
        {children}
      </body>
    </html>
  );
}
