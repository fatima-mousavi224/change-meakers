import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaDB";

export async function GET() {
  try {
    const projects = await prisma.project.findMany();
    return NextResponse.json(projects);
  } catch (error) {
    console.log("error--------------", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const project = await prisma.project.create({
      data: {
        projectTitle: body.projectTitle,
        cardDescription: body.cardDescription,
        uploadCardImage: body.uploadCardImage,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
