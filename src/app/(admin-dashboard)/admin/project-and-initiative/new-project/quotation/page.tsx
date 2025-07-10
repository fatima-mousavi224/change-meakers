"use client";
import { useTabs } from "@/components/context/TabsContext";
import Tabs from "@/components/create-project-tabs/Tabs";
import DeleteModal from "@/components/delete-modal/deleteModal";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";

type FormData = {
  quotations: { quote: string; nameRole: string }[];
};

export default function QuotationSection() {
  const { hideTab } = useTabs();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      quotations: [{ quote: "", nameRole: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "quotations",
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
        toast.success("Quotation saved successfully!");
        localStorage.setItem("projectId", result.id);
        router.push(`/admin/project-and-initiative/new-project/photo-album`);
        reset();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save Quotation. Please try again.");
    }
  };

  const handleClear = () => {
    reset();
  };

  // delete section button handler
  const [showModal, setShowModal] = useState(false);
  const [deleteSection, setDeleteSection] = useState("block");
  const handleDeleteSection = () => {
    setDeleteSection((prev) => (prev === "block" ? "hidden" : "block"));
    setShowModal(false);
    router.push(`/admin/project-and-initiative/new-project/photo-album`);
    toast.success("Quotation section deleted successfully!");
    reset();
    hideTab("/quotation");
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
        Create New Project
      </h2>
      <Tabs />
      <section className={`${deleteSection} border-2 my-6 rounded-lg p-4 md:p-8 lg:px-14 bg-white`}>
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-sky-800 text-xl font-semibold">
            10. Quotation Section
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-6 mt-4"
        >
          {fields.map((field, index) => (
            <div key={field.id} className="col-span-1">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sky-800 text-lg font-semibold">
                  Quotation {index + 1}
                </h4>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                  >
                    <MdDelete className="text-red-500 size-6" />
                  </button>
                )}
              </div>
              <div className="col-span-1">
                <label className="block text-sm/6 font-medium text-gray-900 mb-2">
                  Add Quote
                </label>
                <Controller
                  name={`quotations.${index}.quote`}
                  control={control}
                  rules={{ required: "Quote is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="write something here..."
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    />
                  )}
                />
                {errors.quotations?.[index]?.quote && (
                  <p className="text-red-500 text-sm">
                    {errors.quotations[index].quote.message}
                  </p>
                )}
              </div>

              <div className="col-span-1 mt-6">
                <label className="block text-sm/6 font-medium text-gray-900 mb-2">
                  Name + Role
                </label>
                <Controller
                  name={`quotations.${index}.nameRole`}
                  control={control}
                  rules={{ required: "Name + Role is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="write something here..."
                      className="block w-full md:w-1/2 rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    />
                  )}
                />
                {errors.quotations?.[index]?.nameRole && (
                  <p className="text-red-500 text-sm">
                    {errors.quotations[index].nameRole.message}
                  </p>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => append({ quote: "", nameRole: "" })}
            className="bg-green-500 text-white px-6 w-32 py-2 rounded hover:bg-green-600 transition"
          >
            Add Quote
          </button>

          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className={cn(
                "bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 transition"
            >
              Clear
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}