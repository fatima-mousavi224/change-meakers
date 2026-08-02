import Subscribe from "@/components/contact-us/Subscribe";
import SiteContainer from "@/components/common/SiteContainer";
import Contribute from "@/components/home/contribute/Contribute";
import HeroSlider from "@/components/home/hero-section/HeroSlider";
import WhatWeDo from "@/components/home/what-we-do/WhatWeDo";
import HomeVedio from "@/components/home/homeVedio";
import LatestNews from "@/components/home/news-stories/LatestNews";
import ProjectInitiatives from "@/components/home/project-Initiative/ProjectInitiatives";
import "@/lib/env";
import prisma from "@/lib/prismaDB";

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    take: 10,
    where: {
      showInHome: true,
    },
    orderBy: {
      postDate: "desc",
    },
  });

  return (
    <main>
      <SiteContainer>
        <HeroSlider />
        <WhatWeDo />
        <HomeVedio />
      </SiteContainer>
      <ProjectInitiatives />
      <LatestNews posts={posts} />
      <SiteContainer>
        <Contribute />
        <Subscribe />
      </SiteContainer>
    </main>
  );
}
