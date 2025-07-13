import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prismaDB";



  // Define the main schema for the request body
  const ImpactUpdateSchema = z.object({
    title: z.string().optional(),
    date: z.string().optional(),
    impactTags: z.string().optional(),
    author: z.string().optional(),
    authorPhoto: z.string().optional().nullable(),
    coverPhoto: z.string().optional().nullable(),
    galleryPhoto: z.array(z.string()).default([]),
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

    // Update the impact record
    const updatedImpact = await prisma.impact.update({
      where: { id: impactId },
      data: {
        ...validationResult.data,
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
