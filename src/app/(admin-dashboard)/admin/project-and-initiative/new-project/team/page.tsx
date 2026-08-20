"use client";

import { useProjectId } from "@/hooks/useProjectId";

import { useTabs } from "@/components/context/TabsContext";
import Tabs from "@/components/create-project-tabs/Tabs";
import DeleteModal from "@/components/delete-modal/deleteModal";
import { cn } from "@/lib/utils";
import { uploadCardImage } from "lib/uploadCardImage";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaSquarePlus, FaTrash } from "react-icons/fa6";

type TeamCard = {
  name: string;
  role: string;
  biography: string;
  showLinkInput?: boolean;
  link?: string;
};

type FormData = {
  teamLabelName: string;
  sectionTitleTeam: string;
  sectionDescriptionTeam: string;
  teamCards: TeamCard[];
};

export default function TeamSectionForm() {
  const { hideTab } = useTabs();
  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    register,
    getValues,
  } = useForm<FormData>({
    defaultValues: {
      teamLabelName: "",
      sectionTitleTeam: "",
      sectionDescriptionTeam: "",
      teamCards: [
        {
          name: "",
          role: "",
          biography: "",
          showLinkInput: false,
          link: "",
        },
      ],
    },
  });

  // To store files for images and icons
  const [teamCardFiles, setTeamCardFiles] = useState<{
    images: (File | null)[];
    icons: (File | null)[];
  }>({
    images: [null],
    icons: [null],
  });

  // For image previews
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string }>(
    {}
  );

  // refs to clear file inputs
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const setRef = (name: string) => (el: HTMLInputElement | null) => {
    fileInputRefs.current[name] = el;
  };
  const projectId = useProjectId();
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
        setValue("teamLabelName", p.teamLabelName || "");
        setValue("sectionTitleTeam", p.sectionTitleTeam || "");
        setValue("sectionDescriptionTeam", p.sectionDescriptionTeam || "");
        if (Array.isArray(p.teamCards) && p.teamCards.length) {
          setValue(
            "teamCards",
            p.teamCards.map((t: any) => ({
              name: t.name || "",
              role: t.role || "",
              biography: t.biography || "",
              showLinkInput: Boolean(t.showLinkInput),
              link: t.link || "",
            }))
          );
          setTeamCardFiles({
            images: p.teamCards.map(() => null),
            icons: p.teamCards.map(() => null),
          });
          setImagePreviews(
            p.teamCards.reduce((acc: any, t: any, idx: number) => {
              if (t.image) acc[`teamImage${idx}`] = t.image;
              return acc;
            }, {})
          );
        }
      } catch {}
    };
    load();
  }, [isEdit, projectId, setValue]);

  // Handle image upload & preview for team photos
  const handleTeamImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews((prev) => ({
        ...prev,
        [`teamImage${index}`]: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);

    // Save file
    setTeamCardFiles((prev) => {
      const newImages = [...prev.images];
      newImages[index] = file;
      return { ...prev, images: newImages };
    });
  };

  // Handle icon upload
  const handleTeamIconChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTeamCardFiles((prev) => {
      const newIcons = [...prev.icons];
      newIcons[index] = file;
      return { ...prev, icons: newIcons };
    });
  };

  // Toggle showLinkInput in react-hook-form state
  const toggleLinkInput = (index: number) => {
    const current = watch(`teamCards.${index}.showLinkInput`);
    setValue(`teamCards.${index}.showLinkInput`, !current);
  };

  const onSubmit = async (data: FormData) => {
    try {
      // Upload images and icons for each team card
      const teamCardsWithFiles = await Promise.all(
        data.teamCards.map(async (card, idx) => {
          let imageUrl = "";
          let iconUrl = "";
          if (teamCardFiles.images[idx]) {
            imageUrl = await uploadCardImage(teamCardFiles.images[idx]!);
          }
          if (teamCardFiles.icons[idx]) {
            iconUrl = await uploadCardImage(teamCardFiles.icons[idx]!);
          }
          return {
            ...card,
            image: imageUrl,
            icon: iconUrl,
          };
        })
      );

      const payload = {
        ...data,
        teamCards: teamCardsWithFiles,
      };
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      console.log("🚀 ~ onSubmit ~ result for students:", result)
      if (response.ok) {
        localStorage.setItem("projectId", result.id);
        toast.success("Team section updated successfully!");
        const suffix = isEdit ? `?edit=1&id=${result.id}` : "";
        router.push(`/admin/project-and-initiative/new-project/students${suffix}`);
        handleClear();
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update team section."
      );
    }
  };

  // Clear all form fields + previews + files
  const handleClear = () => {
    reset({
      teamLabelName: "",
      sectionTitleTeam: "",
      sectionDescriptionTeam: "",
      teamCards: Array(3).fill({
        name: "",
        role: "",
        biography: "",
        showLinkInput: false,
        link: "",
      }),
    });
    setTeamCardFiles({ images: [null, null, null], icons: [null, null, null] });
    setImagePreviews({});
    // Clear file inputs
    Object.values(fileInputRefs.current).forEach((input) => {
      if (input) input.value = "";
    });
  };

  // Add a new team card
  const handleAddTeamCard = () => {
    const currentCards = getValues("teamCards");
    setValue("teamCards", [
      ...currentCards,
      { name: "", role: "", biography: "", showLinkInput: false, link: "" },
    ]);
    setTeamCardFiles((prev) => ({
      images: [...prev.images, null],
      icons: [...prev.icons, null],
    }));
  };

  // Remove a team card
  const handleRemoveTeamCard = (index: number) => {
    const currentCards = getValues("teamCards");
    if (currentCards.length === 1) return; // Prevent removing last card
    const newCards = currentCards.filter((_, i) => i !== index);
    setValue("teamCards", newCards);
    setTeamCardFiles((prev) => ({
      images: prev.images.filter((_, i) => i !== index),
      icons: prev.icons.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[`teamImage${index}`];
      return newPreviews;
    });
    // Remove file input refs
    delete fileInputRefs.current[`teamImage${index}`];
    delete fileInputRefs.current[`StatusIcon${index}`];
  };

  // delete section button handler
  const [showModal, setShowModal] = useState(false);
  const [deleteSection, setDeleteSection] = useState("block");
  const handleDeleteSection = () => {
    setDeleteSection((prev) => (prev === "block" ? "hidden" : "block"));
    setShowModal(false);
    router.push("/admin/project-and-initiative/new-project/students");
    toast.success("Team section deleted successfully!");
    reset();
    hideTab("/team");
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
        {/* Team Section */}
        <section className="border-2 my-6 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sky-800 text-xl font-semibold mb-4">
              8. Team Section
            </h3>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="bg-red-500 rounded-lg px-4 py-2 transition-all duration-150 shadow-md active:shadow-none text-white"
            >
              Delete this section
            </button>
          </div>
          <p>Label's Name</p>
          <div className="flex items-center py-1 px-4 bg-gray-200 rounded-full w-52 my-2">
            <span className="w-2 h-2 bg-sky-700  p-1.5 rounded-full"></span>
            <input
              {...register("teamLabelName", {
                required: "teamLabelName is required",
              })}
              type="text"
              placeholder="e.g., 'Team'"
              className="border-none outline-none focus:bg-transparent focus:ring-0 bg-transparent w-40 placeholder:text-gray-400"
            />
          </div>
          {errors.teamLabelName && (
                <p className="text-red-500 text-sm">
                  {errors.teamLabelName.message}
                </p>
              )}

          {/* Section Title & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="col-span-1 mt-6 md:mt-0">
              <label className="block text-sm/6 font-medium text-gray-900 mb-2">
                Section Title
              </label>
              <input
                {...register("sectionTitleTeam", {
                  required: "team Section Title is required",
                })}
                type="text"
                placeholder="e.g. 'Our Team'"
                className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
              />
              {errors.sectionTitleTeam && (
                <p className="text-red-500 text-sm">
                  {errors.sectionTitleTeam.message}
                </p>
              )}
            </div>

            <div className="col-span-2 mt-4 md:mt-0">
              <label className="block text-sm/6 font-medium text-gray-900 mb-2">
                Section Description
              </label>
              <textarea
                {...register("sectionDescriptionTeam", {
                  required: "Section Description is required",
                })}
                placeholder="write something here..."
                className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                rows={4}
              />
              {errors.sectionDescriptionTeam && (
                <p className="text-red-500 text-sm">
                  {errors.sectionDescriptionTeam.message}
                </p>
              )}
            </div>
          </div>

          {/* Team Cards */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {watch("teamCards").map((_, index: number) => (
              <div
                key={index}
                className="border border-gray-300 border-dashed rounded-xl px-4 py-8"
              >
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                  <div className="relative text-center">
                    {teamCardFiles.images[index] ? (
                      <div className="relative">
                        <img
                          src={imagePreviews[`teamImage${index}`]}
                          alt="Uploaded image"
                          className="mx-auto w-16 h-16 object-cover"
                        />
                        <span
                          className="absolute top-0 right-0 cursor-pointer"
                          onClick={() => {
                            setTeamCardFiles((prev) => {
                              const newImages = [...prev.images];
                              newImages[index] = null;
                              return { ...prev, images: newImages };
                            });
                            setImagePreviews((prev) => {
                              const newPreviews = { ...prev };
                              delete newPreviews[`teamImage${index}`];
                              return newPreviews;
                            });
                            if (fileInputRefs.current[`teamImage${index}`]) {
                              fileInputRefs.current[
                                `teamImage${index}`
                              ]!.value = "";
                            }
                          }}
                        >
                          ✖
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
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => handleTeamImageChange(e, index)}
                      ref={setRef(`teamImage${index}`)}
                    />
                    <p className="mt-4 font-semibold text-blue-500">
                      Drag & Drop your Photo
                    </p>
                    <p className="text-gray-500">here or browse images</p>
                  </div>
                </div>

                {/* Inputs */}
                <input
                  {...register(`teamCards.${index}.name` as const)}
                  type="text"
                  placeholder="Enter Person's Name..."
                  className="border-none focus:ring-0 w-full mt-2 placeholder:text-lg"
                />
                <input
                  {...register(`teamCards.${index}.role` as const)}
                  type="text"
                  placeholder="Enter their role..."
                  className="border-none focus:ring-0 w-full"
                />
                <textarea
                  {...register(`teamCards.${index}.biography` as const)}
                  rows={2}
                  placeholder="Enter a short biography"
                  className="border-none focus:ring-0 resize-none w-full placeholder:font-medium"
                />

                {/* Add Link and Icon Upload */}
                <div className="flex justify-end space-x-3 my-4">
                  <button
                    type="button"
                    onClick={() => toggleLinkInput(index)}
                    className="bg-gray-100 text-sm xl:text-base px-1 xl:px-3 py-2 rounded-xl cursor-pointer border border-gray-400"
                  >
                    Add Link +
                  </button>
                  <label
                    htmlFor={`StatusIcon${index}`}
                    className="bg-gray-100 text-sm xl:text-base px-1 xl:px-3 py-2 rounded-xl cursor-pointer border border-gray-400"
                  >
                    upload Icon +
                  </label>
                  <input
                    type="file"
                    id={`StatusIcon${index}`}
                    className="hidden"
                    onChange={(e) => handleTeamIconChange(e, index)}
                    ref={setRef(`StatusIcon${index}`)}
                  />
                </div>

                {/* Show link input if toggled */}
                {watch(`teamCards.${index}.showLinkInput`) ? (
                  <input
                    {...register(`teamCards.${index}.link` as const)}
                    type="text"
                    placeholder="Enter the link"
                    className="border w-full mt-2 border-gray-400 rounded-lg"
                  />
                ) : null}

                {/* Show uploaded icon preview */}
                {teamCardFiles.icons[index] && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(teamCardFiles.icons[index]!)}
                      alt="Uploaded icon"
                      className="w-8 h-8 object-cover"
                    />
                  </div>
                )}

                {/* Plus and Trash icons */}
                <div className="flex justify-end space-x-4 col-span-2 mt-3">
                  <span
                    className="text-blue-600 cursor-pointer hover:text-blue-700"
                    onClick={handleAddTeamCard}
                  >
                    <FaSquarePlus />
                  </span>
                  <span
                    className={`text-red-500 hover:text-red-600 cursor-pointer w-4 h-4 ${
                      watch("teamCards").length === 1
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() => handleRemoveTeamCard(index)}
                  >
                    <FaTrash />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Submit and Clear Buttons */}
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
      </form>
    </div>
  );
}
