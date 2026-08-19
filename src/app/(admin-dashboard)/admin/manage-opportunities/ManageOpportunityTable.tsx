"use client";

import NullDataMessage from "@/components/null-data/NullDataMessage";
import { truncateText } from "@/utilities/truncateText";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Opportunity } from "@prisma/client";
import { Pencil, Trash2 } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import OpportunityFormModal from "./OpportunityFormModal";

interface ManageOpportunityTableProps {
  opportunities: Opportunity[];
}

export default function ManageOpportunityTable({
  opportunities,
}: ManageOpportunityTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"Date" | "Title" | "">("");
  const [showModal, setShowModal] = useState(false);

  const filteredAndSorted = useMemo(() => {
    let items = opportunities.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === "Date") {
      items = items.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sort === "Title") {
      items = items.sort((a, b) => a.title.localeCompare(b.title));
    }

    return items;
  }, [opportunities, search, sort]);

  const handleDelete = useCallback(
    async (id: string) => {
      toast.success("Deleting opportunity...");
      try {
        const res = await fetch(`/api/opportunities/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Delete failed");
        toast.success("Opportunity deleted successfully");
        router.refresh();
      } catch {
        toast.error("Failed to delete opportunity");
      }
    },
    [router]
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 mb-8">
      <OpportunityFormModal open={showModal} setOpen={setShowModal} />

      {opportunities.length === 0 ? (
        <>
          <div className="sm:flex sm:items-center justify-between mb-6">
            <button
              type="button"
              className="block rounded-md bg-primary-50 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-100"
              onClick={() => setShowModal(true)}
            >
              Add Opportunity
            </button>
          </div>
          <NullDataMessage>No opportunities found yet!</NullDataMessage>
        </>
      ) : (
        <>
          <div className="sm:flex sm:items-center justify-between">
            <button
              type="button"
              className="block rounded-md bg-primary-50 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-100 mb-4 md:mb-0"
              onClick={() => {
                router.replace("/admin/manage-opportunities");
                setShowModal(true);
              }}
            >
              Add Opportunity
            </button>
            <div className="flex items-center gap-x-2.5">
              <div className="grid w-full max-w-lg grid-cols-1 lg:max-w-xs">
                <input
                  name="search"
                  type="search"
                  placeholder="Search by title"
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
                  setSort(e.target.value as "Date" | "Title" | "")
                }
                value={sort}
              >
                <option value="">Sort by: All</option>
                <option value="Title">Title</option>
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
                        Title
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Category
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Location
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Deadline
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="relative py-3.5 pl-3 pr-4 rounded-tr-xl rounded-br-xl text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAndSorted.map((item) => (
                      <tr key={item.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.title}
                                width={24}
                                height={24}
                                className="size-6 rounded object-cover"
                              />
                            ) : null}
                            <span>{truncateText(item.title, 40)}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {truncateText(item.category, 24)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {item.location}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {moment(item.deadline).format("DD-MM-YYYY")}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              item.published
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {item.published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium flex gap-2">
                          <span className="bg-blue-500 rounded-md p-0.5">
                            <Pencil
                              className="w-4 h-4 text-white cursor-pointer"
                              onClick={() => {
                                router.push(
                                  `/admin/manage-opportunities?opportunityId=${item.id}`
                                );
                                setShowModal(true);
                              }}
                            />
                          </span>
                          <Trash2
                            className="w-5 h-5 text-red-500 cursor-pointer"
                            onClick={() => handleDelete(item.id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
