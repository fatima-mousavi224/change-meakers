import { Metadata } from "next";

import ProgramPage from "@/components/current-program-page/ProgramPage";
import ProgramRelatedSections from "@/components/current-program-page/ProgramRelatedSections";
import { getLatestPosts } from "@/lib/getLatestPosts";

export const metadata: Metadata = {
  title: "Advocacy Programs",
  description: "Advocacy Programs at Change Makers of the World",
};

export default async function AdvocacyPage() {
  const posts = await getLatestPosts(3);

  return (
    <>
      <ProgramPage activeCategoryId="advocacy" heroTitle="Advocacy" />
      <ProgramRelatedSections posts={posts} />
    </>
  );
}
