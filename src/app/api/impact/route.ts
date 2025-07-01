import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prismaDB";

// Define schemas for standard and highlighted impacts
const StandardImpactSchema = z.object({
  title: z.string().min(1, "Title is required"),
  impactTags: z.string().min(1, "Impact tags are required"),
  writersName: z.string().min(1, "Writer's name is required"),
  date: z.string().min(1, "Date is required"),
  contentDescription: z.string().min(1, "Content description is required"),
  writerPhoto: z.string().url().nullable(),
  galleryPhoto: z.array(z.string().url()).default([]),
});

const HighlightedImpactSchema = z.object({
  message1: z.string().nullable(),
  title2: z.string().nullable(),
  impactTags2: z.string().nullable(),
  date2: z.string().nullable(),
  message2: z.string().nullable(),
  writersName2: z.string().nullable(),
  contentDescription2: z.string().nullable(),
  writerPhoto2: z.string().url().nullable(),
  coverPhoto: z.string().url().nullable(),
  galleryPhoto2: z.array(z.string().url()).default([]),
});

// Define the main schema for the request body
const ImpactSchema = z.object({
  standardImpacts: z
    .array(StandardImpactSchema)
    .min(1, "At least one standard impact is required"),
  highlightedImpacts: z
    .array(HighlightedImpactSchema)
    .min(1, "At least one highlighted impact is required"),
  projectName: z.string().min(1, "Project name is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received impact data:", JSON.stringify(body, null, 2));

    // Validate the request body
    const validationResult = ImpactSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Validation errors:", validationResult.error.errors);
      return NextResponse.json(
        {
          error: "Validation failed",
          message: "Please check your form data",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { standardImpacts, highlightedImpacts, projectName } =
      validationResult.data;

    // Prepare data for standard impacts
    const standardImpactsData = standardImpacts.map((impact) => ({
      title: impact.title,
      impactTags: impact.impactTags,
      writersName: impact.writersName,
      date: new Date(impact.date),
      contentDescription: impact.contentDescription,
      writerPhoto: impact.writerPhoto || null,
      galleryPhoto: impact.galleryPhoto || [],
    }));

    // Prepare data for highlighted impacts
    const highlightedImpactsData = highlightedImpacts.map((impact) => ({
      message1: impact.message1 || null,
      message2: impact.message2 || null,
      title2: impact.title2 || null,
      date2: impact.date2 ? new Date(impact.date2) : null,
      impactTags2: impact.impactTags2 || null,
      writersName2: impact.writersName2 || null,
      contentDescription2: impact.contentDescription2 || null,
      writerPhoto2: impact.writerPhoto2 || null,
      coverPhoto: impact.coverPhoto || null,
      galleryPhoto2: impact.galleryPhoto2 || [],
    }));

    // Create the impact record with related standard and highlighted impacts
    const impact = await prisma.impact.create({
      data: {
        projectName: projectName,
        standardImpacts: {
          create: standardImpactsData,
        },
        highlightedImpacts: {
          create: highlightedImpactsData,
        },
      },
      include: {
        standardImpacts: true,
        highlightedImpacts: true,
      },
    });

    console.log(
      "Impact created successfully:",
      JSON.stringify(impact, null, 2)
    );

    return NextResponse.json(
      {
        message: "Impact created successfully",
        impact,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating impacts:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Internal server error",
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to create impacts",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectName = searchParams.get("project");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const whereClause = projectName ? { projectName } : {};

    const [impacts, total] = await Promise.all([
      prisma.impact.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          standardImpacts: true,
          highlightedImpacts: true,
        },
      }),
      prisma.impact.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      impacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching impacts:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch impacts",
      },
      { status: 500 }
    );
  }
}
