"use client";

import { useProjectId } from "@/hooks/useProjectId";

import { useTabs } from "@/components/context/TabsContext";
import Tabs from "@/components/create-project-tabs/Tabs";
import DeleteModal from "@/components/delete-modal/deleteModal";
import { uploadCardImage } from "lib/uploadCardImage";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BsArrowRight } from "react-icons/bs";
import { cn } from "utilities/cn";

type HeroSection = {
  heroTitle: string;
  subheading: string;
  slogan: string;
  buttonName: string;
  buttonLink: string;
  heroImage: File[];
};

export default function HeroPage() {
  const {hideTab} = useTabs();

  type HeroFormValues = HeroSection;
  
  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HeroFormValues>({
    defaultValues: {
      heroTitle: "",
      subheading: "",
      slogan: "",
      buttonName: "",
      buttonLink: "",
      heroImage: [],
    },
  });

  // For image previews
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const searchParams = useSearchParams();
  const isEdit = searchParams?.get("edit") === "1";
  const projectId = useProjectId();
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      if (!isEdit || !projectId) return;
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) return;
        const p = await res.json();
        setValue("heroTitle", p.heroTitle || "");
        setValue("subheading", p.subheading || "");
        setValue("slogan", p.slogan || "");
        setValue("buttonName", p.buttonName || "");
        setValue("buttonLink", p.buttonLink || "");
        if (Array.isArray(p.heroImage) && p.heroImage.length) {
          setPreviews(p.heroImage);
        }
      } catch {}
    };
    load();
  }, [isEdit, projectId, setValue]);

  const onSubmit = async (data: HeroFormValues) => {
    try {
      // Upload all images and get URLs
      let heroImageUrls: string[] = [];
      if (data.heroImage && data.heroImage.length > 0) {
        heroImageUrls = await Promise.all(
          data.heroImage.map(async (file) => await uploadCardImage(file))
        );
      }
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          heroImage: heroImageUrls,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        localStorage.setItem("projectId", result.id);
        toast.success("Hero section saved!");
        const suffix = isEdit ? `?edit=1&id=${result.id}` : "";
        router.push(`/admin/project-and-initiative/new-project/status-icon${suffix}`);
        reset();
        setPreviews([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        toast.error("Failed to save hero section.");
      }
    } catch (error) {
      console.error("Error submitting hero section:", error);
      toast.error("Failed to save hero section. Please try again.");
    }
  };

  // Image change handler for multiple images
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArr = Array.from(files);
      setValue("heroImage", fileArr);
      // Generate previews
      Promise.all(
        fileArr.map(
          (file) =>
            new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
            })
        )
      ).then((results) => setPreviews(results));
    } else {
      setValue("heroImage", []);
      setPreviews([]);
    }
  };

  const removeImage = (idx: number) => {
    // Remove image at idx from heroImage
    const currentFiles =
      typeof window !== "undefined" &&
      fileInputRef.current &&
      fileInputRef.current.files
        ? Array.from(fileInputRef.current.files)
        : [];
    const newFiles = currentFiles.filter((_, i) => i !== idx);
    setValue("heroImage", newFiles);
    setPreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews.splice(idx, 1);
      return newPreviews;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // delete section button handler
  const [showModal, setShowModal] = useState(false);
  const [deleteSection, setDeleteSection] = useState('block');
  const handleDeleteSection = () => {
    setDeleteSection(prev=> prev === 'block' ? 'hidden' : 'block');
    setShowModal(false);
    router.push("/admin/project-and-initiative/new-project/status-icon");
    toast.success("Hero section deleted successfully!");
    reset();
    hideTab('/hero');
  }
  
  return (
    <div className="max-w-screen-2xl mx-auto">
      <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
        {isEdit ? "Edit Project" : "Create New Project"}
      </h2>
      <Tabs />

      <DeleteModal  isOpen={showModal}
        onClose={() => setShowModal(false)}
        onDelete={handleDeleteSection} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${deleteSection} border-2 rounded-lg my-6 p-6 md:p-8 lg:px-14 bg-white `}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-sky-800">
            1. Hero Section
          </h2>
          <button type="button" onClick={() => setShowModal(true)} className="bg-red-500 rounded-lg px-4 py-2 transition-all duration-150 shadow-md active:shadow-none text-white">Delete this section</button>
        </div>
        <div className="border rounded-lg p-4 mb-8 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Upload Hero Images
              </label>
              <div className="flex justify-end flex-wrap gap-4 mb-4">
                {previews.map((preview, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${idx + 1}`}
                      className="mx-auto w-16 h-16 object-cover rounded"
                    />
                    <span
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 cursor-pointer"
                      onClick={() => removeImage(idx)}
                    >
                      ✕
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="relative text-center">
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
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    multiple
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    ref={fileInputRef}
                  />
                  <p className="mt-4 font-semibold text-blue-500">
                    Drag & Drop your Photos
                  </p>
                  <p className="text-gray-500 text-sm">
                    here or browse images
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Title */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Hero Title
              </label>
              <input
                type="text"
                placeholder="write something here..."
                className="block w-full rounded-md border border-dashed border-gray-900/25 px-4 py-3"
                {...register("heroTitle", {
                  required: "Hero Title is required",
                })}
              />
              {errors.heroTitle && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.heroTitle.message}
                </p>
              )}
            </div>

            {/* Subheading */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Subheading
              </label>
              <input
                type="text"
                placeholder="write something here..."
                className="block w-full rounded-md border border-dashed border-gray-900/25 px-4 py-3"
                {...register("subheading", {
                  required: "Subheading is required",
                })}
              />
              {errors.subheading && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.subheading.message}
                </p>
              )}
            </div>

            {/* Slogan */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Subheading Line or Slogan
              </label>
              <input
                type="text"
                placeholder="write something here..."
                className="block w-full rounded-md border border-dashed border-gray-900/25 px-4 py-3"
                {...register("slogan", {
                  required: "Slogan is required",
                })}
              />
              {errors.slogan && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.slogan.message}
                </p>
              )}
            </div>

            {/* Button Name */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Button Name
              </label>
              <input
                type="text"
                placeholder="Enter the button's name"
                className="block w-full rounded-full border border-dashed border-gray-900/25 px-4 py-3"
                {...register("buttonName", {
                  required: "Button Name is required",
                })}
              />
              <a
                href="#"
                className="absolute top-9 right-3 p-2 bg-gray-100 rounded-full"
              >
                <BsArrowRight />
              </a>
              {errors.buttonName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.buttonName.message}
                </p>
              )}
            </div>

            {/* Button Link */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Button Link
              </label>
              <input
                type="text"
                placeholder="Enter the URL"
                className="block w-full rounded-md border border-dashed border-gray-900/25 px-4 py-3"
                {...register("buttonLink", {
                  required: "Button Link is required",
                })}
              />
              {errors.buttonLink && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.buttonLink.message}
                </p>
              )}
            </div>
          </div>
        </div>
        {/* Submit & Clear Button */}
        <div className="flex justify-between items-center mt-6">
          <button
            type="submit"
            className={cn(
              "bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition",
              isSubmitting && "opacity-50 cursor-not-allowed"
            )}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting" : "Submit"}
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              setPreviews([]);
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
