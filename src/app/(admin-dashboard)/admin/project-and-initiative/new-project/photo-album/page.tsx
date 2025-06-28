"use client";
import Tabs from "@/components/create-project-tabs/Tabs";
import { uploadCardImage } from "lib/uploadCardImage";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { cn } from "utilities/cn";

function PhotoAlbum() {
  // Add this ref to store file input references
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  // Add useForm hook
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    register,
  } = useForm();

  // State for files and image previews
  const [files, setFiles] = React.useState<{ [key: string]: File | null }>({});
  const [imagePreviews, setImagePreviews] = React.useState<{
    [key: string]: string;
  }>({});

  const projectId = localStorage.getItem("projectId");
  const router = useRouter();

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    arg1: string
  ): void {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [arg1]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => ({
          ...prev,
          [arg1]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  }

  // Define the onSubmitPhotoAlbum function
  const onSubmit = async (data: any) => {
    try {
      // 1. Collect image files from local files state
      const imageKeys = [1, 2, 3, 4].map((i) => `photoAlbumImage${i}`);
      const uploadedImageUrls: { [key: string]: string } = {};
      for (const key of imageKeys) {
        const file = files[key]; // Use local files state
        if (file) {
          // Call uploadCardImage for each file
          // @ts-ignore
          const url = await uploadCardImage(file);
          uploadedImageUrls[key] = url;
        }
      }
      // 2. Prepare payload
      const payload = {
        sectionTitlePhoto: data.sectionTitlePhoto,
        sectionDescriptionPhoto: data.sectionDescriptionPhoto,
        ...uploadedImageUrls,
      };
      // 3. Send PATCH request
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        toast.error("Failed to save photo album section.");
      }
      if (response.ok) {
        localStorage.setItem("projectId", result.id);
        toast.success("Photo album section saved successfully!");
        router.push(`/admin/project-and-initiative/new-project/news-letter`);
        clearPhotoAlbumForm();
      }
    } catch (error: any) {
      toast.error(
        error.message || "An error occurred while saving the project section"
      );
    }
  };

  // Clear form handler
  function clearPhotoAlbumForm() {
    reset();
    setFiles({});
    setImagePreviews({});
  }

  return (
    <div className="max-w-screen-2xl mx-auto">
      <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
        Create New Project
      </h2>
      <Tabs />
      {/* Photo Album Section */}
      <section className="border-2 my-6 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
        <h3 className="text-sky-800 text-xl font-semibold">
          11. Photo Album Section
        </h3>
        <p className="my-2">Label's Name</p>
        <div className="bg-gray-200 w-40 space-x-4 px-2 my-2 py-2 rounded-full flex justify-center items-center">
          <span className="bg-sky-700 h-2 w-2 rounded-full"></span>
          <span className="text-gray-400">e.g., "Photos"</span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="col-span-1 mt-4 md:mt-0">
              <label className="block text-sm/6 font-medium text-gray-900">
                Section Title
              </label>
              <Controller
                name="sectionTitlePhoto"
                control={control}
                rules={{
                  required: "Section Title is required",
                  maxLength: 50,
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="e.g. 'Photo Album'"
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  />
                )}
              />
              {errors.sectionTitlePhoto && (
                <p className="text-red-500 text-sm">
                  {errors.sectionTitlePhoto?.message as string}
                </p>
              )}
            </div>
            <div className="col-span-2 mt-4 md:mt-0">
              <label className="block text-sm/6 font-medium text-gray-900">
                Section Description
              </label>
              <Controller
                name="sectionDescriptionPhoto"
                control={control}
                rules={{
                  required: "Section Description is required",
                  maxLength: 1000,
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
              {errors.sectionDescriptionPhoto && (
                <p className="text-red-500 text-sm">
                  {errors?.sectionDescriptionPhoto.message as string}
                </p>
              )}
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2"
              >
                <div className="relative text-center">
                  {files[`photoAlbumImage${index}`] ? (
                    <div className="relative">
                      <img
                        src={imagePreviews[`photoAlbumImage${index}`]}
                        alt={`Photo Album Image ${index} Preview`}
                        className="mx-auto w-16 h-16 object-cover"
                      />
                      <span
                        className="absolute top-0 right-0 cursor-pointer"
                        onClick={() => {
                          setFiles((prev) => ({
                            ...prev,
                            [`photoAlbumImage${index}`]: null,
                          }));
                          setImagePreviews((prev) => {
                            const newPreviews = { ...prev };
                            delete newPreviews[`photoAlbumImage${index}`];
                            return newPreviews;
                          });
                          if (
                            fileInputRefs.current[`photoAlbumImage${index}`]
                          ) {
                            fileInputRefs.current[
                              `photoAlbumImage${index}`
                            ]!.value = "";
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
                    {...register(`photoAlbumImage${index}`)}
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) =>
                      handleFileChange(e, `photoAlbumImage${index}`)
                    }
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    ref={(el) => {
                      if (fileInputRefs && fileInputRefs.current) {
                        fileInputRefs.current[`photoAlbumImage${index}`] = el;
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
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className={cn(
                "bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={clearPhotoAlbumForm}
              className="ml-2 bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Clear
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default PhotoAlbum;
