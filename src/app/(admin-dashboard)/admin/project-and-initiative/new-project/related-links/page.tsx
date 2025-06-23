'use client';

import Tabs from '@/components/create-project-tabs/Tabs';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FaEdit } from 'react-icons/fa';
import { FaSquarePlus, FaTrash } from 'react-icons/fa6';


type RelatedLink = {
  buttonLink: string;
  buttonName: string;
};

type FormData = {
  relatedLinks: RelatedLink[];
};

export default function RelatedLinksSection() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      relatedLinks: [
        { buttonLink: '', buttonName: '' },
        { buttonLink: '', buttonName: '' },
        { buttonLink: '', buttonName: '' },
      ],
    },
  });

  const onSubmit = (data: FormData) => {
    console.log('Related Links Data:', data);
  };

  const clearForm = () => reset();

  return (
    <div className="max-w-screen-2xl mx-auto">
          <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
            Create New Project
          </h2>
          <Tabs />
    <section className="border-2 my-6 rounded-lg p-4 md:p-8 lg:px-14 bg-white space-y-5 py-10">
      <h3 className="text-sky-800 font-medium text-xl">15. Related Links</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row-reverse items-center gap-7"
          >
            <div className="flex justify-center md:justify-end mb-6 md:mb-0 space-x-4">
              <span className="text-blue-600 cursor-pointer w-4 h-4 hover:text-blue-800">
                <FaSquarePlus />
              </span>
              <span className="text-red-600 cursor-pointer w-4 h-4 hover:text-red-800">
                <FaTrash />
              </span>
              <span className="text-blue-600 cursor-pointer w-4 h-4 hover:text-blue-800">
                <FaEdit />
              </span>
            </div>
            <div className="w-full">
              <label className="block font-medium text-gray-900">Button's Link</label>
              <Controller
                name={`relatedLinks.${index}.buttonLink`}
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter the URL"
                    className={`border w-full mt-2 border-dashed rounded-lg px-3 py-2 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2 ${
                      errors.relatedLinks?.[index]?.buttonLink ? "border-red-500" : "border-gray-400"
                    }`}
                  />
                )}
              />
              {errors.relatedLinks?.[index]?.buttonLink && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.relatedLinks[index].buttonLink?.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <label className="block font-medium text-gray-900">Button's Name</label>
              <Controller
                name={`relatedLinks.${index}.buttonName`}
                control={control}
                rules={{
                  required: "Button name is required",
                  maxLength: {
                    value: 30,
                    message: "Max length is 30 characters",
                  },
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter the button's name"
                    className={`border w-full mt-2 border-dashed rounded-lg px-3 py-2 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2 ${
                      errors.relatedLinks?.[index]?.buttonName ? "border-red-500" : "border-gray-400"
                    }`}
                  />
                )}
              />
              {errors.relatedLinks?.[index]?.buttonName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.relatedLinks[index].buttonName?.message}
                </p>
              )}
            </div>
          </div>
        ))}
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
      </form>
    </section>
    </div>
  );
}
