"use client";

import Tabs from "@/components/create-project-tabs/Tabs";
import { useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { uploadCardImage } from "lib/uploadCardImage";
import { cn } from "@/lib/utils";
import { Trash } from "lucide-react";
import DeleteModal from "@/components/delete-modal/deleteModal";
import { useTabs } from "@/components/context/TabsContext";

interface Voice {
  quote: string;
  name: string;
  location: string;
  icon: File | null;
}

type FormData = {
  sectionTitleVoices: string;
  voicesLabelName: string;
  sectionDescriptionVoices: string;
  voices: Voice[];
};

export default function VoicesFromClassroomForm() {
  const { hideTab } = useTabs();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
    register,
    setValue,
    getValues,
  } = useForm<FormData>({
    defaultValues: {
      voicesLabelName: "",
      sectionTitleVoices: "",
      sectionDescriptionVoices: "",
      voices: [
        { quote: "", name: "", location: "", icon: null },
        { quote: "", name: "", location: "", icon: null },
        { quote: "", name: "", location: "", icon: null },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "voices",
  });

  // Fix: useState must be initialized after fields is available
  const [iconPreviews, setIconPreviews] = useState<(string | null)[]>(() =>
    Array(fields.length).fill(null)
  );

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const setRef = (name: string) => (el: HTMLInputElement | null) => {
    fileInputRefs.current[name] = el;
  };

  const projectId = localStorage.getItem("projectId");

  const handleIconPreviewChange = (index: number, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setIconPreviews((prev) => {
        const updated = [...prev];
        updated[index] = reader.result as string;
        return updated;
      });
    };
    reader.readAsDataURL(file);
  };

  // Add a function to update the icon in the form state
  const handleIconChange = (index: number, file: File | null) => {
    // Update the icon in the form state
    const values = getValues("voices");
    values[index].icon = file;
    setValue("voices", values);
    handleIconPreviewChange(index, file);
  };

  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      // Upload all icons in parallel and replace File with URL
      const voicesWithIconUrls = await Promise.all(
        data.voices.map(async (voice) => {
          let iconUrl = null;
          if (voice.icon) {
            iconUrl = await uploadCardImage(voice.icon);
          }
          return { ...voice, icon: iconUrl };
        })
      );

      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voicesLabelName: data.voicesLabelName,
          sectionTitleVoices: data.sectionTitleVoices,
          sectionDescriptionVoices: data.sectionDescriptionVoices,
          voices: voicesWithIconUrls,
        }),
      });
      console.log("🚀 ~ onSubmit ~ res:", res);

      const result = await res.json();
      console.log("🚀 ~ onSubmit ~ result:", result);
      if (res.ok) {
        toast.success("Voices from Classroom updated successfully!");
        router.push(`/admin/project-and-initiative/new-project/media-block`); // Change to next section route if needed
        reset();
      } else {
        toast.error(result.error || "Failed to update project.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to update project. Please try again.");
    }
  };

  // delete section button handler
  const [showModal, setShowModal] = useState(false);
  const [deleteSection, setDeleteSection] = useState("block");
  const handleDeleteSection = () => {
    setDeleteSection((prev) => (prev === "block" ? "hidden" : "block"));
    setShowModal(false);
    router.push(`/admin/project-and-initiative/new-project/media-block`);
    toast.success("Voice-classroom section deleted successfully!");
    reset();
    hideTab("/voice-classroom");
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
        Create New Project
      </h2>
      <Tabs />
      <DeleteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onDelete={handleDeleteSection}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`${deleteSection} max-w-5xl mx-auto `}
      >
        <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold mb-4 text-sky-800">
              5. Voices from the Classroom
            </h2>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="bg-red-500 rounded-lg px-4 py-2 transition-all duration-150 shadow-md active:shadow-none text-white"
            >
              Delete this section
            </button>
          </div>

          <span className="block text-lg my-2">Label's Name</span>
          <div className="flex items-center py-1 px-4 bg-gray-200 rounded-full w-52 my-2">
            <span className="w-2 h-2 bg-sky-700  p-1.5 rounded-full"></span>
            <input
              {...register("voicesLabelName", {
                required: "voicesLabelName is required",
              })}
              type="text"
              placeholder="e.g., 'For Students'"
              className="border-none outline-none focus:bg-transparent focus:ring-0 bg-transparent w-40 placeholder:text-gray-400"
            />
          </div>
            {errors.voicesLabelName && (
              <p className="text-red-500 text-sm">
                {errors.voicesLabelName.message}
              </p>
            )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2 mt-4 md:mt-0">
              {/* Section Title */}
              <div className="col-span-3 mt-4">
                <label className="block text-sm/6 font-medium text-gray-900 mb-2">
                  Section Title
                </label>
                <input
                  {...register("sectionTitleVoices", {
                    required: "Section Title is required",
                  })}
                  type="text"
                  placeholder="e.g. 'Voices from Students'"
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                />
                {errors.sectionTitleVoices && (
                  <p className="text-red-500 text-sm">
                    {errors.sectionTitleVoices.message}
                  </p>
                )}
              </div>

              {/* Section Description */}
              <div className="col-span-3">
                <label className="block text-sm/6 font-medium text-gray-900 mt-4 md:mt-0 mb-2">
                  Section Description
                </label>
                <textarea
                  {...register("sectionDescriptionVoices", {
                    required: "Section Description is required",
                  })}
                  placeholder="Write something here..."
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  rows={4}
                />
                {errors.sectionDescriptionVoices && (
                  <p className="text-red-500 text-sm">
                    {errors.sectionDescriptionVoices.message}
                  </p>
                )}
              </div>

              {/* Voices Entries */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 col-span-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border border-gray-400 rounded-lg border-dashed px-5 py-4 w-full relative"
                  >
                    {/* Remove button */}
                    {fields.length > 1 && (
                      <button
                        type="button"
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg font-bold z-10"
                        onClick={() => remove(index)}
                        title="Remove voice"
                      >
                        <Trash size={16} />
                      </button>
                    )}

                    <textarea
                      {...register(`voices.${index}.quote` as const)}
                      placeholder="Write something here..."
                      rows={3}
                      className="my-3 w-full border-none focus:ring-0 resize-none"
                    />

                    <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 mt-4 space-x-4 items-center">
                      <div className="relative">
                        <label
                          htmlFor={`voiceOfClassRoomIcon${index}`}
                          className="text-3xl w-12 h-12 px-4 flex justify-center items-center py-3 rounded-full cursor-pointer shadow-sm shadow-gray-500 bg-white"
                        >
                          +
                        </label>
                        <input
                          type="file"
                          id={`voiceOfClassRoomIcon${index}`}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) =>
                            handleIconChange(index, e.target.files?.[0] ?? null)
                          }
                          ref={setRef(`voiceOfClassRoomIcon${index}`)}
                        />
                        {iconPreviews[index] && (
                          <img
                            src={iconPreviews[index]!}
                            alt="Icon Preview"
                            className="mt-2 size-10 object-cover rounded-full border"
                          />
                        )}
                      </div>

                      <div className="flex-1">
                        <input
                          {...register(`voices.${index}.name` as const)}
                          type="text"
                          placeholder="Student Name block"
                          className="placeholder:text-base xl:placeholder:text-lg border-none focus:ring-0 w-full"
                        />
                        <input
                          {...register(`voices.${index}.location` as const)}
                          type="text"
                          placeholder="Enter Location"
                          className="border-none focus:ring-0 w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex  mt-4 ">
                <button
                  type="button"
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                  onClick={() => {
                    append({
                      quote: "",
                      name: "",
                      location: "",
                      icon: null,
                    });
                    setIconPreviews((prev) => [...prev, null]);
                  }}
                >
                  + Add Voice
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Form Actions */}
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
            onClick={() => reset()}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md shadow hover:bg-gray-400 transition"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
