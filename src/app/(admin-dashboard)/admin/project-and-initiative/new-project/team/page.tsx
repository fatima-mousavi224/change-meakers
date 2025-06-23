"use client";

import { Controller, useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { FaTrash, FaSquarePlus } from "react-icons/fa6"; // or "react-icons/fa"
import Tabs from "@/components/create-project-tabs/Tabs";

type TeamCard = {
  name: string;
  role: string;
  biography: string;
  showLinkInput?: boolean;
  link?: string;
};

type FormData = {
  sectionTitleTeam: string;
  sectionDescriptionTeam: string;
  teamCards: TeamCard[];
};

export default function TeamSectionForm() {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      sectionTitleTeam: "",
      sectionDescriptionTeam: "",
      teamCards: Array(3).fill({
        name: "",
        role: "",
        biography: "",
        showLinkInput: false,
        link: "",
      }),
    },
  });

  // To store files for images and icons
  const [teamCardFiles, setTeamCardFiles] = useState<{
    images: (File | null)[];
    icons: (File | null)[];
  }>({
    images: [null, null, null],
    icons: [null, null, null],
  });

  // For image previews
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string }>({});

  // refs to clear file inputs
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const setRef = (name: string) => (el: HTMLInputElement | null) => {
    fileInputRefs.current[name] = el;
  };

  // Handle image upload & preview for team photos
  const handleTeamImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("Max file size is 10MB");
      return;
    }
    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews((prev) => ({ ...prev, [`teamImage${index}`]: reader.result as string }));
    };
    reader.readAsDataURL(file);

    // Save file
    setTeamCardFiles((prev) => {
      const newImages = [...prev.images];
      newImages[index] = file;
      return { ...prev, images: newImages };
    });
  };

  // Handle icon upload
  const handleTeamIconChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTeamCardFiles((prev) => {
      const newIcons = [...prev.icons];
      newIcons[index] = file;
      return { ...prev, icons: newIcons };
    });
  };

  // Toggle showLinkInput in react-hook-form state
  const toggleLinkInput = (index: number) => {
    const current = watch(`teamCards.${index}.showLinkInput`);
    setValue(`teamCards.${index}.showLinkInput`, !current);
  };

  const onSubmit = (data: FormData) => {
    // Log form data + file info (file names)
    const filesInfo = {
      images: teamCardFiles.images.map((f) => (f ? f.name : null)),
      icons: teamCardFiles.icons.map((f) => (f ? f.name : null)),
    };
    console.log("Submitted Data:", data);
    console.log("Uploaded Files:", filesInfo);
  };

  // Clear all form fields + previews + files
  const handleClear = () => {
    reset({
      sectionTitleTeam: "",
      sectionDescriptionTeam: "",
      teamCards: Array(3).fill({
        name: "",
        role: "",
        biography: "",
        showLinkInput: false,
        link: "",
      }),
    });
    setTeamCardFiles({ images: [null, null, null], icons: [null, null, null] });
    setImagePreviews({});
    // Clear file inputs
    Object.values(fileInputRefs.current).forEach((input) => {
      if (input) input.value = "";
    });
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
        Create New Project
      </h2>
      <Tabs />
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Team Section */}
        <section className="border-2 my-6 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
          <h3 className="text-sky-800 text-xl font-semibold">8. Team Section</h3>
          <p>Label's Name</p>
          <div className="bg-gray-200 w-40 space-x-4 px-2 my-2 py-2 rounded-full flex justify-center items-center">
            <span className="bg-sky-700 h-2 w-2 rounded-full"></span>
            <span className="text-gray-400">e.g., "Team"</span>
          </div>

          {/* Section Title & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="col-span-1 mt-4 md:mt-0">
              <label className="block text-sm/6 font-medium text-gray-900">Section Title</label>
              <Controller
                name="sectionTitleTeam"
                control={control}
                rules={{
                  required: "Section Title is required",
                  maxLength: 50,
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="e.g. 'Our Team'"
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  />
                )}
              />
              {errors.sectionTitleTeam && (
                <p className="text-red-500 text-sm">{errors.sectionTitleTeam.message}</p>
              )}
            </div>

            <div className="col-span-2 mt-4 md:mt-0">
              <label className="block text-sm/6 font-medium text-gray-900">Section Description</label>
              <Controller
                name="sectionDescriptionTeam"
                control={control}
                rules={{
                  required: "Section Description is required",
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
              {errors.sectionDescriptionTeam && (
                <p className="text-red-500 text-sm">{errors.sectionDescriptionTeam.message}</p>
              )}
            </div>
          </div>

          {/* Team Cards */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="border border-gray-300 border-dashed rounded-xl px-4 py-8"
              >
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                  <div className="relative text-center">
                    {teamCardFiles.images[index] ? (
                      <div className="relative">
                        <img
                          src={imagePreviews[`teamImage${index}`]}
                          alt="Uploaded image"
                          className="mx-auto w-16 h-16 object-cover"
                        />
                        <span
                          className="absolute top-0 right-0 cursor-pointer"
                          onClick={() => {
                            setTeamCardFiles((prev) => {
                              const newImages = [...prev.images];
                              newImages[index] = null;
                              return { ...prev, images: newImages };
                            });
                            setImagePreviews((prev) => {
                              const newPreviews = { ...prev };
                              delete newPreviews[`teamImage${index}`];
                              return newPreviews;
                            });
                            if (fileInputRefs.current[`teamImage${index}`]) {
                              fileInputRefs.current[`teamImage${index}`]!.value = "";
                            }
                          }}
                        >
                          ✖
                        </span>
                      </div>
                    ) : (
                      <svg
                        className="mx-auto w-12 h-12 text-gray-300"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => handleTeamImageChange(e, index)}
                      ref={setRef(`teamImage${index}`)}
                    />
                    <p className="mt-4 font-semibold text-blue-500">Drag & Drop your Photo</p>
                    <p className="text-gray-500">here or Browse up to 10 MB</p>
                  </div>
                </div>

                {/* Inputs */}
                <Controller
                  name={`teamCards.${index}.name`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter Person's Name..."
                      className="border-none focus:ring-0 w-full mt-2 placeholder:text-lg"
                    />
                  )}
                />
                <Controller
                  name={`teamCards.${index}.role`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter their role..."
                      className="border-none focus:ring-0 w-full"
                    />
                  )}
                />
                <Controller
                  name={`teamCards.${index}.biography`}
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={2}
                      placeholder="Enter a short biography"
                      className="border-none focus:ring-0 resize-none w-full placeholder:font-medium"
                    />
                  )}
                />

                {/* Add Link and Icon Upload */}
                <div className="flex justify-end space-x-3 my-4">
                  <button
                    type="button"
                    onClick={() => toggleLinkInput(index)}
                    className="bg-gray-100 text-sm xl:text-base px-1 xl:px-3 py-2 rounded-xl cursor-pointer border border-gray-400"
                  >
                    Add Link +
                  </button>
                  <label
                    htmlFor={`StatusIcon${index}`}
                    className="bg-gray-100 text-sm xl:text-base px-1 xl:px-3 py-2 rounded-xl cursor-pointer border border-gray-400"
                  >
                    upload Icon +
                  </label>
                  <input
                    type="file"
                    id={`StatusIcon${index}`}
                    className="hidden"
                    onChange={(e) => handleTeamIconChange(e, index)}
                    ref={setRef(`StatusIcon${index}`)}
                  />
                </div>

                {/* Show link input if toggled */}
                <Controller
                  name={`teamCards.${index}.showLinkInput`}
                  control={control}
                  render={({ field }) =>
                    field.value ? (
                      <Controller
                        name={`teamCards.${index}.link`}
                        control={control}
                        render={({ field: linkField }) => (
                          <input
                            {...linkField}
                            type="text"
                            placeholder="Enter the link"
                            className="border w-full mt-2 border-gray-400 rounded-lg"
                          />
                        )}
                      />
                    ) : (
                      <></>
                    )
                  }
                />

                {/* Show uploaded icon preview */}
                {teamCardFiles.icons[index] && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(teamCardFiles.icons[index]!)}
                      alt="Uploaded icon"
                      className="w-8 h-8 object-cover"
                    />
                  </div>
                )}

                {/* Plus and Trash icons */}
                <div className="flex justify-end space-x-4 col-span-2 mt-3">
                  <span className="text-blue-600 cursor-pointer hover:text-blue-700">
                    <FaSquarePlus />
                  </span>
                  <span className="text-red-500 hover:text-red-600 cursor-pointer w-4 h-4">
                    <FaTrash />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Submit and Clear Buttons */}
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
      </form>
    </div>
  );
}
