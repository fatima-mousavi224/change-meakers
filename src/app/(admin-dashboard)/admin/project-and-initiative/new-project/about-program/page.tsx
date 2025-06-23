"use client";

import Tabs from "@/components/create-project-tabs/Tabs";
import { Controller, useForm } from "react-hook-form";
import { BsArrowRight } from "react-icons/bs";

type FormData = {
  sectionTitleAbout: string;
  bodyText: string;
  buttonName2: string;
  buttonLink2: string;
};

export default function AboutProgramForm() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("About Program Data:", data);
  };

  const handleClear = () => {
    reset();
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
        Create New Project
      </h2>
      <Tabs />
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* About Program Section */}
        <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
          <h2 className="text-xl font-semibold mb-4 text-sky-800">
            4. About Program Section
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2 mt-4 md:mt-0">
              <div className="col-span-3 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Section Title
                </label>
                <Controller
                  name="sectionTitleAbout"
                  control={control}
                  rules={{
                    required: "Section Title is required",
                    maxLength: 50,
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="e.g. 'About the Program'"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    />
                  )}
                />
                {errors.sectionTitleAbout && (
                  <p className="text-red-500 text-sm">
                    {errors.sectionTitleAbout.message}
                  </p>
                )}
              </div>
              <div className="col-span-3 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Body Text
                </label>
                <Controller
                  name="bodyText"
                  control={control}
                  rules={{
                    required: "Body Text is required",
                    maxLength: 1000,
                  }}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      placeholder="write something here..."
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                      rows={4}
                    />
                  )}
                />
                {errors.bodyText && (
                  <p className="text-red-500 text-sm">
                    {errors.bodyText.message}
                  </p>
                )}
              </div>
              <div className="col-span-1 mt-4 md:mt-0 relative">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Button Name
                </label>
                <Controller
                  name="buttonName2"
                  control={control}
                  rules={{
                    required: "Button Name is required",
                    maxLength: 50,
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter the button's name"
                      className="block w-full border rounded-full border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    />
                  )}
                />
                {errors.buttonName2 && (
                  <p className="text-red-500 text-sm">
                    {errors.buttonName2.message}
                  </p>
                )}
                <a
                  href="#"
                  className="absolute top-8 right-2 p-2 bg-gray-100 rounded-full"
                >
                  <span className="text-xl">
                    <BsArrowRight />
                  </span>
                </a>
              </div>
              <div className="col-span-1 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Button Link
                </label>
                <Controller
                  name="buttonLink2"
                  control={control}
                  rules={{
                    required: "Button Link is required",
                    maxLength: 200,
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter the URL"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    />
                  )}
                />
                {errors.buttonLink2 && (
                  <p className="text-red-500 text-sm">
                    {errors.buttonLink2.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-between gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-sky-600 text-white rounded-md shadow hover:bg-sky-700 transition"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md shadow hover:bg-gray-400 transition"
            >
              Clear
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}
