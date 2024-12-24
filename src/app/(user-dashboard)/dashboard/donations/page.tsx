import React from "react";
import { getCurrentUser } from "@/utilities/getCurrentUser";
import { PrismaClient } from "@prisma/client";
import DashboardTable from "../_components/DashboardTable";

export default async function DonationsPage() {
  const prisma = new PrismaClient();
  const user = await getCurrentUser();
  let donated: any[] = [];
  if (user) {
    donated = await prisma.paymentInfo.findMany({
      where: { email: user.email || "" },
    });
    console.log("donated", donated);
  }
  return (
    <div>
      <DashboardTable donations={donated} />
    </div>
  );
}
