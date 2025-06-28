"use client";

import Tabs from "@/components/create-project-tabs/Tabs";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { uploadCardImage } from "lib/uploadCardImage";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "utilities/cn";

type StatusFormValues = {
  iconTitleStatus1: string;
  shortDescriptionStatus1: string;
  iconTitleStatus2: string;
  shortDescriptionStatus2: string;
  statusIcon1: File | null;
  statusIcon2: File | null;
};

export default function StatusIconsForm() {
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StatusFormValues>();

  const [iconPreview1, setIconPreview1] = useState<string | null>(null);
  const [iconPreview2, setIconPreview2] = useState<string | null>(null);

  const router = useRouter();
  const projectId = localStorage.getItem("projectId");

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({
    icon1: null,
    icon2: null,
  });

  const setRef = (key: string) => (ref: HTMLInputElement | null) => {
    fileInputRefs.current[key] = ref;
  };

  const handleIconPreviewChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    key: "statusIcon1" | "statusIcon2"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(key, file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: StatusFormValues) => {
    try {
      let statusIcon1Url = null;
      let statusIcon2Url = null;
      if (data.statusIcon1) {
        statusIcon1Url = await uploadCardImage(data.statusIcon1);
      }
      if (data.statusIcon2) {
        statusIcon2Url = await uploadCardImage(data.statusIcon2);
      }
      // Example: send to API or handle as needed
      const payload = {
        ...data,
        statusIcon1: statusIcon1Url,
        statusIcon2: statusIcon2Url,
      };
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Status and Icon saved successfully!");
        localStorage.setItem("projectId", result.id);
        router.push(`/admin/project-and-initiative/new-project/vission-goal`);
        reset();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Optionally show a toast or error message
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
        Create New Project
      </h2>
      <Tabs />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="my-8 border-2 p-6 bg-white rounded-lg"
      >
        <h2 className="text-xl mb-6 text-sky-800">2. Status & Icons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((num) => (
            <div
              key={num}
              className="bg-gray-50 rounded-lg p-4 shadow col-span-1 space-y-4"
            >
              <h3 className="font-semibold text-sky-700">
                {num === 1 ? "First Icon" : "Second Icon"}
              </h3>

              {/* Icon Upload */}
              <div className="relative text-center">
                <label
                  htmlFor={`icon${num}`}
                  className="text-sm font-medium cursor-pointer px-4 py-2 bg-white border border-dashed border-gray-300 rounded-lg shadow"
                >
                  Add Icon +
                </label>
                <input
                  type="file"
                  id={`icon${num}`}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) =>
                    handleIconPreviewChange(
                      e,
                      num === 1 ? setIconPreview1 : setIconPreview2,
                      num === 1 ? "statusIcon1" : "statusIcon2"
                    )
                  }
                  ref={setRef(`icon${num}`)}
                />
                {num === 1 && iconPreview1 && (
                  <img
                    src={iconPreview1}
                    alt="Icon 1"
                    className="mt-2 size-10 mx-auto object-contain"
                  />
                )}
                {num === 2 && iconPreview2 && (
                  <img
                    src={iconPreview2}
                    alt="Icon 2"
                    className="mt-2 size-10 mx-auto object-contain"
                  />
                )}
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-800">
                  Title
                </label>
                <input
                  name={`iconTitleStatus${num}`}
                  type="text"
                  placeholder="Enter the title"
                  className="w-full border border-dashed border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-sky-200"
                  onChange={(e) =>
                    setValue(
                      `iconTitleStatus${num}` as
                        | "iconTitleStatus1"
                        | "iconTitleStatus2",
                      e.target.value
                    )
                  }
                />
                {errors[`iconTitleStatus${num}` as keyof StatusFormValues] && (
                  <p className="text-red-500 text-sm mt-1">
                    {
                      errors[`iconTitleStatus${num}` as keyof StatusFormValues]
                        ?.message
                    }
                  </p>
                )}
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-gray-800">
                  Short Description
                </label>
                <textarea
                  name={`shortDescriptionStatus${num}`}
                  rows={3}
                  placeholder="Enter a short description"
                  className="w-full border border-dashed border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-sky-200"
                  onChange={(e) =>
                    setValue(
                      `shortDescriptionStatus${num}` as
                        | "shortDescriptionStatus1"
                        | "shortDescriptionStatus2",
                      e.target.value
                    )
                  }
                />
                {errors[
                  `shortDescriptionStatus${num}` as keyof StatusFormValues
                ] && (
                  <p className="text-red-500 text-sm mt-1">
                    {(errors as any)[`shortDescriptionStatus${num}`]?.message}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="submit"
            className={cn(
              "bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition",
              isSubmitting && "opacity-50 cursor-not-allowed"
            )}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>

          <button
            type="button"
            onClick={() => {
              reset();
              setIconPreview1(null);
              setIconPreview2(null);
              if (fileInputRefs.current.icon1)
                fileInputRefs.current.icon1.value = "";
              if (fileInputRefs.current.icon2)
                fileInputRefs.current.icon2.value = "";
            }}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
