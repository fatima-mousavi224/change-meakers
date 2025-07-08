"use client";

import Tabs from "@/components/create-project-tabs/Tabs";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { uploadCardImage } from "lib/uploadCardImage";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTabs } from "@/components/context/TabsContext";
import DeleteModal from "@/components/delete-modal/deleteModal";

interface VisionGoalFormValues {
  visionTitle: string;
  visionText: string;
  goalTitle: string;
  goalText: string;
  visionGoalImages: (File | null)[];
}

export default function VisionGoalForm() {
  const { hideTab } = useTabs();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VisionGoalFormValues>({
    defaultValues: {
      visionGoalImages: [null, null, null, null],
    },
  });

  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>(
    {}
  );
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const router = useRouter();
  const projectId = localStorage.getItem("projectId");

  const setRef = (key: string) => (ref: HTMLInputElement | null) => {
    fileInputRefs.current[key] = ref;
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => ({
          ...prev,
          [key]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
      setValue(`visionGoalImages.${index}` as any, file);
    }
  };

  const onSubmit = async (data: VisionGoalFormValues) => {
    try {
      // Upload each image to Firebase and get URLs
      const uploadedImageUrls = await Promise.all(
        (data.visionGoalImages || []).map(async (file) => {
          if (file) {
            return await uploadCardImage(file);
          }
          return null;
        })
      );
      // Prepare payload with image URLs, do NOT send visionGoalImages
      const { visionGoalImages, ...rest } = data;
      const payload = {
        ...rest,
        visionGoalImage1: uploadedImageUrls[0],
        visionGoalImage2: uploadedImageUrls[1],
        visionGoalImage3: uploadedImageUrls[2],
        visionGoalImage4: uploadedImageUrls[3],
      };
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success("Vision & Goal section saved!");
        router.push("/admin/project-and-initiative/new-project/about-program");
        reset();
        setImagePreviews({});
        Object.values(fileInputRefs.current).forEach((input) => {
          if (input) input.value = "";
        });
      } else {
        toast.error("Failed to save Vision & Goal section.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save Vision & Goal section. Please try again.");
    }
  };

  // delete section button handler
  const [showModal, setShowModal] = useState(false);
  const [deleteSection, setDeleteSection] = useState("block");
  const handleDeleteSection = () => {
    setDeleteSection((prev) => (prev === "block" ? "hidden" : "block"));
    setShowModal(false);
    router.push("/admin/project-and-initiative/new-project/about-program");
    toast.success("Vission-goal section deleted successfully!");
    reset();
    hideTab("/vission-goal");
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
        <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
          Create New Project
        </h2>
      <Tabs />
      <DeleteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onDelete={handleDeleteSection}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${deleteSection} border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white mt-8 `}
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-sky-800 text-xl font-semibold">
            3. Vision & Goal Section
          </h3>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="bg-red-500 rounded-lg px-4 py-2 transition-all duration-150 shadow-md active:shadow-none text-white"
          >
            Delete this section
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Vision Title
            </label>
            <input
              {...register("visionTitle", {
                required: "Vision Title is required",
              })}
              type="text"
              placeholder="e.g. 'Our Vision'"
              className="block w-full rounded-md border border-dashed border-gray-300 px-6 py-3"
            />
            {errors.visionTitle && (
              <p className="text-red-500 text-sm">
                {errors.visionTitle.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Vision Text
            </label>
            <input
              {...register("visionText", {
                required: "Vision Text is required",
              })}
              type="text"
              placeholder="Write something here..."
              className="block w-full rounded-md border border-dashed border-gray-300 px-6 py-3"
            />
            {errors.visionText && (
              <p className="text-red-500 text-sm">
                {errors.visionText.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Goal Title
            </label>
            <input
              {...register("goalTitle", {
                required: "Goal Title is required",
              })}
              type="text"
              placeholder="e.g. 'Our Goal'"
              className="block w-full rounded-md border border-dashed border-gray-300 px-6 py-3"
            />
            {errors.goalTitle && (
              <p className="text-red-500 text-sm">{errors.goalTitle.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Goal Text
            </label>
            <input
              {...register("goalText", {
                required: "Goal Text is required",
              })}
              type="text"
              placeholder="Write something here..."
              className="block w-full rounded-md border border-dashed border-gray-300 px-6 py-3"
            />
            {errors.goalText && (
              <p className="text-red-500 text-sm">{errors.goalText.message}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">
            Upload Image(s),{" "}
            <span className="text-gray-500">Maximum 4 Images</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((index) => {
              const key = `visionGoalImage${index}`;
              return (
                <div
                  key={index}
                  className="flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-4"
                >
                  <div className="relative text-center">
                    {imagePreviews[key] ? (
                      <div className="relative">
                        <img
                          src={imagePreviews[key]}
                          alt={`Preview ${index}`}
                          className="mx-auto w-16 h-16 object-cover"
                        />
                        <span
                          className="absolute top-0 right-0 cursor-pointer"
                          onClick={() => {
                            setImagePreviews((prev) => {
                              const updated = { ...prev };
                              delete updated[key];
                              return updated;
                            });
                            setValue(
                              `visionGoalImages.${index - 1}` as any,
                              null
                            );
                            fileInputRefs.current[key]?.value &&
                              (fileInputRefs.current[key]!.value = "");
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
                      onChange={(e) => handleFileChange(e, key, index - 1)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      ref={setRef(key)}
                    />
                    <p className="mt-2 text-blue-500 font-medium">
                      Drag & Drop
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className={cn(
              "mt-6 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700",
              isSubmitting && "opacity-50 cursor-not-allowed"
            )}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              setImagePreviews({});
              Object.values(fileInputRefs.current).forEach((input) => {
                if (input) input.value = "";
              });
            }}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
}
