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
const ImpactUpdateSchema = z.object({
  standardImpacts: z
    .array(StandardImpactSchema)
    .min(1, "At least one standard impact is required"),
  highlightedImpacts: z
    .array(HighlightedImpactSchema)
    .min(1, "At least one highlighted impact is required"),
  projectName: z.string().min(1, "Project name is required"),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const impact = await prisma.impact.findUnique({
      where: { id: params.id },
    });

    if (!impact) {
      return NextResponse.json(
        {
          error: "Impact not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(impact);
  } catch (error) {
    console.error("Error fetching impact:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to fetch impact",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const impactId = params.id;
    const body = await request.json();
    
    console.log("Updating impact with ID:", impactId);
    console.log("Received update data:", JSON.stringify(body, null, 2));

    // Validate the request body
    const validationResult = ImpactUpdateSchema.safeParse(body);

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

    // Check if impact exists
    const existingImpact = await prisma.impact.findUnique({
      where: { id: impactId },
      include: {
        standardImpacts: true,
        highlightedImpacts: true,
      },
    });

    if (!existingImpact) {
      return NextResponse.json(
        { error: "Impact not found" },
        { status: 404 }
      );
    }

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

    // Update the impact record
    const updatedImpact = await prisma.impact.update({
      where: { id: impactId },
      data: {
        projectName: projectName,
        standardImpacts: {
          deleteMany: {}, // Delete existing standard impacts
          create: standardImpactsData, // Create new ones
        },
        highlightedImpacts: {
          deleteMany: {}, // Delete existing highlighted impacts
          create: highlightedImpactsData, // Create new ones
        },
      },
      include: {
        standardImpacts: true,
        highlightedImpacts: true,
      },
    });

    console.log(
      "Impact updated successfully:",
      JSON.stringify(updatedImpact, null, 2)
    );

    return NextResponse.json(
      {
        message: "Impact updated successfully",
        impact: updatedImpact,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating impact:", error);

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
        message: "Failed to update impact",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const impactId = params.id;

    // Check if impact exists
    const existingImpact = await prisma.impact.findUnique({
      where: { id: impactId },
    });

    if (!existingImpact) {
      return NextResponse.json(
        { error: "Impact not found" },
        { status: 404 }
      );
    }

    // Delete the impact (this will cascade delete related records)
    await prisma.impact.delete({
      where: { id: impactId },
    });

    return NextResponse.json(
      { message: "Impact deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting impact:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Failed to delete impact",
      },
      { status: 500 }
    );
  }
}
