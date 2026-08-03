import About from "@/components/about-us/hero";
// import Primary from "@/components/about-us/primary";
import RecognitionExperience from "@/components/about-us/RecognitionExperience";
import Team from "@/components/about-us/team";
import SiteContainer from "@/components/common/SiteContainer";
import React from "react";

export default function Page() {
  return (
    <SiteContainer className="space-y-12 sm:space-y-16 lg:space-y-20">
      <About />
      <RecognitionExperience />
      {/* <Primary /> */}
      <Team />
    </SiteContainer>
  );
}
