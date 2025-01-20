import UpdateDetails from "@/components/updates/UpdateDetails";
import { siteConfig } from "@/constant/config";
import prisma from "@/lib/prismaDB";

interface DetailsUpdatePageProps {
  params: { id: string };
}

export default async function DetailsUpdatePage({
  params: { id },
}: DetailsUpdatePageProps) {
  const post = await prisma.post.findUnique({
    where: { id: id },
    include: { Category: true },
  });

  return (
    <main className="min-h-screen max-w-screen-2xl  mx-auto px-4">
      {/* @ts-ignore */}
      <UpdateDetails {...post} />
    </main>
  );
}

export async function generateMetadata({
  params: { id },
}: DetailsUpdatePageProps) {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });

  if (post) {
    // Strip HTML tags from the description
    const stripHtmlTags = (html: string): string =>
      html.replace(/<\/?[^>]+(>|$)/g, "");

    const sanitizedDescription = stripHtmlTags(post.description);

    console.log("post metadata", {
      title: ` ${post.title}`,
      description: sanitizedDescription,
      openGraph: {
        images: [`${siteConfig.url}/${post.postImages[0]?.image}`],
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
        template: `%s | ${post.title}`,
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
        url: `${post.postImages[0]?.image}`,
        title: post.title,
        description: sanitizedDescription,
        siteName: post.title,
        images: [`${post.postImages[0]?.image}`],
        type: "website",
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: sanitizedDescription,
        images: [`${post.postImages[0]?.image}`],
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
