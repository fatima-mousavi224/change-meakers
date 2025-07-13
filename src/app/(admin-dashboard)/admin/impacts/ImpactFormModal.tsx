"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { X } from "lucide-react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import firebaseApp from "@/lib/firebase";
import toast from "react-hot-toast";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import LinearWithValueLabel from "@/components/common/LinearProgressWithLabel";
import ProjectSelector from "@/components/common/ProjectSelector";
import { formatDate } from "@/utilities/formatDatetoMMYYDDD";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface ImpactFormModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  impactId: string | null;
}

interface FormData {
  title: string;
  date: string;
  impactTags: string;
  author: string;
  description: string;
  projectName: string;
  authorPhoto: FileList | null;
  coverPhoto: FileList | null;
  galleryPhoto: FileList | null;
}

interface ImagePreview {
  url: string;
  file: File | null;
}

export default function ImpactFormModal({
  open,
  setOpen,
  impactId,
}: ImpactFormModalProps) {
  const {
    handleSubmit,
    register,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      date: "",
      impactTags: "",
      author: "",
      description: "",
      projectName: "",
      authorPhoto: null,
      coverPhoto: null,
      galleryPhoto: null,
    },
  });

  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDataPopulated, setIsDataPopulated] = useState(Boolean(impactId));
  const [authorPhotoPreview, setAuthorPhotoPreview] = useState<string | null>(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(null);
  const [galleryPhotoPreviews, setGalleryPhotoPreviews] = useState<ImagePreview[]>([]);
  const [existingAuthorPhoto, setExistingAuthorPhoto] = useState<string | null>(null);
  const [existingCoverPhoto, setExistingCoverPhoto] = useState<string | null>(null);
  const [existingGalleryPhotos, setExistingGalleryPhotos] = useState<string[]>([]);

  useEffect(() => {
    async function getImpact() {
      if (impactId) {
        try {
          setIsDataPopulated(true);
          const res = await axios.get(`/api/impact/${impactId}`);
          const data = res.data;
          reset({
            title: data.title || "",
            date: data.date ? formatDate(new Date(data.date)) : "",
            impactTags: data.impactTags || "",
            author: data.author || "",
            description: data.description || "",
            projectName: data.projectName || "",
            authorPhoto: null,
            coverPhoto: null,
            galleryPhoto: null,
          });
          if (data.authorPhoto) {
            setAuthorPhotoPreview(data.authorPhoto);
            setExistingAuthorPhoto(data.authorPhoto);
          }
          if (data.coverPhoto) {
            setCoverPhotoPreview(data.coverPhoto);
            setExistingCoverPhoto(data.coverPhoto);
          }
          if (data.galleryPhoto && data.galleryPhoto.length > 0) {
            const previews = data.galleryPhoto.map((url: string) => ({ url, file: null }));
            setGalleryPhotoPreviews(previews);
            setExistingGalleryPhotos(data.galleryPhoto);
          }
        } catch (error) {
          console.log("Error while fetching impact", error);
          toast.error("Failed to load impact data");
        } finally {
          setIsDataPopulated(false);
        }
      } else {
        reset({
          title: "",
          date: "",
          impactTags: "",
          author: "",
          description: "",
          projectName: "",
          authorPhoto: null,
          coverPhoto: null,
          galleryPhoto: null,
        });
        setAuthorPhotoPreview(null);
        setCoverPhotoPreview(null);
        setGalleryPhotoPreviews([]);
        setExistingAuthorPhoto(null);
        setExistingCoverPhoto(null);
        setExistingGalleryPhotos([]);
      }
    }
    getImpact();
  }, [impactId, reset]);

  useEffect(() => {
    return () => {
      if (authorPhotoPreview && !authorPhotoPreview.startsWith("https")) {
        URL.revokeObjectURL(authorPhotoPreview);
      }
      if (coverPhotoPreview && !coverPhotoPreview.startsWith("https")) {
        URL.revokeObjectURL(coverPhotoPreview);
      }
      galleryPhotoPreviews.forEach(({ url }) => {
        if (!url.startsWith("https")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [authorPhotoPreview, coverPhotoPreview, galleryPhotoPreviews]);

  const validateFile = (file: File): boolean => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      toast.error(`Invalid file type: ${file.type}. Only JPG, PNG, GIF, or WebP files are allowed`);
      return false;
    }
    if (file.size > maxSize) {
      toast.error(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds 10MB limit`);
      return false;
    }
    return true;
  };

  const uploadImageUrl = async (file: File, fieldName: string): Promise<string> => {
    if (!file || !file.name) {
      throw new Error(`Invalid file for ${fieldName}`);
    }
    const storage = getStorage(firebaseApp);
    const extension = file.name.split(".").pop() || "jpg";
    const fileName = `${fieldName}_${new Date().getTime()}.${extension}`;
    const storageRef = ref(storage, `impacts/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          toast.error(`Failed to upload ${fieldName}: ${error.message}`);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {

    
    try {
      setLoading(true);

      let authorPhotoUrl: string | null = null;
      let coverPhotoUrl: string | null = null;
      let galleryPhotoUrls: string[] = [];

      // Handle author photo
      if (data.authorPhoto && data.authorPhoto.length > 0) {
        const file = data.authorPhoto[0];
        if (!validateFile(file)) {
          toast.error("Invalid author photo format or size");
          setLoading(false);
          return;
        }
        authorPhotoUrl = await uploadImageUrl(file, "authorPhoto");
      } else if (impactId) {
        authorPhotoUrl = existingAuthorPhoto;
      }

      // Handle cover photo
      if (data.coverPhoto && data.coverPhoto.length > 0) {
        const file = data.coverPhoto[0];
        if (!validateFile(file)) {
          toast.error("Invalid cover photo format or size");
          setLoading(false);
          return;
        }
        coverPhotoUrl = await uploadImageUrl(file, "coverPhoto");
      } else if (impactId) {
        coverPhotoUrl = existingCoverPhoto;
      }

      // Handle gallery photos
      if (data.galleryPhoto && data.galleryPhoto.length > 0) {
        const validFiles = Array.from(data.galleryPhoto).filter(validateFile);
        if (validFiles.length !== data.galleryPhoto.length) {
          toast.error("One or more gallery photos have invalid format or size");
          setLoading(false);
          return;
        }
        galleryPhotoUrls = await Promise.all(
          validFiles.map((file) => uploadImageUrl(file, "galleryPhoto"))
        );
      } else if (impactId) {
        galleryPhotoUrls = existingGalleryPhotos;
      }


      if (!authorPhotoUrl || !coverPhotoUrl || galleryPhotoUrls.length === 0) {
        toast.error("Please ensure all required photos are uploaded successfully");
        setLoading(false);
        return;
      }

      const impactData = {
        title: data.title.trim(),
        date: data.date ? new Date(data.date).toISOString() : undefined,
        impactTags: data.impactTags.trim(),
        author: data.author.trim(),
        description: data.description.trim(),
        projectName: data.projectName.trim(),
        authorPhoto: authorPhotoUrl,
        coverPhoto: coverPhotoUrl,
        galleryPhoto: galleryPhotoUrls,
      };

      if (impactId) {
        await axios.put(`/api/impact/${impactId}`, impactData);
        toast.success("Impact updated successfully");
      } else {
        await axios.post("/api/impact", impactData);
        toast.success("Impact created successfully");
      }

      router.refresh();
      setOpen(false);
      setAuthorPhotoPreview(null);
      setCoverPhotoPreview(null);
      setGalleryPhotoPreviews([]);
      setExistingAuthorPhoto(null);
      setExistingCoverPhoto(null);
      setExistingGalleryPhotos([]);
      reset();
    } catch (error: any) {
      console.error("Error submitting impact:", error.response?.data || error);
      const errorMessage = error.response?.data?.message || "Error creating impact";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleImageRemove = (index: number) => {
    setGalleryPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
    setValue("galleryPhoto", null, { shouldValidate: true });
    const fileInput = document.getElementById("galleryPhoto") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleClose = () => {
    setOpen(false);
    setAuthorPhotoPreview(null);
    setCoverPhotoPreview(null);
    setGalleryPhotoPreviews([]);
    setExistingAuthorPhoto(null);
    setExistingCoverPhoto(null);
    setExistingGalleryPhotos([]);
    reset({
      title: "",
      date: "",
      impactTags: "",
      author: "",
      description: "",
      projectName: "",
      authorPhoto: null,
      coverPhoto: null,
      galleryPhoto: null,
    });
    router.replace("/admin/impacts");
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <h2 className="text-center text-blue-600 text-2xl font-bold">
              {impactId ? "Edit Impact" : "Create Impact"}
            </h2>
            <form
              className="mx-auto mt-8 max-w-xl"
              onSubmit={handleSubmit(onSubmit)}
              method="POST"
            >
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm/6 font-semibold text-gray-900"
                  >
                    Title
                  </label>
                  <div className="mt-2.5">
                    {isDataPopulated ? (
                      <Skeleton height={40} width="100%" borderRadius={5} />
                    ) : (
                      <input
                        {...register("title", { required: "Title is required" })}
                        id="title"
                        name="title"
                        type="text"
                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-1 focus:-outline-offset-1 focus:outline-blue-600 border-dark_gray border"
                      />
                    )}
                    {errors.title && (
                      <p className="text-red-500 mt-1 text-sm">{errors.title.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="author"
                    className="block text-sm/6 font-semibold text-gray-900"
                  >
                    Author
                  </label>
                  <div className="mt-2.5">
                    {isDataPopulated ? (
                      <Skeleton height={40} width="100%" borderRadius={5} />
                    ) : (
                      <input
                        {...register("author", { required: "Author is required" })}
                        id="author"
                        name="author"
                        type="text"
                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-1 focus:-outline-offset-1 focus:outline-blue-600 border-dark_gray border"
                      />
                    )}
                    {errors.author && (
                      <p className="text-red-500 mt-1 text-sm">{errors.author.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm/6 font-semibold text-gray-900"
                  >
                    Date
                  </label>
                  <div className="mt-2.5">
                    {isDataPopulated ? (
                      <Skeleton height={40} width="100%" borderRadius={5} />
                    ) : (
                      <input
                        {...register("date", { required: "Date is required" })}
                        id="date"
                        name="date"
                        type="date"
                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-1 focus:-outline-offset-1 focus:outline-blue-600 border-dark_gray border"
                      />
                    )}
                    {errors.date && (
                      <p className="text-red-500 mt-1 text-sm">{errors.date.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="projectName"
                    className="block text-sm/6 font-semibold text-gray-900"
                  >
                    Project
                  </label>
                  <div className="mt-2.5">
                    {isDataPopulated ? (
                      <Skeleton height={40} width="100%" borderRadius={5} />
                    ) : (
                      <ProjectSelector
                        value={watch("projectName")}
                        onChange={(value) => setValue("projectName", value)}
                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline-1 focus:-outline-offset-1 focus:outline-blue-600 border-dark_gray border"
                      />
                    )}
                    {errors.projectName && (
                      <p className="text-red-500 mt-1 text-sm">{errors.projectName.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="impactTags"
                    className="block text-sm/6 font-semibold text-gray-900"
                  >
                    Impact Tags
                  </label>
                  <div className="mt-2.5">
                    {isDataPopulated ? (
                      <Skeleton height={40} width="100%" borderRadius={5} />
                    ) : (
                      <input
                        {...register("impactTags")}
                        id="impactTags"
                        name="impactTags"
                        type="text"
                        placeholder="Separate tags with commas"
                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-1 focus:-outline-offset-1 focus:outline-blue-600 border-dark_gray border"
                      />
                    )}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <p className="block text-sm/6 font-semibold text-gray-900">Author Photo</p>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-dark_gray" />
                      <div className="mt-4 flex text-sm/6 text-gray-600">
                        <label
                          htmlFor="authorPhoto"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-700"
                        >
                          <span className="text-center block">Click to select a file</span>
                          <input
                            {...register("authorPhoto")}
                            id="authorPhoto"
                            name="authorPhoto"
                            type="file"
                            className="sr-only"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            onChange={(e) => {
                              const fileList = e.target.files;
                              if (fileList && fileList.length > 0) {
                                const file = fileList[0];
                                if (validateFile(file)) {
                                  setAuthorPhotoPreview(URL.createObjectURL(file));
                                }
                              }
                            }}
                          />
                        </label>
                      </div>
                      {authorPhotoPreview && (
                        <div className="mt-2 relative">
                          <Image
                            src={authorPhotoPreview}
                            alt="Author Photo Preview"
                            width={96}
                            height={96}
                            className="object-cover"
                          />
                          {!authorPhotoPreview.startsWith("https") && (
                            <button
                              type="button"
                              onClick={() => {
                                setAuthorPhotoPreview(null);
                                setValue("authorPhoto", null, { shouldValidate: true });
                                const fileInput = document.getElementById("authorPhoto") as HTMLInputElement;
                                if (fileInput) fileInput.value = "";
                              }}
                              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      )}
                      {isSubmitting && progress > 0 && (
                        <LinearWithValueLabel isLoading={isLoading} progress={progress} />
                      )}
                      <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                  {errors.authorPhoto && (
                    <p className="text-red-500 mt-1 text-sm">{errors.authorPhoto.message}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <p className="block text-sm/6 font-semibold text-gray-900">Cover Photo</p>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-dark_gray" />
                      <div className="mt-4 flex text-sm/6 text-gray-600">
                        <label
                          htmlFor="coverPhoto"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-700"
                        >
                          <span className="text-center block">Click to select a file</span>
                          <input
                            {...register("coverPhoto")}
                            id="coverPhoto"
                            name="coverPhoto"
                            type="file"
                            className="sr-only"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            onChange={(e) => {
                              const fileList = e.target.files;
                              if (fileList && fileList.length > 0) {
                                const file = fileList[0];
                                if (validateFile(file)) {
                                  setCoverPhotoPreview(URL.createObjectURL(file));
                                }
                              }
                            }}
                          />
                        </label>
                      </div>
                      {coverPhotoPreview && (
                        <div className="mt-2 relative">
                          <Image
                            src={coverPhotoPreview}
                            alt="Cover Photo Preview"
                            width={96}
                            height={96}
                            className="object-cover"
                          />
                          {!coverPhotoPreview.startsWith("https") && (
                            <button
                              type="button"
                              onClick={() => {
                                setCoverPhotoPreview(null);
                                setValue("coverPhoto", null, { shouldValidate: true });
                                const fileInput = document.getElementById("coverPhoto") as HTMLInputElement;
                                if (fileInput) fileInput.value = "";
                              }}
                              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      )}
                      {isSubmitting && progress > 0 && (
                        <LinearWithValueLabel isLoading={isLoading} progress={progress} />
                      )}
                      <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                  {errors.coverPhoto && (
                    <p className="text-red-500 mt-1 text-sm">{errors.coverPhoto.message}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <p className="block text-sm/6 font-semibold text-gray-900">Gallery Photos</p>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-dark_gray" />
                      <div className="mt-4 flex text-sm/6 text-gray-600">
                        <label
                          htmlFor="galleryPhoto"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-700"
                        >
                          <span className="text-center block">Click to select files</span>
                          <input
                            {...register("galleryPhoto")}
                            id="galleryPhoto"
                            name="galleryPhoto"
                            type="file"
                            className="sr-only"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            multiple
                            onChange={(e) => {
                              const fileList = e.target.files;
                              if (fileList && fileList.length > 0) {
                                const files = Array.from(fileList);
                                const validFiles = files.filter(validateFile);
                                if (validFiles.length > 0) {
                                  setGalleryPhotoPreviews(
                                    validFiles.map((file) => ({
                                      url: URL.createObjectURL(file),
                                      file,
                                    }))
                                  );
                                  toast.success(`${validFiles.length} gallery photos selected successfully`);
                                } else {
                                  e.target.value = "";
                                }
                              }
                            }}
                          />
                        </label>
                      </div>
                      {galleryPhotoPreviews.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {galleryPhotoPreviews.map((preview, index) => (
                            <div key={index} className="relative">
                              <Image
                                src={preview.url}
                                alt={`Gallery Photo Preview ${index + 1}`}
                                width={96}
                                height={96}
                                className="object-cover"
                              />
                              {!preview.url.startsWith("https") && (
                                <button
                                  type="button"
                                  onClick={() => handleImageRemove(index)}
                                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                >
                                  <X size={16} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {isSubmitting && progress > 0 && (
                        <LinearWithValueLabel isLoading={isLoading} progress={progress} />
                      )}
                      <p className="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                  {errors.galleryPhoto && (
                    <p className="text-red-500 mt-1 text-sm">{errors.galleryPhoto.message}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm/6 font-semibold text-gray-900"
                  >
                    Description
                  </label>
                  <div className="mt-2.5">
                    {isDataPopulated ? (
                      <Skeleton height={200} width="100%" borderRadius={5} />
                    ) : (
                      <Controller
                        name="description"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <ReactQuill
                            theme="snow"
                            value={field.value}
                            onChange={field.onChange}
                            className="quill-editor"
                          />
                        )}
                      />
                    )}
                    {errors.description && (
                      <p className="text-red-500 mt-1 text-sm">{errors.description.message}</p>
                    )}
                  </div>
                </div>
                <div className="sm:col-span-2 md:mt-10 mt-20 flex justify-end gap-x-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="block rounded-md bg-gray-200 px-3.5 py-2.5 text-center text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="block rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : impactId ? "Update Impact" : "Create Impact"}
                  </button>
                </div>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}