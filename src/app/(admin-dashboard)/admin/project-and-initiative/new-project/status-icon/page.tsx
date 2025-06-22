"use client";

import Tabs from "@/components/create-project-tabs/Tabs";
import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";

type StatusFormValues = {
  iconTitleStatus1: string;
  shortDescriptionStatus1: string;
  iconTitleStatus2: string;
  shortDescriptionStatus2: string;
  iconImage1: File | null;
  iconImage2: File | null;
};

export default function StatusIconsForm() {
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<StatusFormValues>();

  const [iconPreview1, setIconPreview1] = useState<string | null>(null);
  const [iconPreview2, setIconPreview2] = useState<string | null>(null);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({
    icon1: null,
    icon2: null,
  });

  const setRef = (key: string) => (ref: HTMLInputElement | null) => {
    fileInputRefs.current[key] = ref;
  };

  const handleIconPreviewChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    key: "iconImage1" | "iconImage2"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(key, file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: StatusFormValues) => {
    console.log("Submitted Data:", {
      ...data,
      iconImage1: data.iconImage1 ? data.iconImage1.name : null,
      iconImage2: data.iconImage2 ? data.iconImage2.name : null,
    });
    alert("Data logged to console!");
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
          <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
            Create New Project
          </h2>
          <Tabs />
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="my-8 border-2 p-6 bg-white rounded-lg"
    >
      <h2 className="text-xl mb-6 text-sky-800">2. Status & Icons</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((num) => (
          <div
            key={num}
            className="bg-gray-50 rounded-lg p-4 shadow col-span-1 space-y-4"
          >
            <h3 className="font-semibold text-sky-700">
              {num === 1 ? "First Icon" : "Second Icon"}
            </h3>

            {/* Icon Upload */}
            <Controller
              name={`iconImage${num}` as "iconImage1" | "iconImage2"}
              control={control}
              render={() => (
                <div className="relative text-center">
                  <label
                    htmlFor={`icon${num}`}
                    className="text-sm font-medium cursor-pointer px-4 py-2 bg-white border border-dashed border-gray-300 rounded-lg shadow"
                  >
                    Add Icon +
                  </label>
                  <input
                    type="file"
                    id={`icon${num}`}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) =>
                      handleIconPreviewChange(
                        e,
                        num === 1 ? setIconPreview1 : setIconPreview2,
                        num === 1 ? "iconImage1" : "iconImage2"
                      )
                    }
                    ref={setRef(`icon${num}`)}
                  />
                  {num === 1 && iconPreview1 && (
                    <img
                      src={iconPreview1}
                      alt="Icon 1"
                      className="mt-2 size-10 mx-auto object-contain"
                    />
                  )}
                  {num === 2 && iconPreview2 && (
                    <img
                      src={iconPreview2}
                      alt="Icon 2"
                      className="mt-2 size-10 mx-auto object-contain"
                    />
                  )}
                </div>
              )}
            />

            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-800">
                Title
              </label>
              <Controller
                name={`iconTitleStatus${num}` as
                  | "iconTitleStatus1"
                  | "iconTitleStatus2"}
                control={control}
                rules={{
                  required: "Title is required",
                  maxLength: 50,
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter the title"
                    className="w-full border border-dashed border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-sky-200"
                  />
                )}
              />
              {errors[`iconTitleStatus${num}` as keyof StatusFormValues] && (
                <p className="text-red-500 text-sm mt-1">
                  {
                    errors[`iconTitleStatus${num}` as keyof StatusFormValues]
                      ?.message
                  }
                </p>
              )}
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-sm font-medium text-gray-800">
                Short Description
              </label>
              <Controller
                name={`shortDescriptionStatus${num}` as
                  | "shortDescriptionStatus1"
                  | "shortDescriptionStatus2"}
                control={control}
                rules={{
                  required: "Short description is required",
                  maxLength: 200,
                }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={3}
                    placeholder="Enter a short description"
                    className="w-full border border-dashed border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-sky-200"
                  />
                )}
              />
              {errors[`shortDescriptionStatus${num}` as keyof StatusFormValues] && (
                <p className="text-red-500 text-sm mt-1">
                  {
                    (errors as any)[`shortDescriptionStatus${num}`]?.message
                  }
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Submit
        </button>

        <button
          type="button"
          onClick={() => {
            reset();
            setIconPreview1(null);
            setIconPreview2(null);
            if (fileInputRefs.current.icon1)
              fileInputRefs.current.icon1.value = "";
            if (fileInputRefs.current.icon2)
              fileInputRefs.current.icon2.value = "";
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
