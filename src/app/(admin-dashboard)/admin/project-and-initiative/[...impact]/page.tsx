"use client";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import firebaseApp from "lib/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { FaSquarePlus, FaTrash } from "react-icons/fa6";

interface FormData {
  title: string;
  impactTags: string;
  writersName: string;
  date: string;
  contentDescription: string;
  contentDescription2: string;
  writerPhoto: File | null;
  galleryPhoto: File | null;
  galleryPhoto2: File | null;
  writerPhoto2: File | null;
  coverPhoto: File | null;
  message1: string;
  message2: string;
  title2: string;
  date2: string;
  impactTags2: string;
  writersName2: string;
  addImpact: string;
}

interface FilesState {
  writerPhoto: File | null;
  galleryPhoto: File | null;
  galleryPhoto2: File | null;
  writerPhoto2: File | null;
  coverPhoto: File | null;
}

export default function ApplyContribution() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    impactTags: "",
    writersName: "",
    date: "",
    contentDescription: "",
    contentDescription2: "",
    writerPhoto: null,
    galleryPhoto: null,
    galleryPhoto2: null,
    writerPhoto2: null,
    coverPhoto: null,
    message1: "",
    message2: "",
    title2: "",
    date2: "",
    impactTags2: "",
    writersName2: "",
    addImpact: "",
  });

  const [files, setFiles] = useState<FilesState>({
    writerPhoto: null,
    galleryPhoto: null,
    galleryPhoto2: null,
    writerPhoto2: null,
    coverPhoto: null,
  });

  console.log("Form Data:", formData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FilesState
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) {
      alert("File size exceeds 10 MB limit.");
      return;
    }

    setFiles((prev) => ({
      ...prev,
      [field]: file,
    }));
    setFormData((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const uploadImageUrl = async (file: File, folder: string): Promise<string> => {
    const filename = `${Date.now()}_${file.name}`;
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, `${folder}/${filename}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const uploadedFiles: { [key: string]: string } = {};

      // Upload files and get URLs
      const fileFields: (keyof FilesState)[] = [
        "writerPhoto",
        "galleryPhoto",
        "galleryPhoto2",
        "writerPhoto2",
        "coverPhoto",
      ];

      for (const field of fileFields) {
        if (files[field]) {
          const url = await uploadImageUrl(files[field]!, field);
          uploadedFiles[field] = url;
        }
      }

      // Prepare form data for submission
      const formDataToSend = {
        ...formData,
        ...uploadedFiles,
        writerPhoto: uploadedFiles.writerPhoto || null,
        galleryPhoto: uploadedFiles.galleryPhoto || null,
        galleryPhoto2: uploadedFiles.galleryPhoto2 || null,
        writerPhoto2: uploadedFiles.writerPhoto2 || null,
        coverPhoto: uploadedFiles.coverPhoto || null,
      };

      const response = await fetch("/api/submit-contribute-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setSubmitMessage("Form submitted successfully");
        // Reset form
        setFormData({
          title: "",
          impactTags: "",
          writersName: "",
          date: "",
          contentDescription: "",
          contentDescription2: "",
          writerPhoto: null,
          galleryPhoto: null,
          galleryPhoto2: null,
          writerPhoto2: null,
          coverPhoto: null,
          message1: "",
          message2: "",
          title2: "",
          date2: "",
          impactTags2: "",
          writersName2: "",
          addImpact: "",
        });
        setFiles({
          writerPhoto: null,
          galleryPhoto: null,
          galleryPhoto2: null,
          writerPhoto2: null,
          coverPhoto: null,
        });
      } else {
        setSubmitStatus("error");
        setSubmitMessage("Error submitting form");
      }
    } catch (error) {
      setSubmitStatus("error");
      setSubmitMessage("Error submitting form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setFormData({
      title: "",
      impactTags: "",
      writersName: "",
      date: "",
      contentDescription: "",
      contentDescription2: "",
      writerPhoto: null,
      galleryPhoto: null,
      galleryPhoto2: null,
      writerPhoto2: null,
      coverPhoto: null,
      message1: "",
      message2: "",
      title2: "",
      date2: "",
      impactTags2: "",
      writersName2: "",
      addImpact: "",
    });
    setFiles({
      writerPhoto: null,
      galleryPhoto: null,
      galleryPhoto2: null,
      writerPhoto2: null,
      coverPhoto: null,
    });
  };

  return (
    <div className="flex mt-4 max-w-screen-2xl mx-auto">
      <main className="mx-auto">
        <div className="xl:px-20 mx-auto">
          <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-12 text-center md:text-left">
            Create New Impact for a Project
          </h2>
          <form className="mt-12 space-y-8" onSubmit={handleSubmit}>
            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
              <h2 className="text-xl font-semibold mb-4 text-sky-800 text-center md:text-left">
                Standard Impact
              </h2>

              <div className="md:grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-5 col-span-2">
                  <div className="md:col-span-2">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Title
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="title"
                        placeholder="write something here..."
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        maxLength={50}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Impact Tags
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="impactTags"
                        placeholder="tags help categorize posts within each project."
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.impactTags}
                        onChange={handleInputChange}
                        required
                        maxLength={50}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-5 col-span-2">
                  <div className="md:col-span-2 mt-4 md:mt-0">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Writer's Name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="writersName"
                        placeholder="write something here..."
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.writersName}
                        onChange={handleInputChange}
                        required
                        maxLength={50}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Enter a Date
                    </label>
                    <div className="mt-2">
                      <input
                        type="date"
                        name="date"
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm/6 font-medium text-gray-900 mt-4 md:mt-0">
                    Full Content Description
                  </label>
                  <div className="mt-2">
                    <textarea
                      name="contentDescription"
                      placeholder="write something here..."
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.contentDescription}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      maxLength={1000}
                    />
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
                          <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                            {files.writerPhoto ? (
                              <div className="relative">
                                <img
                                  src={URL.createObjectURL(files.writerPhoto)}
                                  alt="Writer Photo Preview"
                                  className="mx-auto size-16 object-cover"
                                />
                                <IoMdClose
                                  className="absolute top-0 right-0 cursor-pointer"
                                  onClick={() => {
                                    setFiles((prev) => ({ ...prev, writerPhoto: null }));
                                    setFormData((prev) => ({ ...prev, writerPhoto: null }));
                                  }}
                                />
                              </div>
                            ) : (
                              <svg
                                className="mx-auto size-12 text-gray-300"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                                data-slot="icon"
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
                              name="writerPhoto"
                              accept=".jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(e, "writerPhoto")}
                              className="sr-only focus:outline-none active:outline-none bg-transparent"
                            />
                          </label>
                          <div>
                            <p className="font-semibold text-blue-500">
                              Drag & Drop your Photo
                            </p>
                            <p className="text-gray-500">here or Browse up to 10 MB</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Gallery Photo
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="relative text-center">
                        <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                          <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                            {files.galleryPhoto ? (
                              <div className="relative">
                                <img
                                  src={URL.createObjectURL(files.galleryPhoto)}
                                  alt="Gallery Photo Preview"
                                  className="mx-auto size-16 object-cover"
                                />
                                <IoMdClose
                                  className="absolute top-0 right-0 cursor-pointer"
                                  onClick={() => {
                                    setFiles((prev) => ({ ...prev, galleryPhoto: null }));
                                    setFormData((prev) => ({ ...prev, galleryPhoto: null }));
                                  }}
                                />
                              </div>
                            ) : (
                              <svg
                                className="mx-auto size-12 text-gray-300"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                                data-slot="icon"
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
                              name="galleryPhoto"
                              accept=".jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(e, "galleryPhoto")}
                              className="sr-only focus:outline-none active:outline-none bg-transparent"
                            />
                          </label>
                          <div>
                            <p className="font-semibold text-blue-500">
                              Drag & Drop your Photo
                            </p>
                            <p className="text-gray-500">here or Browse up to 10 MB</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-2">
                      <FaSquarePlus className="text-blue-600 cursor-pointer hover:text-blue-700" />
                      <FaTrash
                        className="text-red-500 hover:text-red-600 cursor-pointer size-4"
                        onClick={() => {
                          setFiles((prev) => ({ ...prev, galleryPhoto: null }));
                          setFormData((prev) => ({ ...prev, galleryPhoto: null }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
              <h2 className="text-xl font-semibold mb-10">Highlighted Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 col-span-2">
                  <div className="col-span-1">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      1st Description
                    </label>
                    <div className="mt-2">
                      <textarea
                        name="message1"
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.message1}
                        onChange={handleInputChange}
                        rows={4}
                        maxLength={1000}
                        placeholder="write something here..."
                      />
                    </div>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Title
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="title2"
                        placeholder="write something here..."
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.title2}
                        onChange={handleInputChange}
                        required
                        maxLength={50}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-5 col-span-2">
                  <div className="col-span-2">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Impact Tags
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        placeholder="Tags help categorize posts within each project."
                        name="impactTags2"
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.impactTags2}
                        onChange={handleInputChange}
                        required
                        maxLength={50}
                      />
                    </div>
                  </div>
                  <div className="col-span-3">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Enter a Date
                    </label>
                    <div className="mt-2">
                      <input
                        type="date"
                        name="date2"
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.date2}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    2nd Description
                  </label>
                  <div className="mt-2">
                    <textarea
                      name="message2"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.message2}
                      onChange={handleInputChange}
                      rows={4}
                      maxLength={1000}
                      placeholder="write something here..."
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Writer Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="writersName2"
                      placeholder="write something here..."
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.writersName2}
                      onChange={handleInputChange}
                      required
                      maxLength={50}
                    />
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
                          <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                            {files.writerPhoto2 ? (
                              <div className="relative">
                                <img
                                  src={URL.createObjectURL(files.writerPhoto2)}
                                  alt="Writer Photo 2 Preview"
                                  className="mx-auto size-16 object-cover"
                                />
                                <IoMdClose
                                  className="absolute top-0 right-0 cursor-pointer"
                                  onClick={() => {
                                    setFiles((prev) => ({ ...prev, writerPhoto2: null }));
                                    setFormData((prev) => ({ ...prev, writerPhoto2: null }));
                                  }}
                                />
                              </div>
                            ) : (
                              <svg
                                className="mx-auto size-12 text-gray-300"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                                data-slot="icon"
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
                              name="writerPhoto2"
                              accept=".jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(e, "writerPhoto2")}
                              className="sr-only focus:outline-none active:outline-none bg-transparent"
                            />
                          </label>
                          <div>
                            <p className="font-semibold text-blue-500">
                              Drag & Drop your Photo
                            </p>
                            <p className="text-gray-500">here or Browse up to 10 MB</p>
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
                          <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                            {files.coverPhoto ? (
                              <div className="relative">
                                <img
                                  src={URL.createObjectURL(files.coverPhoto)}
                                  alt="Cover Photo Preview"
                                  className="mx-auto size-16 object-cover"
                                />
                                <IoMdClose
                                  className="absolute top-0 right-0 cursor-pointer"
                                  onClick={() => {
                                    setFiles((prev) => ({ ...prev, coverPhoto: null }));
                                    setFormData((prev) => ({ ...prev, coverPhoto: null }));
                                  }}
                                />
                              </div>
                            ) : (
                              <svg
                                className="mx-auto size-12 text-gray-300"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                                data-slot="icon"
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
                              name="coverPhoto"
                              accept=".jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(e, "coverPhoto")}
                              className="sr-only focus:outline-none active:outline-none bg-transparent"
                            />
                          </label>
                          <div>
                            <p className="font-semibold text-blue-500">
                              Drag & Drop your Photo
                            </p>
                            <p className="text-gray-500">here or Browse up to 10 MB</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Gallery Photo
                    </label>
                    <span className="text-xs text-gray-600 italic">
                      Upload additional photos that will be shown inside the
                      full post view when this impact story is opened.
                    </span>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="relative text-center">
                        <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                          <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                            {files.galleryPhoto2 ? (
                              <div className="relative">
                                <img
                                  src={URL.createObjectURL(files.galleryPhoto2)}
                                  alt="Gallery Photo 2 Preview"
                                  className="mx-auto size-16 object-cover"
                                />
                                <IoMdClose
                                  className="absolute top-0 right-0 cursor-pointer"
                                  onClick={() => {
                                    setFiles((prev) => ({ ...prev, galleryPhoto2: null }));
                                    setFormData((prev) => ({ ...prev, galleryPhoto2: null }));
                                  }}
                                />
                              </div>
                            ) : (
                              <svg
                                className="mx-auto size-12 text-gray-300"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                                data-slot="icon"
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
                              name="galleryPhoto2"
                              accept=".jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(e, "galleryPhoto2")}
                              className="sr-only focus:outline-none active:outline-none bg-transparent"
                            />
                          </label>
                          <div>
                            <p className="font-semibold text-blue-500">
                              Drag & Drop your Photo
                            </p>
                            <p className="text-gray-500">here or Browse up to 10 MB</p>
                          </div>
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
                    <textarea
                      name="contentDescription2"
                      placeholder="write something here..."
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.contentDescription2}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      maxLength={1000}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 col-span-2">
                  <FaSquarePlus className="text-blue-600 cursor-pointer hover:text-blue-700" />
                  <FaTrash
                    className="text-red-500 hover:text-red-600 cursor-pointer size-4"
                    onClick={clearForm}
                  />
                </div>
              </div>
            </section>

            <div className="col-span-2">
              <div className="mt-2">
                <input
                  type="text"
                  name="addImpact"
                  placeholder="Add this impact to..."
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                  value={formData.addImpact}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                />
              </div>
            </div>

            <div className="flex justify-between mb-10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary-100 hover:opacity-90 text-white px-4 md:px-10 py-1 md:py-3 rounded-md disabled:opacity-50"
              >
                Submit
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