"use client";
import { useTabs } from "@/components/context/TabsContext";
import Tabs from "@/components/create-project-tabs/Tabs";
import DeleteModal from "@/components/delete-modal/deleteModal";
import { uploadCardImage } from "lib/uploadCardImage";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";
import { FaSquarePlus, FaTrash } from "react-icons/fa6";
import { cn } from "utilities/cn";

type LiveMoment = {
  link: string;
  image?: string;
};

type FormData = {
  liveMoments: LiveMoment[];
};

function LiveMoments() {
  const { hideTab } = useTabs();
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      liveMoments: [{ link: "", image: undefined }],
    },
  });

  const router = useRouter();
  const projectId = localStorage.getItem("projectId");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "liveMoments",
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Upload images if any
      const liveMomentsWithImages = await Promise.all(
        data.liveMoments.map(async (moment, idx) => {
          // @ts-ignore
          if (moment.image && moment.image instanceof File) {
            try {
              const url = await uploadCardImage(moment.image);
              return { ...moment, image: url };
            } catch (e) {
              toast.error("Failed to upload image for a live moment.");
              return { ...moment, image: undefined };
            }
          }
          return moment;
        })
      );
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          liveMoments: liveMomentsWithImages,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Live moment saved successfully!");
        localStorage.setItem("projectId", result.id);
        router.push(`/admin/project-and-initiative/new-project/global-goals`);
        reset();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save live moment. Please try again.");
    }
  };

  const clearLiveMomentsForm = () => {
    reset({
      liveMoments: [{ link: "" }],
    });
  };

  // delete section button handler
  const [showModal, setShowModal] = useState(false);
  const [deleteSection, setDeleteSection] = useState("block");
  const handleDeleteSection = () => {
    setDeleteSection((prev) => (prev === "block" ? "hidden" : "block"));
    setShowModal(false);
    router.push(`/admin/project-and-initiative/new-project/global-goals`);

    toast.success("Live-moments section deleted successfully!");
    reset();
    hideTab("/live-moments");
  };

  return (
    <div>
      <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
        Create New Project
      </h2>
      <Tabs />

      <section
        className={`${deleteSection} border-2 my-6 rounded-lg p-4 md:p-8 lg:px-14 bg-white space-y-5 py-10 `}
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-sky-800 font-medium text-xl">
            13. Live Moments: Follow Us
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
        <form onSubmit={handleSubmit(onSubmit)}>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col md:flex-row-reverse items-center justify-between"
            >
              <div className="flex justify-center md:justify-end mb-6 md:mb-0 space-x-4">
                <span
                  className="text-blue-600 cursor-pointer w-4 h-4 hover:text-blue-800"
                  onClick={() => append({ link: "", image: undefined })}
                  title="Add"
                >
                  <FaSquarePlus />
                </span>
                {fields.length > 1 && (
                  <span
                    className="text-red-600 cursor-pointer w-4 h-4 hover:text-red-800"
                    onClick={() => remove(index)}
                    title="Delete"
                  >
                    <FaTrash />
                  </span>
                )}
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-900">
                  Choose link or Embed code
                </label>
                <Controller
                  name={`liveMoments.${index}.link`}
                  control={control}
                  rules={{ required: "Link or embed code is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter the link or embed code"
                      className="border w-full md:w-[90%] mt-2 border-gray-400 border-dashed rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2 mb-2.5"
                    />
                  )}
                />
                {errors?.liveMoments?.[index]?.link && (
                  <p className="text-red-500 text-sm">
                    {
                      errors?.liveMoments[index]?.link?.message as
                        | string
                        | undefined
                    }
                  </p>
                )}
                <label className="block text-sm font-medium text-gray-900 mt-2">
                  Upload Image
                </label>
                <Controller
                  name={`liveMoments.${index}.image`}
                  control={control}
                  render={({ field: { value, onChange, ...rest } }) => (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            onChange(e.target.files[0]);
                          } else {
                            onChange(undefined);
                          }
                        }}
                        className="border w-full md:w-[90%] mt-2 border-gray-400 border-dashed rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2 mb-2.5"
                        {...rest}
                      />
                      {/* Image preview */}
                      {value &&
                        (typeof value === "string" ? (
                          <img
                            src={value}
                            alt="Selected preview"
                            className="mt-2 max-h-32 mb-4 rounded shadow border"
                          />
                        ) : (
                          <img
                            src={URL.createObjectURL(value)}
                            alt="Selected preview"
                            className="mt-2 max-h-32 mb-4 rounded shadow border"
                          />
                        ))}
                    </>
                  )}
                />
              </div>
            </div>
          ))}
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
              onClick={clearLiveMomentsForm}
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

export default LiveMoments;
