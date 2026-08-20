"use client";

import { useProjectId } from "@/hooks/useProjectId";
import { useTabs } from "@/components/context/TabsContext";
import Tabs from "@/components/create-project-tabs/Tabs";
import DeleteModal from "@/components/delete-modal/deleteModal";
import { uploadCardImage } from "lib/uploadCardImage";
import { Trash } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { cn } from "utilities/cn";

function PhotoAlbum() {
  const { hideTab } = useTabs();
  const fileInputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    register,
    setValue,
    getValues,
  } = useForm();

  // Dynamic photo album items
  const [photoAlbumItems, setPhotoAlbumItems] = React.useState<
    Array<{
      image: File | null;
      imagePreview: string;
      photoAlbumLabelName: string;
      title: string;
      description: string;
    }>
  >([{ image: null, imagePreview: "",photoAlbumLabelName: "", title: "", description: "" }]);
  const projectId = useProjectId();
  const searchParams = useSearchParams();
  const isEdit = searchParams?.get("edit") === "1";
  console.log("🚀 ~ PhotoAlbum ~ projectId:", projectId)
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      if (!isEdit || !projectId) return;
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) return;
        const p = await res.json();
        setValue("photoAlbumLabelName", p.photoAlbumLabelName || "");
        setValue("sectionTitlePhoto", p.sectionTitlePhoto || "");
        setValue("sectionDescriptionPhoto", p.sectionDescriptionPhoto || "");
        if (Array.isArray(p.photoAlbums) && p.photoAlbums.length) {
          setPhotoAlbumItems(
            p.photoAlbums.map((pa: any) => ({
              image: null,
              imagePreview: pa.image || "",
              photoAlbumLabelName: p.photoAlbumLabelName || "",
              title: pa.title || "",
              description: pa.description || "",
            }))
          );
        }
      } catch {}
    };
    load();
  }, [isEdit, projectId, setValue]);

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ): void {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoAlbumItems((prev) => {
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            image: file,
            imagePreview: reader.result as string,
          };
          return updated;
        });
      };
      reader.readAsDataURL(file);
    }
  }

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    idx: number
  ) {
    const { name, value } = e.target;
    setPhotoAlbumItems((prev) => {
      const updated = [...prev];
      updated[idx] = {
        ...updated[idx],
        [name]: value,
      };
      return updated;
    });
  }

  function addPhotoAlbumItem() {
    setPhotoAlbumItems((prev) => [
      ...prev,
      { image: null, imagePreview: "",photoAlbumLabelName: "", title: "", description: "" },
    ]);
  }

  function removePhotoAlbumItem(idx: number) {
    setPhotoAlbumItems((prev) => prev.filter((_, i) => i !== idx));
    fileInputRefs.current.splice(idx, 1);
  }

  const onSubmit = async (data: any) => {
    try {
      // Upload images and build items array
      const items = await Promise.all(
        photoAlbumItems.map(async (item) => {
          let imageUrl = "";
          if (item.image) {
            // @ts-ignore
            imageUrl = await uploadCardImage(item.image);
          } else if (item.imagePreview) {
            imageUrl = item.imagePreview;
          }
          return {
            image: imageUrl,
            title: item.title,
            description: item.description,
          };
        })
      );
      const payload = {
        photoAlbumLabelName: data.photoAlbumLabelName,
        sectionTitlePhoto: data.sectionTitlePhoto,
        sectionDescriptionPhoto: data.sectionDescriptionPhoto,
        photoAlbum: items,
      };
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      console.log("🚀 ~ onSubmit ~ result:", result)
      if (!response.ok) {
        toast.error("Failed to save photo album section.");
      }
      if (response.ok) {
        localStorage.setItem("projectId", result.id);
        toast.success("Photo album section saved successfully!");
        const suffix = isEdit ? `?edit=1&id=${projectId}` : "";
        router.push(`/admin/project-and-initiative/new-project/news-letter${suffix}`);
        clearPhotoAlbumForm();
      }
    } catch (error: any) {
      toast.error(
        error.message || "An error occurred while saving the project section"
      );
    }
  };

  function clearPhotoAlbumForm() {
    reset();
    setPhotoAlbumItems([
      { image: null, imagePreview: "",photoAlbumLabelName: "", title: "", description: "" },
    ]);
    fileInputRefs.current = [];
  }

  // delete section button handler
  const [showModal, setShowModal] = useState(false);
  const [deleteSection, setDeleteSection] = useState("block");
  const handleDeleteSection = () => {
    setDeleteSection((prev) => (prev === "block" ? "hidden" : "block"));
    setShowModal(false);
    router.push(`/admin/project-and-initiative/new-project/news-letter`);

    toast.success("Photo-album section deleted successfully!");
    reset();
    hideTab("/photo-album");
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
        {isEdit ? "Edit Project" : "Create New Project"}
      </h2>
      <Tabs />
      {/* Photo Album Section */}
      <section
        className={`${deleteSection} border-2 my-6 rounded-lg p-4 md:p-8 lg:px-14 bg-white `}
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-sky-800 text-xl font-semibold">
            11. Photo Album Section
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
        <div className="bg-gray-200 w-48 px-4 my-2 py-1 rounded-full flex items-center">
         <span className="w-2 h-2 bg-sky-700  p-1.5 rounded-full"></span>
            <input
              {...register("photoAlbumLabelName", {
                required: "photoAlbumLabelName is required",
              })}
              type="text"
              placeholder="e.g., 'photo album'"
              className="border-none outline-none focus:bg-transparent focus:ring-0 bg-transparent w-40 placeholder:text-gray-400"
            />
        </div>
        <DeleteModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onDelete={handleDeleteSection}
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="col-span-1 mt-4 md:mt-0">
              <label className="block text-sm/6 font-medium text-gray-900 mb-2">
                Section Title
              </label>
              <Controller
                name="sectionTitlePhoto"
                control={control}
                rules={{
                  required: "Section Title is required",
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="e.g. 'Photo Album'"
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  />
                )}
              />
              {errors.sectionTitlePhoto && (
                <p className="text-red-500 text-sm">
                  {errors.sectionTitlePhoto?.message as string}
                </p>
              )}
            </div>
            <div className="col-span-2 mt-4 md:mt-0">
              <label className="block text-sm/6 font-medium text-gray-900 mb-2">
                Section Description
              </label>
              <Controller
                name="sectionDescriptionPhoto"
                control={control}
                rules={{
                  required: "Section Description is required",
                }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    placeholder="write something here..."
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    rows={4}
                  />
                )}
              />
              {errors.sectionDescriptionPhoto && (
                <p className="text-red-500 text-sm">
                  {errors?.sectionDescriptionPhoto.message as string}
                </p>
              )}
            </div>
          </div>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {photoAlbumItems.map((item, idx) => (
              <div
                key={idx}
                className="mt-2 flex flex-col justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2 relative"
              >
                <div className="relative text-center">
                  {item.imagePreview ? (
                    <div className="relative">
                      <img
                        src={item.imagePreview}
                        alt={`Photo Album Image ${idx + 1} Preview`}
                        className="mx-auto w-16 h-16 object-cover"
                      />
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
                    onChange={(e) => handleFileChange(e, idx)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    ref={(el) => {
                      fileInputRefs.current[idx] = el;
                    }}
                  />
                  <p className="mt-4 font-semibold text-blue-500">
                    Drag & Drop your Photo
                  </p>
                  <p className="text-gray-500">here or browse images</p>
                </div>
                <input
                  type="text"
                  name="title"
                  value={item.title}
                  onChange={(e) => handleInputChange(e, idx)}
                  placeholder="Image Title"
                  className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                />
                <textarea
                  name="description"
                  value={item.description}
                  onChange={(e) => handleInputChange(e, idx)}
                  placeholder="Image Description"
                  className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  rows={2}
                />
                {photoAlbumItems.length > 1 && (
                  <button
                    type="button"
                    className="absolute top-2 right-2 text-red-500 transition duration-200 hover:text-red-600  flex items-center justify-center text-xs"
                    onClick={() => removePhotoAlbumItem(idx)}
                  >
                    <Trash size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-2">
            <button
              type="button"
              className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
              onClick={addPhotoAlbumItem}
            >
              + Add Photo
            </button>
          </div>
          <div className="flex justify-between mt-4">
            <button
              type="submit"
              className={cn(
                "bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              onClick={clearPhotoAlbumForm}
              className="ml-2 bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Clear
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default PhotoAlbum;
