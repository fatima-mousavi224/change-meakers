"use client";

import PostFormModal from "@/app/(admin-dashboard)/admin/_components/PostFormModal";
import NullDataMessage from "@/components/null-data/NullDataMessage";
import { truncateText } from "@/utilities/truncateText";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Post } from "@prisma/client";
import { Pencil, Trash2 } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

import type { UpdateFormCategory } from "@/lib/updateCategories";

type PostWithCategory = Post & {
  Category: { id: string; title: string } | null;
};

interface ManagePostTableProps {
  posts: PostWithCategory[];
  categories: UpdateFormCategory[];
}

export default function ManagePostTable({
  posts,
  categories,
}: ManagePostTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"Date" | "Title" | "">("");
  const [showModal, setShowModal] = useState(false);

  const filteredAndSorted = useMemo(() => {
    let items = posts.filter((post) =>
      post.title.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === "Date") {
      items = items.sort((a, b) => {
        const dateA = a.postDate ? new Date(a.postDate).getTime() : 0;
        const dateB = b.postDate ? new Date(b.postDate).getTime() : 0;
        return dateB - dateA;
      });
    } else if (sort === "Title") {
      items = items.sort((a, b) => a.title.localeCompare(b.title));
    }

    return items;
  }, [posts, search, sort]);

  const handleDelete = useCallback(
    async (id: string) => {
      toast.success("Deleting update...");
      try {
        const res = await fetch(`/api/post/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Delete failed");
        toast.success("Update deleted successfully");
        router.refresh();
      } catch {
        toast.error("Failed to delete update");
      }
    },
    [router]
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 mb-8">
      <PostFormModal
        open={showModal}
        setOpen={setShowModal}
        categories={categories}
      />

      {posts.length === 0 ? (
        <>
          <div className="sm:flex sm:items-center justify-between mb-6">
            <button
              type="button"
              className="block rounded-md bg-primary-50 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-100"
              onClick={() => setShowModal(true)}
            >
              Add Update
            </button>
          </div>
          <NullDataMessage>No updates found yet!</NullDataMessage>
        </>
      ) : (
        <>
          <div className="sm:flex sm:items-center justify-between">
            <button
              type="button"
              className="block rounded-md bg-primary-50 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-100 mb-4 md:mb-0"
              onClick={() => {
                router.replace("/admin/manage-posts");
                setShowModal(true);
              }}
            >
              Add Update
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
                        Author
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Date
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Home
                      </th>
                      <th className="relative py-3.5 pl-3 pr-4 rounded-tr-xl rounded-br-xl text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredAndSorted.map((post) => (
                      <tr key={post.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            {post.authorImage?.image ? (
                              <Image
                                src={post.authorImage.image}
                                alt={post.title}
                                width={24}
                                height={24}
                                className="size-6 rounded object-cover"
                              />
                            ) : null}
                            <span>{truncateText(post.title, 40)}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {truncateText(post.Category?.title ?? "Updates", 24)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {post.author}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {post.postDate
                            ? moment(post.postDate).format("DD-MM-YYYY")
                            : "—"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              post.showInHome
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {post.showInHome ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium flex gap-2">
                          <span className="bg-blue-500 rounded-md p-0.5">
                            <Pencil
                              className="w-4 h-4 text-white cursor-pointer"
                              onClick={() => {
                                router.push(
                                  `/admin/manage-posts?postId=${post.id}`
                                );
                                setShowModal(true);
                              }}
                            />
                          </span>
                          <Trash2
                            className="w-5 h-5 text-red-500 cursor-pointer"
                            onClick={() => handleDelete(post.id)}
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
