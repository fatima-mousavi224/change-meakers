import Programs from "@/components/home/programs/Programs";
import prisma from "@/lib/prismaDB";
import React from "react";

async function ProgramsPage2({ params }: { params: { id: string } }) {
  console.log("🚀 ~ ProgramsPage2 ~ params:", params);
  const project = await prisma.project.findUnique({
    where: {
      id: params.id,
    },
    include: {
      heroSections: true,
      statusAndIcons: true,
      teamCards: true,
      studentItems: true,
      voices: true,
      offerIcons: true,
      photoAlbums: true,
      liveMoments: true,
      relatedLinks: true,
      newsletterItems: true,
    },
  });
  console.log("🚀 ~ ProgramsPage2 ~ project:", project);

  if (!project) {
    return <div>Project not found</div>;
  }

  const impacts = await prisma.impact.findMany({
    include: {
      standardImpacts: true,
      highlightedImpacts: true,
    },
  });
  console.log("🚀 ~ ProgramsPage2 ~ impacts>>>>>>>>:", impacts);

  return (
    <div>
      <Programs project={project} impacts={impacts} />
    </div>
  );
}

export default ProgramsPage2;
