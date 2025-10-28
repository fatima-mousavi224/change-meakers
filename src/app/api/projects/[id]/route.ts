import prisma from "@/lib/prismaDB";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        statusAndIcons: true,
        photoAlbums: true,
        voices: true,
        offerIcons: true,
        teamCards: true,
        studentItems: true,
        newsletterItems: true,
        liveMoments: true,
        relatedLinks: true,
        quotations: true,
      },
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
      quotations,
      ...rest
    } = body;
    
    // Replace status icons if provided
    if (Array.isArray(sections)) {
      // clear old
      await prisma.statusAndIcon.deleteMany({ where: { projectId: params.id } });
      if (sections.length > 0) {
        await prisma.statusAndIcon.createMany({
          data: sections.map((s: any) => ({
            iconTitle: s.iconTitle,
            shortDescription: s.shortDescription,
            statusIcon: s.statusIcon,
            projectId: params.id,
          })),
        });
      }
    }

    // Replace photo albums if provided
    if (Array.isArray(photoAlbum)) {
      await prisma.photoAlbum.deleteMany({ where: { projectId: params.id } });
      if (photoAlbum.length > 0) {
        await prisma.photoAlbum.createMany({
          data: photoAlbum.map((p: any) => ({
            image: p.image,
            title: p.title,
            description: p.description,
            projectId: params.id,
          })),
        });
      }
    }

    // Replace voices if provided
    if (Array.isArray(voices)) {
      await prisma.voice.deleteMany({ where: { projectId: params.id } });
      if (voices.length > 0) {
        await prisma.voice.createMany({
          data: voices.map((v: any) => ({
            quote: v.quote,
            name: v.name,
            location: v.location,
            icon: v.icon,
            projectId: params.id,
          })),
        });
      }
    }
    // Replace offer icons if provided
    if (Array.isArray(offerIcons)) {
      await prisma.offerIcon.deleteMany({ where: { projectId: params.id } });
      if (offerIcons.length > 0) {
        await prisma.offerIcon.createMany({
          data: offerIcons.map((o: any) => ({
            url: o.url,
            iconTitle: o.iconTitle,
            shortDescription: o.shortDescription,
            projectId: params.id,
          })),
        });
      }
    }

    // Replace team cards if provided
    if (Array.isArray(teamCards)) {
      await prisma.teamCard.deleteMany({ where: { projectId: params.id } });
      if (teamCards.length > 0) {
        await prisma.teamCard.createMany({
          data: teamCards.map((t: any) => ({
            name: t.name,
            role: t.role,
            biography: t.biography,
            link: t.link,
            showLinkInput: Boolean(t.showLinkInput),
            image: t.image,
            icon: t.icon,
            projectId: params.id,
          })),
        });
      }
    }

    // Replace student items if provided
    if (Array.isArray(studentItems)) {
      await prisma.studentItem.deleteMany({ where: { projectId: params.id } });
      if (studentItems.length > 0) {
        await prisma.studentItem.createMany({
          data: studentItems.map((st: any) => ({
            name: st.name,
            role: st.role,
            biography: st.biography,
            link: st.link,
            showLinkInput: Boolean(st.showLinkInput),
            image: st.image,
            icon: st.icon,
            projectId: params.id,
          })),
        });
      }
    }

    // Replace newsletter items if provided
    if (Array.isArray(newsletterItems)) {
      await prisma.newsletterItem.deleteMany({ where: { projectId: params.id } });
      if (newsletterItems.length > 0) {
        await prisma.newsletterItem.createMany({
          data: newsletterItems.map((n: any) => ({
            date: n.date ? new Date(n.date) : new Date(),
            title: n.title,
            description: n.description,
            url: n.url ?? null,
            newsLetterImage: n.newsLetterImage ?? null,
            projectId: params.id,
          })),
        });
      }
    }

    // Replace live moments if provided
    if (Array.isArray(liveMoments)) {
      await prisma.liveMoment.deleteMany({ where: { projectId: params.id } });
      if (liveMoments.length > 0) {
        await prisma.liveMoment.createMany({
          data: liveMoments.map((l: any) => ({
            link: l.link,
            image: l.image,
            projectId: params.id,
          })),
        });
      }
    }

    // Replace quotations if provided
    if (Array.isArray(quotations)) {
      await prisma.quotation.deleteMany({ where: { projectId: params.id } });
      if (quotations.length > 0) {
        await prisma.quotation.createMany({
          data: quotations.map((l: any) => ({
            quote: l.quote,
            nameRole: l.nameRole,
            projectId: params.id,
          })),
        });
      }
    }

    // Replace related links if provided
    if (Array.isArray(relatedLinks)) {
      await prisma.relatedLink.deleteMany({ where: { projectId: params.id } });
      if (relatedLinks.length > 0) {
        await prisma.relatedLink.createMany({
          data: relatedLinks.map((l: any) => ({
            buttonName: l.buttonName,
            buttonLink: l.buttonLink,
            projectId: params.id,
          })),
        });
      }
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
