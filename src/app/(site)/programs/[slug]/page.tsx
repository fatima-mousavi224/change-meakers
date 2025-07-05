import Programs from "@/components/home/programs/Programs";
import prisma from "@/lib/prismaDB";
import React from "react";

async function ProgramsPage2({ params }: { params: { slug: string } }) {
  const project = await prisma.project.findUnique({
    where: {
      navigationLabel: params.slug,
    },
    include: {
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

  if (!project) {
    return <div>Project not found</div>;
  }

  const impacts = await prisma.impact.findMany({
    include: {
      standardImpacts: true,
      highlightedImpacts: true,
    },
  });

  return (
    <div>
      <Programs project={project} impacts={impacts} />
    </div>
  );
}

export default ProgramsPage2;
