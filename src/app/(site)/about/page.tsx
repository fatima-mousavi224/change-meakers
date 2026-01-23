import About from "@/components/about-us/hero";
// import Primary from "@/components/about-us/primary";
import RecognitionExperience from "@/components/about-us/RecognitionExperience";
import Team from "@/components/about-us/team";
import React from "react";

export default function Page() {
  return (
    <div className="max-w-screen-2xl px-4 mx-auto sm:space-y-20 space-y-10">
      <About />
      <RecognitionExperience />
      {/* <Primary /> */}
      <Team />
    </div>
  );
}
