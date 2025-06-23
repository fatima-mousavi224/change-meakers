"use client";

import Tabs from "@/components/create-project-tabs/Tabs";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function NewsletterForm() {
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string }>(
    {}
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const setRef = (name: string) => (el: HTMLInputElement | null) => {
    fileInputRefs.current[name] = el;
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [key]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => ({
          ...prev,
          [key]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearForm = () => {
    reset();
    setFiles({});
    setImagePreviews({});
    Object.values(fileInputRefs.current).forEach((ref) => {
      if (ref) ref.value = "";
    });
  };

  const onSubmit = (data: any) => {
    console.log("Newsletter Data:", data);
    console.log("Newsletter Files:", files);
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
        Create New Project
      </h2>
      <Tabs />
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Section Wrapper */}
        <section className="border-2 my-6 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
          <h3 className="text-sky-800 text-xl font-semibold">
            12. Newsletter/Archive Document Section
          </h3>
          <p className="my-2">Label's Name</p>
          <div className="bg-gray-200 w-48 px-2 py-2 rounded-full flex justify-center items-center space-x-4">
            <span className="bg-sky-700 h-2 w-2 rounded-full"></span>
            <span className="text-gray-400">e.g., "Newsletter"</span>
          </div>

          {/* Section Title and Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Section Title
              </label>
              <Controller
                name="sectionTitleNewsletter"
                control={control}
                rules={{ required: "Section Title is required", maxLength: 50 }}
                render={({ field }) => (
                  <input
                    {...field}
                    placeholder="e.g. 'Newsletter'"
                    className="w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3"
                  />
                )}
              />
              {errors.sectionTitleNewsletter && (
                <p className="text-red-500 text-sm">
                  {errors.sectionTitleNewsletter.message as string}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900">
                Section Description
              </label>
              <Controller
                name="sectionDescriptionNewsletter"
                control={control}
                rules={{
                  required: "Section Description is required",
                  maxLength: 1000,
                }}
                render={({ field }) => (
                  <textarea
                    {...field}
                    placeholder="Write something here..."
                    rows={4}
                    className="w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3"
                  />
                )}
              />
              {errors.sectionDescriptionNewsletter && (
                <p className="text-red-500 text-sm">
                  {errors.sectionDescriptionNewsletter.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
            {[0, 1].map((index) => {
              const imageKey = `newsletterImage${index + 1}`;
              return (
                <div
                  key={index}
                  className="border border-dashed border-gray-300 rounded-md px-4 py-4 flex flex-col xl:flex-row gap-4"
                >
                  {/* Image Upload */}
                  <div className="flex-1">
                    <div className="relative text-center border border-dashed rounded-lg px-6 py-2">
                      {files[imageKey] ? (
                        <div className="relative">
                          <img
                            src={imagePreviews[imageKey]}
                            alt=""
                            className="w-16 h-16 mx-auto object-cover"
                          />
                          <span
                            className="absolute top-0 right-0 cursor-pointer"
                            onClick={() => {
                              setFiles((prev) => ({
                                ...prev,
                                [imageKey]: null,
                              }));
                              setImagePreviews((prev) => {
                                const newPreviews = { ...prev };
                                delete newPreviews[imageKey];
                                return newPreviews;
                              });
                              if (fileInputRefs.current[imageKey]) {
                                fileInputRefs.current[imageKey]!.value = "";
                              }
                            }}
                          >
                            ✖
                          </span>
                        </div>
                      ) : (
                        <svg
                          className="w-12 h-12 text-gray-300 mx-auto"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                          />
                        </svg>
                      )}
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, imageKey)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        ref={setRef(imageKey)}
                      />
                      <p className="mt-2 font-semibold text-blue-500">
                        Drag & Drop or Browse
                      </p>
                    </div>

                    {/* URL input */}
                    <Controller
                      name={`newsletterItems.${index}.url`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          placeholder="Enter Downloadable URL"
                          className="w-full mt-2 rounded border border-dashed border-gray-400 px-3 py-2"
                        />
                      )}
                    />
                  </div>

                  {/* Text Info */}
                  <div className="flex-1 space-y-2">
                    <Controller
                      name={`newsletterItems.${index}.date`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          placeholder="Date"
                          className="w-full border border-dashed rounded px-2 py-1"
                        />
                      )}
                    />
                    <Controller
                      name={`newsletterItems.${index}.title`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          placeholder="Title"
                          className="w-full border border-dashed rounded px-2 py-1"
                        />
                      )}
                    />
                    <Controller
                      name={`newsletterItems.${index}.description`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          placeholder="Short Description"
                          className="w-full border border-dashed rounded px-2 py-1"
                        />
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit and Clear Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={clearForm}
              className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400"
            >
              Clear
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}
