"use client";

import { useForm } from "react-hook-form";
import Tabs from "@/components/create-project-tabs/Tabs";
import { cn } from "@/lib/utils";
import { uploadCardImage } from "lib/uploadCardImage";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";
import DeleteModal from "@/components/delete-modal/deleteModal";
import { useState } from "react";
import { useTabs } from "@/components/context/TabsContext";

interface OfferIcon {
  iconTitle: string;
  shortDescription: string;
  iconFile?: File; // optional File object for the uploaded image
  iconPreviewUrl?: string; // optional derived preview URL
}

type FormData = {
  WhatWeOfferSectionTitle: string;
  sectionTitleAbout: string;
  bodyText: string;
  buttonName2: string;
  buttonLink2: string;
  sectionTitleVoices: string;
  sectionDescriptionVoices: string;
  offerIcons: OfferIcon[];
};

export default function Offer() {
  const { hideTab } = useTabs();
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      WhatWeOfferSectionTitle: "",
      offerIcons: [{ iconTitle: "", shortDescription: "" }],
    },
  });

  const offerIcons = watch("offerIcons"); // watch for offerIcons array
  const projectId = localStorage.getItem("projectId");
  const router = useRouter();

  // Add a new offer icon
  const handleAddOfferIcon = () => {
    const current = getValues("offerIcons") || [];
    if (current.length >= 4) {
      toast.error("You can add a maximum of 4 offer icons.");
      return;
    }
    setValue("offerIcons", [
      ...current,
      { iconTitle: "", shortDescription: "" },
    ]);
  };

  // Remove an offer icon by index
  const handleRemoveOfferIcon = (index: number) => {
    const current = getValues("offerIcons") || [];
    if (current.length <= 1) return; // Always keep at least one
    setValue(
      "offerIcons",
      current.filter((_, i) => i !== index)
    );
  };

  const setRef = (name: string) => (el: HTMLInputElement | null) => {
    if (el) el.value = ""; // optional: reset file input
  };

  const handleFileChange = (index: number, file: File) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      // update the form state with the file and preview url
      setValue(`offerIcons.${index}.iconFile`, file);
      setValue(`offerIcons.${index}.iconPreviewUrl`, reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: FormData) => {
    // Upload icons to Firebase and replace iconFile with URL
    const offerIconsWithUrls = await Promise.all(
      data.offerIcons.map(async (icon, idx) => {
        if (icon.iconFile) {
          const url = await uploadCardImage(icon.iconFile);
          return {
            iconTitle: icon.iconTitle,
            shortDescription: icon.shortDescription,
            url,
          };
        }
        return {
          iconTitle: icon.iconTitle,
          shortDescription: icon.shortDescription,
          url: icon.iconPreviewUrl || "",
        };
      })
    );

    const payload = {
      WhatWeOfferSectionTitle: data.WhatWeOfferSectionTitle,
      offerIcons: offerIconsWithUrls,
    };

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("projectId", result.id);
        toast.success("Project updated successfully!");
        router.push("/admin/project-and-initiative/new-project/team");
        reset();
      } else {
        toast.error(result.error || "Failed to update project.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update project.");
    }
  };

  // delete section button handler
  const [showModal, setShowModal] = useState(false);
  const [deleteSection, setDeleteSection] = useState("block");
  const handleDeleteSection = () => {
    setDeleteSection((prev) => (prev === "block" ? "hidden" : "block"));
    setShowModal(false);
    router.push("/admin/project-and-initiative/new-project/team");
    toast.success("Offer section deleted successfully!");
    reset();
    hideTab("/offer");
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
      <form onSubmit={handleSubmit(onSubmit)} className={`${deleteSection}`}>
        {/* Offer Icons Section */}
        <section className="border-2 my-6 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold mb-4 text-sky-800">
              7. ‘What We Offer?’ Section
            </h2>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="bg-red-500 rounded-lg px-4 py-2 transition-all duration-150 shadow-md active:shadow-none text-white"
            >
              Delete this section
            </button>
          </div>

          <div className="mb-5">
            <label className="block text-sm/6 font-medium text-gray-900 mb-2">
              What We Offer Section Title
            </label>
            <input
            {...register("WhatWeOfferSectionTitle", { required: true })}
            placeholder="Write something here..."
            className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
          />
           {/* Error */}
            {errors?.WhatWeOfferSectionTitle && (
              <p className="text-red-500 text-sm">{errors.WhatWeOfferSectionTitle?.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-4 mb-4">
            <button
              type="button"
              className="self-end px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition"
              onClick={handleAddOfferIcon}
            >
              Add Offer Icon
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offerIcons.map((icon, index) => (
              <div
                key={index}
                className="border border-gray-300 border-dashed rounded-xl px-4 py-6 relative"
              >
                {offerIcons.length > 1 && (
                  <button
                    type="button"
                    className="absolute top-2 right-2 px-2 py-1 text-red-500  rounded hover:text-red-600 text-xs"
                    onClick={() => handleRemoveOfferIcon(index)}
                  >
                    <Trash size={16} />
                  </button>
                )}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="relative">
                    <label
                      htmlFor={`offerIcon${index}`}
                      className="text-sm text-center xl:text-left xl:text-xl px-4 py-1 xl:py-3 rounded-xl cursor-pointer inline-block shadow-sm shadow-gray-500"
                    >
                      Add Offer Icon +
                    </label>
                    <input
                      type="file"
                      id={`offerIcon${index}`}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileChange(index, file);
                      }}
                      ref={setRef(`offerIcon${index}`)}
                    />
                    {offerIcons[index]?.iconPreviewUrl && (
                      <img
                        src={offerIcons[index].iconPreviewUrl}
                        alt={`Offer Icon ${index + 1} Preview`}
                        className="mt-2 size-10 object-contain"
                      />
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="block text-sm/6 font-medium text-gray-900 mb-2">
                        Icon Title
                      </label>
                      <input
                        name={`offerIcons.${index}.iconTitle`}
                        type="text"
                        placeholder="Enter icon title"
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                        value={offerIcons[index]?.iconTitle || ""}
                        onChange={(e) =>
                          setValue(
                            `offerIcons.${index}.iconTitle`,
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm/6 font-medium text-gray-900 mb-2">
                        Short Description
                      </label>
                      <textarea
                        name={`offerIcons.${index}.shortDescription`}
                        placeholder="Enter short description"
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                        rows={3}
                        value={offerIcons[index]?.shortDescription || ""}
                        onChange={(e) =>
                          setValue(
                            `offerIcons.${index}.shortDescription`,
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
            onClick={() => {
              reset();
            }}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md shadow hover:bg-gray-400 transition"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
