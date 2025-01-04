"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import LinearWithValueLabel from "@/components/common/LinearProgressWithLabel";
import firebaseApp from "@/lib/firebase";
import { formatDate } from "@/utilities/formatDatetoMMYYDDD";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { Category } from "@prisma/client";
import axios from "axios";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
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
import toast from "react-hot-toast";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface PostFormModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  categories: Category[];
}

type UploadImageType = {
  image: string;
};

export default function PostFormModal({
  open,
  setOpen,
  categories,
}: PostFormModalProps) {
  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const router = useRouter();

  // states

  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<any>();
  const hasData = Boolean(data && data.length > 0);
  const [progress, setProgress] = useState(0);
  const [postImagesIsLoading, setpostImagesLoading] = useState(false);
  const [postImagesProgress, setPostImagesProgress] = useState(0);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    hasData && data[0]?.authorImage ? data[0].authorImage.image : null
  );
  const [imagesPreview, setImagesPreview] = useState<
    Array<{ url: string; file: File | null }>
  >(
    hasData && data[0]?.postImages
      ? data[0].postImages.map((img: any) => ({ url: img.image, file: null }))
      : []
  );

  const params = useSearchParams();
  const postId = params.get("postId");

  const [isDataPopulated, setIsDataPopulated] = useState(Boolean(postId));

  useEffect(() => {
    async function getPost() {
      try {
        setIsDataPopulated(true);
        const res = await axios.get(`/api/post/${postId}`);
        const data = res.data;
        setData(data);

        if (data[0]?.authorImage) {
          setCoverImagePreview(data[0].authorImage.image);
        }
        if (data[0]?.postImages) {
          setImagesPreview(
            data[0].postImages.map((img: any) => ({
              url: img.image,
              file: null,
            }))
          );
        }

        reset({
          title: data[0]?.title || "",
          author: data[0]?.author || "",
          description: data[0]?.description || "",
          authorImage: data[0]?.authorImage || null,
          postImages: data[0]?.postImages || [],
          postDate: formatDate(data[0]?.postDate) || null,
          categoryId: data[0]?.categoryId || null,
        });
      } catch (error) {
        console.log("Error while fetching post", error);
      } finally {
        setIsDataPopulated(false);
      }
    }
    if (postId) {
      getPost();
    } else {
      reset({
        title: "",
        author: "",
        description: "",
        authorImage: null,
        postImages: null,
        postDate: null,
        categoryId: null,
      });
    }
  }, [postId, reset]);

  useEffect(() => {
    return () => {
      // Cleanup function to revoke object URLs
      if (coverImagePreview) URL.revokeObjectURL(coverImagePreview);
      imagesPreview.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [coverImagePreview, imagesPreview]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    let postCoverImage =
      hasData && data[0]?.authorImage?.image
        ? data[0].authorImage.image
        : coverImagePreview;

    let postImages: UploadImageType[] = hasData ? data[0]?.postImages : [];

    async function handlePostCoverImageUpload() {
      if (data.authorImage?.[0]) {
        setLoading(true);
        const item = data.authorImage[0];
        try {
          const fileName = new Date().getTime() + "-" + item.name;
          const storage = getStorage(firebaseApp);
          const storageRef = ref(storage, `authorImage/${fileName}`);
          const uploadTask = uploadBytesResumable(storageRef, item);
          await new Promise<void>((resolve, reject) => {
            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
                console.log("Upload is " + progress + "% done");
              },
              (error) => {
                console.log("Error uploading image", error);
                setLoading(false);
                reject(error);
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref)
                  .then((downloadURL) => {
                    // Assuming you have a state to hold the uploaded image URLs
                    postCoverImage = downloadURL;
                    console.log("File available at", downloadURL);
                    resolve();
                  })
                  .catch((err) => {
                    console.log("Error getting the downloadURL");
                    reject(err);
                  });
              }
            );
          });
        } catch (error) {
          console.log("Error in uploading image", error);
          toast.error("Error in uploading image");
          setLoading(false);
        }
      }
    }

    async function handlePostImagesUpload() {
      if (data.postImages && data.postImages.length > 0) {
        setpostImagesLoading(true);
        try {
          const newPostImages: UploadImageType[] = [];
          for (const item of data.postImages) {
            const fileName = new Date().getTime() + "-" + item.name;
            const storage = getStorage(firebaseApp);
            const storageRef = ref(storage, `postImages/${fileName}`);
            const uploadTask = uploadBytesResumable(storageRef, item);
            await new Promise<void>((resolve, reject) => {
              uploadTask.on(
                "state_changed",
                (snapshot) => {
                  const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  setPostImagesProgress(progress);
                  console.log("Upload is " + progress + "% done");
                },
                (error) => {
                  console.log("Error uploading image", error);
                  reject(error);
                },
                () => {
                  getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                      newPostImages.push({ image: downloadURL });
                      console.log("File available at", downloadURL);
                      resolve();
                    })
                    .catch((err) => {
                      console.log("Error getting the downloadURL");
                      reject(err);
                    });
                }
              );
            });
          }
          postImages = newPostImages;
        } catch (error) {
          console.log("Error in uploading image", error);
          toast.error("Error in uploading image");
        } finally {
          setpostImagesLoading(false);
        }
      }
    }

    if (postId) {
      toast.success("updating post, please wait...");
    } else {
      toast.success("creating post, please wait...");
    }

    await handlePostCoverImageUpload();
    await handlePostImagesUpload();

    const postData = {
      ...data,
      authorImage: {
        image: postCoverImage || (hasData ? data[0]?.authorImage?.image : null),
      },
      postImages: [...postImages],
    };

    if (postId) {
      await axios
        .patch(`/api/post/${postId}`, postData)
        .then(() => {
          router.refresh();
          setOpen(false);
          toast.success("Post updated successfully");
          reset();
        })
        .catch((err) => {
          console.error("Update error:", err);
          toast.error("Error while updating post to db!");
        });
    } else {
      await axios
        .post(`/api/post`, postData)
        .then(() => {
          router.refresh();
          setOpen(false);
          setImagesPreview([]);
          setCoverImagePreview(null);
          toast.success("Post created successfully");
          reset();
        })
        .catch((err) => {
          toast.error("Error while saving post to db!", err);
        });
    }
  };

  const handleImageRemove = (index: number) => {
    setImagesPreview((prev) => prev.filter((_, i) => i !== index));

    // Reset the file input
    const fileInput = document.getElementById("postImages") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleClose = () => {
    setOpen(false);
    setImagesPreview([]);
    setCoverImagePreview(null);
    reset({
      title: "",
      author: "",
      description: "",
      authorImage: null,
      postImages: null,
      postDate: null,
      categoryId: null,
    });
    router.replace("/admin/manage-posts");
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
              Create Post
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
                        {...register("title", {
                          required: "Title is required",
                        })}
                        id="title"
                        name="title"
                        type="text"
                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-1 focus:-outline-offset-1 focus:outline-primary-50 border-dark_gray border"
                      />
                    )}
                  </div>
                  {errors.title && (
                    <p className="text-red-500 mt-1 text-sm">
                      {errors.title.message as string}
                    </p>
                  )}
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
                        {...register("author", {
                          required: "Author is required",
                        })}
                        id="author"
                        name="author"
                        type="text"
                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-1 focus:-outline-offset-1 focus:outline-primary-50 border-dark_gray border"
                      />
                    )}
                  </div>
                  {errors.author && (
                    <p className="text-red-500 mt-1 text-sm">
                      {errors.author.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="postDate"
                    className="block text-sm/6 font-semibold text-gray-900"
                  >
                    Post Date
                  </label>
                  <div className="mt-2.5">
                    {isDataPopulated ? (
                      <Skeleton height={40} width="100%" borderRadius={5} />
                    ) : (
                      <input
                        {...register("postDate", {
                          required: "Post date is required",
                        })}
                        defaultValue={formatDate(
                          data?.length > 0 ? new Date(data[0]?.postDate) : ""
                        )}
                        id="postDate"
                        name="postDate"
                        type="date"
                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-1 focus:-outline-offset-1 focus:outline-primary-50 border-dark_gray border"
                      />
                    )}
                  </div>
                  {errors.postDate && (
                    <p className="text-red-500 mt-1 text-sm">
                      {errors.postDate.message as string}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="categoryId"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Category
                  </label>
                  <div className="mt-2.5">
                    {isDataPopulated ? (
                      <Skeleton height={40} width="100%" borderRadius={5} />
                    ) : (
                      <select
                        {...register("categoryId", {
                          required: "Category is required",
                        })}
                        id="categoryId"
                        name="categoryId"
                        defaultValue={hasData ? data[0].categoryId : ""}
                        className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-1 focus:-outline-offset-1 focus:outline-primary-50 border-dark_gray border"
                      >
                        {categories?.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.title}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  {errors.categoryId && (
                    <p className="text-red-500 mt-1 text-sm">
                      {errors.categoryId.message as string}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <p className="block text-sm/6 font-semibold text-gray-900">
                    Author Image
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
                            htmlFor="authorImage"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-100 focus-within:ring-offset-2 hover:text-primary-50"
                          >
                            <span className="text-center block">
                              Click to select a file
                            </span>
                            <input
                              {...register("authorImage", {
                                required: !postId
                                  ? "Author image is required"
                                  : false,
                              })}
                              id="authorImage"
                              name="authorImage"
                              type="file"
                              className="sr-only"
                              multiple={false}
                              accept=".jpg,.jpeg,.png, gif"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setCoverImagePreview(
                                    URL.createObjectURL(file)
                                  );
                                }
                              }}
                            />
                          </label>
                        </div>
                        {coverImagePreview && (
                          <Image
                            src={coverImagePreview}
                            alt="author image preview"
                            className="mt-2 max-w-full h-auto"
                            width={96}
                            height={96}
                          />
                        )}
                        {isSubmitting && (
                          <LinearWithValueLabel
                            isLoading={postImagesIsLoading}
                            progress={postImagesProgress}
                          />
                        )}
                        <p className="text-xs/5 text-gray-600">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  )}

                  {errors.authorImage && (
                    <p className="text-red-500 mt-1 text-sm">
                      {errors.authorImage.message as string}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <p className="block text-sm/6 font-semibold text-gray-900">
                    Post Images
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
                            htmlFor="postImages"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-100 focus-within:ring-offset-2 hover:text-primary-50 "
                          >
                            <span className="text-center block">
                              Click to select a file
                            </span>
                            <input
                              {...register("postImages", {
                                required: !postId
                                  ? "Post images are required"
                                  : false,
                              })}
                              id="postImages"
                              name="postImages"
                              type="file"
                              className="sr-only"
                              accept=".jpg,.jpeg,.png, gif"
                              multiple
                              onChange={(e) => {
                                const files = e.target.files;
                                if (files) {
                                  const newPreviews = Array.from(files).map(
                                    (file) => ({
                                      url: URL.createObjectURL(file),
                                      file,
                                    })
                                  );
                                  setImagesPreview(newPreviews);
                                }
                              }}
                            />
                          </label>
                        </div>
                        {imagesPreview.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {imagesPreview.map((preview, index) => (
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
                            isLoading={isLoading}
                            progress={progress}
                          />
                        )}
                        <p className="text-xs/5 text-gray-600">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                  {errors.postImages && (
                    <p className="text-red-500 mt-1 text-sm">
                      {errors.postImages.message as string}
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
