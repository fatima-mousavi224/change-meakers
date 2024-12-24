import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prismaDB";
import { getCurrentUser } from "@/utilities/getCurrentUser";

export async function POST(request: NextRequest) {
  const { email, phone, country, city, coverPhoto, profilePhoto } =
    await request.json();
  console.log(
    "email",
    email + "/n",
    "phone",
    phone + "/n",
    "country",
    country + "/n",
    "city",
    city + "/n",
    "coverPhoto",
    coverPhoto + "/n",
    "profilePhoto",
    profilePhoto + "/n"
  );

  if (!email || !phone || !country || !city || !coverPhoto || !profilePhoto) {
    return NextResponse.json(
      { errors: "Please fill all the fields" },
      { status: 400 }
    );
  }
  const currentUser = await getCurrentUser();
  console.log("currentUser", currentUser);
  if (!currentUser) {
    return NextResponse.error();
  }

  const userProfile = await prisma.userProfile.create({
    data: {
      userId: currentUser.id,
      email,
      phone,
      country,
      city,
      coverPhoto,
      profilePhoto,
    },
  });

  return NextResponse.json({ userProfile }, { status: 201 });
}

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ errors: "Unauthorized" }, { status: 401 });
  }
  const userProfile = await prisma.userProfile.findUnique({
    where: {
      id: currentUser.id,
    },
  });

  if (!userProfile) {
    return NextResponse.json(
      { errors: "User profile not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ userProfile }, { status: 200 });
}

export async function PUT(request: NextRequest) {
  try {
    const { email, phone, country, city, coverPhoto, profilePhoto } =
      await request.json();
    const currentUser = await getCurrentUser();

    if (!email || !phone || !country || !city || !coverPhoto || !profilePhoto) {
      return NextResponse.json(
        { errors: "Please fill all the fields" },
        { status: 400 }
      );
    }

    if (!currentUser) {
      return NextResponse.json({ errors: "Unauthorized" }, { status: 401 });
    }

    const userProfile = await prisma.userProfile.findUnique({
      where: {
        userId: currentUser.id,
      },
    });

    if (!userProfile) {
      return NextResponse.json(
        { errors: "User profile not found" },
        { status: 404 }
      );
    }

    const updatedProfile = await prisma.userProfile.update({
      where: {
        userId: currentUser.id,
      },
      data: {
        email,
        phone,
        country,
        city,
        coverPhoto,
        profilePhoto,
      },
    });

    return NextResponse.json({ updatedProfile }, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);

    return NextResponse.json(
      { errors: (error as Error).message },
      { status: 500 }
    );
  }
}
