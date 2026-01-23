import React from "react";
import { Metadata } from "next";
import NewProgram from "@/components/current-program-page/NewProgram";
// import CurrentProgram from "@/components/current-program-page/CurrentProgram";

export const metadata: Metadata = {
  title: "Current Programs",
  description: "Current Programs in Change Makers",
};

export default async function page() {
  return (
  <>
      <NewProgram/>
  {/* <CurrentProgram /> */}
  </>
  );
}
