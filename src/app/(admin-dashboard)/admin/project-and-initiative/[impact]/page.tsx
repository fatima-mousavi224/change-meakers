"use client";
import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import firebaseApp from "lib/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { FaSquarePlus, FaTrash } from "react-icons/fa6";
import { toast } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import ProjectSelector from "@/components/common/ProjectSelector";
import ImpactTable from "@/components/admin/ImpactTable";

interface StandardImpact {
  id: string;
  title: string;
  impactTags: string;
  writersName: string;
  date: string;
  contentDescription: string;
  writerPhoto: File | null;
  galleryPhoto: File[];
}

interface HighlightedImpact {
  id: string;
  message1: string;
  title2: string;
  impactTags2: string;
  date2: string;
  message2: string;
  writersName2: string;
  contentDescription2: string;
  writerPhoto2: File | null;
  coverPhoto: File | null;
  galleryPhoto2: File[];
}

interface FormData {
  standardImpacts: StandardImpact[];
  highlightedImpacts: HighlightedImpact[];
  projectName: string;
}

interface ImpactFromAPI {
  id: string;
  projectName: string;
  createdAt: string;
  updatedAt: string;
  standardImpacts: {
    id: string;
    title: string;
    impactTags: string;
    writersName: string;
    date: string;
    contentDescription: string;
    writerPhoto: string | null;
    galleryPhoto: string[];
  }[];
  highlightedImpacts: {
    id: string;
    message1: string | null;
    title2: string | null;
    impactTags2: string | null;
    date2: string | null;
    message2: string | null;
    writersName2: string | null;
    contentDescription2: string | null;
    writerPhoto2: string | null;
    coverPhoto: string | null;
    galleryPhoto2: string[];
  }[];
}

