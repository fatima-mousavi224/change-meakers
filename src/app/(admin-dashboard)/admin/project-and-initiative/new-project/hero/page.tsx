"use client";

import Tabs from "@/components/create-project-tabs/Tabs";
import { useRef, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { BsArrowRight } from "react-icons/bs";
import { uploadCardImage } from "lib/uploadCardImage";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "utilities/cn";

type HeroSection = {
  heroTitle: string;
  subheading: string;
  slogan: string;
  buttonName: string;
  buttonLink: string;
  heroImage: File | null;
};

type HeroFormValues = {
  heroSections: HeroSection[];
};

export default function HeroSectionForm() {
  const {
    handleSubmit,
    register,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<HeroFormValues>({
    defaultValues: {
      heroSections: [
        {
          heroTitle: "",
          subheading: "",
          slogan: "",
          buttonName: "",
          buttonLink: "",
          heroImage: null,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "heroSections",
  });

  // For image previews per section
  const [previews, setPreviews] = useState<(string | null)[]>([null]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const projectId =
    typeof window !== "undefined" ? localStorage.getItem("projectId") : null;
  const router = useRouter();

  const onSubmit = async (data: HeroFormValues) => {
    console.log("data:", data);
    try {
      // Upload images for each section
      const heroSectionsWithUrls = await Promise.all(
        data.heroSections.map(async (section, idx) => {
          let heroImageUrl = null;
          if (section.heroImage) {
            heroImageUrl = await uploadCardImage(section.heroImage);
          }
          return {
            ...section,
            heroImage: heroImageUrl,
          };
        })
      );
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          heroSections: heroSectionsWithUrls,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        localStorage.setItem("projectId", result.id);
        toast.success("Hero section(s) saved!");
        router.push("/admin/project-and-initiative/new-project/status-icon");
        reset();
        setPreviews([null]);
        fileInputRefs.current.forEach((ref) => {
          if (ref) ref.value = "";
        });
      } else {
        toast.error("Failed to save hero section(s).");
      }
    } catch (error) {
      console.error("Error submitting hero section(s):", error);
      toast.error("Failed to save hero section(s). Please try again.");
    }
  };

  // Image change handler per section
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(`heroSections.${idx}.heroImage`, file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => {
          const newPreviews = [...prev];
          newPreviews[idx] = reader.result as string;
          return newPreviews;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (idx: number) => {
    setValue(`heroSections.${idx}.heroImage`, null);
    setPreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews[idx] = null;
      return newPreviews;
    });
    if (fileInputRefs.current[idx]) fileInputRefs.current[idx]!.value = "";
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
        Create New Project
      </h2>
      <Tabs />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-2 rounded-lg my-6 p-6 md:p-8 lg:px-14 bg-white"
      >
        <h2 className="text-xl font-semibold mb-6 text-sky-800">
          1. Hero Section(s)
        </h2>
        {fields.map((field, idx) => (
          <div
            key={field.id}
            className="border rounded-lg p-4 mb-8 relative bg-gray-50"
          >
            {fields.length > 1 && (
              <button
                type="button"
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg"
                onClick={() => {
                  remove(idx);
                  setPreviews((prev) => prev.filter((_, i) => i !== idx));
                  fileInputRefs.current.splice(idx, 1);
                }}
                aria-label="Remove section"
              >
                ✕
              </button>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Upload Hero Image
                </label>
                <div className="flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="relative text-center">
                    {previews[idx] ? (
                      <div className="relative">
                        <img
                          src={previews[idx]!}
                          alt="Preview"
                          className="mx-auto w-16 h-16 object-cover"
                        />
                        <span
                          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 cursor-pointer"
                          onClick={() => removeImage(idx)}
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
                      onChange={(e) => handleImageChange(e, idx)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      ref={(el) => {
                        fileInputRefs.current[idx] = el;
                      }}
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

              {/* Hero Title */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Hero Title
                </label>
                <input
                  type="text"
                  placeholder="write something here..."
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-4 py-3"
                  {...register(`heroSections.${idx}.heroTitle`, {
                    required: "Hero Title is required",
                    maxLength: 50,
                  })}
                />
                {errors.heroSections?.[idx]?.heroTitle && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.heroSections[idx]?.heroTitle?.message}
                  </p>
                )}
              </div>

              {/* Subheading */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Subheading
                </label>
                <input
                  type="text"
                  placeholder="write something here..."
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-4 py-3"
                  {...register(`heroSections.${idx}.subheading`, {
                    required: "Subheading is required",
                    maxLength: 50,
                  })}
                />
                {errors.heroSections?.[idx]?.subheading && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.heroSections[idx]?.subheading?.message}
                  </p>
                )}
              </div>

              {/* Slogan */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Subheading Line or Slogan
                </label>
                <input
                  type="text"
                  placeholder="write something here..."
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-4 py-3"
                  {...register(`heroSections.${idx}.slogan`, {
                    required: "Slogan is required",
                    maxLength: 50,
                  })}
                />
                {errors.heroSections?.[idx]?.slogan && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.heroSections[idx]?.slogan?.message}
                  </p>
                )}
              </div>

              {/* Button Name */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Button Name
                </label>
                <input
                  type="text"
                  placeholder="Enter the button's name"
                  className="block w-full rounded-full border border-dashed border-gray-900/25 px-4 py-3"
                  {...register(`heroSections.${idx}.buttonName`, {
                    required: "Button Name is required",
                    maxLength: 50,
                  })}
                />
                <a
                  href="#"
                  className="absolute top-9 right-3 p-2 bg-gray-100 rounded-full"
                >
                  <BsArrowRight />
                </a>
                {errors.heroSections?.[idx]?.buttonName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.heroSections[idx]?.buttonName?.message}
                  </p>
                )}
              </div>

              {/* Button Link */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  Button Link
                </label>
                <input
                  type="text"
                  placeholder="Enter the URL"
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-4 py-3"
                  {...register(`heroSections.${idx}.buttonLink`, {
                    required: "Button Link is required",
                    maxLength: 200,
                  })}
                />
                {errors.heroSections?.[idx]?.buttonLink && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.heroSections[idx]?.buttonLink?.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        <div className="flex justify-end mb-6">
          <button
            type="button"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            onClick={() => {
              append({
                heroTitle: "",
                subheading: "",
                slogan: "",
                buttonName: "",
                buttonLink: "",
                heroImage: null,
              });
              setPreviews((prev) => [...prev, null]);
            }}
          >
            + Add Hero Section
          </button>
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
              setPreviews([null]);
              fileInputRefs.current.forEach((ref) => {
                if (ref) ref.value = "";
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
