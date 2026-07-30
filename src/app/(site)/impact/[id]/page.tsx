import ImpactDetails from "@/components/impact/ImpactDetails";
import SiteContainer from "@/components/common/SiteContainer";
import { siteConfig } from "@/constant/config";
import prisma from "@/lib/prismaDB";

interface DetailsImpactPageProps {
  params: { id: string };
}

export default async function DetailsImpactPage({
  params: { id },
}: DetailsImpactPageProps) {
  const impact = await prisma.impact.findUnique({
    where: { id: id },
  });

  return (
    <SiteContainer as="main" className="min-h-screen">
      {/* @ts-ignore */}
      <ImpactDetails {...impact} />
    </SiteContainer>
  );
}

export async function generateMetadata({
  params: { id },
    }: DetailsImpactPageProps) {
  const impact = await prisma.impact.findUnique({
    where: {
      id,
    },
  });

  if (impact) {
    // Strip HTML tags from the description
    const stripHtmlTags = (html: string): string =>
      html.replace(/<\/?[^>]+(>|$)/g, "");

    const sanitizedDescription = stripHtmlTags(impact.description || "");

    console.log("post metadata", {
      title: ` ${impact.title || ""}`,
      description: sanitizedDescription,
      openGraph: {
        images: [`${siteConfig.url}/${impact.coverPhoto}`],
      },
    });

    return {
      // title: ` ${post.title}`,
      // description: sanitizedDescription,
      // openGraph: {
      //   images: [`${siteConfig.url}/${post.postImages[0]?.image}`],
      // },
      metadataBase: new URL(siteConfig.url),
      title: {
        default: siteConfig.title,
        template: `%s | ${impact.title || ""}`,
      },
      description: sanitizedDescription,
      keywords: siteConfig.keywords,
      robots: { index: true, follow: true },
      icons: {
        icon: "/favicon/favicon.ico",
        shortcut: "/favicon/favicon-16x16.png",
        apple: "/favicon/apple-touch-icon.png",
      },
      manifest: `/favicon/site.webmanifest`,
      openGraph: {
        url: `${impact.coverPhoto}`,
        title: impact.title || "",
        description: sanitizedDescription,
        siteName: impact.title || "",
        images: [`${impact.coverPhoto}`],
        type: "website",
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title: impact.title || "",
        description: sanitizedDescription,
        images: [`${impact.coverPhoto}`],
      },
      authors: [
        {
          name: "MarsCoders",
          url: "https://github.com/MarsCoders",
        },
      ],
    };
  }
}
