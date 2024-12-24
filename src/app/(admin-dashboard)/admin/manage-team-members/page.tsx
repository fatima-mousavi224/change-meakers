import React from 'react';
import ManageTeamMembersTable from './ManageTeamMembersTable';
import prisma from '@/lib/prismaDB';

export default async function ManageTeamMembersPage() {
  const members = await prisma.member.findMany();

  return (
    <div>
      <ManageTeamMembersTable members={members} />
    </div>
  );
}
