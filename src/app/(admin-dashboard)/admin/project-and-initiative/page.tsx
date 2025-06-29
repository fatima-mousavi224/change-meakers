import React from "react";
import ProjectAndInitiative from "./ProjectAndInitiative";
import prisma from "@/lib/prismaDB";
export default async function ProjectAndInitiativePage() {
  const projects = await prisma.project.findMany({
    include: { heroSections: true },
  });
  const impacts = await prisma.impact.findMany({
    include: {
      standardImpacts: true,
      highlightedImpacts: true,
    },
  });

  return (
    <div>
      <ProjectAndInitiative projects={projects} impacts={impacts} />
    </div>
  );
}