export default function ImpactPage() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      standardImpacts: [
        {
          id: uuidv4(),
          title: "",
          impactTags: "",
          writersName: "",
          date: "",
          contentDescription: "",
          writerPhoto: null,
          galleryPhoto: [],
        },
      ],
      highlightedImpacts: [
        {
          id: uuidv4(),
          message1: "",
          title2: "",
          impactTags2: "",
          date2: "",
          message2: "",
          writersName2: "",
          contentDescription2: "",
          writerPhoto2: null,
          coverPhoto: null,
          galleryPhoto2: [],
        },
      ],
      projectName: "",
    },
  });

  const {
    fields: standardImpactFields,
    append: appendStandardImpact,
    remove: removeStandardImpact,
  } = useFieldArray({
    control,
    name: "standardImpacts",
  });

  const {
    fields: highlightedImpactFields,
    append: appendHighlightedImpact,
    remove: removeHighlightedImpact,
  } = useFieldArray({
    control,
    name: "highlightedImpacts",
  });

  const [submitMessage, setSubmitMessage] = React.useState("");
  const [submitStatus, setSubmitStatus] = React.useState<
    "success" | "error" | null
  >(null);
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editingImpactId, setEditingImpactId] = React.useState<string | null>(null);
  const [projectFilter, setProjectFilter] = React.useState("");
  const [cameFromSimpleList, setCameFromSimpleList] = React.useState(false);

  const uploadImageUrl = async (
    file: File,
    folder: string
  ): Promise<string> => {
    const filename = `${Date.now()}_${file.name}`;
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, `${folder}/${filename}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Error uploading image:", error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error("Error getting download URL:", error);
            reject(error);
          }
        }
      );
    });
  };

  const onSubmit = async (data: FormData) => {
    setSubmitMessage("");
    setSubmitStatus(null);

    try {
      const uploadedFiles: { [key: string]: string | string[] } = {};

      // Upload files and get URLs
      for (const section of [
        "standardImpacts",
        "highlightedImpacts",
      ] as const) {
        const items =
          section === "standardImpacts"
            ? data.standardImpacts
            : data.highlightedImpacts;
        const fileFields =
          section === "standardImpacts"
            ? ["writerPhoto", "galleryPhoto"]
            : ["writerPhoto2", "coverPhoto", "galleryPhoto2"];
        // @ts-ignore
        for (const [index, item] of items.entries()) {
          for (const field of fileFields) {
            const fileKey = `${section}[${index}].${field}`;
            if (field === "galleryPhoto" || field === "galleryPhoto2") {
              const files = item[field as keyof typeof item] as File[];
              if (files && files.length > 0) {
                const urls = await Promise.all(
                  files.map((file) => uploadImageUrl(file, field))
                );
                uploadedFiles[fileKey] = urls;
              } else {
                uploadedFiles[fileKey] = [];
              }
            } else {
              const file = item[field as keyof typeof item] as File | null;
              if (file) {
                const url = await uploadImageUrl(file, field);
                uploadedFiles[fileKey] = url;
              }
            }
          }
        }
      }

      // Prepare form data for submission
      const formDataToSend = {
        standardImpacts: data.standardImpacts.map((impact, index) => ({
          title: impact.title,
          impactTags: impact.impactTags,
          writersName: impact.writersName,
          date: impact.date,
          contentDescription: impact.contentDescription,
          writerPhoto:
            uploadedFiles[`standardImpacts[${index}].writerPhoto`] || null,
          galleryPhoto:
            uploadedFiles[`standardImpacts[${index}].galleryPhoto`] || [],
        })),
        highlightedImpacts: data.highlightedImpacts.map((impact, index) => ({
          message1: impact.message1 || null,
          title2: impact.title2 || null,
          impactTags2: impact.impactTags2 || null,
          date2: impact.date2 || null,
          message2: impact.message2 || null,
          writersName2: impact.writersName2 || null,
          contentDescription2: impact.contentDescription2 || null,
          writerPhoto2:
            uploadedFiles[`highlightedImpacts[${index}].writerPhoto2`] || null,
          coverPhoto:
            uploadedFiles[`highlightedImpacts[${index}].coverPhoto`] || null,
          galleryPhoto2:
            uploadedFiles[`highlightedImpacts[${index}].galleryPhoto2`] || [],
        })),
        projectName: data.projectName,
      };

      console.log("Sending data to API:", formDataToSend);

      const apiUrl = isEditMode ? `/api/impact/${editingImpactId}` : "/api/impact";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setSubmitMessage(isEditMode ? "Impact updated successfully" : "Impact created successfully");
        toast.success(isEditMode ? "Impact updated successfully" : "Impact created successfully");
        
        // If user came from simple list and this was an edit, redirect back
        if (isEditMode && cameFromSimpleList) {
          setTimeout(() => {
            window.location.href = "/admin/impacts?success=updated";
          }, 1500); // Give time for toast to show
        } else {
          reset();
          setIsEditMode(false);
          setEditingImpactId(null);
          setRefreshTrigger(prev => prev + 1); // Trigger table refresh
        }
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        setSubmitStatus("error");
        setSubmitMessage(errorData.message || "Error submitting form");
        toast.error(errorData.message || "Error creating impact");
      }
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage("Error submitting form");
      toast.error("Error creating impact");
    }
  };

  const clearForm = () => {
    reset();
    setSubmitMessage("");
    setSubmitStatus(null);
    setIsEditMode(false);
    setEditingImpactId(null);
    setCameFromSimpleList(false);
  };

  const handleEditImpact = (impact: ImpactFromAPI) => {
    setIsEditMode(true);
    setEditingImpactId(impact.id);
    
    // Convert API data to form format
    const standardImpacts = impact.standardImpacts.map(standard => ({
      id: standard.id,
      title: standard.title,
      impactTags: standard.impactTags,
      writersName: standard.writersName,
      date: standard.date.split('T')[0], // Convert to YYYY-MM-DD format
      contentDescription: standard.contentDescription,
      writerPhoto: null, // We'll keep files as null since we can't reconstruct File objects
      galleryPhoto: [],
    }));

    const highlightedImpacts = impact.highlightedImpacts.map(highlighted => ({
      id: highlighted.id,
      message1: highlighted.message1 || "",
      title2: highlighted.title2 || "",
      impactTags2: highlighted.impactTags2 || "",
      date2: highlighted.date2 ? highlighted.date2.split('T')[0] : "",
      message2: highlighted.message2 || "",
      writersName2: highlighted.writersName2 || "",
      contentDescription2: highlighted.contentDescription2 || "",
      writerPhoto2: null,
      coverPhoto: null,
      galleryPhoto2: [],
    }));

    // Populate form with impact data
    reset({
      standardImpacts: standardImpacts.length > 0 ? standardImpacts : [{
        id: uuidv4(),
        title: "",
        impactTags: "",
        writersName: "",
        date: "",
        contentDescription: "",
        writerPhoto: null,
        galleryPhoto: [],
      }],
      highlightedImpacts: highlightedImpacts.length > 0 ? highlightedImpacts : [{
        id: uuidv4(),
        message1: "",
        title2: "",
        impactTags2: "",
        date2: "",
        message2: "",
        writersName2: "",
        contentDescription2: "",
        writerPhoto2: null,
        coverPhoto: null,
        galleryPhoto2: [],
      }],
      projectName: impact.projectName,
    });

    setSubmitMessage("");
    setSubmitStatus(null);
  };

  // Check for edit parameter and load data from sessionStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const editId = urlParams.get('edit');
      
      if (editId) {
        const storedData = sessionStorage.getItem('editImpactData');
        if (storedData) {
          try {
            const impactData = JSON.parse(storedData) as ImpactFromAPI;
            handleEditImpact(impactData);
            setCameFromSimpleList(true); // Mark that user came from simple list
            // Clear the stored data after use
            sessionStorage.removeItem('editImpactData');
            // Clean URL
            window.history.replaceState({}, '', window.location.pathname);
          } catch (error) {
            console.error('Error parsing stored impact data:', error);
          }
        }
      }
    }
  }, []);

  return (
    <div className="flex mt-4 max-w-screen-2xl mx-auto">
      <main className="mx-auto">
        <div className="xl:px-20 mx-auto">
          <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-12 text-center md:text-left">
            Impact Management
          </h2>
          
          {/* Existing Impacts Table */}
          <div className="mb-12">
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Existing Impact Stories</h3>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Filter by Project:</label>
                <ProjectSelector
                  value={projectFilter}
                  onChange={setProjectFilter}
                  placeholder="All projects"
                  className="min-w-[200px]"
                />
                {projectFilter && (
                  <button
                    onClick={() => setProjectFilter("")}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Clear filter
                  </button>
                )}
              </div>
            </div>
            <ImpactTable 
              refreshTrigger={refreshTrigger} 
              projectFilter={projectFilter || undefined}
              onEditImpact={handleEditImpact}
            />
          </div>

          <h3 className="text-lg md:text-2xl font-bold text-sky-800 mb-8 text-center md:text-left">
            {isEditMode ? "Edit Impact" : "Create New Impact for a Project"}
          </h3>
          
          {isEditMode && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800 text-sm">
                <strong>Editing Mode:</strong> You are currently editing an existing impact. 
                <button
                  type="button"
                  onClick={clearForm}
                  className="ml-2 text-blue-600 underline hover:text-blue-800"
                >
                  Cancel and create new
                </button>
                {cameFromSimpleList && (
                  <button
                    type="button"
                    onClick={() => window.location.href = "/admin/impacts"}
                    className="ml-2 text-blue-600 underline hover:text-blue-800"
                  >
                    Back to impacts list
                  </button>
                )}
              </p>
            </div>
          )}
          
          <form id="impact-form" className="mt-8 space-y-8" onSubmit={handleSubmit(onSubmit)}>
            {standardImpactFields.map((impact, index) => (
              <section
                key={impact.id}
                className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-sky-800 text-center md:text-left">
                    Standard Impact {index + 1}
                  </h2>
                  {standardImpactFields.length > 1 && (
                    <FaTrash
                      className="text-red-500 hover:text-red-600 cursor-pointer size-4"
                      onClick={() => removeStandardImpact(index)}
                    />
                  )}
                </div>

                <div className="md:grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-5 col-span-2">
                    <div className="md:col-span-2">
                      <label className="block text-sm/6 font-medium text-gray-900">
                        Title
                      </label>
                      <div className="mt-2">
                        <Controller
                          name={`standardImpacts.${index}.title`}
                          control={control}
                          rules={{
                            required: "Title is required",
                          }}
                          render={({ field }) => (
                            <input
                              type="text"
                              placeholder="write something here..."
                              className={cn(
                                "block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2",
                                errors.standardImpacts?.[index]?.title &&
                                  "border-red-500"
                              )}
                              {...field}
                            />
                          )}
                        />
                        {errors?.standardImpacts?.[index]?.title && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors?.standardImpacts[index]?.title?.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-sm/6 font-medium text-gray-900">
                        Impact Tags
                      </label>
                      <div className="mt-2">
                        <Controller
                          name={`standardImpacts.${index}.impactTags`}
                          control={control}
                          rules={{
                            required: "Impact tags are required",
                          }}
                          render={({ field }) => (
                            <input
                              type="text"
                              placeholder="tags help categorize posts within each project."
                              className={cn(
                                "block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2",
                                errors.standardImpacts?.[index]?.impactTags &&
                                  "border-red-500"
                              )}
                              {...field}
                            />
                          )}
                        />
                        {errors.standardImpacts?.[index]?.impactTags && (
                          <p className="text-red-500 text-xs mt-1">
                            {
                              errors?.standardImpacts[index]?.impactTags
                                ?.message
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-5 col-span-2">
                    <div className="md:col-span-2 mt-4 md:mt-0">
                      <label className="block text-sm/6 font-medium text-gray-900">
                        Writer's Name
                      </label>
                      <div className="mt-2">
                        <Controller
                          name={`standardImpacts.${index}.writersName`}
                          control={control}
                          rules={{
                            required: "Writer's name is required",
                          }}
                          render={({ field }) => (
                            <input
                              type="text"
                              placeholder="write something here..."
                              className={cn(
                                "block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2",
                                errors?.standardImpacts?.[index]?.writersName &&
                                  "border-red-500"
                              )}
                              {...field}
                            />
                          )}
                        />
                        {errors.standardImpacts?.[index]?.writersName && (
                          <p className="text-red-500 text-xs mt-1">
                            {
                              errors?.standardImpacts[index]?.writersName
                                ?.message
                            }
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-sm/6 font-medium text-gray-900">
                        Enter a Date
                      </label>
                      <div className="mt-2">
                        <Controller
                          name={`standardImpacts.${index}.date`}
                          control={control}
                          rules={{ required: "Date is required" }}
                          render={({ field }) => (
                            <input
                              type="date"
                              className={cn(
                                "block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2",
                                errors.standardImpacts?.[index]?.date &&
                                  "border-red-500"
                              )}
                              {...field}
                            />
                          )}
                        />
                        {errors.standardImpacts?.[index]?.date && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors?.standardImpacts[index]?.date?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm/6 font-medium text-gray-900 mt-4 md:mt-0">
                      Full Content Description
                    </label>
                    <div className="mt-2">
                      <Controller
                        name={`standardImpacts.${index}.contentDescription`}
                        control={control}
                        rules={{
                          required: "Content description is required",
                        }}
                        render={({ field }) => (
                          <textarea
                            placeholder="write something here..."
                            className={cn(
                              "block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2",
                              errors.standardImpacts?.[index]
                                ?.contentDescription && "border-red-500"
                            )}
                            rows={4}
                            {...field}
                          />
                        )}
                      />
                      {errors.standardImpacts?.[index]?.contentDescription && (
                        <p className="text-red-500 text-xs mt-1">
                          {
                            errors?.standardImpacts[index]?.contentDescription
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 col-span-2">
                    <div className="col-span-1">
                      <label className="block text-sm/6 font-medium text-gray-900 mt-4 md:mt-0">
                        Writer's Photo
                      </label>
                      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="relative text-center">
                          <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                            <Controller
                              name={`standardImpacts.${index}.writerPhoto`}
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                                  {value ? (
                                    <div className="relative">
                                      <img
                                        src={URL.createObjectURL(value)}
                                        alt="Writer Photo Preview"
                                        className="mx-auto size-16 object-cover"
                                      />
                                      <IoMdClose
                                        className="absolute top-0 right-0 cursor-pointer"
                                        onClick={() => onChange(null)}
                                      />
                                    </div>
                                  ) : (
                                    <svg
                                      className="mx-auto size-12 text-gray-300"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      aria-hidden="true"
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
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        if (file.size > 10 * 1024 * 1024) {
                                          toast.error(
                                            "File size exceeds 10 MB limit."
                                          );
                                          return;
                                        }
                                        onChange(file);
                                      }
                                    }}
                                    className="sr-only"
                                  />
                                </label>
                              )}
                            />
                            <div>
                              <p className="font-semibold text-blue-500">
                                Drag & Drop your Photo
                              </p>
                              <p className="text-gray-500">
                                here or Browse up to 10 MB
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm/6 font-medium text-gray-900">
                        Gallery Photos
                      </label>
                      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="relative text-center">
                          <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                            <Controller
                              name={`standardImpacts.${index}.galleryPhoto`}
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <div className="flex flex-wrap gap-2">
                                    {value && value.length > 0 ? (
                                      value.map((file, fileIndex) => (
                                        <div
                                          key={fileIndex}
                                          className="relative"
                                        >
                                          <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Gallery Photo ${
                                              fileIndex + 1
                                            }`}
                                            className="size-16 object-cover"
                                          />
                                          <IoMdClose
                                            className="absolute top-0 right-0 cursor-pointer"
                                            onClick={() => {
                                              const newFiles = value.filter(
                                                (_, i) => i !== fileIndex
                                              );
                                              onChange(newFiles);
                                            }}
                                          />
                                        </div>
                                      ))
                                    ) : (
                                      <svg
                                        className="mx-auto size-12 text-gray-300"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        aria-hidden="true"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                  <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 hover:text-primary-100">
                                    <span className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer">
                                      Upload photos
                                    </span>
                                    <input
                                      className="sr-only"
                                      type="file"
                                      accept=".jpg,.jpeg,.png"
                                      multiple
                                      onChange={(e) => {
                                        const files = Array.from(
                                          e.target.files || []
                                        );
                                        if (files.length > 0) {
                                          const validFiles = files.filter(
                                            (file) =>
                                              file.size <= 10 * 1024 * 1024
                                          );
                                          if (
                                            validFiles.length < files.length
                                          ) {
                                            toast.error(
                                              "Some files exceed 10 MB limit."
                                            );
                                          }
                                          onChange([
                                            ...(value || []),
                                            ...validFiles,
                                          ]);
                                        }
                                      }}
                                    />
                                  </label>
                                  <div>
                                    <p className="font-semibold text-blue-500">
                                      Drag & Drop your Photos
                                    </p>
                                    <p className="text-gray-500">
                                      here or Browse up to 10 MB each
                                    </p>
                                  </div>
                                </>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ))}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  appendStandardImpact({
                    id: uuidv4(),
                    title: "",
                    impactTags: "",
                    writersName: "",
                    date: "",
                    contentDescription: "",
                    writerPhoto: null,
                    galleryPhoto: [],
                  })
                }
                className="text-blue-600 hover:text-blue-700 flex items-center gap-2 -mt-4"
              >
                <FaSquarePlus className="size-5" />
                Add Standard Impact
              </button>
            </div>

            {highlightedImpactFields.map((impact, index) => (
              <section
                key={impact.id}
                className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white"
              >
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-xl font-semibold">
                    Highlighted Impact {index + 1}
                  </h2>
                  {highlightedImpactFields.length > 1 && (
                    <FaTrash
                      className="text-red-500 hover:text-red-600 cursor-pointer size-4"
                      onClick={() => removeHighlightedImpact(index)}
                    />
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 col-span-2">
                    <div className="col-span-1">
                      <label className="block text-sm/6 font-medium text-gray-900">
                        1st Description
                      </label>
                      <div className="mt-2">
                        <Controller
                          name={`highlightedImpacts.${index}.message1`}
                          control={control}
                          render={({ field }) => (
                            <textarea
                              placeholder="write something here..."
                              className={cn(
                                "block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2",
                                errors.highlightedImpacts?.[index]?.message1 &&
                                  "border-red-500"
                              )}
                              rows={4}
                              {...field}
                            />
                          )}
                        />
                        {errors.highlightedImpacts?.[index]?.message1 && (
                          <p className="text-red-500 text-xs mt-1">
                            {
                              errors?.highlightedImpacts[index]?.message1
                                ?.message
                            }
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm/6 font-medium text-gray-900">
                        Title
                      </label>
                      <div className="mt-2">
                        <Controller
                          name={`highlightedImpacts.${index}.title2`}
                          control={control}
                          render={({ field }) => (
                            <input
                              type="text"
                              placeholder="write something here..."
                              className={cn(
                                "block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2",
                                errors.highlightedImpacts?.[index]?.title2 &&
                                  "border-red-500"
                              )}
                              {...field}
                            />
                          )}
                        />
                        {errors.highlightedImpacts?.[index]?.title2 && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors?.highlightedImpacts[index]?.title2?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-5 col-span-2">
                    <div className="col-span-2">
                      <label className="block text-sm/6 font-medium text-gray-900">
                        Impact Tags
                      </label>
                      <div className="mt-2">
                        <Controller
                          name={`highlightedImpacts.${index}.impactTags2`}
                          control={control}
                          render={({ field }) => (
                            <input
                              type="text"
                              placeholder="Tags help categorize posts within each project."
                              className={cn(
                                "block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2",
                                errors.highlightedImpacts?.[index]
                                  ?.impactTags2 && "border-red-500"
                              )}
                              {...field}
                            />
                          )}
                        />
                        {errors.highlightedImpacts?.[index]?.impactTags2 && (
                          <p className="text-red-500 text-xs mt-1">
                            {
                              errors?.highlightedImpacts[index]?.impactTags2
                                ?.message
                            }
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="col-span-3">
                      <label className="block text-sm/6 font-medium text-gray-900">
                        Enter a Date
                      </label>
                      <div className="mt-2">
                        <Controller
                          name={`highlightedImpacts.${index}.date2`}
                          control={control}
                          render={({ field }) => (
                            <input
                              type="date"
                              className={cn(
                                "block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2",
                                errors.highlightedImpacts?.[index]?.date2 &&
                                  "border-red-500"
                              )}
                              {...field}
                            />
                          )}
                        />
                        {errors.highlightedImpacts?.[index]?.date2 && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors?.highlightedImpacts[index]?.date2?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      2nd Description
                    </label>
                    <div className="mt-2">
                      <Controller
                        name={`highlightedImpacts.${index}.message2`}
                        control={control}
                        render={({ field }) => (
                          <textarea
                            placeholder="write something here..."
                            className={cn(
                              "block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2",
                              errors.highlightedImpacts?.[index]?.message2 &&
                                "border-red-500"
                            )}
                            rows={4}
                            {...field}
                          />
                        )}
                      />
                      {errors.highlightedImpacts?.[index]?.message2 && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors?.highlightedImpacts[index]?.message2?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Writer Name
                    </label>
                    <div className="mt-2">
                      <Controller
                        name={`highlightedImpacts.${index}.writersName2`}
                        control={control}
                        render={({ field }) => (
                          <input
                            type="text"
                            placeholder="write something here..."
                            className={cn(
                              "block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2",
                              errors?.highlightedImpacts?.[index]
                                ?.writersName2 && "border-red-500"
                            )}
                            {...field}
                          />
                        )}
                      />
                      {errors.highlightedImpacts?.[index]?.writersName2 && (
                        <p className="text-red-500 text-xs mt-1">
                          {
                            errors?.highlightedImpacts[index]?.writersName2
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 col-span-2">
                    <div className="col-span-1">
                      <label className="block text-sm/6 font-medium text-gray-900">
                        Writer Photo
                      </label>
                      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="relative text-center">
                          <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                            <Controller
                              name={`highlightedImpacts.${index}.writerPhoto2`}
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                                  {value ? (
                                    <div className="relative">
                                      <img
                                        src={URL.createObjectURL(value)}
                                        alt="Writer Photo 2 Preview"
                                        className="mx-auto size-16 object-cover"
                                      />
                                      <IoMdClose
                                        className="absolute top-0 right-0 cursor-pointer"
                                        onClick={() => onChange(null)}
                                      />
                                    </div>
                                  ) : (
                                    <svg
                                      className="mx-auto size-12 text-gray-300"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      aria-hidden="true"
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
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        if (file.size > 10 * 1024 * 1024) {
                                          toast.error(
                                            "File size exceeds 10 MB limit."
                                          );
                                          return;
                                        }
                                        onChange(file);
                                      }
                                    }}
                                    className="sr-only"
                                  />
                                </label>
                              )}
                            />
                            <div>
                              <p className="font-semibold text-blue-500">
                                Drag & Drop your Photo
                              </p>
                              <p className="text-gray-500">
                                here or Browse up to 10 MB
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <label className="block text-sm/6 font-medium text-gray-900">
                        Cover Photo
                      </label>
                      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="relative text-center">
                          <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                            <Controller
                              name={`highlightedImpacts.${index}.coverPhoto`}
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                                  {value ? (
                                    <div className="relative">
                                      <img
                                        src={URL.createObjectURL(value)}
                                        alt="Cover Photo Preview"
                                        className="mx-auto size-16 object-cover"
                                      />
                                      <IoMdClose
                                        className="absolute top-0 right-0 cursor-pointer"
                                        onClick={() => onChange(null)}
                                      />
                                    </div>
                                  ) : (
                                    <svg
                                      className="mx-auto size-12 text-gray-300"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      aria-hidden="true"
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
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        if (file.size > 10 * 1024 * 1024) {
                                          toast.error(
                                            "File size exceeds 10 MB limit."
                                          );
                                          return;
                                        }
                                        onChange(file);
                                      }
                                    }}
                                    className="sr-only"
                                  />
                                </label>
                              )}
                            />
                            <div>
                              <p className="font-semibold text-blue-500">
                                Drag & Drop your Photo
                              </p>
                              <p className="text-gray-500">
                                here or Browse up to 10 MB
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-1">
                      <label className="block text-sm/6 font-medium text-gray-900">
                        Gallery Photos
                      </label>
                      <span className="text-xs text-gray-600 italic">
                        Upload additional photos that will be shown inside the
                        full post view when this impact story is opened.
                      </span>
                      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="relative text-center">
                          <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                            <Controller
                              name={`highlightedImpacts.${index}.galleryPhoto2`}
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <div className="flex flex-wrap gap-2">
                                    {value && value.length > 0 ? (
                                      value.map((file, fileIndex) => (
                                        <div
                                          key={fileIndex}
                                          className="relative"
                                        >
                                          <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Gallery Photo 2 ${
                                              fileIndex + 1
                                            }`}
                                            className="size-16 object-cover"
                                          />
                                          <IoMdClose
                                            className="absolute top-0 right-0 cursor-pointer"
                                            onClick={() => {
                                              const newFiles = value.filter(
                                                (_, i) => i !== fileIndex
                                              );
                                              onChange(newFiles);
                                            }}
                                          />
                                        </div>
                                      ))
                                    ) : (
                                      <svg
                                        className="mx-auto size-12 text-gray-300"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        aria-hidden="true"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                  <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 hover:text-primary-100">
                                    <span className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 cursor-pointer">
                                      Upload photos
                                    </span>
                                    <input
                                      className="sr-only"
                                      type="file"
                                      accept=".jpg,.jpeg,.png"
                                      multiple
                                      onChange={(e) => {
                                        const files = Array.from(
                                          e.target.files || []
                                        );
                                        if (files.length > 0) {
                                          const validFiles = files.filter(
                                            (file) =>
                                              file.size <= 10 * 1024 * 1024
                                          );
                                          if (
                                            validFiles.length < files.length
                                          ) {
                                            toast.error(
                                              "Some files exceed 10 MB limit."
                                            );
                                          }
                                          onChange([
                                            ...(value || []),
                                            ...validFiles,
                                          ]);
                                        }
                                      }}
                                    />
                                  </label>
                                  <div>
                                    <p className="font-semibold text-blue-500">
                                      Drag & Drop your Photos
                                    </p>
                                    <p className="text-gray-500">
                                      here or Browse up to 10 MB each
                                    </p>
                                  </div>
                                </>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Full Content Description
                    </label>
                    <div className="mt-2">
                      <Controller
                        name={`highlightedImpacts.${index}.contentDescription2`}
                        control={control}
                        render={({ field }) => (
                          <textarea
                            placeholder="write something here..."
                            className={cn(
                              "block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2",
                              errors?.highlightedImpacts?.[index]
                                ?.contentDescription2 && "border-red-500"
                            )}
                            rows={4}
                            {...field}
                          />
                        )}
                      />
                      {errors.highlightedImpacts?.[index]
                        ?.contentDescription2 && (
                        <p className="text-red-500 text-xs mt-1">
                          {
                            errors?.highlightedImpacts[index]
                              ?.contentDescription2?.message
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            ))}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() =>
                  appendHighlightedImpact({
                    id: uuidv4(),
                    message1: "",
                    title2: "",
                    impactTags2: "",
                    date2: "",
                    message2: "",
                    writersName2: "",
                    contentDescription2: "",
                    writerPhoto2: null,
                    coverPhoto: null,
                    galleryPhoto2: [],
                  })
                }
                className="text-blue-600 hover:text-blue-700 flex items-center -mt-4 gap-2"
              >
                <FaSquarePlus className="size-5" />
                Add Highlighted Impact
              </button>
            </div>

            <div className="col-span-2">
              <label className="block text-sm/6 font-medium text-gray-900 mb-2">
                Add this impact to...
              </label>
              <div className="mt-2">
                <Controller
                  name="projectName"
                  control={control}
                  rules={{
                    required: "Project selection is required",
                  }}
                  render={({ field: { value, onChange } }) => (
                    <ProjectSelector
                      value={value}
                      onChange={onChange}
                      placeholder="Search and select a project..."
                      error={!!errors.projectName}
                    />
                  )}
                />
                {errors.projectName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors?.projectName?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-between mb-10">
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "bg-primary-100 hover:opacity-90 text-white px-4 md:px-10 py-1 md:py-3 rounded-md disabled:opacity-50",
                  isSubmitting && "cursor-not-allowed opacity-50"
                )}
              >
                {isSubmitting 
                  ? (isEditMode ? "Updating..." : "Creating...") 
                  : (isEditMode ? "Update Impact" : "Create Impact")
                }
              </button>

              <button
                type="button"
                className="text-base md:text-lg md:font-semibold border-b md:border-b-2 border-black hover:text-blue-700 hover:border-blue-700"
                onClick={clearForm}
              >
                Clear Changes
              </button>
            </div>
            {submitMessage && (
              <p
                className={
                  submitStatus === "success" ? "text-green-500" : "text-red-500"
                }
              >
                {submitMessage}
              </p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
