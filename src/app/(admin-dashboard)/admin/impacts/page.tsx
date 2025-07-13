import prisma from "@/lib/prismaDB";
import ManageImpactsTable from "./ImpactTable";
export default async function ImpactsPage() {
  const impacts = await prisma.impact.findMany();

  return (
    <div className="">
      <ManageImpactsTable impacts={impacts} />
    </div>
  );
}