"use client";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { useRef, useState } from "react";
import { FaTrash, FaSquarePlus } from "react-icons/fa6";
import Tabs from "@/components/create-project-tabs/Tabs";
import { uploadCardImage } from "lib/uploadCardImage";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type StudentItem = {
  name: string;
  role: string;
  biography: string;
  showLinkInput?: boolean;
  link?: string;
};

type FormData = {
  sectionTitleStudents: string;
  sectionDescriptionStudents: string;
  studentItems: StudentItem[];
};

export default function StudentsSection() {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      sectionTitleStudents: "",
      sectionDescriptionStudents: "",
      studentItems: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "studentItems",
  });

  const [studentFiles, setStudentFiles] = useState<{
    images: (File | null)[];
    icons: (File | null)[];
  }>({
    images: [],
    icons: [],
  });

  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string }>(
    {}
  );

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const setRef = (name: string) => (el: HTMLInputElement | null) => {
    fileInputRefs.current[name] = el;
  };

  const handleStudentImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("Max file size is 10MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews((prev) => ({
        ...prev,
        [`studentImage${index}`]: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);

    setStudentFiles((prev) => {
      const newImages = [...prev.images];
      newImages[index] = file;
      return { ...prev, images: newImages };
    });
  };

  const handleStudentIconChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStudentFiles((prev) => {
      const newIcons = [...prev.icons];
      newIcons[index] = file;
      return { ...prev, icons: newIcons };
    });
  };

  const toggleLinkInput = (index: number) => {
    const current = watch(`studentItems.${index}.showLinkInput`);
    setValue(`studentItems.${index}.showLinkInput`, !current);
  };

  const projectId =
    typeof window !== "undefined" ? localStorage.getItem("projectId") : null;
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    if (!projectId) {
      alert("No projectId found");
      return;
    }
    // Upload images and icons for each student item
    const studentItemsWithFiles = await Promise.all(
      data.studentItems.map(async (item, idx) => {
        let imageUrl = "";
        let iconUrl = "";
        if (studentFiles.images[idx]) {
          imageUrl = await uploadCardImage(studentFiles.images[idx]!);
        }
        if (studentFiles.icons[idx]) {
          iconUrl = await uploadCardImage(studentFiles.icons[idx]!);
        }
        return {
          ...item,
          image: imageUrl,
          icon: iconUrl,
        };
      })
    );
    const payload = {
      ...data,
      studentItems: studentItemsWithFiles,
    };
    const response = await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (response.ok) {
      localStorage.setItem("projectId", result.id);
      toast.success("Students section updated successfully!");
      router.push("/admin/project-and-initiative/new-project/quotation");
      handleClear();
    } else {
      toast.error(result.error || "Failed to update project");
    }
  };

  const handleClear = () => {
    reset({
      sectionTitleStudents: "",
      sectionDescriptionStudents: "",
      studentItems: [],
    });
    setStudentFiles({ images: [], icons: [] });
    setImagePreviews({});
    Object.values(fileInputRefs.current).forEach((input) => {
      if (input) input.value = "";
    });
  };

  const handleAddStudent = () => {
    append({
      name: "",
      role: "",
      biography: "",
      showLinkInput: false,
      link: "",
    });
    setStudentFiles((prev) => ({
      images: [...prev.images, null],
      icons: [...prev.icons, null],
    }));
  };

  const handleRemoveStudent = (index: number) => {
    remove(index);
    setStudentFiles((prev) => {
      const newImages = [...prev.images];
      const newIcons = [...prev.icons];
      newImages.splice(index, 1);
      newIcons.splice(index, 1);
      return { images: newImages, icons: newIcons };
    });
    setImagePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[`studentImage${index}`];
      return newPreviews;
    });
  };

  return (
    <div className="max-w-screen-2xl mx-auto">
      <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
        Create New Project
      </h2>
      <Tabs />
      <section className="border-2 my-6 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
        <h3 className="text-sky-800 text-xl font-semibold">
          9. Students Section
        </h3>
        <p>Label's Name</p>
        <div className="bg-gray-200 w-40 space-x-4 px-2 my-2 py-2 rounded-full flex justify-center items-center">
          <span className="bg-sky-700 h-2 w-2 rounded-full"></span>
          <span className="text-gray-400">e.g., "Students"</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="col-span-1 mt-4 md:mt-0">
              <label className="block text-sm/6 font-medium text-gray-900 mb-2">
                Section Title
              </label>
              <Controller
                name="sectionTitleStudents"
                control={control}
                rules={{ required: "Section Title is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="e.g. 'Our Students'"
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  />
                )}
              />
              {errors.sectionTitleStudents && (
                <p className="text-red-500 text-sm">
                  {errors.sectionTitleStudents.message}
                </p>
              )}
            </div>

            <div className="col-span-2 mt-4 md:mt-0">
              <label className="block text-sm/6 font-medium text-gray-900 mb-2">
                Section Description
              </label>
              <Controller
                name="sectionDescriptionStudents"
                control={control}
                rules={{
                  required: "Section Description is required",
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
              {errors.sectionDescriptionStudents && (
                <p className="text-red-500 text-sm">
                  {errors.sectionDescriptionStudents.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border border-gray-300 border-dashed rounded-xl px-4 py-8"
              >
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                  <div className="relative text-center">
                    {studentFiles.images[index] ? (
                      <div className="relative">
                        <img
                          src={imagePreviews[`studentImage${index}`]}
                          alt="Uploaded"
                          className="w-20 h-20 object-cover mx-auto"
                        />
                        <span
                          className="absolute top-0 right-0 cursor-pointer"
                          onClick={() => {
                            setStudentFiles((prev) => {
                              const newImages = [...prev.images];
                              newImages[index] = null;
                              return { ...prev, images: newImages };
                            });
                            setImagePreviews((prev) => {
                              const newPreviews = { ...prev };
                              delete newPreviews[`studentImage${index}`];
                              return newPreviews;
                            });
                            if (fileInputRefs.current[`studentImage${index}`]) {
                              fileInputRefs.current[
                                `studentImage${index}`
                              ]!.value = "";
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
                      onChange={(e) => handleStudentImageChange(e, index)}
                      ref={setRef(`studentImage${index}`)}
                    />
                    <p className="mt-4 font-semibold text-blue-500">
                      Drag & Drop your Photo
                    </p>
                    <p className="text-gray-500">here or Browse up to 10 MB</p>
                  </div>
                </div>

                <Controller
                  name={`studentItems.${index}.name`}
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
                  name={`studentItems.${index}.role`}
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
                  name={`studentItems.${index}.biography`}
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={2}
                      className="border-none focus:ring-0 resize-none w-full placeholder:font-medium"
                      placeholder="Enter a short biography"
                    />
                  )}
                />

                <div className="flex justify-end space-x-3 my-4">
                  <button
                    type="button"
                    onClick={() => toggleLinkInput(index)}
                    className="bg-gray-100 text-sm xl:text-base px-1 xl:px-3 py-2 rounded-xl cursor-pointer border border-gray-400"
                  >
                    Add Link +
                  </button>
                  <label
                    htmlFor={`StudentIcon${index}`}
                    className="bg-gray-100 text-sm xl:text-base px-1 xl:px-3 py-2 rounded-xl cursor-pointer border border-gray-400"
                  >
                    Upload Icon +
                  </label>
                  <input
                    type="file"
                    id={`StudentIcon${index}`}
                    className="hidden"
                    onChange={(e) => handleStudentIconChange(e, index)}
                    ref={setRef(`StudentIcon${index}`)}
                  />
                </div>

                <Controller
                  name={`studentItems.${index}.showLinkInput`}
                  control={control}
                  render={({ field }) =>
                    field.value ? (
                      <Controller
                        name={`studentItems.${index}.link`}
                        control={control}
                        render={({ field: linkField }) => (
                          <input
                            {...linkField}
                            type="text"
                            placeholder="Enter URL..."
                            className="w-full border border-gray-300 rounded px-2 py-1"
                          />
                        )}
                      />
                    ) : (
                      <></>
                    )
                  }
                />

                {studentFiles.icons[index] && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(studentFiles.icons[index]!)}
                      alt="Icon"
                      className="w-12 h-12 object-cover"
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-4 col-span-2 mt-3">
                  <span
                    className="text-blue-600 cursor-pointer hover:text-blue-700"
                    onClick={handleAddStudent}
                  >
                    <FaSquarePlus />
                  </span>
                  <span
                    className="text-red-500 hover:text-red-600 cursor-pointer w-4 h-4"
                    onClick={() => handleRemoveStudent(index)}
                  >
                    <FaTrash />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between space-x-6 my-8">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleAddStudent}
                className="bg-blue-100 text-blue-700 px-6 py-2 rounded hover:bg-blue-200 transition border border-blue-400"
              >
                Add Student
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 transition"
              >
                Clear
              </button>
            </div>
            <button
              type="submit"
              className={cn(
                "bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
