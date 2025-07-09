"use client";

import { useTabs } from "@/components/context/TabsContext";
import Tabs from "@/components/create-project-tabs/Tabs";
import DeleteModal from "@/components/delete-modal/deleteModal";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaSquarePlus, FaTrash } from "react-icons/fa6";
import { cn } from "utilities/cn";

type RelatedLink = {
  buttonLink: string;
  buttonName: string;
};

type FormData = {
  relatedLinks: RelatedLink[];
};

export default function RelatedLinksSection() {
  const {hideTab} = useTabs();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      relatedLinks: [{ buttonLink: "", buttonName: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "relatedLinks",
  });

  const router = useRouter();
  const projectId = localStorage.getItem("projectId");

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        localStorage.setItem("projectId", result.id);
        toast.success("Related links saved successfully!");
        router.push(
          "/admin/project-and-initiative/new-project/finalcall-and-navigation"
        );
        reset();
      } else {
        toast.error("Failed to save related links.");
      }
    } catch (error) {
      console.error("Error submitting related links:", error);
      toast.error("Failed to save related links section. Please try again.");
    }
  };

  const clearForm = () => reset();

   // delete section button handler
    const [showModal, setShowModal] = useState(false);
    const [deleteSection, setDeleteSection] = useState("block");
    const handleDeleteSection = () => {
      setDeleteSection((prev) => (prev === "block" ? "hidden" : "block"));
      setShowModal(false);
      router.push(
          "/admin/project-and-initiative/new-project/finalcall-and-navigation"
        );
  
      toast.success("Related-links section deleted successfully!");
      reset();
      hideTab("/related-links");
    };


  return (
    <div className="max-w-screen-2xl mx-auto">
      <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
        Create New Project
      </h2>
      <Tabs />
      <section className={`${deleteSection} border-2 my-6 rounded-lg p-4 md:p-8 lg:px-14 bg-white space-y-5 py-10`}>
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-sky-800 font-medium text-xl">
            15. Related Links
          </h3>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="bg-red-500 rounded-lg px-4 py-2 transition-all duration-150 shadow-md active:shadow-none text-white"
          >
            Delete this section
          </button>
        </div>
        <DeleteModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onDelete={handleDeleteSection}
        />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col md:flex-row-reverse items-center gap-7"
            >
              <div className="flex justify-center md:justify-end mb-6 md:mb-0 space-x-4">
                <span
                  className="text-blue-600 cursor-pointer w-4 h-4 hover:text-blue-800"
                  onClick={() => append({ buttonLink: "", buttonName: "" })}
                  title="Add Link"
                >
                  <FaSquarePlus />
                </span>
                {fields.length > 1 && (
                  <span
                    className="text-red-600 cursor-pointer w-4 h-4 hover:text-red-800"
                    onClick={() => remove(index)}
                    title="Remove Link"
                  >
                    <FaTrash />
                  </span>
                )}
              </div>
              <div className="w-full">
                <label className="block font-medium text-gray-900">
                  Button's Link
                </label>
                <Controller
                  name={`relatedLinks.${index}.buttonLink`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter the URL"
                      className={`border w-full mt-2 border-dashed rounded-lg px-3 py-2 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2 ${
                        errors?.relatedLinks?.[index]?.buttonLink
                          ? "border-red-500"
                          : "border-gray-400"
                      }`}
                    />
                  )}
                />
                {errors?.relatedLinks?.[index]?.buttonLink && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors?.relatedLinks[index]?.buttonLink?.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className="block font-medium text-gray-900">
                  Button's Name
                </label>
                <Controller
                  name={`relatedLinks.${index}.buttonName`}
                  control={control}
                  rules={{
                    required: "Button name is required",
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter the button's name"
                      className={`border w-full mt-2   border-dashed rounded-lg px-3 py-2 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2 ${
                        errors?.relatedLinks?.[index]?.buttonName
                          ? "border-red-500"
                          : "border-gray-400"
                      }`}
                    />
                  )}
                />
                {errors?.relatedLinks?.[index]?.buttonName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors?.relatedLinks[index]?.buttonName?.message}
                  </p>
                )}
              </div>
            </div>
          ))}
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className={cn(
                "bg-blue-600 text-white px-6 py-2 mt-4 rounded-lg hover:bg-blue-700",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={clearForm}
              className="bg-gray-300 text-black mt-4 px-6 py-2 rounded-lg hover:bg-gray-400"
            >
              Clear
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
