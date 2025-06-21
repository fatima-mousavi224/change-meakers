import { NextResponse } from "next/server";
import { ProjectSchema } from "@/lib/schemas";
import prisma from "@/lib/prismaDB";
import { ProjectInput } from "@/types/project";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received data:", JSON.stringify(body, null, 2));

    // Simple validation check for required fields
    if (!body.projectTitle || !body.cardDescription || !body.heroTitle) {
      console.error("Missing required fields:", {
        projectTitle: !!body.projectTitle,
        cardDescription: !!body.cardDescription,
        heroTitle: !!body.heroTitle,
      });
      return NextResponse.json(
        {
          error: "Missing required fields",
          message:
            "Project title, card description, and hero title are required",
        },
        { status: 400 }
      );
    }

    // Log the structure of the data
    console.log("Data structure check:", {
      hasProjectTitle: !!body.projectTitle,
      hasCardDescription: !!body.cardDescription,
      hasHeroTitle: !!body.heroTitle,
      hasUploadedFiles: !!body.uploadedFiles,
      hasTeamCards: !!body.teamCards,
      hasStudentItems: !!body.studentItems,
      hasVoices: !!body.voices,
      hasOfferIcons: !!body.offerIcons,
      hasIconPreview1: !!body.iconPreview1,
      hasIconPreview2: !!body.iconPreview2,
      keys: Object.keys(body),
    });

    let parsedData;
    try {
      parsedData = ProjectSchema.parse(body) as ProjectInput;
      console.log("Parsed data successfully:", parsedData);
    } catch (validationError) {
      console.error("Schema validation failed:", validationError);
      console.error(
        "Validation error details:",
        JSON.stringify(validationError, null, 2)
      );
      console.error("Received body:", JSON.stringify(body, null, 2));
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationError,
          message: "Please check the form data and try again",
        },
        { status: 400 }
      );
    }

    const {
      uploadedFiles,
      teamCards,
      studentItems,
      voices,
      liveMoments,
      relatedLinks,
      newsletterItems,
      offerIcons,
      iconPreview1,
      iconPreview2,
      ...projectData
    } = parsedData;

    const project = await prisma.project.create({
      data: {
        ...projectData,
        // Map uploaded files to their respective fields
        cardImage: uploadedFiles?.cardImage,
        heroImage: uploadedFiles?.heroImage,
        visionGoalImage1: uploadedFiles?.visionGoalImage1,
        visionGoalImage2: uploadedFiles?.visionGoalImage2,
        visionGoalImage3: uploadedFiles?.visionGoalImage3,
        visionGoalImage4: uploadedFiles?.visionGoalImage4,
        mediaHeroImage: uploadedFiles?.mediaHeroImage,
        photoAlbumImage1: uploadedFiles?.photoAlbumImage1,
        photoAlbumImage2: uploadedFiles?.photoAlbumImage2,
        photoAlbumImage3: uploadedFiles?.photoAlbumImage3,
        photoAlbumImage4: uploadedFiles?.photoAlbumImage4,
        newsletterImage1: uploadedFiles?.newsletterImage1,
        newsletterImage2: uploadedFiles?.newsletterImage2,
        sdgsImage1: uploadedFiles?.sdgsImage1,
        sdgsImage2: uploadedFiles?.sdgsImage2,
        sdgsImage3: uploadedFiles?.sdgsImage3,
        sdgsImage4: uploadedFiles?.sdgsImage4,
        // Map status icons
        statusIcon1: iconPreview1 || null,
        statusIcon2: iconPreview2 || null,
        // Create related records
        teamCards: teamCards ? { create: teamCards } : undefined,
        studentItems: studentItems ? { create: studentItems } : undefined,
        voices: voices ? { create: voices } : undefined,
        liveMoments: liveMoments ? { create: liveMoments } : undefined,
        relatedLinks: relatedLinks ? { create: relatedLinks } : undefined,
        newsletterItems: newsletterItems
          ? {
              create: newsletterItems.map((item) => ({
                ...item,
                date: new Date(item.date),
              })),
            }
          : undefined,
        offerIcons: offerIcons ? { create: offerIcons } : undefined,
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

    console.log(
      "Project created successfully:",
      JSON.stringify(project, null, 2)
    );
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);

    // If it's a Zod validation error, show the specific issues
    if (error && typeof error === "object" && "issues" in error) {
      console.error("Validation errors:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues,
          message: "Please check the form data and try again",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create project",
        message: "An unexpected error occurred",
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
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
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
