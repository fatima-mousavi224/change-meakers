import prisma from "@/lib/prismaDB";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// export async function PATCH(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const body = await req.json();

//     const updated = await prisma.project.update({
//       where: { id: params.id },
//       data: body,
//     });

//     return NextResponse.json(updated);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Failed to update project" },
//       { status: 500 }
//     );
//   }
// }

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const {
      heroSections,
      sections,
      photoAlbum,
      voices,
      offerIcons,
      teamCards,
      studentItems,
      newsletterItems,
      liveMoments,
      relatedLinks,
      ...rest
    } = body;

    // Create new heroSections if provided
    if (Array.isArray(heroSections) && heroSections.length > 0) {
      await prisma.heroSection.createMany({
        data: heroSections.map((h) => ({
          ...h,
          projectId: params.id,
        })),
      });
    }

    // Create new status icon if provided
    if (Array.isArray(sections) && sections.length > 0) {
      await prisma.statusAndIcon.createMany({
        data: sections.map((s) => ({
          ...s,
          projectId: params.id,
        })),
      });
    }

    // Create new status icon if provided
    if (Array.isArray(sections) && sections.length > 0) {
      await prisma.statusAndIcon.createMany({
        data: sections.map((s) => ({
          ...s,
          projectId: params.id,
        })),
      });
    }

    // Create new photo item if provided
    if (Array.isArray(photoAlbum) && photoAlbum.length > 0) {
      await prisma.photoAlbum.createMany({
        data: photoAlbum.map((p) => ({
          ...p,
          projectId: params.id,
        })),
      });
    }

    // Create new voices if provided
    if (Array.isArray(voices) && voices.length > 0) {
      await prisma.voice.createMany({
        data: voices.map((v) => ({
          ...v,
          projectId: params.id,
        })),
      });
    }
    // Create new offer icons if provided
    if (Array.isArray(offerIcons) && offerIcons.length > 0) {
      await prisma.offerIcon.createMany({
        data: offerIcons.map((o) => ({
          ...o,
          projectId: params.id,
        })),
      });
    }

    // Create teamCards if provided
    if (Array.isArray(teamCards) && teamCards.length > 0) {
      await prisma.teamCard.createMany({
        data: teamCards.map((t) => ({
          ...t,
          projectId: params.id,
        })),
      });
    }

    // Create studentItems if provided
    if (Array.isArray(studentItems) && studentItems.length > 0) {
      await prisma.studentItem.createMany({
        data: studentItems.map((st) => ({
          ...st,
          projectId: params.id,
        })),
      });
    }

    // Create newsLetterItems if provided
    if (Array.isArray(newsletterItems) && newsletterItems.length > 0) {
      await prisma.newsletterItem.createMany({
        data: newsletterItems.map((n) => ({
          ...n,
          projectId: params.id,
        })),
      });
    }

    // Create liveMomentItems if provided
    if (Array.isArray(liveMoments) && liveMoments.length > 0) {
      await prisma.liveMoment.createMany({
        data: liveMoments.map((l) => ({
          ...l,
          projectId: params.id,
        })),
      });
    }

    // Create relatedLinks if provided
    if (Array.isArray(relatedLinks) && relatedLinks.length > 0) {
      await prisma.relatedLink.createMany({
        data: relatedLinks.map((l) => ({
          ...l,
          projectId: params.id,
        })),
      });
    }

    // Update the project with the rest of the fields
    const updated = await prisma.project.update({
      where: { id: params.id },
      data: rest,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
