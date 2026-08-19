import React from "react";

import { getAdminMembers } from "@/lib/adminMembers";

import ManageTeamMembersTable from "./ManageTeamMembersTable";

export const revalidate = 0;

export default async function ManageTeamMembersPage() {
  const members = await getAdminMembers();

  return (
    <div>
      <ManageTeamMembersTable members={members} />
    </div>
  );
}
