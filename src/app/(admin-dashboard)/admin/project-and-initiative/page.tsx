import React from "react";
import ProjectAndInitiative from "./ProjectAndInitiative";
import prisma from "@/lib/prismaDB";
export default async function ProjectAndInitiativePage() {
  const projects = await prisma.project.findMany({});


  return <ProjectAndInitiative projects={projects}  />;
}
