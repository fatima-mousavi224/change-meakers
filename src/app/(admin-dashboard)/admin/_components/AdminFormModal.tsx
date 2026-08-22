"use client";

import LinearWithValueLabel from "../../../../components/common/LinearProgressWithLabel";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import toast from "react-hot-toast";
import { uploadCardImage } from "lib/uploadCardImage";
import { X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface AdminFormModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

type UploadImageType = {
  image: string;
};

export default function AdminFormModal({ open, setOpen }: AdminFormModalProps) {
  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const router = useRouter();

  // states

  const [data, setData] = useState<any>();
  const hasData = Boolean(data);
  const [memberImageIsLoading, setMemberImageLoading] = useState(false);
  const [memberImageProgress, setMemberImageProgress] = useState(0);
  const [memberImagePreview, setMemberImagePreview] = useState<
    Array<{ url: string; file: File | null }>
  >(
    hasData && data?.avatar
      ? data.avatar.map((img: any) => ({ url: img.image, file: null }))
      : []
  );


  const params = useSearchParams();
  const memberId = params.get("memberId");

  const [isDataPopulated, setIsDataPopulated] = useState(Boolean(memberId));

  useEffect(() => {
    async function getMember() {
      try {
        setIsDataPopulated(true);
        const res = await axios.get(`/api/member/${memberId}`);
        const data = res.data;
        setData(data);

        if (data) {
          setMemberImagePreview(
            data.avatar.map((img: any) => ({ url: img.image, file: null }))
          );
        }
        reset({
          name: data?.name || "",
          position: data?.position || "",
          description: data?.description || "",
          avatar: data?.avatar || [],
        });
      } catch (error) {

      } finally {
        setIsDataPopulated(false);
      }
    }
    if (memberId) {
      getMember();
    } else {
      reset({
        title: "",
        position: "",
        description: "",
        avatar: [],
      });
    }
  }, [memberId, reset]);

  useEffect(() => {
    return () => {
      memberImagePreview.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [memberImagePreview]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    let postImages: UploadImageType[] = hasData ? data?.avatar : [];

    if (data.avatar instanceof FileList && data.avatar.length > 0) {
      setMemberImageLoading(true);
      try {
        const newPostImages: UploadImageType[] = [];
        const filesArray = Array.from(data.avatar);
        for (const item of filesArray) {
          const downloadURL = await uploadCardImage(item, "avatar");
          newPostImages.push({ image: downloadURL });
          setMemberImageProgress(100);
        }
        postImages = newPostImages;
      } catch (error) {
        console.log("Error in uploading image", error);
        toast.error("Error in uploading image");
      } finally {
        setMemberImageLoading(false);
      }
    } else if (memberId) {
      postImages = data?.avatar || [];
    }

    if (memberId) {
      toast.success("updating member, please wait...");
    } else {
      toast.success("creating member, please wait...");
    }

    const memberData = {
      ...data,
      avatar: postImages,
    };


    if (memberId) {
      await axios
        .patch(`/api/member/${memberId}`, memberData)
        .then(() => {
          router.refresh();
          setOpen(false);
          toast.success("Member updated successfully");
          reset();
        })
        .catch((err) => {
          console.error("Update error:", err);
          toast.error("Error while updating member to db!");
        });
    } else {
      await axios
        .post(`/api/member`, memberData)
        .then(() => {
          router.refresh();
          setOpen(false);
          setMemberImagePreview([]);
          toast.success("Member created successfully");
          reset();
        })
        .catch((err) => {
          toast.error("Error while saving member to db!", err);
        });
    }
  };

  const handleImageRemove = (index: number) => {
    setMemberImagePreview((prev) => prev.filter((_, i) => i !== index));

    // Reset the file input
    const fileInput = document.getElementById("postImages") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleClose = () => {
    setOpen(false);
    setMemberImagePreview([]);
    // setCoverImagePreview(null);
    reset({
      name: "",
      position: "",
      description: "",
      avatar: null,
    });
    router.replace("/admin/manage-team-members");
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10  w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <h2 className="text-center text-primary-50 text-2xl font-bold">
              Add New Admin
            </h2>
            <form
              className="mx-auto mt-8 max-w-xl"
              onSubmit={handleSubmit(onSubmit)}
              method="POST"
            >
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm/6 font-semibold text-gray-900"
                  >
                    Name
                  </label>
                  <div className="mt-2.5">
                    {isDataPopulated ? (
                      <Skeleton height={40} width="100%" borderRadius={5} />
                    ) : (
                      <input
                        {...register("name", {
                          required: "Name is required",
                        })}
                        id="name"
                        name="name"
                        type="text"
                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-1 focus:-outline-offset-1 focus:outline-primary-50 border-dark_gray border"
                        defaultValue={data?.name}
                      />
                    )}
                  </div>
                  {errors.name && (
                    <p className="text-red-500 mt-1 text-sm">
                      {errors.name.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm/6 font-semibold text-gray-900"
                  >
                    Email
                  </label>
                  <div className="mt-2.5">
                    {isDataPopulated ? (
                      <Skeleton height={40} width="100%" borderRadius={5} />
                    ) : (
                      <input
                        {...register("email", {
                          required: "Email is required",
                        })}
                        id="email"
                        name="email"
                        type="email"
                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-1 focus:-outline-offset-1 focus:outline-primary-50 border-dark_gray border"
                      />
                    )}
                  </div>
                  {errors.email && (
                    <p className="text-red-500 mt-1 text-sm">
                      {errors.email.message as string}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <p className="block text-sm/6 font-semibold text-gray-900">
                    Avatar
                  </p>
                  {isDataPopulated ? (
                    <Skeleton height={100} width="100%" borderRadius={5} />
                  ) : (
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 ">
                      <div className="text-center">
                        <PhotoIcon
                          aria-hidden="true"
                          className="mx-auto size-12 text-dark_gray"
                        />
                        <div className="mt-4 flex text-sm/6 text-gray-600">
                          <label
                            htmlFor="avatar"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-100 focus-within:ring-offset-2 hover:text-primary-50"
                          >
                            <span className="text-center block">
                              Click to select a file
                            </span>
                            <input
                              {...register("avatar", {
                                required: !memberId
                                  ? "Avatar is required"
                                  : false,
                              })}
                              id="avatar"
                              name="avatar"
                              type="file"
                              className="sr-only"
                              multiple={false}
                              accept=".jpg,.jpeg,.png, gif"
                              onChange={(e) => {
                                const files = e.target.files;
                                if (files) {
                                  const newPreviews = Array.from(files).map(
                                    (file) => ({
                                      url: URL.createObjectURL(file),
                                      file,
                                    })
                                  );
                                  setMemberImagePreview(newPreviews);
                                }
                              }}
                            />
                          </label>
                        </div>
                        {memberImagePreview.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {memberImagePreview.map((preview, index) => (
                              <div key={index} className="relative">
                                <Image
                                  src={preview.url}
                                  alt={`Preview ${index + 1}`}
                                  className="w-24 h-24 object-cover"
                                  width={96}
                                  height={96}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleImageRemove(index)}
                                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        {isSubmitting && (
                          <LinearWithValueLabel
                            isLoading={memberImageIsLoading}
                            progress={memberImageProgress}
                          />
                        )}
                        <p className="text-xs/5 text-gray-600">
                          PNG, JPG, GIF, or WebP
                        </p>
                      </div>
                    </div>
                  )}

                  {errors.avatar && (
                    <p className="text-red-500 mt-1 text-sm">
                      {errors.avatar.message as string}
                    </p>
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
                      <p className="text-red-500 mt-1 text-sm">
                        {errors?.description.message as string}
                      </p>
                    )}
                  </div>
                </div>
                <div className="md:mt-10 mt-20">
                  <button
                    type="submit"
                    className="block w-full rounded-md bg-primary-50 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-50 col-span-2 disabled:cursor-not-allowed disabled:bg-dark_gray"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
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
