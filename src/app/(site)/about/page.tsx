import About from "@/components/about-us/hero";
import AdvisoryBoard from "@/components/about-us/AdvisoryBoard";
import MissionImpact from "@/components/about-us/MissionImpact";
// import Primary from "@/components/about-us/primary";
import Team from "@/components/about-us/team";
import ScrollReveal from "@/components/common/ScrollReveal";
import SiteContainer from "@/components/common/SiteContainer";
import { getExecutiveTeam } from "@/lib/leadership";
import React from "react";

export default async function Page() {
  const members = await getExecutiveTeam();

  return (
    <SiteContainer className="space-y-12 sm:space-y-16 lg:space-y-20">
      <ScrollReveal>
        <About />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <MissionImpact />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <Team members={members} />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <AdvisoryBoard />
      </ScrollReveal>
    </SiteContainer>
  );
}
