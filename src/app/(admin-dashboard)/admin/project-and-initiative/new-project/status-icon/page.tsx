"use client";

import Tabs from "@/components/create-project-tabs/Tabs";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { uploadCardImage } from "lib/uploadCardImage";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "utilities/cn";
import { Trash } from "lucide-react";
import DeleteModal from "@/components/delete-modal/deleteModal";
import { useTabs } from "@/components/context/TabsContext";

type StatusSection = {
  iconTitle: string;
  shortDescription: string;
  statusIcon: File | null;
};

type StatusFormValues = {
  sections: StatusSection[];
};

export default function StatusIconsForm() {
  const {hideTab} = useTabs();

  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StatusFormValues>({
    defaultValues: {
      sections: [
        { iconTitle: "", shortDescription: "", statusIcon: null },
        { iconTitle: "", shortDescription: "", statusIcon: null },
      ],
    },
  });

  const [iconPreviews, setIconPreviews] = useState<(string | null)[]>([
    null,
    null,
  ]);

  const router = useRouter();
  const projectId =
    typeof window !== "undefined" ? localStorage.getItem("projectId") : null;
  const isEdit = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("edit") === "1" : false;

  const fileInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  useEffect(() => {
    const load = async () => {
      if (!isEdit || !projectId) return;
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) return;
        const p = await res.json();
        if (Array.isArray(p.statusAndIcons) && p.statusAndIcons.length) {
          const mapped = p.statusAndIcons.map((s: any) => ({
            iconTitle: s.iconTitle || "",
            shortDescription: s.shortDescription || "",
            statusIcon: null as File | null,
          }));
          setValue("sections", mapped);
          setIconPreviews(p.statusAndIcons.map((s: any) => s.statusIcon || null));
        }
      } catch {}
    };
    load();
  }, [isEdit, projectId, setValue]);

  const handleIconPreviewChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(`sections.${idx}.statusIcon`, file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreviews((prev) => {
          const updated = [...prev];
          updated[idx] = reader.result as string;
          return updated;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: StatusFormValues) => {
    try {
      const sectionsWithUrls = await Promise.all(
        data.sections.map(async (section, idx) => {
          let statusIconUrl = null as string | null;
          if (section.statusIcon) {
            statusIconUrl = await uploadCardImage(section.statusIcon);
          } else if (iconPreviews[idx]) {
            statusIconUrl = iconPreviews[idx]!;
          }
          return {
            iconTitle: section.iconTitle,
            shortDescription: section.shortDescription,
            statusIcon: statusIconUrl,
          };
        })
      );
      const payload = { ...data, sections: sectionsWithUrls };
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success("Status and Icon saved successfully!");
        localStorage.setItem("projectId", result.id);
        const suffix = isEdit ? `?edit=1&id=${result.id}` : "";
        router.push(`/admin/project-and-initiative/new-project/vission-goal${suffix}`);
        reset();
        setIconPreviews([]);
        fileInputRefs.current.forEach((ref) => {
          if (ref) ref.value = "";
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const sections = watch("sections");

  const handleAddSection = () => {
    if (sections.length >= 4) return;
    setValue("sections", [
      ...sections,
      { iconTitle: "", shortDescription: "", statusIcon: null },
    ]);
    setIconPreviews((prev) => [...prev, null]);
  };

  const handleRemoveSection = (idx: number) => {
    if (sections.length <= 1) return;
    setValue(
      "sections",
      sections.filter((_, i) => i !== idx)
    );
    setIconPreviews((prev) => prev.filter((_, i) => i !== idx));
    if (fileInputRefs.current[idx]) fileInputRefs.current[idx]!.value = "";
  };

  // delete section button handler
  const [showModal, setShowModal] = useState(false);
  const [deleteSection, setDeleteSection] = useState("block");
  const handleDeleteSection = () => {
    setDeleteSection((prev) => (prev === "block" ? "hidden" : "block"));
    setShowModal(false);
    router.push(`/admin/project-and-initiative/new-project/vission-goal`);
    toast.success("Status-icon section deleted successfully!");
    reset();
    hideTab('/status-icon');
  };

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
      className={`${deleteSection} my-8 border-2 p-6 bg-white rounded-lg `}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl mb-6 text-sky-800">2. Status & Icons</h2>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="bg-red-500 rounded-lg px-4 py-2 transition-all duration-150 shadow-md active:shadow-none text-white"
          >
            Delete this section
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-lg p-4 shadow col-span-1 space-y-4 relative"
            >
              <h3 className="font-semibold text-sky-700">
                Status Icon {idx + 1}
              </h3>
              {sections.length > 1 && (
                <button
                  type="button"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg font-bold"
                  onClick={() => handleRemoveSection(idx)}
                  title="Remove section"
                >
                  <Trash size={20} />
                </button>
              )}

              {/* Icon Upload */}
              <div className="relative text-center">
                <label
                  htmlFor={`icon${idx}`}
                  className="text-sm font-medium cursor-pointer px-4 py-2 bg-white border border-dashed border-gray-300 rounded-lg shadow mb-2 inline-block"
                >
                  Add Icon +
                </label>
                <input
                  type="file"
                  id={`icon${idx}`}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleIconPreviewChange(e, idx)}
                  ref={(el) => {
                    fileInputRefs.current[idx] = el;
                  }}
                />
                {iconPreviews[idx] && (
                  <img
                    src={iconPreviews[idx]!}
                    alt={`Icon ${idx + 1}`}
                    className="size-10 mx-auto object-contain"
                  />
                )}
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Title
                </label>
                <input
                  name={`sections.${idx}.iconTitle`}
                  type="text"
                  placeholder="Enter the title"
                  className="w-full border border-dashed border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-sky-200"
                  value={section.iconTitle}
                  onChange={(e) =>
                    setValue(`sections.${idx}.iconTitle`, e.target.value)
                  }
                />
                {/* Add error display if using validation */}
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-2">
                  Short Description
                </label>
                <textarea
                  name={`sections.${idx}.shortDescription`}
                  rows={3}
                  placeholder="Enter a short description"
                  className="w-full border border-dashed border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-sky-200"
                  value={section.shortDescription}
                  onChange={(e) =>
                    setValue(`sections.${idx}.shortDescription`, e.target.value)
                  }
                />
                {/* Add error display if using validation */}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAddSection}
            disabled={sections.length >= 4}
          >
            + Add Section
          </button>
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
              setIconPreviews([]);
              fileInputRefs.current.forEach((ref) => {
                if (ref) ref.value = "";
              });
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
