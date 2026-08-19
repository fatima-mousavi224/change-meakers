"use client";

import LinearWithValueLabel from "@/components/common/LinearProgressWithLabel";
import {
  OPPORTUNITY_CATEGORIES,
  OPPORTUNITY_LOCATIONS,
} from "@/constant/opportunities";
import type { OpportunityContentBlock } from "@/constant/opportunityContentBlocks";
import { htmlContentToBlocks } from "@/constant/opportunityContentBlocks";
import { formatDate } from "@/utilities/formatDatetoMMYYDDD";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { uploadCardImage } from "lib/uploadCardImage";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import OpportunityContentBlocksEditor, {
  contentBlocksToEditable,
  createDefaultEditableBlocks,
  type EditableContentBlock,
} from "./OpportunityContentBlocksEditor";

type ImageState = {
  file: File | null;
  url: string | null;
  preview: string | null;
};

const emptyImageState = (): ImageState => ({
  file: null,
  url: null,
  preview: null,
});

function resolveStoredImageUrl(preview: string | null, url: string | null) {
  if (url) return url;
  if (preview && (/^https?:\/\//.test(preview) || preview.startsWith("/")))
    return preview;
  return null;
}

interface OpportunityFormModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const selectableCategories = OPPORTUNITY_CATEGORIES.filter(
  (c) => c !== "All Opportunities"
);
const selectableLocations = OPPORTUNITY_LOCATIONS.filter(
  (l) => l !== "All Locations"
);

function ImageUploadField({
  label,
  hint,
  preview,
  onFileSelect,
}: {
  label: string;
  hint?: string;
  preview: string | null;
  onFileSelect: (file: File) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {hint ? (
        <p className="mt-1 text-xs text-gray-500">{hint}</p>
      ) : null}
      <div className="mt-2 flex items-center gap-4">
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            width={80}
            height={80}
            className="size-20 rounded-md object-cover"
            unoptimized={
              preview.startsWith("blob:") ||
              preview.startsWith("http") ||
              preview.startsWith("/uploads/") ||
              preview.startsWith("/")
            }
          />
        ) : null}
        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600">
          <PhotoIcon className="size-5" />
          Upload image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileSelect(file);
            }}
          />
        </label>
      </div>
    </div>
  );
}

