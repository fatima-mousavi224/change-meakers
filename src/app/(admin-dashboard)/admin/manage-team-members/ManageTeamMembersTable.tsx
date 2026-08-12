"use client";
import { useCallback, useMemo, useState } from "react";

import NullDataMessage from "@/components/null-data/NullDataMessage";
import firebaseApp from "@/lib/firebase";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Member } from "@prisma/client";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import moment from "moment";
import { truncateText } from "@/utilities/truncateText";
import { Pencil, Trash2 } from "lucide-react";
import MemberFormModal from "../_components/MemberFormModal";

interface ManageTeamMembersTableProps {
  members: Member[];
}

export default function ManageTeamMembersTable({
  members,
}: ManageTeamMembersTableProps) {
  const router = useRouter();
  const storage = getStorage(firebaseApp);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"Date" | "Name" | "">("");
  const [showModal, setShowModal] = useState(false);

  const handleSortChange = (sortItem: "Date" | "Name" | "") => {
    setSort(sortItem);
  };

  // Derived sorted and filtered posts
  const filteredAndSortedPosts = useMemo(() => {
    let filteredPosts = members.filter((member) =>
      member.name.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === "Date") {
      filteredPosts = filteredPosts.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    } else if (sort === "Name") {
      filteredPosts = filteredPosts.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return filteredPosts;
  }, [members, search, sort]);

  const handleDeleteMember = useCallback(
    async (id: string, avatar: any[]) => {
      toast.success("Deleting member please wait...");

      // delete images from the firebase storage
      async function deleteMemberAvatar() {
        try {
          for (const item of avatar) {
            if (item.image) {
              const imageRef = ref(storage, item.image);
              await deleteObject(imageRef);
            }
          }
        } catch (error: any) {
          console.log(
            "Error deleting image from Firebase Storage: ",
            error.message
          );
        }
      }

      await deleteMemberAvatar();

      await fetch(`/api/member/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          toast.success("Member deleted successfully");
          router.refresh();
        })
        .catch((error) => {
          toast.error(error.message);
        });
    },
    [router, storage]
  );

  if (members.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="sm:flex sm:items-center justify-between mb-6">
          <button
            type="button"
            className="block rounded-md bg-primary-50 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-50"
            onClick={() => setShowModal(true)}
          >
            Add Member
          </button>
        </div>
        <MemberFormModal open={showModal} setOpen={setShowModal} />
        <NullDataMessage>No members found yet!</NullDataMessage>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 mb-8">
      <div className="sm:flex sm:items-center justify-between">
        <button
          type="button"
          className="block rounded-md bg-primary-50 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-50 mb-4 md:mb-0"
          onClick={() => setShowModal(true)}
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
              handleSortChange(e.target.value as "Date" | "Name" | "")
            }
            value={sort}
          >
            <option value="">Sort by: All</option>
            <option value="Name">Name</option>
            <option value="Date">Date</option>
          </select>
        </div>
      </div>
      <MemberFormModal open={showModal} setOpen={setShowModal} />
      <div className="mt-4 flow-root bg-white shadow-sm ring-1 ring-gray-900/5 rounded-[20px] p-5">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full">
              <thead>
                <tr className="p-2 rounded-xl bg-[#EAEAEA]">
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 rounded-tl-xl rounded-bl-xl"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Joining Date
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Position
                  </th>
                  <th
                    scope="col"
                    className="relative py-3.5 pl-3 pr-4 rounded-tr-xl rounded-br-xl text-sm font-semibold"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedPosts.map((member) => (
                  <tr key={member.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 flex items-center gap-x-2">
                      <Image
                        src={member?.avatar[0]?.image || ""}
                        alt="author"
                        width={24}
                        height={24}
                        className="rounded-full shrink-0 object-cover aspect-square"
                      />
                      <span>{member.name}</span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {moment(member.createdAt).format("DD-MM-YYYY")}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {truncateText(member.position, 20)}
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
                          handleDeleteMember(member.id, member.avatar)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
