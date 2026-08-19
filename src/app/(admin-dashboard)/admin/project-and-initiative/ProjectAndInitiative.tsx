"use client";
import {  Project } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { IoIosArrowDown, IoIosSearch } from "react-icons/io";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Modal from "../../../../components/common/Modal";


interface ProjectAndInitiativeProps {
  projects: Project[];
}

const ProjectAndInitiative = ({
  projects,
}: ProjectAndInitiativeProps) => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("All");
  const [filter, setFilter] = useState("Projects");
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Unified data based on filter
  const data: any = useMemo(() => {
    return projects;
  }, [projects]);

  // Search and sort logic
  const filteredData = useMemo(() => {
    let items = data.filter((item: any) => {
      const name = item.projectName || item.projectTitle || "";
      return name.toLowerCase().includes(search.toLowerCase());
    });
    if (sort === "Newest") {
      items = items
        .slice()
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    } else if (sort === "Oldest") {
      items = items
        .slice()
        .sort(
          (a: any, b: any) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
    }
    return items;
  }, [data, search, sort]);

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        toast.error("Failed to delete project");
        return;
      }
      toast.success("Project deleted successfully");
      setOpenModal(false);
      setSelectedId(null);
      router.refresh();
    } catch {
      toast.error("Error deleting project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen md:p-6">

      <div className="flex flex-col xl:flex-row space-y-4 gap-4  md:space-y-0 justify-between items-center mb-6 pt-4 lg:pt-10">
        <div className="flex gap-4">
          <Link
            href={`/admin/project-and-initiative/new-project`}
            className="bg-gradient-to-r from-[#134C83] to-[#4497E8] text-white shadow-md hover:opacity-90 active:shadow-none px-4 py-2 rounded transition-colors duration-150 text-sm"
          >
            Create New Project
          </Link>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative pl-3 w-72 flex items-center bg-white rounded-md">
            <IoIosSearch className="text-gray-500" />
            <input
              type="text"
              placeholder={`Search ${
                filter === "Projects" ? "Project" : "Impact"
              }`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-none focus:outline-none focus:ring-0 rounded-md px-2 py-2 w-full"
            />
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-72 md:w-48 bg-white px-4 py-2 border-none rounded text-gray-700 focus:outline-none"
          >
            <option value="All">Sort by: All</option>
            <option value="Newest">Newest</option>
            <option value="Oldest">Oldest</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-10">
        {filteredData.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20">
            <img
              src={
                filter === "Projects"
                  ? "/images/nodata.png"
                  : "/images/noDonations.png"
              }
              alt="No data"
              className="w-32 h-32 mb-6 opacity-80"
            />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No Projects Found
            </h2>
            <p className="text-gray-500 text-center max-w-xs mb-4">
              There are currently no projects to display. Click 'Create New
              Project' to add one.
            </p>
            <div className="flex gap-4">
              <Link
                href={`/admin/project-and-initiative/new-project`}
                className="bg-gradient-to-r from-[#134C83] to-[#4497E8] text-white shadow-md hover:opacity-90 active:shadow-none px-4 py-2 rounded transition-colors duration-150 text-sm"
              >
                Create New Project
              </Link>
            </div>
          </div>
        ) : (
          filteredData.map((item: any, index: number) => (
            <div
              key={item.id}
              className="bg-white relative rounded-lg shadow p-4 flex flex-col"
            >
              {filter === "Projects" ? (
                <div className="relative">
                  {/* Project images rendering logic here, adjust as needed */}

                  <Image
                    src={
                      item.heroImage?.[0] ||
                      item.uploadCardImage ||
                      "/images/logo.jpg"
                    }
                    alt={`${item.projectTitle || item.title || "Project"} card`}
                    className="w-full h-32 object-cover rounded-md"
                    width={300}
                    height={300}
                  />
                </div>
              ) : (
                <div className="relative">
                  <Image
                    src={item?.standardImpacts?.[0]?.galleryPhoto?.[0]}
                    alt={`${item.title} slide1`}
                    className="w-full h-32 object-cover rounded-md"
                    width={300}
                    height={300}
                  />
                </div>
              )}

              <div className="flex justify-end mt-2">
                <div className="flex space-x-2 justify-end items-center   text-xs  bg-sky-100 text-blue-700 px-2 py-1 rounded-full w-max">
                  <span className="w-2 h-2 bg-sky-700 rounded-full"></span>
                  {filter === "Projects" ? (
                    <span>Project</span>
                  ) : (
                    <span>Impact</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center gap-1">
                <div className="mt-3">
                  <h3 className="text-sm font-semibold">
                    {item.title ||
                      item.name ||
                      item.projectTitle ||
                      item.projectName}
                  </h3>
                  <p className="text-gray-500 text-xs">
                    {item.type || item.description}
                  </p>
                </div>
                <div className="flex gap-3 text-lg text-gray-600 mt-3">
                  <Link
                    href={`/admin/project-and-initiative/new-project/card-components?edit=1&id=${item.id}`}
                    className="text-blue-600 hover:text-blue-700 cursor-pointer size-4"
                    onClick={() => {
                      try {
                        if (typeof window !== "undefined") {
                          localStorage.setItem("projectId", String(item.id));
                        }
                      } catch {}
                    }}
                    aria-label={`Edit ${item.title || item.name}`}
                  >
                    <FaEdit className="inline-block align-middle" />
                  </Link>
                  <FaTrash
                    aria-label={`Delete ${item.title || item.name}`}
                    className="text-red-500 hover:text-red-600 cursor-pointer size-4"
                    onClick={() => {
                      setSelectedId(item.id);
                      setOpenModal(true);
                    }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Modal
        open={openModal}
        setOpen={setOpenModal}
        handleDelete={() => selectedId && handleDelete(selectedId)}
        loading={loading}
      />
    </div>
  );
};

export default ProjectAndInitiative;
