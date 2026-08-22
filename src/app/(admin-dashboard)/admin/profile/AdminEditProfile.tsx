"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import ToggleShowPassword from "@/components/common/ToggleShowPassword";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { uploadCardImage } from "lib/uploadCardImage";
import { CameraIcon, UserIcon } from "lucide-react";
import LinearWithValueLabel from "@/components/common/LinearProgressWithLabel";

interface EditProfileForm {
  name: string;
  email: string;
  password: string;
  image: string | File;
}

export default function AdminEditProfile({ user }: { user: any }) {
  const route = useRouter();
  const {
    handleSubmit,
    setValue,
    register,
    formState: { isSubmitting },
  } = useForm<EditProfileForm>({
    defaultValues: {
      image: user?.image || "",
      name: user?.name || "",
      email: user?.email || "",
      password: "",
    },
  });

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user?.image || null
  );
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const toggleShowPassword = () => {
    setIsShowPassword((prev) => !prev);
  };

  const onSubmit = async (data: EditProfileForm) => {
    try {
      let uploadedImageUrl = data.image; // Default to the existing value
      if (image) {
        setLoading(true);
        setProgress(30);
        uploadedImageUrl = await uploadCardImage(image, "profile");
        setProgress(100);
        setLoading(false);
      }

      // Prepare the payload for the API
      const payload = {
        ...data,
        image: uploadedImageUrl || null,
      };

      const res = await fetch("/api/profile/edit-profile", {
        body: JSON.stringify(payload),
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        toast.success("Profile updated successfully");
        route.refresh();
      } else {
        const errorData = await res.json();
        toast.error(`Error updating profile: ${errorData.errors}`);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Check if files exist and if a file was selected
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setValue("image", file); // Update the form value with the file object
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // Handle the case when no file is selected (e.g., user cancels the file selection)
      setImage(null);
      setImagePreview(user?.image || null);
      setValue("image", user?.image || "");
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="flex items-center justify-center w-full lg:mt-20 mt:10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center space-y-3 justify-center max-w-4xl h-fit rounded-lg bg-white shadow-lg p-6 w-full"
      >
        <div className="flex flex-col gap-3 sm:col-span-2">
          <div className="relative flex items-center justify-center">
            {!imagePreview ? (
              <div className="w-32 h-32 bg-gray-300 rounded-md flex items-center justify-center">
                <UserIcon className="w-1/2 h-1/2 text-gray-400" />
              </div>
            ) : (
              <Image
                src={imagePreview}
                alt="profile"
                width={128}
                height={128}
                className="w-32 h-32 rounded-md object-cover"
              />
            )}
            <label
              htmlFor="image"
              className="absolute left-[calc(67%-1.5rem)] -translate-x-1/2 bottom-2 cursor-pointer"
            >
              <span className="bg-white rounded-full p-1 flex-shrink-0 block shadow-md">
                <CameraIcon className="text-gray-600" />
              </span>
              <input
                multiple={false}
                type="file"
                {...register("image")}
                onChange={handleImageChange}
                id="image"
                name="image"
                accept="image/*"
                className="opacity-0 absolute w-0 h-0"
              />
            </label>
          </div>
          <LinearWithValueLabel isLoading={loading} progress={progress} />
        </div>

        {/* Name Input */}
        <div className="lg:w-1/2 w-full">
          <label
            htmlFor="name"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Name
          </label>
          <div className="mt-2">
            <input
              {...register("name", { required: "Name is required" })}
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-50 sm:text-sm/6"
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="lg:w-1/2 w-full">
          <label
            htmlFor="email"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Email
          </label>
          <div className="mt-2">
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-50 sm:text-sm/6"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="lg:w-1/2 relative w-full">
          <label
            htmlFor="password"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Password
          </label>
          <div className="mt-2 relative">
            <input
              {...register("password")}
              id="password"
              name="password"
              type={isShowPassword ? "text" : "password"}
              placeholder="Leave blank to keep current password"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-50 sm:text-sm/6"
            />
            <div className="absolute right-3 bottom-0.5">
              <ToggleShowPassword
                isShowPassword={isShowPassword}
                toggleShowPassword={toggleShowPassword}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-4  max-w-4xl lg:w-1/2 w-full mt-8">
          <button
            type="button"
            className="bg-transparent text-paragraph_color border w-full border-paragraph_color font-semibold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary-50 hover:bg-primary-100 text-white font-semibold py-2 px-4 rounded w-full"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
