import { NextRequest, NextResponse } from "next/server";
import { ImpactSchema } from "@/lib/schemas";
import prisma from "@/lib/prismaDB";

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

    const validatedData = validationResult.data;

    // Convert empty strings to null for optional fields
    const cleanedData = {
      ...validatedData,
      message1: validatedData.message1 || null,
      message2: validatedData.message2 || null,
      title2: validatedData.title2 || null,
      date2: validatedData.date2 || null,
      impactTags2: validatedData.impactTags2 || null,
      writersName2: validatedData.writersName2 || null,
      contentDescription2: validatedData.contentDescription2 || null,
    };

    // Convert date strings to Date objects, handling optional dates
    const impactData = {
      ...cleanedData,
      date: new Date(cleanedData.date),
      date2: cleanedData.date2 ? new Date(cleanedData.date2) : null,
      projectName: cleanedData.addImpact,
    };

    // Remove the addImpact field as it's mapped to projectName
    const { addImpact, ...dataToSave } = impactData;

    console.log("Data to save:", JSON.stringify(dataToSave, null, 2));

    // Create the impact record in the database
    const impact = await prisma.impact.create({
      data: dataToSave,
    });

    console.log("Impact created successfully:", impact);

    return NextResponse.json(
      {
        message: "Impact created successfully",
        impact,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating impact:", error);

    // Provide more specific error messages
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
        message: "Failed to create impact",
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
