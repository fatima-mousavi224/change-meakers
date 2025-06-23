"use client";

import { Controller, useForm, useFieldArray } from "react-hook-form";
import { FaSquarePlus, FaTrash } from "react-icons/fa6";
import { useRef, useState } from "react";
import Tabs from "@/components/create-project-tabs/Tabs";
import { FaRegEdit } from "react-icons/fa";

interface Voice {
  quote: string;
  name: string;
  description: string;
}

type FormData = {
  sectionTitleVoices: string;
  sectionDescriptionVoices: string;
  voices: Voice[];
};

export default function VoicesFromClassroomForm() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      sectionTitleVoices: "",
      sectionDescriptionVoices: "",
      voices: [
        { quote: "", name: "", description: "" },
        { quote: "", name: "", description: "" },
        { quote: "", name: "", description: "" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "voices",
  });

  const [iconPreviews, setIconPreviews] = useState<(string | null)[]>(
    Array(fields.length).fill(null)
  );

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const setRef = (name: string) => (el: HTMLInputElement | null) => {
    fileInputRefs.current[name] = el;
  };

  const handleIconPreviewChange = (index: number, file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setIconPreviews((prev) => {
        const updated = [...prev];
        updated[index] = reader.result as string;
        return updated;
      });
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (data: FormData) => {
    console.log("Voices from Classroom Data:", data);
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
        Create New Project
      </h2>
      <Tabs />
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto">
        <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
          <h2 className="text-xl font-semibold mb-4 text-sky-800">
            5. Voices from the Classroom
          </h2>

          <span className="block text-lg my-2">Label's Name</span>
          <div className="flex items-center justify-center space-x-3 py-2 px-2 bg-gray-200 rounded-full w-52 my-2">
            <span className="w-2 h-2 bg-sky-700 rounded-full"></span>
            <span className="block text-lg text-gray-400">
              e.g., "For Students"
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2 mt-4 md:mt-0">
              {/* Section Title */}
              <div className="col-span-3">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Section Title
                </label>
                <Controller
                  name="sectionTitleVoices"
                  control={control}
                  rules={{
                    required: "Section Title is required",
                    maxLength: 50,
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="e.g. 'Voices from Students'"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    />
                  )}
                />
                {errors.sectionTitleVoices && (
                  <p className="text-red-500 text-sm">
                    {errors.sectionTitleVoices.message}
                  </p>
                )}
              </div>

              {/* Section Description */}
              <div className="col-span-3">
                <label className="block text-sm/6 font-medium text-gray-900 mt-4 md:mt-0">
                  Section Description
                </label>
                <Controller
                  name="sectionDescriptionVoices"
                  control={control}
                  rules={{
                    required: "Section Description is required",
                    maxLength: 1000,
                  }}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      placeholder="Write something here..."
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                      rows={4}
                    />
                  )}
                />
                {errors.sectionDescriptionVoices && (
                  <p className="text-red-500 text-sm">
                    {errors.sectionDescriptionVoices.message}
                  </p>
                )}
              </div>

              {/* Voices Entries */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 col-span-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border border-gray-400 rounded-lg border-dashed px-5 py-4 w-full"
                  >
                    <Controller
                      name={`voices.${index}.quote`}
                      control={control}
                      rules={{ required: false }}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          placeholder="Write something here..."
                          rows={3}
                          className="my-3 w-full border-none focus:ring-0 resize-none"
                        />
                      )}
                    />

                    <div className="flex justify-center md:justify-end mb-6 md:mb-0 space-x-4">
                      <span
                        className="text-blue-600 cursor-pointer w-4 h-4 hover:text-blue-800"
                        onClick={() =>
                          append({ quote: "", name: "", description: "" })
                        }
                        title="Add"
                      >
                        <FaSquarePlus />
                      </span>
                      <span
                        className="text-red-600 cursor-pointer w-4 h-4 hover:text-red-800"
                        onClick={() => remove(index)}
                        title="Remove"
                      >
                        <FaTrash />
                      </span>
                      <span
                        className="text-blue-600 cursor-pointer w-4 h-4 hover:text-blue-800"
                        title="Edit"
                      >
                        <FaRegEdit />
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 mt-4 space-x-4 items-center">
                      <div className="relative">
                        <label
                          htmlFor={`voiceOfClassRoomIcon${index}`}
                          className="text-3xl w-12 h-12 px-4 flex justify-center items-center py-3 rounded-full cursor-pointer shadow-sm shadow-gray-500 bg-white"
                        >
                          +
                        </label>
                        <input
                          type="file"
                          id={`voiceOfClassRoomIcon${index}`}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) =>
                            handleIconPreviewChange(
                              index,
                              e.target.files?.[0] ?? null
                            )
                          }
                          ref={setRef(`voiceOfClassRoomIcon${index}`)}
                        />
                        {iconPreviews[index] && (
                          <img
                            src={iconPreviews[index]!}
                            alt="Icon Preview"
                            className="mt-2 size-10 object-cover rounded-full border"
                          />
                        )}
                      </div>

                      <div className="flex-1">
                        <Controller
                          name={`voices.${index}.name`}
                          control={control}
                          rules={{ required: false }}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="text"
                              placeholder="Student Name block"
                              className="placeholder:text-base xl:placeholder:text-lg border-none focus:ring-0 w-full"
                            />
                          )}
                        />
                        <Controller
                          name={`voices.${index}.description`}
                          control={control}
                          rules={{ required: false }}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="text"
                              placeholder="Short Description block"
                              className="border-none focus:ring-0 w-full"
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Form Actions */}
        <div className="mt-6 flex justify-between gap-4">
          <button
            type="submit"
            className="px-6 py-2 bg-sky-600 text-white rounded-md shadow hover:bg-sky-700 transition"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md shadow hover:bg-gray-400 transition"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
