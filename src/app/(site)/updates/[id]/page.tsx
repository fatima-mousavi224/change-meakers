import { Metadata } from "next";

import InitiativeDetails from "@/components/initiatives/InitiativeDetails";
import UpdateDetails, {
  loadUpdateDetails,
} from "@/components/updates/UpdateDetails";
import { siteConfig } from "@/constant/config";
import { INITIATIVES } from "@/constant/initiatives";
import { getInitiativeDetail } from "@/lib/initiativeDetails";
import { getUpdateById } from "@/lib/updateDetails";

type UpdateDetailPageProps = {
  params: {
    id: string;
  };
};

export function generateStaticParams() {
  return INITIATIVES.map((initiative) => ({
    id: initiative.id,
  }));
}

export async function generateMetadata({
  params,
}: UpdateDetailPageProps): Promise<Metadata> {
  const initiative = getInitiativeDetail(params.id);

  if (initiative) {
    return {
      title: initiative.title,
      description: initiative.description,
    };
  }

  const post = await getUpdateById(params.id);

  if (!post) {
    return { title: "Not Found" };
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
  const initiative = getInitiativeDetail(params.id);

  if (initiative) {
    return <InitiativeDetails id={params.id} />;
  }

  const update = await loadUpdateDetails(params.id);

  return <UpdateDetails update={update} />;
}
