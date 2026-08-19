"use client";

import MemberFormModal from "@/app/(admin-dashboard)/admin/_components/MemberFormModal";
import DeleteModal from "@/components/delete-modal/deleteModal";
import NullDataMessage from "@/components/null-data/NullDataMessage";
import { truncateText } from "@/utilities/truncateText";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Member } from "@prisma/client";
import { Pencil, Trash2 } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

interface ManageTeamMembersTableProps {
  members: Member[];
}

function getMemberImage(member: Member) {
  return member.image?.trim() || member.avatar?.[0]?.image?.trim() || "";
}

function getMemberRole(member: Member) {
  return member.role?.trim() || member.position?.trim() || "—";
}

export default function ManageTeamMembersTable({
  members,
}: ManageTeamMembersTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"Date" | "Name" | "">("");
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredAndSortedMembers = useMemo(() => {
    let items = members.filter((member) =>
      member.name.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === "Date") {
      items = items.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    } else if (sort === "Name") {
      items = items.sort((a, b) => a.name.localeCompare(b.name));
    }

    return items;
  }, [members, search, sort]);

  const handleDeleteMember = useCallback(async () => {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);
    toast.success("Deleting member, please wait...");

    try {
      const res = await fetch(`/api/member/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Delete failed");
      }

      toast.success("Member deleted successfully");
      setDeleteTarget(null);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete member"
      );
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, router]);

  if (members.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <MemberFormModal open={showModal} setOpen={setShowModal} />
      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onDelete={handleDeleteMember}
        title="Delete team member?"
        description="This member will be removed from the About page. This action cannot be undone."
        itemName={deleteTarget?.name}
        isDeleting={isDeleting}
      />
        <div className="sm:flex sm:items-center justify-between mb-6">
          <button
            type="button"
            className="block rounded-md bg-primary-50 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-100"
            onClick={() => setShowModal(true)}
          >
            Add Member
          </button>
        </div>
        <NullDataMessage>No members found yet!</NullDataMessage>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 mb-8">
      <MemberFormModal open={showModal} setOpen={setShowModal} />
      <DeleteModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onDelete={handleDeleteMember}
        title="Delete team member?"
        description="This member will be removed from the About page. This action cannot be undone."
        itemName={deleteTarget?.name}
        isDeleting={isDeleting}
      />

      <div className="sm:flex sm:items-center justify-between">
        <button
          type="button"
          className="block rounded-md bg-primary-50 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-100 mb-4 md:mb-0"
          onClick={() => {
            router.replace("/admin/manage-team-members");
            setShowModal(true);
          }}
        >
          Add Member
        </button>
        <div className="flex items-center gap-x-2.5">
          <div className="grid w-full max-w-lg grid-cols-1 lg:max-w-xs">
            <input
              name="search"
              type="search"
              placeholder="Search by name"
              className="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-10 pr-3 text-base text-gray-900 border-gray-300 placeholder:text-gray-400 sm:text-sm/6 focus:border-primary-50"
              onChange={(e) => setSearch(e.target.value)}
            />
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400"
            />
          </div>
          <select
            className="rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 border-gray-300 focus:outline-2 sm:text-sm/6 focus:border-primary-50 cursor-pointer"
            onChange={(e) =>
              setSort(e.target.value as "Date" | "Name" | "")
            }
            value={sort}
          >
            <option value="">Sort by: All</option>
            <option value="Name">Name</option>
            <option value="Date">Date</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flow-root bg-white shadow-sm ring-1 ring-gray-900/5 rounded-[20px] p-5">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full">
              <thead>
                <tr className="p-2 rounded-xl bg-[#EAEAEA]">
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 rounded-tl-xl rounded-bl-xl">
                    Name
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Role
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Order
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Visible
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Added
                  </th>
                  <th className="relative py-3.5 pl-3 pr-4 rounded-tr-xl rounded-br-xl text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedMembers.map((member) => {
                  const image = getMemberImage(member);

                  return (
                    <tr key={member.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          {image ? (
                            <Image
                              src={image}
                              alt={member.name}
                              width={24}
                              height={24}
                              className="size-6 rounded-full object-cover"
                              unoptimized={
                                image.startsWith("http") ||
                                image.startsWith("/uploads/") ||
                                image.startsWith("/")
                              }
                            />
                          ) : null}
                          <span>{member.name}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {truncateText(getMemberRole(member), 24)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {member.sortOrder}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            member.published
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {member.published ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {moment(member.createdAt).format("DD-MM-YYYY")}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium flex gap-2">
                        <span className="bg-blue-500 rounded-md p-0.5">
                          <Pencil
                            className="w-4 h-4 text-white cursor-pointer"
                            onClick={() => {
                              router.push(
                                `/admin/manage-team-members?memberId=${member.id}`
                              );
                              setShowModal(true);
                            }}
                          />
                        </span>
                        <Trash2
                          className="w-5 h-5 text-red-500 cursor-pointer"
                          onClick={() =>
                            setDeleteTarget({
                              id: member.id,
                              name: member.name,
                            })
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
