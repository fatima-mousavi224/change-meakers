"use client";

import { Controller, useForm } from "react-hook-form";
import Tabs from "@/components/create-project-tabs/Tabs";

interface OfferIcon {
  iconTitle: string;
  shortDescription: string;
  iconFile?: File; // optional File object for the uploaded image
  iconPreviewUrl?: string; // optional derived preview URL
}

type FormData = {
  sectionTitleAbout: string;
  bodyText: string;
  buttonName2: string;
  buttonLink2: string;
  sectionTitleVoices: string;
  sectionDescriptionVoices: string;
  offerIcons: OfferIcon[];
};

export default function Offer() {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      offerIcons: [
        { iconTitle: "", shortDescription: "" },
        { iconTitle: "", shortDescription: "" },
      ],
    },
  });

  const offerIcons = watch("offerIcons"); // watch for offerIcons array

  const setRef = (name: string) => (el: HTMLInputElement | null) => {
    if (el) el.value = ""; // optional: reset file input
  };

  const handleFileChange = (index: number, file: File) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      // update the form state with the file and preview url
      setValue(`offerIcons.${index}.iconFile`, file);
      setValue(`offerIcons.${index}.iconPreviewUrl`, reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const onSubmit = (data: FormData) => {
    // The data now includes files and previews
    console.log("Form Data:", data);

    // For actual upload, you might need to prepare FormData object for fetch/Axios
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
        Create New Project
      </h2>
      <Tabs />
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ... other sections ... */}

        {/* Offer Icons Section */}
        <section className="border-2 my-6 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
          <h2 className="text-xl font-semibold mb-4 text-sky-800">
            7. ‘What We Offer?’ Section
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[0, 1].map((index) => (
              <div
                key={index}
                className="border border-gray-300 border-dashed rounded-xl px-4 py-6"
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="relative">
                    <label
                      htmlFor={`offerIcon${index}`}
                      className="text-sm text-center xl:text-left xl:text-xl px-4 py-1 xl:py-3 rounded-xl cursor-pointer inline-block shadow-sm shadow-gray-500"
                    >
                      Add Offer Icon +
                    </label>
                    <input
                      type="file"
                      id={`offerIcon${index}`}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileChange(index, file);
                      }}
                      ref={setRef(`offerIcon${index}`)}
                    />
                    {offerIcons[index]?.iconPreviewUrl && (
                      <img
                        src={offerIcons[index].iconPreviewUrl}
                        alt={`Offer Icon ${index + 1} Preview`}
                        className="mt-2 size-10 object-contain"
                      />
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="block text-sm/6 font-medium text-gray-900">
                        Icon Title
                      </label>
                      <Controller
                        name={`offerIcons.${index}.iconTitle`}
                        control={control}
                        rules={{
                          required: "Icon Title is required",
                          maxLength: 50,
                        }}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            placeholder="Enter icon title"
                            className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                          />
                        )}
                      />
                    </div>
                    <div>
                      <label className="block text-sm/6 font-medium text-gray-900">
                        Short Description
                      </label>
                      <Controller
                        name={`offerIcons.${index}.shortDescription`}
                        control={control}
                        rules={{
                          required: "Short Description is required",
                          maxLength: 200,
                        }}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            placeholder="Enter short description"
                            className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                            rows={3}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
            onClick={() => {
              reset();
            }}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md shadow hover:bg-gray-400 transition"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}