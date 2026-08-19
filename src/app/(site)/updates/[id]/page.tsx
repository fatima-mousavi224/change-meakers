import { Metadata } from "next";
import { redirect } from "next/navigation";

import InitiativeDetails from "@/components/initiatives/InitiativeDetails";
import UpdateDetails, {
  loadUpdateDetails,
} from "@/components/updates/UpdateDetails";
import { siteConfig } from "@/constant/config";
import {
  getInitiativeDetailPath,
  getInitiativePublicSlug,
  INITIATIVES,
  resolveInitiativeId,
} from "@/constant/initiatives";
import { getInitiativeDetail } from "@/lib/initiativeDetails";
import { getUpdateByParam } from "@/lib/updateDetails";
import {
  buildUpdateDetailHref,
  getUpdateDetailPath,
} from "@/utilities/updateDetailHref";

type UpdateDetailPageProps = {
  params: {
    id: string;
  };
  searchParams?: {
    from?: string;
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
  const initiativeId = resolveInitiativeId(params.id);
  const initiative = getInitiativeDetail(initiativeId);

  if (initiative) {
    return {
      title: initiative.title,
      description: initiative.description,
    };
  }

  const post = await getUpdateByParam(params.id);

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
  searchParams,
}: UpdateDetailPageProps) {
  const initiativeId = resolveInitiativeId(params.id);
  const initiative = getInitiativeDetail(initiativeId);

  if (initiative) {
    const publicSlug = getInitiativePublicSlug(initiativeId);

    if (params.id !== publicSlug) {
      redirect(getInitiativeDetailPath(initiativeId));
    }

    return <InitiativeDetails id={initiativeId} />;
  }

  const update = await loadUpdateDetails(params.id);
  const returnTo = searchParams?.from ?? null;

  if (params.id !== getUpdateDetailPath(update).replace("/updates/", "")) {
    redirect(buildUpdateDetailHref(update, returnTo));
  }

  return <UpdateDetails update={update} returnTo={returnTo} />;
}
