"use client";

import Tabs from "@/components/create-project-tabs/Tabs";
import React from "react";
import { useForm, Controller } from "react-hook-form";

type FormData = {
  finalStatement: string;
  showInMainNavigation: boolean;
  navigationLabel: string;
};

export default function FinalCallToActionAndNavigation() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      finalStatement: "",
      showInMainNavigation: false,
      navigationLabel: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Final Call & Navigation Data:", data);
  };

  const clearForm = () => reset();

  return (
    <div className="max-w-screen-2xl mx-auto">
      <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
        Create New Project
      </h2>
      <Tabs />
      <form onSubmit={handleSubmit(onSubmit)} className="my-6 space-y-8">
        {/* Final Call to Action / Statement Section */}
        <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
          <h3 className="text-xl font-medium text-sky-800">
            16. Final Call to Action / Statement
          </h3>
          <label className="block mt-4 font-medium text-gray-900">
            Final Big Statement
          </label>
          <Controller
            name="finalStatement"
            control={control}
            rules={{
              required: "Final Statement is required",
              maxLength: {
                value: 500,
                message: "Maximum length is 500 characters",
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="write something here..."
                className={`border w-full mt-2 border-dashed rounded-lg px-3 py-2 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2 ${
                  errors.finalStatement ? "border-red-500" : "border-gray-400"
                }`}
              />
            )}
          />
          {errors.finalStatement && (
            <p className="text-red-500 text-sm mt-1">
              {errors.finalStatement.message}
            </p>
          )}
        </section>

        {/* Navigation Settings Section */}
        <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white space-y-4">
          <h3 className="text-xl font-medium text-sky-800">
            Navigation Settings
          </h3>
          <div className="flex space-x-5 items-center">
            <Controller
              name="showInMainNavigation"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="border border-gray-400 rounded cursor-pointer"
                />
              )}
            />
            <div>
              <span className="block text-gray-700 font-medium">
                Show in Main Navigation
              </span>
              <span className="block text-sm text-gray-600">
                Enable this option if you want this program/project to appear in
                the main site menu.
              </span>
            </div>
          </div>
          <div className="flex flex-col space-y-3">
            <h4 className="text-gray-700 font-medium">Navigation Label</h4>
            <p className="text-gray-600 text-sm">
              Only visible if toggle is enabled. This is the name that will
              appear in the top menu. Leave blank to use the Project Title.
            </p>
            <Controller
              name="navigationLabel"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="write something here..."
                  className="border w-full mt-2 border-dashed rounded-lg px-3 py-2 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2 border-gray-400"
                />
              )}
            />
          </div>
        </section>

        {/* Buttons */}
        <div className="flex justify-between mt-6 px-4 md:px-14">
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
      </form>
    </div>
  );
}
