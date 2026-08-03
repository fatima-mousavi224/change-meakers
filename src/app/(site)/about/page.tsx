import About from "@/components/about-us/hero";
import AdvisoryBoard from "@/components/about-us/AdvisoryBoard";
import MissionImpact from "@/components/about-us/MissionImpact";
// import Primary from "@/components/about-us/primary";
import Team from "@/components/about-us/team";
import SiteContainer from "@/components/common/SiteContainer";
import React from "react";

export default function Page() {
  return (
    <SiteContainer className="space-y-12 sm:space-y-16 lg:space-y-20">
      <About />
      <MissionImpact />
      {/* <Primary /> */}
      <Team />
      <AdvisoryBoard />
    </SiteContainer>
  );
}
