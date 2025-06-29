"use client";

import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import Tabs from "@/components/create-project-tabs/Tabs";
import { cn } from "@/lib/utils";
import { uploadCardImage } from "lib/uploadCardImage";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type FormData = {
  heroTitleMedia: string;
  shortDescriptionMedia: string;
  videoLink: string;
  fullVideoDescription: string;
  mediaHeroImage: File | null;
};

export default function MediaBlockSection() {
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
    register,
  } = useForm<FormData>({
    defaultValues: {
      heroTitleMedia: "",
      shortDescriptionMedia: "",
      videoLink: "",
      fullVideoDescription: "",
      mediaHeroImage: null,
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const projectId = localStorage.getItem("projectId");
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setValue("mediaHeroImage", file);

    if (!file) {
      setImagePreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setValue("mediaHeroImage", null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: FormData) => {
    try {
      let imageUrl = "";
      if (data.mediaHeroImage) {
        imageUrl = await uploadCardImage(data.mediaHeroImage);
      }
      const payload = {
        ...data,
        mediaHeroImage: imageUrl,
      };
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        localStorage.setItem("projectId", result.id);
        reset();
        setImagePreview(null);
        toast.success("Media Block Section updated successfully!");
        router.push("/admin/project-and-initiative/new-project/offer");
      }
    } catch (error) {
      // Optionally, handle error (e.g., show an error message)
      console.error(error);
      toast.error("Failed to update Media Block Section. Please try again.");
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
        Create New Project
      </h2>
      <Tabs />
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto">
        <section className="border-2 my-6 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
          <h2 className="text-xl font-semibold mb-4 text-sky-800">
            6. Media Block Section
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Upload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 col-span-2">
              <div className="col-span-1">
                <label className="block text-sm/6 font-medium">
                  Upload Hero Image
                </label>
                <div className="mt-2 flex flex-col justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 relative cursor-pointer">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Media Hero Image Preview"
                        className="mx-auto w-16 h-16 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                      <p className="mt-4 text-center font-semibold text-blue-500">
                        Drag & Drop your Photo
                      </p>
                      <p className="text-gray-500 text-center">
                        here or Browse up to 10 MB
                      </p>
                    </div>
                  ) : (
                    <>
                      <svg
                        className="mx-auto w-12 h-12 text-gray-300"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="mt-4 text-center font-semibold text-blue-500">
                        Drag & Drop your Photo
                      </p>
                      <p className="text-gray-500 text-center">
                        here or Browse up to 10 MB
                      </p>
                    </>
                  )}

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    ref={fileInputRef}
                  />
                </div>
              </div>
            </div>

            {/* Text Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:col-span-2 mt-4 md:mt-0">
              {/* Hero Title */}
              <div className="col-span-2">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Hero Title
                </label>
                <input
                  {...register("heroTitleMedia", {
                    required: "Hero Title is required",
                    maxLength: 50,
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
                <label className="block text-sm/6 font-medium text-gray-900">
                  Short Description
                </label>
                <input
                  {...register("shortDescriptionMedia", {
                    required: "Short Description is required",
                    maxLength: 200,
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
                <label className="block text-sm/6 font-medium text-gray-900">
                  Video Link
                </label>
                <input
                  {...register("videoLink", {
                    required: "Video Link is required",
                    maxLength: 200,
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
                <label className="block text-sm/6 font-medium text-gray-900">
                  Full Video Description
                </label>
                <input
                  {...register("fullVideoDescription", {
                    required: "Full Video Description is required",
                    maxLength: 500,
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
              setImagePreview(null);
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
