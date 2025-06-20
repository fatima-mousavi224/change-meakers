import { NextResponse } from "next/server";
import prisma from "../../../../lib/prismaDB";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        teamCards: true,
        studentItems: true,
        voices: true,
        liveMoments: true,
        relatedLinks: true,
        newsletterItems: true,
        offerIcons: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error("GET /api/projects/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();

    // Validate required fields
    if (!data.projectTitle || !data.cardDescription || !data.heroTitle) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Parse newsletterItems dates
    const newsletterItems =
      data.newsletterItems?.map((item: any) => ({
        ...item,
        date: new Date(item.date),
      })) || [];

    // Delete existing relations to replace with new ones
    await prisma.teamCard.deleteMany({ where: { projectId: id } });
    await prisma.studentItem.deleteMany({ where: { projectId: id } });
    await prisma.voice.deleteMany({ where: { projectId: id } });
    await prisma.liveMoment.deleteMany({ where: { projectId: id } });
    await prisma.relatedLink.deleteMany({ where: { projectId: id } });
    await prisma.newsletterItem.deleteMany({ where: { projectId: id } });
    await prisma.offerIcon.deleteMany({ where: { projectId: id } });

    const project = await prisma.project.update({
      where: { id },
      data: {
        projectTitle: data.projectTitle,
        cardDescription: data.cardDescription,
        heroTitle: data.heroTitle,
        subheading: data.subheading || null,
        slogan: data.slogan || null,
        buttonName: data.buttonName || null,
        buttonLink: data.buttonLink || null,
        iconTitle: data.iconTitle || null,
        shortDescription: data.shortDescription || null,
        iconTitle2: data.iconTitle2 || null,
        shortDescription2: data.shortDescription2 || null,
        visionTitle: data.visionTitle || null,
        visionText: data.visionText || null,
        goalTitle: data.goalTitle || null,
        goalText: data.goalText || null,
        sectionTitleAbout: data.sectionTitleAbout || null,
        bodyText: data.bodyText || null,
        buttonName2: data.buttonName2 || null,
        buttonLink2: data.buttonLink2 || null,
        sectionTitleVoices: data.sectionTitleVoices || null,
        sectionDescription: data.sectionDescription || null,
        heroTitleMedia: data.heroTitleMedia || null,
        shortDescriptionMedia: data.shortDescriptionMedia || null,
        videoLink: data.videoLink || null,
        fullVideoDescription: data.fullVideoDescription || null,
        iconTitleOffer1: data.iconTitleOffer1 || null,
        shortDescriptionOffer1: data.shortDescriptionOffer1 || null,
        sectionTitleTeam: data.sectionTitleTeam || null,
        sectionDescriptionTeam: data.sectionDescriptionTeam || null,
        sectionTitleStudents: data.sectionTitleStudents || null,
        sectionDescriptionStudents: data.sectionDescriptionStudents || null,
        addQuote: data.addQuote || null,
        nameRole: data.nameRole || null,
        sectionTitlePhoto: data.sectionTitlePhoto || null,
        sectionDescriptionPhoto: data.sectionDescriptionPhoto || null,
        sectionTitleNewsletter: data.sectionTitleNewsletter || null,
        sectionDescriptionNewsletter: data.sectionDescriptionNewsletter || null,
        sectionTitleSDGs: data.sectionTitleSDGs || null,
        sectionTextSDGs: data.sectionTextSDGs || null,
        finalStatement: data.finalStatement || null,
        navigationLabel: data.navigationLabel || null,
        showInMainNavigation: data.showInMainNavigation ?? true,
        cardImage: data.uploadedFiles?.cardImage || null,
        heroImage: data.uploadedFiles?.heroImage || null,
        newsletterImage1: data.uploadedFiles?.newsletterImage1 || null,
        newsletterImage2: data.uploadedFiles?.newsletterImage2 || null,
        iconPreview1: data.iconPreview1 || null,
        iconPreview2: data.iconPreview2 || null,
        teamCards: {
          create:
            data.teamCards?.map((card: any) => ({
              name: card.name,
              role: card.role,
              biography: card.biography,
              link: card.link || null,
              showLinkInput: card.showLinkInput ?? false,
              image: card.image || null,
              icon: card.icon || null,
            })) || [],
        },
        studentItems: {
          create:
            data.studentItems?.map((item: any) => ({
              name: item.name,
              role: item.role,
              biography: item.biography,
              link: item.link || null,
              showLinkInput: item.showLinkInput ?? false,
              image: item.image || null,
              icon: item.icon || null,
            })) || [],
        },
        voices: {
          create:
            data.voices?.map((voice: any) => ({
              quote: voice.quote,
              name: voice.name,
              description: voice.description,
              icon: voice.icon || null,
            })) || [],
        },
        liveMoments: {
          create:
            data.liveMoments?.map((moment: any) => ({
              link: moment.link,
            })) || [],
        },
        relatedLinks: {
          create:
            data.relatedLinks?.map((link: any) => ({
              buttonName: link.buttonName,
              buttonLink: link.buttonLink,
            })) || [],
        },
        newsletterItems: {
          create: newsletterItems,
        },
        offerIcons: {
          create:
            data.offerIcons?.map((icon: any) => ({
              url: icon.url,
            })) || [],
        },
      },
      include: {
        teamCards: true,
        studentItems: true,
        voices: true,
        liveMoments: true,
        relatedLinks: true,
        newsletterItems: true,
        offerIcons: true,
      },
    });

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error("PUT /api/projects/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const project = await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Project deleted successfully", project },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
