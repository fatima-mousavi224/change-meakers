import Subscribe from "@/components/contact-us/Subscribe";
import SiteContainer from "@/components/common/SiteContainer";
import Contribute from "@/components/home/contribute/Contribute";
import HeroSlider from "@/components/home/hero-section/HeroSlider";
import WhatWeDo from "@/components/home/what-we-do/WhatWeDo";
import OurInitiatives from "@/components/home/our-initiatives/OurInitiatives";
import GetInvolved from "@/components/home/get-involved/GetInvolved";
import LatestUpdates from "@/components/home/latest-updates/LatestUpdates";
import "@/lib/env";
import prisma from "@/lib/prismaDB";

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    take: 3,
    orderBy: {
      postDate: "desc",
    },
    include: {
      Category: true,
    },
  });

  return (
    <main>
      <SiteContainer>
        <HeroSlider />
        <WhatWeDo />
        <OurInitiatives />
        <GetInvolved />
        <LatestUpdates posts={posts} />
      </SiteContainer>
      <SiteContainer>
        <Contribute />
        <Subscribe />
      </SiteContainer>
    </main>
  );
}
