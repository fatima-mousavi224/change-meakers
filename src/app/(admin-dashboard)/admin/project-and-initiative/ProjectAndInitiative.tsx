"use client";
import { Impact, Project } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FaEyeSlash, FaTrash } from "react-icons/fa";
import { IoIosArrowDown, IoIosSearch } from "react-icons/io";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Modal from "../../../../components/common/Modal";

const FILTER_OPTIONS = [
  { label: "Projects", value: "Projects" },
  { label: "Impacts", value: "Impacts" },
];

interface ProjectAndInitiativeProps {
  projects: Project[];
  impacts: Impact[];
}

const ProjectAndInitiative = ({
  projects,
  impacts,
}: ProjectAndInitiativeProps) => {
  console.log("projects", projects);
  console.log("impacts", impacts);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("All");
  const [filter, setFilter] = useState("Projects");
  const [openModal, setOpenModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Unified data based on filter
  const data = useMemo(() => {
    if (filter === "Projects") return projects;
    return impacts;
  }, [projects, impacts, filter]);

  // Search and sort logic
  const filteredData = useMemo(() => {
    let items = data.filter((item: any) => {
      const name = item.title || item.name || "";
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

  const handleDelete = async (id: number) => {
    setLoading(true);
    const url = filter === "Projects" ? "/api/projects" : "/api/impact";
    try {
      const response = await fetch(`${url}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        toast.error("Failed to delete item");
      }
      toast.success("Item deleted successfully");
      setOpenModal(false);
      setSelectedId(null);
      router.refresh();
    } catch (error) {
      toast.error("Error deleting item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen md:p-6">
      <div className="relative flex justify-center md:justify-end">
        <select
          className="bg-[#134C83] text-white px-4 py-2 rounded shadow-md flex items-center gap-2 w-36 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <IoIosArrowDown className="absolute right-3 top-3 text-white" />
      </div>

      <div className="flex flex-col xl:flex-row space-y-4 gap-4  md:space-y-0 justify-between items-center mb-6 pt-4 lg:pt-10">
        <div className="flex gap-4">
          <Link
            href={`/admin/project-and-initiative/new-project`}
            className="bg-gradient-to-r from-[#134C83] to-[#4497E8] text-white shadow-md hover:opacity-90 active:shadow-none px-4 py-2 rounded transition-colors duration-150 text-sm"
          >
            Create New Project
          </Link>
          <Link
            href={`/admin/project-and-initiative/new`}
            className="bg-gradient-to-r bg-gray-200  text-black shadow-md hover:opacity-90 active:shadow-none px-4 py-2 rounded transition-colors duration-150 text-sm"
          >
            Create New Impact
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
        {filteredData.map((item: any, index: number) => (
          <div
            key={item.id}
            className="bg-white relative rounded-lg shadow p-4 flex flex-col"
          >
            {filter === "Projects" ? (
              <div className="relative">
                {/* Project images rendering logic here, adjust as needed */}

                <Image
                  src={item?.heroImage}
                  alt={`${item.title} slide1`}
                  className="w-full h-32 object-cover rounded-md"
                  width={300}
                  height={300}
                />
              </div>
            ) : (
              <div className="relative">
                <Image
                  src={item?.galleryPhoto}
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
                  <Link
                    href={`/admin/project-and-initiative/impact/${item.id}`}
                  >
                    Project
                  </Link>
                ) : (
                  <span>Impact</span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center gap-1">
              <div className="mt-3">
                <h3 className="text-sm font-semibold">
                  {item.title || item.name || item.projectTitle}
                </h3>
                <p className="text-gray-500 text-xs">
                  {item.type || item.description}
                </p>
              </div>
              <div className="flex gap-3 text-lg text-gray-600 mt-3">
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
        ))}
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
