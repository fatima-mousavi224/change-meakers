"use client";

import Tabs from "@/components/create-project-tabs/Tabs";
import { uploadCardImage } from "lib/uploadCardImage";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { cn } from "utilities/common";

type FormValues = {
  projectTitle: string;
  cardDescription: string;
  cardImage: File | null;
};

export default function CardComponentsForm() {
  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = searchParams?.get("edit") === "1";
  const editingId = searchParams?.get("id");

  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      if (!isEdit || !editingId) return;
      try {
        const res = await fetch(`/api/projects/${editingId}`);
        if (!res.ok) return;
        const project = await res.json();
        setValue("projectTitle", project.projectTitle || "");
        setValue("cardDescription", project.cardDescription || "");
        setPreview(project.uploadCardImage || null);
        if (typeof window !== "undefined") {
          localStorage.setItem("projectId", String(project.id));
        }
      } catch {}
    };
    load();
  }, [isEdit, editingId, setValue]);

  const onSubmit = async (data: FormValues) => {
    try {
      let cardImageUrl = null;
      if (data.cardImage) {
        cardImageUrl = await uploadCardImage(data.cardImage);
      }
      if (isEdit && editingId) {
        const res = await fetch(`/api/projects/${editingId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectTitle: data.projectTitle,
            cardDescription: data.cardDescription,
            uploadCardImage: cardImageUrl ?? undefined,
          }),
        });
        const result = await res.json();
        if (res.ok) {
          toast.success("Project updated successfully!");
          localStorage.setItem("projectId", result.id);
          router.push(`/admin/project-and-initiative/new-project/hero?edit=1&id=${result.id}`);
          reset();
        } else {
          toast.error(result?.error || "Failed to update project.");
        }
      } else {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            cardImage: cardImageUrl,
          }),
        });
        const result = await res.json();
        if (res.ok) {
          toast.success("Project created successfully!");
          localStorage.setItem("projectId", result.id);
          router.push(`/admin/project-and-initiative/new-project/hero`);
          reset();
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to create project. Please try again.");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("cardImage", file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setValue("cardImage", null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
        {isEdit ? "Edit Project" : "Create New Project"}
      </h2>
      <Tabs />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-2 my-6 rounded-lg p-6 md:p-8 lg:px-14 bg-white"
      >
        <h2 className="text-xl font-semibold mb-6 text-sky-800 text-center md:text-left">
          Card Components
        </h2>

        {/* Project Title */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Project Title
          </label>
          <input
            type="text"
            {...register("projectTitle", {
              required: "Project Title is required",
            })}
            placeholder="Write something here..."
            className="block w-full rounded-md border border-dashed border-gray-900/25 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
          />
          {errors.projectTitle && (
            <p className="text-red-500 text-sm mt-1">
              {errors.projectTitle.message}
            </p>
          )}
        </div>

        {/* Card Description */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Card Description
          </label>
          <textarea
            {...register("cardDescription", {
              required: "Card Description is required",
            })}
            placeholder="Write something here..."
            className="block w-full rounded-md border border-dashed border-gray-900/25 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
            rows={4}
          />
          {errors.cardDescription && (
            <p className="text-red-500 text-sm mt-1">
              {errors.cardDescription.message}
            </p>
          )}
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Upload Card Image
          </label>
          <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div className="relative text-center">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="mx-auto w-16 h-16 object-cover"
                  />
                  <span
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 cursor-pointer"
                    onClick={removeImage}
                  >
                    ✕
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
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                ref={fileInputRef}
              />
              <p className="mt-4 font-semibold text-blue-500">
                Drag & Drop your Photo
              </p>
              <p className="text-gray-500 text-sm">
                here or browse up to 10 MB
              </p>
            </div>
          </div>
        </div>

        {/* Submit & Clear */}
        <div className="flex justify-between items-center mt-6">
          <button
            type="submit"
            className={cn(
              "bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition",
              isSubmitting && "opacity-50 cursor-not-allowed"
            )}
            disabled={isSubmitting}
          >
            {isEdit ? (isSubmitting ? "Saving..." : "Save & Continue") : (isSubmitting ? "Submitting..." : "Submit")}
          </button>

          <button
            type="button"
            onClick={() => {
              reset();
              setPreview(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
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
