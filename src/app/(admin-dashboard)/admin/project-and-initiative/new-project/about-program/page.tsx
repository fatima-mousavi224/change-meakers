"use client";

import Tabs from "@/components/create-project-tabs/Tabs";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BsArrowRight } from "react-icons/bs";
import { cn } from "utilities/cn";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-loading-skeleton/dist/skeleton.css";
import "react-quill/dist/quill.snow.css";

type FormData = {
  sectionTitleAbout: string;
  bodyText: string;
  buttonName2: string;
  buttonLink2: string;
};

export default function AboutProgramForm() {
  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const projectId = localStorage.getItem("projectId");
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data }),
      });
      const result = await res.json();
      if (res.ok) {
        localStorage.setItem("projectId", result.id);
        toast.success("Program section saved successfully!");
        router.push(
          "/admin/project-and-initiative/new-project/voice-classroom"
        );
        reset();
      } else {
        toast.error("Failed to save Program section");
      }
    } catch (error) {
      console.error("Error saving program section:", error);
      toast.error("An error occurred while saving the program section.");
    }
  };

  const handleClear = () => {
    reset();
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
        Create New Project
      </h2>
      <Tabs />
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* About Program Section */}
        <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
          <h2 className="text-xl font-semibold mb-4 text-sky-800">
            4. About Program Section
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2 mt-4 md:mt-0">
              <div className="col-span-3 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Section Title
                </label>
                <input
                  {...register("sectionTitleAbout", {
                    required: "Section Title is required",
                    maxLength: 50,
                  })}
                  type="text"
                  placeholder="e.g. 'About the Program'"
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                />
                {errors.sectionTitleAbout && (
                  <p className="text-red-500 text-sm">
                    {errors.sectionTitleAbout.message}
                  </p>
                )}
              </div>
              <div className="col-span-3 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Body Text
                </label>

                <Controller
                  name="bodyText"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <div className="block w-full rounded-md border border-dashed border-gray-900/25 focus-within:ring-2 focus-within:ring-blue-100 focus-within:ring-offset-2 px-0 py-0">
                      <ReactQuill
                        theme="snow"
                        value={field.value}
                        onChange={field.onChange}
                        className="quill-editor mb-10"
                        style={{
                          border: "none",
                          borderRadius: "0.375rem",
                          padding: "0",
                          minHeight: "120px",
                        }}
                      />
                    </div>
                  )}
                />
                {errors.bodyText && (
                  <p className="text-red-500 text-sm">
                    {errors.bodyText.message}
                  </p>
                )}
              </div>
              <div className="col-span-1 mt-4 md:mt-0 relative">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Button Name
                </label>
                <input
                  {...register("buttonName2", {
                    required: "Button Name is required",
                    maxLength: 50,
                  })}
                  type="text"
                  placeholder="Enter the button's name"
                  className="block w-full border rounded-full border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                />
                {errors.buttonName2 && (
                  <p className="text-red-500 text-sm">
                    {errors.buttonName2.message}
                  </p>
                )}
                <a
                  href="#"
                  className="absolute top-8 right-2 p-2 bg-gray-100 rounded-full"
                >
                  <span className="text-xl">
                    <BsArrowRight />
                  </span>
                </a>
              </div>
              <div className="col-span-1 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Button Link
                </label>
                <input
                  {...register("buttonLink2", {
                    required: "Button Link is required",
                    maxLength: 200,
                  })}
                  type="text"
                  placeholder="Enter the URL"
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                />
                {errors.buttonLink2 && (
                  <p className="text-red-500 text-sm">
                    {errors.buttonLink2.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-between gap-4">
            <button
              type="submit"
              className={cn(
                "px-6 py-2 bg-sky-600 text-white rounded-md shadow hover:bg-sky-700 transition",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md shadow hover:bg-gray-400 transition"
            >
              Clear
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}
