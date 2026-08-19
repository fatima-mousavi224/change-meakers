import prisma from "@/lib/prismaDB";

function toObjectId(id: string) {
  return { $oid: id };
}

export async function deleteMemberById(id: string) {
  try {
    await prisma.member.delete({ where: { id } });
    return;
  } catch (error) {
    console.warn("member.delete failed, using raw fallback:", error);
  }

  const result = await prisma.$runCommandRaw({
    delete: "Member",
    deletes: [
      {
        q: { _id: toObjectId(id) },
        limit: 1,
      },
    ],
  } as Parameters<typeof prisma.$runCommandRaw>[0]);

  const deletedCount =
    typeof result === "object" &&
    result !== null &&
    "n" in result &&
    typeof result.n === "number"
      ? result.n
      : 0;

  if (deletedCount < 1) {
    throw new Error("Member not found");
  }
}

export async function updateMemberById(
  id: string,
  data: Record<string, unknown>
) {
  if (!Object.keys(data).length) {
    return;
  }

  try {
    return await prisma.member.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.warn("member.update failed, using raw fallback:", error);
  }

  await prisma.$runCommandRaw({
    update: "Member",
    updates: [
      {
        q: { _id: toObjectId(id) },
        u: { $set: data },
      },
    ],
  } as Parameters<typeof prisma.$runCommandRaw>[0]);
}
