import SiteContainer from "@/components/common/SiteContainer";
import HeroSlider from "@/components/home/hero-section/HeroSlider";
import WhatWeDo from "@/components/home/what-we-do/WhatWeDo";
import OurInitiatives from "@/components/home/our-initiatives/OurInitiatives";
import GetInvolved from "@/components/home/get-involved/GetInvolved";
import LatestUpdates from "@/components/home/latest-updates/LatestUpdates";
import OurPartners from "@/components/home/our-partners/OurPartners";
import "@/lib/env";
import prisma from "@/lib/prismaDB";

async function getHomePosts() {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    return await prisma.post.findMany({
      take: 3,
      orderBy: {
        postDate: "desc",
      },
      include: {
        Category: true,
      },
    });
  } catch (error) {
    console.error("Failed to load home posts:", error);
    return [];
  }
}

export default async function HomePage() {
  const posts = await getHomePosts();

  return (
    <main>
      <SiteContainer>
        <HeroSlider />
        <WhatWeDo />
        <OurInitiatives />
        <GetInvolved />
        <LatestUpdates posts={posts} />
        <OurPartners />
      </SiteContainer>
    </main>
  );
}
