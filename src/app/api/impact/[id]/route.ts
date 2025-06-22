import { NextRequest, NextResponse } from "next/server";
import { ImpactSchema } from "@/lib/schemas";
import prisma from "@/lib/prismaDB";

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
    const body = await request.json();

    // Validate the request body
    const validationResult = ImpactSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Validation errors:", validationResult.error.errors);
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Convert date strings to Date objects
    const impactData = {
      ...validatedData,
      date: new Date(validatedData.date),
      date2: validatedData.date2 ? new Date(validatedData.date2) : null,
      projectName: validatedData.addImpact,
    };

    // Remove the addImpact field as it's mapped to projectName
    const { addImpact, ...dataToUpdate } = impactData;

    // Check if impact exists
    const existingImpact = await prisma.impact.findUnique({
      where: { id: params.id },
    });

    if (!existingImpact) {
      return NextResponse.json(
        {
          error: "Impact not found",
        },
        { status: 404 }
      );
    }

    // Update the impact record
    const updatedImpact = await prisma.impact.update({
      where: { id: params.id },
      data: dataToUpdate,
    });

    return NextResponse.json({
      message: "Impact updated successfully",
      impact: updatedImpact,
    });
  } catch (error) {
    console.error("Error updating impact:", error);
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
    // Check if impact exists
    const existingImpact = await prisma.impact.findUnique({
      where: { id: params.id },
    });

    if (!existingImpact) {
      return NextResponse.json(
        {
          error: "Impact not found",
        },
        { status: 404 }
      );
    }

    // Delete the impact record
    await prisma.impact.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: "Impact deleted successfully",
    });
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
