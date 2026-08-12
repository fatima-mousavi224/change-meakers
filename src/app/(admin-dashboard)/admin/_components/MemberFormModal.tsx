"use client";

import LinearWithValueLabel from "@/components/common/LinearProgressWithLabel";
import type {
  LeadershipSocialLink,
  LeadershipSocialType,
} from "@/constant/aboutLeadership";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { uploadCardImage } from "lib/uploadCardImage";
import { Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface MemberFormModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

type ImageState = {
  file: File | null;
  url: string | null;
  preview: string | null;
};

const SOCIAL_TYPES: LeadershipSocialType[] = [
  "website",
  "linkedin",
  "instagram",
  "x",
  "facebook",
];

const emptyImageState = (): ImageState => ({
  file: null,
  url: null,
  preview: null,
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveStoredImageUrl(preview: string | null, url: string | null) {
  if (url) return url;
  if (preview && (/^https?:\/\//.test(preview) || preview.startsWith("/"))) {
    return preview;
  }
  return null;
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
      {hint ? <p className="mt-1 text-xs text-gray-500">{hint}</p> : null}
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
          Upload photo
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

export default function MemberFormModal({
  open,
  setOpen,
}: MemberFormModalProps) {
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm();

  const router = useRouter();
  const params = useSearchParams();
  const memberId = params.get("memberId");

  const [isLoading, setLoading] = useState(false);
  const [isDataPopulated, setIsDataPopulated] = useState(Boolean(memberId));
  const [socials, setSocials] = useState<LeadershipSocialLink[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const photoRef = useRef<ImageState>(emptyImageState());
  const loadedKeyRef = useRef<string | null>(null);
  const slugTouchedRef = useRef(false);

  const watchedName = watch("name");

  const setPhotoState = (next: ImageState) => {
    photoRef.current = next;
    setPhotoPreview(next.preview);
  };

  useEffect(() => {
    if (!slugTouchedRef.current && watchedName && !memberId) {
      setValue("slug", slugify(watchedName));
    }
  }, [memberId, setValue, watchedName]);

  useEffect(() => {
    if (!open) {
      loadedKeyRef.current = null;
      return;
    }

    const loadKey = memberId ?? "new";
    if (loadedKeyRef.current === loadKey) return;
    loadedKeyRef.current = loadKey;

    async function loadMember() {
      slugTouchedRef.current = false;

      if (!memberId) {
        reset({
          name: "",
          slug: "",
          role: "",
          bio: "",
          imageObjectPosition: "",
          sortOrder: 0,
          published: true,
        });
        setPhotoState(emptyImageState());
        setSocials([]);
        return;
      }

      try {
        setIsDataPopulated(true);
        const res = await axios.get(`/api/member/${memberId}`, {
          timeout: 15000,
        });
        const data = res.data;

        reset({
          name: data.name || "",
          slug: data.slug || "",
          role: data.role || data.position || "",
          bio:
            data.bio ||
            String(data.description || "")
              .replace(/<br\s*\/?>/gi, " ")
              .replace(/<[^>]*>/g, " ")
              .replace(/&nbsp;/g, " ")
              .replace(/\s+/g, " ")
              .trim(),
          imageObjectPosition: data.imageObjectPosition || "",
          sortOrder: data.sortOrder ?? 0,
          published: Boolean(data.published ?? true),
        });

        const imageUrl =
          data.image?.trim() || data.avatar?.[0]?.image?.trim() || null;

        setPhotoState({
          file: null,
          url: imageUrl,
          preview: imageUrl,
        });

        setSocials(Array.isArray(data.socials) ? data.socials : []);
        slugTouchedRef.current = true;
      } catch (error) {
        console.error("Failed to load member", error);
        toast.error("Failed to load team member");
      } finally {
        setIsDataPopulated(false);
      }
    }

    loadMember();
  }, [memberId, open, reset]);

  const resolveImageForSubmit = async () => {
    if (photoRef.current.file) {
      setLoading(true);
      try {
        return await uploadCardImage(photoRef.current.file);
      } finally {
        setLoading(false);
      }
    }

    return resolveStoredImageUrl(
      photoRef.current.preview,
      photoRef.current.url
    );
  };

  const onSubmit: SubmitHandler<FieldValues> = async (formData) => {
    try {
      const image = await resolveImageForSubmit();

      if (!image) {
        toast.error("Please upload a member photo");
        return;
      }

      const payload = {
        slug: String(formData.slug).trim(),
        name: String(formData.name).trim(),
        role: String(formData.role || "").trim() || null,
        bio: String(formData.bio).trim(),
        image,
        imageObjectPosition:
          String(formData.imageObjectPosition || "").trim() || null,
        socials: socials.filter((item) => item.href.trim()),
        sortOrder: Number(formData.sortOrder) || 0,
        published: Boolean(formData.published),
      };

      if (memberId) {
        await axios.patch(`/api/member/${memberId}`, payload);
        toast.success("Team member updated successfully");
      } else {
        await axios.post("/api/member", payload);
        toast.success("Team member created successfully");
      }

      setOpen(false);
      router.replace("/admin/manage-team-members");
      router.refresh();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.message ||
          "Failed to save team member"
      );
    }
  };

  const handleClose = () => {
    setOpen(false);
    router.replace("/admin/manage-team-members");
  };

  const addSocial = () => {
    setSocials((current) => [...current, { type: "linkedin", href: "" }]);
  };

  const updateSocial = (
    index: number,
    field: keyof LeadershipSocialLink,
    value: string
  ) => {
    setSocials((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  };

  const removeSocial = (index: number) => {
    setSocials((current) => current.filter((_, itemIndex) => itemIndex !== index));
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
              {memberId ? "Edit Team Member" : "Add Team Member"}
            </h2>

            {isDataPopulated ? (
              <div className="py-10 text-center text-gray-500">Loading...</div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      {...register("name", { required: "Name is required" })}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Slug
                    </label>
                    <input
                      {...register("slug", { required: "Slug is required" })}
                      onChange={(event) => {
                        slugTouchedRef.current = true;
                        setValue("slug", event.target.value);
                      }}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Used internally. Example: jawid-amani
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role (optional)
                    </label>
                    <input
                      {...register("role")}
                      placeholder="Programs Director"
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sort order
                    </label>
                    <input
                      type="number"
                      {...register("sortOrder")}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    {...register("bio", { required: "Bio is required" })}
                    rows={5}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <ImageUploadField
                  label="Photo"
                  hint="Shown on the About page team cards"
                  preview={photoPreview}
                  onFileSelect={(file) =>
                    setPhotoState({
                      file,
                      url: null,
                      preview: URL.createObjectURL(file),
                    })
                  }
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Image position (optional)
                  </label>
                  <input
                    {...register("imageObjectPosition")}
                    placeholder="50% 22%"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <LinearWithValueLabel isLoading={isLoading} progress={0} />

                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      Social links
                    </label>
                    <button
                      type="button"
                      onClick={addSocial}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary-50"
                    >
                      <Plus className="size-4" />
                      Add link
                    </button>
                  </div>

                  <div className="mt-3 space-y-3">
                    {socials.map((social, index) => (
                      <div
                        key={`${social.type}-${index}`}
                        className="grid grid-cols-1 md:grid-cols-[160px_1fr_auto] gap-3"
                      >
                        <select
                          value={social.type}
                          onChange={(event) =>
                            updateSocial(
                              index,
                              "type",
                              event.target.value as LeadershipSocialType
                            )
                          }
                          className="rounded-md border border-gray-300 px-3 py-2"
                        >
                          {SOCIAL_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        <input
                          value={social.href}
                          onChange={(event) =>
                            updateSocial(index, "href", event.target.value)
                          }
                          placeholder="https://"
                          className="rounded-md border border-gray-300 px-3 py-2"
                        />
                        <button
                          type="button"
                          onClick={() => removeSocial(index)}
                          className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-red-500"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" {...register("published")} />
                  Show on About page
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
                    {isSubmitting ? "Saving..." : "Save Member"}
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
