import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prismaDB";

// Define schemas for standard and highlighted impacts
const ImpactSchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.date().optional(),
  description: z.string().min(1, "Description is required"),
  author: z.string().min(1, "Author is required"),
  impactTags: z.string().optional(),
  projectName: z.string().optional(),
  coverPhoto: z.string().optional(),
  galleryPhoto: z.array(z.string().url()).default([]),
  authorPhoto: z.string().optional(),
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

    // Create the impact record with related standard and highlighted impacts
    const impact = await prisma.impact.create({
      data: { 
        ...validationResult.data,
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
