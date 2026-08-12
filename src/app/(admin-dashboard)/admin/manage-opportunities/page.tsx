import ManageOpportunityTable from "./ManageOpportunityTable";
import { Metadata } from "next";
import prisma from "@/lib/prismaDB";

export const metadata: Metadata = {
  title: "Manage Opportunities",
  description: "Manage opportunities shown on the /apply page",
};

export default async function ManageOpportunitiesPage() {
  const opportunities = await prisma.opportunity.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <ManageOpportunityTable opportunities={opportunities} />
    </div>
  );
}

export const revalidate = 0;
