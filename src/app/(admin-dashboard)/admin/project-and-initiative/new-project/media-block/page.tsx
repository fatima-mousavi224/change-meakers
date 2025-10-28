"use client";

import { useTabs } from "@/components/context/TabsContext";
import Tabs from "@/components/create-project-tabs/Tabs";
import DeleteModal from "@/components/delete-modal/deleteModal";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type FormData = {
  heroTitleMedia: string;
  shortDescriptionMedia: string;
  videoLink: string;
  fullVideoDescription: string;
};

export default function MediaBlockSection() {
  const { hideTab } = useTabs();
  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    register,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      heroTitleMedia: "",
      shortDescriptionMedia: "",
      videoLink: "",
      fullVideoDescription: "",
    },
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const projectId = localStorage.getItem("projectId");
  const searchParams = useSearchParams();
  const isEdit = searchParams?.get("edit") === "1";
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      if (!isEdit || !projectId) return;
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) return;
        const p = await res.json();
        setValue("heroTitleMedia", p.heroTitleMedia || "");
        setValue("shortDescriptionMedia", p.shortDescriptionMedia || "");
        setValue("videoLink", p.videoLink || "");
        setValue("fullVideoDescription", p.fullVideoDescription || "");
      } catch {}
    };
    load();
  }, [isEdit, projectId]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        ...data,
      };
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      console.log("🚀 ~ onSubmit ~ result:", result);
      if (res.ok) {
        localStorage.setItem("projectId", result.id);
        reset();
        toast.success("Media Block Section updated successfully!");
        const suffix = isEdit ? `?edit=1&id=${projectId}` : "";
        router.push(`/admin/project-and-initiative/new-project/offer${suffix}`);
      }
    } catch (error) {
      // Optionally, handle error (e.g., show an error message)
      console.error(error);
      toast.error("Failed to update Media Block Section. Please try again.");
    }
  };

  // delete section button handler
  const [showModal, setShowModal] = useState(false);
  const [deleteSection, setDeleteSection] = useState("block");
  const handleDeleteSection = () => {
    setDeleteSection((prev) => (prev === "block" ? "hidden" : "block"));
    setShowModal(false);
    router.push("/admin/project-and-initiative/new-project/offer");
    toast.success("Media-block section deleted successfully!");
    reset();
    hideTab("/media-block");
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
        {isEdit ? "Edit Project" : "Create New Project"}
      </h2>
      <Tabs />
      <DeleteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onDelete={handleDeleteSection}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${deleteSection} max-w-5xl mx-auto `}
      >
        <section className="border-2 my-6 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold mb-4 text-sky-800">
              6. Media Block Section
            </h2>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="bg-red-500 rounded-lg px-4 py-2 transition-all duration-150 shadow-md active:shadow-none text-white"
            >
              Delete this section
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Text Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:col-span-2 mt-4 md:mt-0">
              {/* Hero Title */}
              <div className="col-span-2">
                <label className="block text-sm/6 font-medium text-gray-900 mb-2">
                  Hero Title
                </label>
                <input
                  {...register("heroTitleMedia", {
                    required: "Hero Title is required",
                  })}
                  type="text"
                  placeholder="write something here..."
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                />
                {errors.heroTitleMedia && (
                  <p className="text-red-500 text-sm">
                    {errors.heroTitleMedia.message}
                  </p>
                )}
              </div>

              {/* Short Description */}
              <div className="col-span-2">
                <label className="block text-sm/6 font-medium text-gray-900 mb-2">
                  Short Description
                </label>
                <input
                  {...register("shortDescriptionMedia", {
                    required: "Short Description is required",
                  })}
                  type="text"
                  placeholder="write something here..."
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                />
                {errors.shortDescriptionMedia && (
                  <p className="text-red-500 text-sm">
                    {errors.shortDescriptionMedia.message}
                  </p>
                )}
              </div>

              {/* Video Link */}
              <div className="col-span-2">
                <label className="block text-sm/6 font-medium text-gray-900 mb-2">
                  Video Link
                </label>
                <input
                  {...register("videoLink", {
                    required: "Video Link is required",
                  })}
                  type="text"
                  placeholder="write something here..."
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                />
                {errors.videoLink && (
                  <p className="text-red-500 text-sm">
                    {errors.videoLink.message}
                  </p>
                )}
              </div>

              {/* Full Video Description */}
              <div className="col-span-2">
                <label className="block text-sm/6 font-medium text-gray-900 mb-2">
                  Full Video Description
                </label>
                <input
                  {...register("fullVideoDescription", {
                    required: "Full Video Description is required",
                  })}
                  type="text"
                  placeholder="Enter the description"
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                />
                {errors.fullVideoDescription && (
                  <p className="text-red-500 text-sm">
                    {errors.fullVideoDescription.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Form Actions */}
        <div className="mt-6 flex justify-between gap-4 ">
          <button
            type="submit"
            className={cn(
              "px-6 py-2 bg-sky-600 text-white rounded-md shadow hover:bg-sky-700 transition",
              isSubmitting && "opacity-50 cursor-not-allowed"
            )}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md shadow hover:bg-gray-400 transition"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
