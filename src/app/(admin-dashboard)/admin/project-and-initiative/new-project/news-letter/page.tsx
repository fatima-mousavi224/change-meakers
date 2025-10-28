"use client";

import { useTabs } from "@/components/context/TabsContext";
import Tabs from "@/components/create-project-tabs/Tabs";
import DeleteModal from "@/components/delete-modal/deleteModal";
import { cn } from "@/lib/utils";
import { uploadCardImage } from "lib/uploadCardImage";
import { Trash } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-hot-toast";

export default function NewsletterForm() {
  const { hideTab } = useTabs();
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string }>(
    {}
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    register,
  } = useForm({
    defaultValues: {
      sectionTitleNewsletter: "",
      studentLabelName: "",
      sectionDescriptionNewsletter: "",
      newsletterItems: [{ url: "", date: "", title: "", description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "newsletterItems",
  });

  const setRef = (name: string) => (el: HTMLInputElement | null) => {
    fileInputRefs.current[name] = el;
  };

  const projectId = localStorage.getItem("projectId");
  const searchParams = useSearchParams();
  const isEdit = searchParams?.get("edit") === "1";
  const router = useRouter();
  useEffect(() => {
    const load = async () => {
      if (!isEdit || !projectId) return;
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) return;
        const p = await res.json();
        setValue("sectionTitleNewsletter", p.sectionTitleNewsletter || "");
        setValue("studentLabelName", p.studentLabelName || "");
        setValue("sectionDescriptionNewsletter", p.sectionDescriptionNewsletter || "");
        if (Array.isArray(p.newsletterItems) && p.newsletterItems.length) {
          setValue(
            "newsletterItems",
            p.newsletterItems.map((n: any) => ({
              url: n.url || "",
              date: n.date ? n.date.substring(0, 10) : "",
              title: n.title || "",
              description: n.description || "",
            }))
          );
          const previews: any = {};
          p.newsletterItems.forEach((n: any, idx: number) => {
            if (n.newsLetterImage) previews[`newsletterImage${idx + 1}`] = n.newsLetterImage;
          });
          setImagePreviews(previews);
        }
      } catch {}
    };
    load();
  }, [isEdit, projectId, setValue]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [key]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => ({
          ...prev,
          [key]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearForm = () => {
    reset();
    setFiles({});
    setImagePreviews({});
    Object.values(fileInputRefs.current).forEach((ref) => {
      if (ref) ref.value = "";
    });
  };

  const onSubmit = async (data: any) => {
    // Attach images to newsletterItems
    let newsletterItemsWithImages = await Promise.all(
      (data.newsletterItems || []).map(async (item: any, idx: number) => {
        const file = files[`newsletterImage${idx + 1}`];
        let imageUrl = null;
        if (file) {
          try {
            imageUrl = await uploadCardImage(file);
          } catch (err) {
            toast.error(`Failed to upload image for item ${idx + 1}`);
          }
        }
        // Ensure date is ISO-8601 or null
        let date = item.date ? new Date(item.date).toISOString() : null;

        return {
          ...item,
          date,
          newsLetterImage: imageUrl,
        };
      })
    );

    const finalData = {
      ...data,
      newsletterItems: newsletterItemsWithImages,
    };

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });
      if (!res.ok) throw new Error("Failed to update project");
      if (res.ok) {
        localStorage.setItem("projectId", projectId!);
        toast.success("Project updated successfully!");
        const suffix = isEdit ? `?edit=1&id=${projectId}` : "";
        router.push(`/admin/project-and-initiative/new-project/live-moments${suffix}`);
        reset();
        setFiles({});
      }
      console.log("🚀 ~ onSubmit ~ res:", res)
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  // delete section button handler
  const [showModal, setShowModal] = useState(false);
  const [deleteSection, setDeleteSection] = useState("block");
  const handleDeleteSection = () => {
    setDeleteSection((prev) => (prev === "block" ? "hidden" : "block"));
    setShowModal(false);
    router.push("/admin/project-and-initiative/new-project/live-moments");

    toast.success("News-letter section deleted successfully!");
    reset();
    hideTab("/news-letter");
  };


  return (
    <div className="max-w-screen-2xl mx-auto">
      <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
        {isEdit ? "Edit Project" : "Create New Project"}
      </h2>
      <Tabs />
      <DeleteModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onDelete={handleDeleteSection}
              />
      <form onSubmit={handleSubmit(onSubmit)} className={`${deleteSection}`}>
        {/* Section Wrapper */}
        <section className="border-2 my-6 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
          
           <div className="flex justify-between items-center mb-8">
          <h3 className="text-sky-800 text-xl font-semibold mb-4">
            12. Newsletter/Archive Document Section
          </h3>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="bg-red-500 rounded-lg px-4 py-2 transition-all duration-150 shadow-md active:shadow-none text-white"
          >
            Delete this section
          </button>
        </div>
          <p className="my-2">Label's Name</p>
          <div className="bg-gray-200 w-48 px-4 py-2 rounded-full flex items-center">
            <span className="bg-sky-700 h-2 w-2 p-1.5 rounded-full"></span>
            <input 
                {...register("studentLabelName", {
                required: "studentLabelName is required",
              })}
            type="text"
            placeholder="e.g., 'Newsletter'"
            className="border-none outline-none focus:bg-transparent focus:ring-0 bg-transparent w-40 placeholder:text-gray-400"
            />
          </div>
           {errors.studentLabelName && (
                <p className="text-red-500 text-sm">
                  {errors.studentLabelName.message as string}
                </p>
              )}

          {/* Section Title and Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Section Title
              </label>
              <Controller
                name="sectionTitleNewsletter"
                control={control}
                rules={{ required: "Section Title is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="e.g. 'Newsletter'"
                    className="w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3"
                  />
                )}
              />
              {errors.sectionTitleNewsletter && (
                <p className="text-red-500 text-sm">
                  {errors.sectionTitleNewsletter.message as string}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Section Description
              </label>
              <Controller
                name="sectionDescriptionNewsletter"
                control={control}
                rules={{
                  required: "Section Description is required",
                }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    placeholder="Write something here..."
                    rows={4}
                    className="w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3"
                  />
                )}
              />
              {errors.sectionDescriptionNewsletter && (
                <p className="text-red-500 text-sm">
                  {errors.sectionDescriptionNewsletter.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Items */}

          <div className="mt-5 flex flex-col gap-10">
            {fields.map((item, index) => {
              const imageKey = `newsletterImage${index + 1}`;
              return (
                <div
                  key={item.id}
                  className="border border-dashed border-gray-300 rounded-md px-4 py-4 flex flex-col xl:flex-row gap-4 relative"
                >
                  {/* Remove Button */}
                  {fields.length > 1 && (
                    <button
                      type="button"
                      className="absolute -top-5 right-1 text-red-500 hover:text-red-700 text-xl font-bold"
                      onClick={() => remove(index)}
                      title="Remove"
                    >
                      <Trash size={16} />
                    </button>
                  )}

                  {/* Image Upload */}
                  <div className="flex-1">
                    <div className="relative text-center border border-dashed rounded-lg px-6 py-2">
                      {files[imageKey] ? (
                        <div className="relative">
                          <img
                            src={imagePreviews[imageKey]}
                            alt=""
                            className="w-16 h-16 mx-auto object-cover"
                          />
                        </div>
                      ) : (
                        <svg
                          className="w-12 h-12 text-gray-300 mx-auto"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                          />
                        </svg>
                      )}
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, imageKey)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        ref={setRef(imageKey)}
                      />
                      <p className="mt-2 font-semibold text-blue-500">
                        Drag & Drop or Browse
                      </p>
                    </div>

                    {/* URL input */}
                    <Controller
                      name={`newsletterItems.${index}.url`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          placeholder="Enter Downloadable URL"
                          className="w-full mt-2 rounded border border-dashed border-gray-400 px-3 py-2"
                        />
                      )}
                    />
                  </div>

                  {/* Text Info */}
                  <div className="flex-1 space-y-2">
                    <Controller
                      name={`newsletterItems.${index}.date`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          placeholder="Date"
                          className="w-full border border-dashed rounded px-2 py-1"
                          type="date"
                        />
                      )}
                    />
                    <Controller
                      name={`newsletterItems.${index}.title`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          placeholder="Title"
                          className="w-full border border-dashed rounded px-2 py-1"
                        />
                      )}
                    />
                    <Controller
                      name={`newsletterItems.${index}.description`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          placeholder="Short Description"
                          className="w-full border border-dashed rounded px-2 py-1"
                        />
                      )}
                    />
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              className="mt-4 w-fit px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 self-end"
              onClick={() =>
                append({ url: "", date: "", title: "", description: "" })
              }
            >
              + Add Newsletter Item
            </button>
          </div>

          {/* Submit and Clear Buttons */}
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
              onClick={clearForm}
              className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400"
            >
              Clear
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}
