import { Metadata } from "next";
import { notFound } from "next/navigation";

import UpdateDetails, {
  loadUpdateDetails,
} from "@/components/updates/UpdateDetails";
import { siteConfig } from "@/constant/config";
import { getUpdateById } from "@/lib/updateDetails";

type UpdateDetailPageProps = {
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params,
}: UpdateDetailPageProps): Promise<Metadata> {
  const post = await getUpdateById(params.id);

  if (!post) {
    return { title: "Update Not Found" };
  }

  const sanitizedDescription = post.excerpt;

  return {
    metadataBase: new URL(siteConfig.url),
    title: post.title,
    description: sanitizedDescription,
    keywords: siteConfig.keywords,
    robots: { index: true, follow: true },
    openGraph: {
      title: post.title,
      description: sanitizedDescription,
      siteName: siteConfig.title,
      type: "article",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: sanitizedDescription,
    },
  };
}

export default async function UpdateDetailPage({
  params,
}: UpdateDetailPageProps) {
  const update = await loadUpdateDetails(params.id);

  if (!update) {
    notFound();
  }

  return <UpdateDetails update={update} />;
}
