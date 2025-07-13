'use client'
import React, { useState, useMemo } from "react";
import { Impact } from "@/types/impact";

import { useRouter } from "next/navigation";
import { getStorage, ref, deleteObject } from "firebase/storage";
import firebaseApp from "@/lib/firebase";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import moment from "moment";
import { truncateText } from "@/utilities/truncateText";
import toast from "react-hot-toast";
import ImpactFormModal from "./ImpactFormModal";

export const revalidate = 0;

interface ManageImpactsTableProps {
  impacts: Impact[];
}

export default function ManageImpactsTable({ impacts }: ManageImpactsTableProps) {
  const router = useRouter();
  const storage = getStorage(firebaseApp);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"Date" | "Title" | "">("");
  const [showModal, setShowModal] = useState(false);
  const [editingImpactId, setEditingImpactId] = useState<string | null>(null);

  const handleSortChange = (sortItem: "Date" | "Title" | "") => {
    setSort(sortItem);
  };

  const filteredAndSortedImpacts = useMemo(() => {
    let filteredImpacts = impacts.filter((impact) =>
      impact.title?.toLowerCase().includes(search.toLowerCase())
    ) || [];

    if (sort === "Date") {
      filteredImpacts = filteredImpacts.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });
    } else if (sort === "Title") {
      filteredImpacts = filteredImpacts.sort((a, b) =>
        a.title?.localeCompare(b.title || "") || 0
      );
    }

    return filteredImpacts;
  }, [impacts, search, sort]);

  const handleDeleteImpact = async (id: string, images: string[]) => {
    toast.success("Deleting impact please wait...");

    async function deleteImpactImages() {
      try {
        for (const image of images) {
          if (image) {
            const imageRef = ref(storage, image);
            await deleteObject(imageRef);
          }
        }
      } catch (error: any) {
        console.log("Error deleting image from Firebase Storage: ", error.message);
      }
    }

    await deleteImpactImages();

    await fetch(`/api/impact/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        toast.success("Impact deleted successfully");
        router.refresh();
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 mb-8">
      <div className="sm:flex sm:items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Impact Management</h1>
        <button
          type="button"
          className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          onClick={() => {
            setEditingImpactId(null);
            setShowModal(true);
          }}
        >
          Create New Impact
        </button>
      </div>
      <div className="flex items-center gap-x-2.5 mt-4">
        <div className="grid w-full max-w-lg grid-cols-1 lg:max-w-xs">
          <input
            name="search"
            type="search"
            placeholder="Search"
            className="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-10 pr-3 text-base text-gray-900 border-gray-300 placeholder:text-gray-400 sm:text-sm/6 focus:border-blue-600"
            onChange={(e) => setSearch(e.target.value)}
          />
          <MagnifyingGlassIcon
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400"
          />
        </div>
        <select
          className="rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 border-gray-300 focus:outline-2 sm:text-sm/6 focus:border-blue-600 cursor-pointer"
          onChange={(e) => handleSortChange(e.target.value as "Date" | "Title" | "")}
          value={sort}
        >
          <option value="">Sort by: All</option>
          <option value="Title">Title</option>
          <option value="Date">Date</option>
        </select>
      </div>
      <ImpactFormModal
        open={showModal}
        setOpen={setShowModal}
        impactId={editingImpactId}
      />
      <div className="mt-4 flow-root bg-white shadow-sm ring-1 ring-gray-900/5 rounded-[20px] p-5">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full">
              <thead>
                <tr className="p-2 rounded-xl bg-[#EAEAEA]">
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 rounded-tl-xl rounded-bl-xl">
                    Author
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Title
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Project
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Impact Tags
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 rounded-tr-xl rounded-br-xl text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedImpacts.map((impact) => (
                  <tr key={impact.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 flex items-center gap-x-2">
                      {impact.authorPhoto && (
                        <Image
                          src={impact.authorPhoto}
                          alt="author"
                          width={24}
                          height={24}
                          className="rounded-full shrink-0 object-cover aspect-square"
                        />
                      )}
                      <span>{impact.author || "N/A"}</span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {truncateText(impact.title || "N/A", 20)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {impact.projectName || "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {impact.impactTags || "N/A"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {moment(impact.date).format("DD-MM-YYYY")}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium flex gap-2">
                      <span className="bg-blue-500 rounded-md p-0.5">
                        <Pencil
                          className="w-4 h-4 text-white cursor-pointer"
                          onClick={() => {
                            setEditingImpactId(impact.id);
                            setShowModal(true);
                          }}
                        />
                      </span>
                      <Trash2
                        className="w-5 h-5 text-red-500 cursor-pointer"
                        onClick={() =>
                          handleDeleteImpact(impact.id, [
                            impact.authorPhoto,
                            impact.coverPhoto,
                            ...(impact.galleryPhoto || []),
                          ].filter(Boolean) as string[])
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

