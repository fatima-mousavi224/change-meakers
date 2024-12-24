import React from "react";
import { Metadata } from "next";
import CurrentProgram from "@/components/current-program-page/CurrentProgram";

export const metadata: Metadata = {
  title: "Current Programs",
  description: "Current Programs in Change Makers",
};

export default async function page() {
  return <CurrentProgram />;
}
