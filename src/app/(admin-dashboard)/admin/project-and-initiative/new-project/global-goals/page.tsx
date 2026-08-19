"use client";

import { useProjectId } from "@/hooks/useProjectId";

import { useForm, Controller } from "react-hook-form";
import { useRef, useState } from "react";
import Tabs from "@/components/create-project-tabs/Tabs";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { uploadCardImage } from "lib/uploadCardImage";
import { useRouter, useSearchParams } from "next/navigation";
import DeleteModal from "@/components/delete-modal/deleteModal";
import { useTabs } from "@/components/context/TabsContext";

// Define the form data type
type FormData = {
  sectionTitleSDGs: string;
  sectionTextSDGs: string;
};

export default function GlobalGoalsSection() {
  const { hideTab } = useTabs();
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string }>(
    {}
  );
  const projectId = useProjectId();
  const searchParams = useSearchParams();
  const isEdit = searchParams?.get("edit") === "1";
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      sectionTitleSDGs: "",
      sectionTextSDGs: "",
    },
  });

  const onSubmitSDGs = async (data: FormData) => {
    try {
      // 1. Upload all selected images and get their URLs
      const imageUploadPromises = Object.entries(files)
        .filter(([_, file]) => file)
        .map(async ([key, file]) => {
          const url = await uploadCardImage(file!);
          return { key, url };
        });
      const uploadedImages = await Promise.all(imageUploadPromises);
      // 2. Build sdgsImages array or object (as needed)
      const sdgsImages: Record<string, string> = {};
      uploadedImages.forEach(({ key, url }) => {
        sdgsImages[key] = url;
      });
      // 3. Combine with form data
      const payload = {
        ...data,
        sdgsImage1: sdgsImages.sdgsImage0 || null,
        sdgsImage2: sdgsImages.sdgsImage1 || null,
        sdgsImage3: sdgsImages.sdgsImage2 || null,
        sdgsImage4: sdgsImages.sdgsImage3 || null,
      };
      // 4. Send PATCH request
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) toast.error(result.error || "Failed to save global goals");
      if (res.ok) {
        localStorage.setItem("projectId", result.id);
        const suffix = isEdit ? `?edit=1&id=${result.id}` : "";
        router.push(`/admin/project-and-initiative/new-project/related-links${suffix}`);
        toast.success("Global goals saved successfully!");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const clearSDGsForm = () => {
    reset();
    setFiles({});
    setImagePreviews({});
    Object.values(fileInputRefs.current).forEach((input) => {
      if (input) input.value = "";
    });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [key]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => ({
          ...prev,
          [key]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // delete section button handler
  const [showModal, setShowModal] = useState(false);
  const [deleteSection, setDeleteSection] = useState("block");
  const handleDeleteSection = () => {
    setDeleteSection((prev) => (prev === "block" ? "hidden" : "block"));
    setShowModal(false);
    router.push("/admin/project-and-initiative/new-project/related-links");

    toast.success("Global-goals section deleted successfully!");
    reset();
    hideTab("/global-goals");
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
        {isEdit ? "Edit Project" : "Create New Project"}
      </h2>
      <Tabs />
      <section
        className={`${deleteSection} border-2 my-6 rounded-lg p-4 md:p-8 lg:px-14 bg-white `}
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-sky-800 text-xl font-semibold">
            14. Global Goals (SDGs)
          </h3>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="bg-red-500 rounded-lg px-4 py-2 transition-all duration-150 shadow-md active:shadow-none text-white"
          >
            Delete this section
          </button>
        </div>
        <p className="my-2">Label's Name</p>
        <DeleteModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onDelete={handleDeleteSection}
        />
        <form onSubmit={handleSubmit(onSubmitSDGs)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="col-span-1 mt-4 md:mt-0">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Section Title
              </label>
              <Controller
                name="sectionTitleSDGs"
                control={control}
                rules={{ required: "Section Title is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="e.g. 'Sustainable Development Goals'"
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  />
                )}
              />
              {errors.sectionTitleSDGs && (
                <p className="text-red-500 text-sm">
                  {errors.sectionTitleSDGs.message}
                </p>
              )}
            </div>
            <div className="col-span-2 mt-4 md:mt-0">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Section Text
              </label>
              <Controller
                name="sectionTextSDGs"
                control={control}
                rules={{
                  required: "Section Text is required",
                }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    placeholder="write something here..."
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    rows={4}
                  />
                )}
              />
              {errors.sectionTextSDGs && (
                <p className="text-red-500 text-sm">
                  {errors.sectionTextSDGs.message}
                </p>
              )}
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2"
              >
                <div className="relative text-center">
                  {files[`sdgsImage${index}`] ? (
                    <div className="relative">
                      <img
                        src={imagePreviews[`sdgsImage${index}`]}
                        alt={`SDGs Image ${index} Preview`}
                        className="mx-auto w-16 h-16 object-cover"
                      />
                      <span
                        className="absolute top-0 right-0 cursor-pointer"
                        onClick={() => {
                          setFiles((prev) => ({
                            ...prev,
                            [`sdgsImage${index}`]: null,
                          }));
                          setImagePreviews((prev) => {
                            const newPreviews = { ...prev };
                            delete newPreviews[`sdgsImage${index}`];
                            return newPreviews;
                          });
                          if (fileInputRefs.current[`sdgsImage${index}`]) {
                            fileInputRefs.current[`sdgsImage${index}`]!.value =
                              "";
                          }
                        }}
                      >
                        ✖
                      </span>
                    </div>
                  ) : (
                    <svg
                      className="mx-auto w-12 h-12 text-gray-300"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, `sdgsImage${index}`)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    ref={(el) => {
                      if (fileInputRefs.current) {
                        fileInputRefs.current[`sdgsImage${index}`] = el;
                      }
                    }}
                  />
                  <p className="mt-4 font-semibold text-blue-500">
                    Drag & Drop your Photo
                  </p>
                  <p className="text-gray-500">here or Browse up to 10 MB</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className={cn(
                "bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={clearSDGsForm}
              className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400"
            >
              Clear
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