export default function OpportunityFormModal({
  open,
  setOpen,
}: OpportunityFormModalProps) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const router = useRouter();
  const params = useSearchParams();
  const opportunityId = params.get("opportunityId");

  const [progress, setProgress] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [isDataPopulated, setIsDataPopulated] = useState(Boolean(opportunityId));
  const [contentBlocks, setContentBlocks] = useState<EditableContentBlock[]>(
    createDefaultEditableBlocks()
  );

  const [cardImagePreview, setCardImagePreview] = useState<string | null>(null);

  const cardImageRef = useRef<ImageState>(emptyImageState());
  const loadedKeyRef = useRef<string | null>(null);

  const setCardImageState = (next: ImageState) => {
    cardImageRef.current = next;
    setCardImagePreview(next.preview);
  };

  const resetImages = () => {
    setCardImageState(emptyImageState());
  };

  const uploadBlockImage = async (file: File) => {
    setLoading(true);
    try {
      return await uploadCardImage(file);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      loadedKeyRef.current = null;
      return;
    }

    const loadKey = opportunityId ?? "new";
    if (loadedKeyRef.current === loadKey) return;
    loadedKeyRef.current = loadKey;

    async function loadOpportunity() {
      if (!opportunityId) {
        reset({
          title: "",
          excerpt: "",
          category: selectableCategories[0],
          location: selectableLocations[0],
          deadline: "",
          postedDate: "",
          applicationUrl: "",
          resourceProvider: "",
          mainSource: "",
          published: true,
        });
        resetImages();
        setContentBlocks(createDefaultEditableBlocks());
        return;
      }

      try {
        setIsDataPopulated(true);
        const res = await axios.get(
          `/api/opportunities/${opportunityId}?admin=true`
        );
        const data = res.data;

        reset({
          title: data.title || "",
          excerpt: data.excerpt || "",
          category: data.category || selectableCategories[0],
          location: data.location || selectableLocations[0],
          deadline: data.deadline ? formatDate(new Date(data.deadline)) : "",
          postedDate: data.postedDate
            ? formatDate(new Date(data.postedDate))
            : "",
          applicationUrl: data.applicationUrl || "",
          resourceProvider: data.resourceProvider || "",
          mainSource: data.mainSource || "",
          published: Boolean(data.published),
        });

        setCardImageState({
          file: null,
          url: data.image || null,
          preview: data.image || null,
        });

        let editableBlocks = contentBlocksToEditable(data.contentBlocks ?? []);
        if (!editableBlocks.length && data.content) {
          editableBlocks = contentBlocksToEditable(
            htmlContentToBlocks(data.content)
          );
        }
        if (
          data.videoUrl &&
          !editableBlocks.some(
            (block) => block.type === "video" && block.url === data.videoUrl
          )
        ) {
          editableBlocks = [
            ...editableBlocks,
            {
              id: `${Date.now()}-video`,
              type: "video",
              url: data.videoUrl,
              caption: "",
            },
          ];
        }
        setContentBlocks(
          editableBlocks.length
            ? editableBlocks
            : createDefaultEditableBlocks()
        );
      } catch (error) {
        console.error("Failed to load opportunity", error);
        toast.error("Failed to load opportunity");
      } finally {
        setIsDataPopulated(false);
      }
    }

    loadOpportunity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, opportunityId]);

  const resolveImageForSubmit = async (
    imageState: ImageState,
    label: string
  ) => {
    if (imageState.file) {
      try {
        setLoading(true);
        return await uploadCardImage(imageState.file);
      } catch (error: any) {
        console.error(`Failed to upload ${label}`, error);
        const message =
          error?.code === "storage/quota-exceeded"
            ? "Firebase Storage is full. Free up space in the Firebase Console or upgrade your plan."
            : error?.code === "storage/unauthorized"
              ? "Image upload is not permitted. Please contact an administrator."
              : error?.message || `Failed to upload ${label}. Please try again.`;
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    }

    return resolveStoredImageUrl(imageState.preview, imageState.url);
  };

  const resolveContentBlocksForSubmit = async (
    blocks: EditableContentBlock[]
  ): Promise<OpportunityContentBlock[]> => {
    const resolved: OpportunityContentBlock[] = [];

    for (let index = 0; index < blocks.length; index += 1) {
      const block = blocks[index];
      if (block.type === "text") {
        const body = block.body.trim();
        if (body) {
          resolved.push({ type: "text", body });
        }
        continue;
      }

      if (block.type === "image") {
        if (block.isUploading) {
          throw new Error("Please wait for all images to finish uploading");
        }

        let src = block.src.trim();
        if (!src && block.file) {
          setLoading(true);
          src = await uploadCardImage(block.file);
          setLoading(false);
        }

        if (!src) {
          src =
            resolveStoredImageUrl(block.preview, block.src) || "";
        }

        if (!src) {
          throw new Error(`Image block ${index + 1} is missing an uploaded image`);
        }

        resolved.push({
          type: "image",
          src,
          caption: block.caption.trim() || undefined,
        });
        continue;
      }

      const url = block.url.trim();
      if (!url) {
        continue;
      }

      resolved.push({
        type: "video",
        url,
        caption: block.caption.trim() || undefined,
      });
    }

    return resolved;
  };

  const handleCardFileSelect = (file: File) => {
    setCardImageState({
      file,
      url: null,
      preview: URL.createObjectURL(file),
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
    try {
      const cardImageState = cardImageRef.current;

      const finalCardImage = await resolveImageForSubmit(
        cardImageState,
        "card image"
      );

      if (!finalCardImage) {
        toast.error("Please upload a card image for the listing page");
        return;
      }

      const resolvedContentBlocks =
        await resolveContentBlocksForSubmit(contentBlocks);

      if (!resolvedContentBlocks.length) {
        toast.error("Add at least one text, image, or video block");
        return;
      }

      const payload = {
        title: formData.title,
        excerpt: formData.excerpt,
        contentBlocks: resolvedContentBlocks,
        category: formData.category,
        location: formData.location,
        image: finalCardImage,
        detailImage: null,
        deadline: formData.deadline,
        postedDate: formData.postedDate || null,
        applicationUrl: formData.applicationUrl || null,
        resourceProvider: formData.resourceProvider || null,
        mainSource: formData.mainSource || null,
        published: Boolean(formData.published),
      };

      if (opportunityId) {
        await axios.patch(`/api/opportunities/${opportunityId}`, payload);
        toast.success("Opportunity updated successfully");
      } else {
        await axios.post("/api/opportunities", payload);
        toast.success("Opportunity created successfully");
      }

      setOpen(false);
      router.replace("/admin/manage-opportunities");
      router.refresh();
    } catch (error: any) {
      toast.error(
        error?.message ||
          error?.response?.data?.error ||
          "Failed to save opportunity"
      );
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleClose = () => {
    setOpen(false);
    router.replace("/admin/manage-opportunities");
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75" />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="size-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {opportunityId ? "Edit Opportunity" : "Add Opportunity"}
            </h2>

            {isDataPopulated ? (
              <div className="py-10 text-center text-gray-500">Loading...</div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    {...register("title", { required: "Title is required" })}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Excerpt
                  </label>
                  <textarea
                    {...register("excerpt", {
                      required: "Excerpt is required",
                    })}
                    rows={3}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      {...register("category", { required: true })}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    >
                      {selectableCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <select
                      {...register("location", { required: true })}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    >
                      {selectableLocations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Deadline
                    </label>
                    <input
                      type="date"
                      {...register("deadline", { required: true })}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Posted Date (optional)
                    </label>
                    <input
                      type="date"
                      {...register("postedDate")}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                </div>

                <ImageUploadField
                  label="Card Image"
                  hint="Shown on the /apply listing cards"
                  preview={cardImagePreview}
                  onFileSelect={handleCardFileSelect}
                />

                <LinearWithValueLabel isLoading={isLoading} progress={progress} />

                <OpportunityContentBlocksEditor
                  blocks={contentBlocks}
                  onChange={setContentBlocks}
                  onUploadImage={uploadBlockImage}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Application URL
                    </label>
                    <input
                      {...register("applicationUrl")}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Resource Provider
                    </label>
                    <input
                      {...register("resourceProvider")}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Main Source
                    </label>
                    <input
                      {...register("mainSource")}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" {...register("published")} />
                  Published (visible on /apply page)
                </label>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="rounded-md bg-primary-50 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-100 disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : "Save Opportunity"}
                  </button>
                </div>
              </form>
            )}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
