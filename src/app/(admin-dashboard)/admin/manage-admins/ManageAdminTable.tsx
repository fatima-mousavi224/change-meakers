"use client";
import { useCallback, useMemo, useState } from "react";

import NullDataMessage from "@/components/null-data/NullDataMessage";
import firebaseApp from "@/lib/firebase";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { User } from "@prisma/client";
import { deleteObject, getStorage, ref } from "firebase/storage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ToggleAdminBtn from "../_components/ToggleAdminBtn";

interface ManageTeamMembersTableProps {
  users: User[];
  handleToggleAdminRole: (
    id: string
  ) => Promise<{ success: boolean; message: string }>;
}

export default function ManageAdminTable({
  users,
  handleToggleAdminRole,
}: ManageTeamMembersTableProps) {
  const router = useRouter();
  const storage = getStorage(firebaseApp);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"Date" | "Name" | "">("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSortChange = (sortItem: "Date" | "Name" | "") => {
    setSort(sortItem);
  };

  // Derived sorted and filtered posts
  const filteredAndSortedUsers = useMemo(() => {
    let filteredPosts = users.filter((user) =>
      user?.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === "Date") {
      filteredPosts = filteredPosts.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    } else if (sort === "Name") {
      // @ts-ignore
      filteredPosts = filteredPosts.sort((a, b) =>
        // @ts-ignore
        a?.name?.localeCompare(b?.name)
      );
    }

    return filteredPosts;
  }, [users, search, sort]);

  const handleDeleteUser = useCallback(
    async (userId: string, avatar: any[]) => {
      setIsDeleting(true);
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

      await fetch(`/api/delete-account/${userId}`, {
        method: "DELETE",
      })
        .then(() => {
          toast.success("User deleted successfully");
          router.refresh();
        })
        .catch((error) => {
          toast.error(error.message);
        })
        .finally(() => {
          setIsDeleting(false);
        });
    },
    [router, storage]
  );

  if (users.length === 0) {
    return <NullDataMessage>No users found yet!</NullDataMessage>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 mb-8">
      <div className="sm:flex sm:items-center justify-between">
        <div />
        <div className="flex items-center justify-end gap-x-2.5">
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
      <div className="mt-4 flow-root bg-white shadow-sm ring-1 ring-gray-900/5 rounded-[20px] p-5">
        <div className="-mx-4 -my-2 overflow-x-auto sm:px-4 sm:-mx-4 lg:-mx-2 xl:-mx-8">
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
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="relative py-3.5 pl-3 pr-4 rounded-tr-xl rounded-br-xl text-sm font-semibold"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 flex items-center gap-x-2">
                      {user.image ? (
                        <Image
                          src={user.image || ""}
                          alt="author"
                          width={24}
                          height={24}
                          className="rounded-full shrink-0 object-cover aspect-square"
                        />
                      ) : (
                        <div className="bg-[#EAEAEA] rounded-full flex justify-center items-center size-6 ">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span>{user.name}</span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.role}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium flex gap-2 justify-center">
                      <ToggleAdminBtn
                        toggleAdminRole={handleToggleAdminRole}
                        user={user}
                      />
                      <button
                        disabled={isDeleting}
                        onClick={() => handleDeleteUser(user.id, [user?.image])}
                        className="disabled:cursor-not-allowed disabled:bg-rose-400/80 block rounded-md bg-rose-400 px-2 py-1 text-center text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 "
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
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
