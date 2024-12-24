import { getCurrentUser } from "@/utilities/getCurrentUser";
import prisma from "@/lib/prismaDB";
import DonationsTable from "./DonationsTable";

export default async function DonationsPage() {
  let donated: any[] = [];
  donated = await prisma.paymentInfo.findMany();
  return (
    <div>
      <DonationsTable donations={donated} />
    </div>
  );
}
