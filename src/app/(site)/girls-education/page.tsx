import { Metadata } from "next";

import ProgramPage from "@/components/current-program-page/ProgramPage";
import ProgramRelatedSections from "@/components/current-program-page/ProgramRelatedSections";
import { getLatestPosts } from "@/lib/getLatestPosts";

export const metadata: Metadata = {
  title: "Girls' Education Programs",
  description: "Girls' Education Programs at Change Makers of the World",
};

export default async function GirlsEducationPage() {
  const posts = await getLatestPosts(3);

  return (
    <>
      <ProgramPage
        activeCategoryId="girls-education"
        heroTitle="Girls' Education"
      />
      <ProgramRelatedSections posts={posts} />
    </>
  );
}
