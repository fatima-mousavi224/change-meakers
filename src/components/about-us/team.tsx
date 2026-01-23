import React from "react";
import Header from "../current-program-page/Header";
import TeamCards from "./TeamCards";

export default function Team() {
  return (
    <div className="space-y-10 pb-10">
      <Header
        btnName="Board of Directors"
        title='Leadership'
      />
      <TeamCards />
    </div>
  );
}
