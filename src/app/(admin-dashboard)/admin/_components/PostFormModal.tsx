"use client";

import LinearWithValueLabel from "@/components/common/LinearProgressWithLabel";
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

import type { UpdateFormCategory } from "@/lib/updateCategories";

import OpportunityContentBlocksEditor, {
  contentBlocksToEditable,
  createDefaultEditableBlocks,
  type EditableContentBlock,
} from "../manage-opportunities/OpportunityContentBlocksEditor";

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

interface PostFormModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  categories: UpdateFormCategory[];
}

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

export default function PostFormModal({
  open,
  setOpen,
  categories,
}: PostFormModalProps) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const router = useRouter();
  const params = useSearchParams();
  const postId = params.get("postId");

  const [progress, setProgress] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [isDataPopulated, setIsDataPopulated] = useState(Boolean(postId));
  const [contentBlocks, setContentBlocks] = useState<EditableContentBlock[]>(
    createDefaultEditableBlocks()
  );
  const [cardImagePreview, setCardImagePreview] = useState<string | null>(null);
  const [categoryOptions, setCategoryOptions] = useState(categories);

  const cardImageRef = useRef<ImageState>(emptyImageState());
  const loadedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    setCategoryOptions(categories);
  }, [categories]);

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

    const loadKey = postId ?? "new";
    if (loadedKeyRef.current === loadKey) return;
    loadedKeyRef.current = loadKey;

    async function loadPost() {
      if (!postId) {
        reset({
          title: "",
          excerpt: "",
          author: "",
          categoryId: categoryOptions[0]?.id ?? "",
          postDate: "",
          showInHome: false,
        });
        resetImages();
        setContentBlocks(createDefaultEditableBlocks());
        setCategoryOptions(categories);
        return;
      }

      try {
        setIsDataPopulated(true);
        const res = await axios.get(`/api/post/${postId}`);
        const data = res.data;

        if (
          data.Category &&
          !categories.some((category) => category.id === data.categoryId)
        ) {
          setCategoryOptions([
            ...categories,
            { id: data.Category.id, title: data.Category.title },
          ]);
        } else {
          setCategoryOptions(categories);
        }

        reset({
          title: data.title || "",
          excerpt:
            data.excerpt ||
            (data.description
              ? data.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 280)
              : ""),
          author: data.author || "",
          categoryId: data.categoryId || categories[0]?.id || "",
          postDate: data.postDate ? formatDate(new Date(data.postDate)) : "",
          showInHome: Boolean(data.showInHome),
        });

        setCardImageState({
              file: null,
          url: data.authorImage?.image || null,
          preview: data.authorImage?.image || null,
        });

        let editableBlocks = contentBlocksToEditable(data.contentBlocks ?? []);
        if (!editableBlocks.length && data.description) {
          editableBlocks = contentBlocksToEditable(
            htmlContentToBlocks(data.description)
          );
        }
        if (!editableBlocks.length && data.postImages?.length) {
          editableBlocks = contentBlocksToEditable(
            data.postImages.map((img: { image: string }) => ({
              type: "image" as const,
              src: img.image,
            }))
          );
        }
        setContentBlocks(
          editableBlocks.length
            ? editableBlocks
            : createDefaultEditableBlocks()
        );
      } catch (error) {
        console.error("Failed to load update", error);
        toast.error("Failed to load update");
      } finally {
        setIsDataPopulated(false);
      }
    }

    loadPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, postId, categories]);

  const resolveImageForSubmit = async (
    imageState: ImageState,
    label: string
  ) => {
    if (imageState.file) {
      try {
        setLoading(true);
        return await uploadCardImage(imageState.file);
      } catch (error: any) {
        throw new Error(error?.message || `Failed to upload ${label}`);
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
        if (body) resolved.push({ type: "text", body });
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
          src = resolveStoredImageUrl(block.preview, block.src) || "";
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
      if (url) {
        resolved.push({
          type: "video",
          url,
          caption: block.caption.trim() || undefined,
        });
      }
    }

    return resolved;
  };

  const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
    try {
      const finalCardImage = await resolveImageForSubmit(
        cardImageRef.current,
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
        author: formData.author,
        categoryId: formData.categoryId,
        postDate: formData.postDate,
        showInHome: Boolean(formData.showInHome),
        authorImage: { image: finalCardImage },
        contentBlocks: resolvedContentBlocks,
    };

    if (postId) {
        await axios.patch(`/api/post/${postId}`, payload);
        toast.success("Update saved successfully");
    } else {
        await axios.post("/api/post", payload);
        toast.success("Update created successfully");
      }

      setOpen(false);
      router.replace("/admin/manage-posts");
      router.refresh();
    } catch (error: any) {
      toast.error(
        error?.message ||
          error?.response?.data?.error ||
          "Failed to save update"
      );
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleClose = () => {
    setOpen(false);
    router.replace("/admin/manage-posts");
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
              {postId ? "Edit Update" : "Add Update"}
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
                      {...register("categoryId", { required: true })}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    >
                      {categoryOptions.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.title}
                        </option>
                      ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                    Post Date
                  </label>
                      <input
                        type="date"
                      {...register("postDate", { required: true })}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Author
                  </label>
                            <input
                    {...register("author", { required: "Author is required" })}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <ImageUploadField
                  label="Card Image"
                  hint="Shown on the /updates listing cards"
                  preview={cardImagePreview}
                  onFileSelect={(file) =>
                    setCardImageState({
                                      file,
                      url: null,
                      preview: URL.createObjectURL(file),
                    })
                  }
                />

                <LinearWithValueLabel isLoading={isLoading} progress={progress} />

                <OpportunityContentBlocksEditor
                  blocks={contentBlocks}
                  onChange={setContentBlocks}
                  onUploadImage={uploadBlockImage}
                />

                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" {...register("showInHome")} />
                  Show on home page
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
                    {isSubmitting ? "Saving..." : "Save Update"}
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
