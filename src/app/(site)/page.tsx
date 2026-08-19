import SiteContainer from "@/components/common/SiteContainer";
import ScrollReveal from "@/components/common/ScrollReveal";
import HeroSlider from "@/components/home/hero-section/HeroSlider";
import WhatWeDo from "@/components/home/what-we-do/WhatWeDo";
import OurInitiatives from "@/components/home/our-initiatives/OurInitiatives";
import GetInvolved from "@/components/home/get-involved/GetInvolved";
import LatestUpdates from "@/components/home/latest-updates/LatestUpdates";
import OurPartners from "@/components/home/our-partners/OurPartners";
import { getLatestPosts } from "@/lib/getLatestPosts";
import "@/lib/env";

export default async function HomePage() {
  const posts = await getLatestPosts(3);

  return (
    <main>
      <SiteContainer>
        <HeroSlider />
        <ScrollReveal>
          <WhatWeDo />
        </ScrollReveal>
        <ScrollReveal delay={0.05}>
          <OurInitiatives />
        </ScrollReveal>
        <ScrollReveal delay={0.05}>
          <GetInvolved />
        </ScrollReveal>
        <ScrollReveal delay={0.05}>
          <LatestUpdates posts={posts} />
        </ScrollReveal>
        <ScrollReveal delay={0.05}>
          <OurPartners />
        </ScrollReveal>
      </SiteContainer>
    </main>
  );
}
