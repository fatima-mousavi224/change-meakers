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
import { FaEdit } from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs";
import Link from "next/link";
import Image from "next/image";

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
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

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
        <div className="mx-auto">
          <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-12 text-center md:text-left">
            Create New Project
          </h2>
          <form
            className="mt-12 space-y-8 md:w-full lg:w-full xl:w-[1000px] 2xl:w-[60vw]"
            onSubmit={handleSubmit}
          >
            {/* card component */}
            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
              <h2 className="text-xl font-semibold mb-4 text-sky-800 text-center md:text-left">
                Card Components
              </h2>

              <div className="md:grid grid-cols-1 md:grid-cols-5 gap-5 col-span-2">
                <div className="md:col-span-4 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Project Title
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="projectTitle"
                      placeholder="write something here..."
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.writersName}
                      onChange={handleInputChange}
                      required
                      maxLength={50}
                    />
                  </div>
                </div>

                <div className="col-span-5">
                  <label className="block text-sm/6 font-medium text-gray-900 mt-4 md:mt-0">
                    Card Description
                  </label>
                  <div className="mt-2">
                    <textarea
                      name="cardDescription"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 col-span-3">
                  <div className="col-span-2">
                    <label className="block text-sm/6 font-medium text-gray-900 mt-4 md:mt-0">
                      Upload Card Image
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="relative text-center">
                        <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                          <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                            {files.writerPhoto ? (
                              <div className="relative">
                                <Image
                                  src={URL.createObjectURL(files.writerPhoto)}
                                  alt="Writer Photo Preview"
                                  className="mx-auto size-16 object-cover"
                                />
                                <IoMdClose
                                  className="absolute top-0 right-0 cursor-pointer"
                                  onClick={() => {
                                    setFiles((prev) => ({
                                      ...prev,
                                      writerPhoto: null,
                                    }));
                                    setFormData((prev) => ({
                                      ...prev,
                                      writerPhoto: null,
                                    }));
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
                              name="cardImage"
                              accept=".jpg,.jpeg,.png"
                              onChange={(e) =>
                                handleFileChange(e, "writerPhoto")
                              }
                              className="sr-only focus:outline-none active:outline-none bg-transparent"
                            />
                          </label>
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
                </div>
              </div>
            </section>

            {/* Hero section */}
            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
              <h2 className="text-xl font-semibold mb-4 text-sky-800">
                1. Hero Section
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 col-span-2">
                  <div className="col-span-2">
                    <label className="block text-sm/6 font-medium ">
                      Upload Hero Image(s)
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="relative text-center">
                        <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                          <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                            {files.galleryPhoto2 ? (
                              <div className="relative">
                                <Image
                                  src={URL.createObjectURL(files.galleryPhoto2)}
                                  alt="Gallery Photo 2 Preview"
                                  className="mx-auto size-16 object-cover"
                                />
                                <IoMdClose
                                  className="absolute top-0 right-0 cursor-pointer"
                                  onClick={() => {
                                    setFiles((prev) => ({
                                      ...prev,
                                      galleryPhoto2: null,
                                    }));
                                    setFormData((prev) => ({
                                      ...prev,
                                      galleryPhoto2: null,
                                    }));
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
                              onChange={(e) =>
                                handleFileChange(e, "galleryPhoto2")
                              }
                              className="sr-only focus:outline-none active:outline-none bg-transparent"
                            />
                          </label>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2 mt-4 md:mt-0">
                  {/* hero title */}
                  <div className="col-span-1 mt-4 md:mt-0">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Hero Title
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="heroTitle"
                        placeholder="write something here..."
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.writersName}
                        onChange={handleInputChange}
                        required
                        maxLength={50}
                      />
                    </div>
                  </div>

                  {/* subheading */}
                  <div className="col-span-1 mt-4 md:mt-0">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Subheading
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="subheading"
                        placeholder="write something here..."
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.writersName}
                        onChange={handleInputChange}
                        required
                        maxLength={50}
                      />
                    </div>
                  </div>

                  {/* subheading line or slogan */}
                  <div className="col-span-1 mt-4 md:mt-0">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Subheading Line or Slogan
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="slogan"
                        placeholder="write something here..."
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.writersName}
                        onChange={handleInputChange}
                        required
                        maxLength={50}
                      />
                    </div>
                  </div>

                  {/* button name */}
                  <div className="col-span-1 mt-4 md:mt-0 relative">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Button Name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="slogan"
                        placeholder="Enter the button's name"
                        className="block w-full border rounded-full border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.writersName}
                        onChange={handleInputChange}
                        required
                        maxLength={50}
                      />
                    </div>
                    <Link
                      href="#"
                      className="absolute top-10 right-2 p-2 bg-gray-100 rounded-full "
                    >
                      <BsArrowRight className="size-5 " />
                    </Link>
                  </div>

                  {/* button link */}
                  <div className="col-span-1 mt-4 md:mt-0">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Button Link
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="buttonLink"
                        placeholder="Enter the URL"
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.writersName}
                        onChange={handleInputChange}
                        required
                        maxLength={50}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* status icon */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow px-3 py-6 col-span-1">
                  <h2 className="text-sky-800 text-xl font-semibold pl-4">
                    2. Status & Icons
                  </h2>
                  <div className="flex flex-col md:flex-row mt-4 md:mt-0 items-center justify-between gap-3 px-4 py-2">
                    <div className="col-span-1 relative">
                      <label
                        htmlFor="icon"
                        className="text-sm text-center xl:text-left xl:text-xl px-4 py-1 xl:py-3 rounded-xl cursor-pointer inline-block shadow-sm shadow-gray-500"
                      >
                        Add Icon +
                        <input type="file" id="icon" className="hidden" />
                      </label>
                    </div>

                    <div className="grid-cols-1 space-y-3">
                      {/* title */}
                      <div className="col-span-1 mt-4 md:mt-0">
                        <label className="block text-sm/6 font-medium text-gray-900">
                          Title
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="iconTitle"
                            placeholder="Enter the URL"
                            className="block w-full md:w-[215px] 2xl:w-[340px] rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                            value={formData.writersName}
                            onChange={handleInputChange}
                            required
                            maxLength={50}
                          />
                        </div>
                      </div>
                      {/* short description */}
                      <div className="col-span-1 mt-4 md:mt-0">
                        <label className="block text-sm/6 font-medium text-gray-900">
                          Short Description
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="shortDescription"
                            placeholder="Enter the URL"
                            className="block w-full md:w-[215px] 2xl:w-[340px] rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                            value={formData.writersName}
                            onChange={handleInputChange}
                            required
                            maxLength={50}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4 col-span-2 mt-3">
                        <FaSquarePlus className="text-blue-600 cursor-pointer hover:text-blue-700" />
                        <FaTrash
                          className="text-red-500 hover:text-red-600 cursor-pointer size-4"
                          onClick={clearForm}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow px-3 py-6 col-span-1">
                  <h2 className="text-sky-800 text-xl font-semibold pl-4">
                    2. Status & Icons
                  </h2>
                  <div className="flex flex-col md:flex-row mt-4 md:mt-0 items-center justify-between gap-3 px-4 py-2">
                    <div className="col-span-1 relative">
                      <label
                        htmlFor="icon"
                        className="text-sm text-center xl:text-left xl:text-xl px-4 py-1 xl:py-3 rounded-xl cursor-pointer inline-block shadow-sm shadow-gray-500"
                      >
                        Add Icon +
                        <input type="file" id="icon" className="hidden" />
                      </label>
                    </div>

                    <div className="grid-cols-1 space-y-3">
                      {/* title */}
                      <div className="col-span-1 mt-4 md:mt-0">
                        <label className="block text-sm/6 font-medium text-gray-900">
                          Title
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="iconTitle2"
                            placeholder="Enter the URL"
                            className="block w-full md:w-[215px] 2xl:w-[340px] rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                            value={formData.writersName}
                            onChange={handleInputChange}
                            required
                            maxLength={50}
                          />
                        </div>
                      </div>
                      {/* short description */}
                      <div className="col-span-1 mt-4 md:mt-0">
                        <label className="block text-sm/6 font-medium text-gray-900">
                          Short Description
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="shortDescription2"
                            placeholder="Enter the URL"
                            className="block w-full md:w-[215px] 2xl:w-[340px] rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                            value={formData.writersName}
                            onChange={handleInputChange}
                            required
                            maxLength={50}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4 col-span-2 mt-3">
                        <FaSquarePlus className="text-blue-600 cursor-pointer hover:text-blue-700" />
                        <FaTrash
                          className="text-red-500 hover:text-red-600 cursor-pointer size-4"
                          onClick={clearForm}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* vission and goal  section */}
            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
              <h3 className="text-sky-800 text-xl font-semibold">
                3. Vission & Goal Section
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6 mt-4">
                {/* vission title */}
                <div className="col-span-1 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Vission Title
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="VissionTitle"
                      placeholder="e.g. ''Our Vission''"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.writersName}
                      onChange={handleInputChange}
                      required
                      maxLength={50}
                    />
                  </div>
                </div>

                {/* vission text */}
                <div className="col-span-1 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Vission Text
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="vissionText"
                      placeholder="write something here..."
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.writersName}
                      onChange={handleInputChange}
                      required
                      maxLength={50}
                    />
                  </div>
                </div>

                {/* Goal title */}
                <div className="col-span-1 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Goal Title
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="goalTitle"
                      placeholder="e.g. ''Our Goal''"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.writersName}
                      onChange={handleInputChange}
                      required
                      maxLength={50}
                    />
                  </div>
                </div>

                {/* Goal text */}
                <div className="col-span-1 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Goal Text
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="goalText"
                      placeholder="write something here..."
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.writersName}
                      onChange={handleInputChange}
                      required
                      maxLength={50}
                    />
                  </div>
                </div>
              </div>

              {/* upload images */}
              <div className="mt-5">
                <label className="block text-sm/6 font-medium ">
                  Upload Image(s),{" "}
                  <span className="text-gray-500 text-sm">
                    Maximum 4 Images
                  </span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                    <div className="relative text-center">
                      <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                        <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                          {files.galleryPhoto2 ? (
                            <div className="relative">
                              <Image
                                src={URL.createObjectURL(files.galleryPhoto2)}
                                alt="Gallery Photo 2 Preview"
                                className="mx-auto size-16 object-cover"
                              />
                              <IoMdClose
                                className="absolute top-0 right-0 cursor-pointer"
                                onClick={() => {
                                  setFiles((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
                                  setFormData((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
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
                            onChange={(e) =>
                              handleFileChange(e, "galleryPhoto2")
                            }
                            className="sr-only focus:outline-none active:outline-none bg-transparent"
                          />
                        </label>
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

                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                    <div className="relative text-center">
                      <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                        <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                          {files.galleryPhoto2 ? (
                            <div className="relative">
                              <Image
                                src={URL.createObjectURL(files.galleryPhoto2)}
                                alt="Gallery Photo 2 Preview"
                                className="mx-auto size-16 object-cover"
                              />
                              <IoMdClose
                                className="absolute top-0 right-0 cursor-pointer"
                                onClick={() => {
                                  setFiles((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
                                  setFormData((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
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
                            onChange={(e) =>
                              handleFileChange(e, "galleryPhoto2")
                            }
                            className="sr-only focus:outline-none active:outline-none bg-transparent"
                          />
                        </label>
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

                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                    <div className="relative text-center">
                      <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                        <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                          {files.galleryPhoto2 ? (
                            <div className="relative">
                              <Image
                                src={URL.createObjectURL(files.galleryPhoto2)}
                                alt="Gallery Photo 2 Preview"
                                className="mx-auto size-16 object-cover"
                              />
                              <IoMdClose
                                className="absolute top-0 right-0 cursor-pointer"
                                onClick={() => {
                                  setFiles((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
                                  setFormData((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
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
                            onChange={(e) =>
                              handleFileChange(e, "galleryPhoto2")
                            }
                            className="sr-only focus:outline-none active:outline-none bg-transparent"
                          />
                        </label>
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

                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                    <div className="relative text-center">
                      <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                        <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                          {files.galleryPhoto2 ? (
                            <div className="relative">
                              <Image
                                src={URL.createObjectURL(files.galleryPhoto2)}
                                alt="Gallery Photo 2 Preview"
                                className="mx-auto size-16 object-cover"
                              />
                              <IoMdClose
                                className="absolute top-0 right-0 cursor-pointer"
                                onClick={() => {
                                  setFiles((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
                                  setFormData((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
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
                            onChange={(e) =>
                              handleFileChange(e, "galleryPhoto2")
                            }
                            className="sr-only focus:outline-none active:outline-none bg-transparent"
                          />
                        </label>
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
              </div>
            </section>

            {/* About program section */}
            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
              <h2 className="text-xl font-semibold mb-4 text-sky-800">
                4. About Program Section
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2 mt-4 md:mt-0">
                  {/* section title */}
                  <div className="col-span-3 mt-4 md:mt-0">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Section Title
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="sectionTitile"
                        placeholder="e.g. ''section title''"
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.writersName}
                        onChange={handleInputChange}
                        required
                        maxLength={50}
                      />
                    </div>
                  </div>

                  {/* body text */}
                  <div className="col-span-3 mt-4 md:mt-0">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Body Text
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="bodyText"
                        placeholder="write something here..."
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.writersName}
                        onChange={handleInputChange}
                        required
                        maxLength={50}
                      />
                    </div>
                  </div>

                  {/* button name2 */}
                  <div className="col-span-1 mt-4 md:mt-0 relative">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Button Name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="slogan2"
                        placeholder="Enter the button's name"
                        className="block w-full border rounded-full border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.writersName}
                        onChange={handleInputChange}
                        required
                        maxLength={50}
                      />
                    </div>
                    <Link
                      href="#"
                      className="absolute top-10 right-2 p-2 bg-gray-100 rounded-full "
                    >
                      <BsArrowRight className="size-5 " />
                    </Link>
                  </div>

                  {/* button link3 */}
                  <div className="col-span-1 mt-4 md:mt-0">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Button Link
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="buttonLink2"
                        placeholder="Enter the URL"
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.writersName}
                        onChange={handleInputChange}
                        required
                        maxLength={50}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Voices from the Classroom */}
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
              <div className="inline-block md:grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2 mt-4 md:mt-0">
                  {/* section title */}
                  <div className="col-span-3 mt-4 md:mt-0">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Section Title
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="sectionTitile2"
                        placeholder="e.g. ''About the Program''"
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.writersName}
                        onChange={handleInputChange}
                        required
                        maxLength={50}
                      />
                    </div>
                  </div>

                  {/* section description */}
                  <div className="col-span-3">
                    <label className="block text-sm/6 font-medium text-gray-900 mt-4 md:mt-0">
                      Section Description
                    </label>
                    <div className="mt-2">
                      <textarea
                        name="sectionDescription"
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

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 col-span-3">
                    {/* first box */}
                    <div className="border border-gray-400 rounded-lg border-dashed px-5 py-4 w-full">
                      <textarea
                        placeholder="write somthing here..."
                        rows={3}
                        className="my-3 w-full border-none focus:ring-0 resize-none"
                      />
                      <div className="flex justify-center md:justify-end mb-6 md:mb-0 space-x-4">
                        <FaSquarePlus className="text-blue-600 cursor-pointer size-4 hover:to-blue-800" />
                        <FaTrash className="text-red-600 cursor-pointer size-4 hover:to-red-800" />
                        <FaEdit className="text-blue-600 cursor-pointer size-4 hover:to-blue-800" />
                      </div>
                      <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 mt-4 space-x-4 items-center">
                        <div className="col-span-1 relative ">
                          <label
                            htmlFor="icon"
                            className="text-3xl size-12 px-4 flex justify-center items-center py-3 rounded-full cursor-pointer shadow-sm shadow-gray-500"
                          >
                            +
                            <input type="file" id="icon" className="hidden" />
                          </label>
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Student Name block"
                            className="placeholder:text-base xl:placeholder:text-lg border-none focus:ring-0 w-full"
                          />
                          <input
                            type="text"
                            placeholder="Short Description block"
                            className=" border-none focus:ring-0 w-full"
                          />
                        </div>
                      </div>
                    </div>
                    {/* second box */}
                    <div className="border border-gray-400 rounded-lg border-dashed px-5 py-4 w-full">
                      <textarea
                        placeholder="write somthing here..."
                        rows={3}
                        className="my-3 w-full border-none focus:ring-0 resize-none"
                      />
                      <div className="flex justify-center md:justify-end mb-6 md:mb-0 space-x-4">
                        <FaSquarePlus className="text-blue-600 cursor-pointer size-4 hover:to-blue-800" />
                        <FaTrash className="text-red-600 cursor-pointer size-4 hover:to-red-800" />
                        <FaEdit className="text-blue-600 cursor-pointer size-4 hover:to-blue-800" />
                      </div>
                      <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 mt-4 space-x-4 items-center">
                        <div className="col-span-1 relative ">
                          <label
                            htmlFor="icon"
                            className="text-3xl size-12 px-4 flex justify-center items-center py-3 rounded-full cursor-pointer shadow-sm shadow-gray-500"
                          >
                            +
                            <input type="file" id="icon" className="hidden" />
                          </label>
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Student Name block"
                            className="placeholder:text-base xl:placeholder:text-lg border-none focus:ring-0 w-full"
                          />
                          <input
                            type="text"
                            placeholder="Short Description block"
                            className=" border-none focus:ring-0 w-full"
                          />
                        </div>
                      </div>
                    </div>
                    {/* third box */}
                    <div className="border border-gray-400 rounded-lg border-dashed px-5 py-4 w-full">
                      <textarea
                        placeholder="write somthing here..."
                        rows={3}
                        className="my-3 w-full border-none focus:ring-0 resize-none"
                      />
                      <div className="flex justify-center md:justify-end mb-6 md:mb-0 space-x-4">
                        <FaSquarePlus className="text-blue-600 cursor-pointer size-4 hover:to-blue-800" />
                        <FaTrash className="text-red-600 cursor-pointer size-4 hover:to-red-800" />
                        <FaEdit className="text-blue-600 cursor-pointer size-4 hover:to-blue-800" />
                      </div>
                      <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 mt-4 space-x-4 items-center">
                        <div className="col-span-1 relative ">
                          <label
                            htmlFor="icon"
                            className="text-3xl size-12 px-4 flex justify-center items-center py-3 rounded-full cursor-pointer shadow-sm shadow-gray-500"
                          >
                            +
                            <input type="file" id="icon" className="hidden" />
                          </label>
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Student Name block"
                            className="placeholder:text-base xl:placeholder:text-lg border-none focus:ring-0 w-full"
                          />
                          <input
                            type="text"
                            placeholder="Short Description block"
                            className=" border-none focus:ring-0 w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Media Block Section */}
            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
              <h2 className="text-xl font-semibold mb-4 text-sky-800">
                6. Media Block Section
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 col-span-2">
                  <div className="col-span-1">
                    <label className="block text-sm/6 font-medium ">
                      Upload Hero Image
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="relative text-center">
                        <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                          <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                            {files.galleryPhoto2 ? (
                              <div className="relative">
                                <Image
                                  src={URL.createObjectURL(files.galleryPhoto2)}
                                  alt="Gallery Photo 2 Preview"
                                  className="mx-auto size-16 object-cover"
                                />
                                <IoMdClose
                                  className="absolute top-0 right-0 cursor-pointer"
                                  onClick={() => {
                                    setFiles((prev) => ({
                                      ...prev,
                                      galleryPhoto2: null,
                                    }));
                                    setFormData((prev) => ({
                                      ...prev,
                                      galleryPhoto2: null,
                                    }));
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
                              onChange={(e) =>
                                handleFileChange(e, "galleryPhoto2")
                              }
                              className="sr-only focus:outline-none active:outline-none bg-transparent"
                            />
                          </label>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:col-span-2 mt-4 md:mt-0">
                  {/* hero title */}
                  <div className="col-span-2 mt-4 md:mt-0">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Hero Title
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="heroTitle2"
                        placeholder="write something here..."
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.writersName}
                        onChange={handleInputChange}
                        required
                        maxLength={50}
                      />
                    </div>
                  </div>

                  {/* short description */}
                  <div className="col-span-2 mt-4 md:mt-0">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Short Description
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="shortDescription3"
                        placeholder="write something here..."
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.writersName}
                        onChange={handleInputChange}
                        required
                        maxLength={50}
                      />
                    </div>
                  </div>

                  {/* video link */}
                  <div className="col-span-2 mt-4 md:mt-0">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Video Link
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="videoLink"
                        placeholder="write something here..."
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.writersName}
                        onChange={handleInputChange}
                        required
                        maxLength={50}
                      />
                    </div>
                  </div>

                  {/* Full Video Description */}
                  <div className="col-span-2 mt-4 md:mt-0">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Full Video Description
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="fullVideoDescription"
                        placeholder="Enter the URL"
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.writersName}
                        onChange={handleInputChange}
                        required
                        maxLength={50}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* What We Offer section */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow px-3 py-6 col-span-1">
                  <h2 className="text-sky-800 text-xl font-semibold pl-4">
                    7. 'What We Offer?' section
                  </h2>
                  <div className="flex flex-col md:flex-row mt-4 md:mt-0 items-center justify-between gap-3 px-4 py-2">
                    <div className="col-span-1 relative">
                      <label
                        htmlFor="icon"
                        className="text-sm text-center xl:text-left xl:text-xl px-4 py-1 xl:py-3 rounded-xl cursor-pointer inline-block shadow-sm shadow-gray-500"
                      >
                        Add Icon +
                        <input type="file" id="icon" className="hidden" />
                      </label>
                    </div>

                    <div className="grid-cols-1 space-y-3">
                      {/* title */}
                      <div className="col-span-1 mt-4 md:mt-0">
                        <label className="block text-sm/6 font-medium text-gray-900">
                          Title
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="iconTitle3"
                            placeholder="Enter the URL"
                            className="block w-full md:w-[215px] 2xl:w-[340px] rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                            value={formData.writersName}
                            onChange={handleInputChange}
                            required
                            maxLength={50}
                          />
                        </div>
                      </div>
                      {/* short description */}
                      <div className="col-span-1 mt-4 md:mt-0">
                        <label className="block text-sm/6 font-medium text-gray-900">
                          Short Description
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="shortDescription4"
                            placeholder="Enter the URL"
                            className="block w-full md:w-[215px] 2xl:w-[340px] rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                            value={formData.writersName}
                            onChange={handleInputChange}
                            required
                            maxLength={50}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4 col-span-2 mt-3">
                        <FaSquarePlus className="text-blue-600 cursor-pointer hover:text-blue-700" />
                        <FaTrash
                          className="text-red-500 hover:text-red-600 cursor-pointer size-4"
                          onClick={clearForm}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow px-3 py-6 col-span-1">
                  <h2 className="text-sky-800 text-xl font-semibold pl-4">
                    'What We Offer?' section
                  </h2>
                  <div className="flex flex-col md:flex-row mt-4 md:mt-0 items-center justify-between gap-3 px-4 py-2">
                    <div className="col-span-1 relative">
                      <label
                        htmlFor="icon"
                        className="text-sm text-center xl:text-left xl:text-xl px-4 py-1 xl:py-3 rounded-xl cursor-pointer inline-block shadow-sm shadow-gray-500"
                      >
                        Add Icon +
                        <input type="file" id="icon" className="hidden" />
                      </label>
                    </div>

                    <div className="grid-cols-1 space-y-3">
                      {/* title */}
                      <div className="col-span-1 mt-4 md:mt-0">
                        <label className="block text-sm/6 font-medium text-gray-900">
                          Title
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="iconTitle4"
                            placeholder="Enter the URL"
                            className="block w-full md:w-[215px] 2xl:w-[340px] rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                            value={formData.writersName}
                            onChange={handleInputChange}
                            required
                            maxLength={50}
                          />
                        </div>
                      </div>
                      {/* short description */}
                      <div className="col-span-1 mt-4 md:mt-0">
                        <label className="block text-sm/6 font-medium text-gray-900">
                          Short Description
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            name="shortDescription5"
                            placeholder="Enter the URL"
                            className="block w-full md:w-[215px] 2xl:w-[340px] rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                            value={formData.writersName}
                            onChange={handleInputChange}
                            required
                            maxLength={50}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4 col-span-2 mt-3">
                        <FaSquarePlus className="text-blue-600 cursor-pointer hover:text-blue-700" />
                        <FaTrash
                          className="text-red-500 hover:text-red-600 cursor-pointer size-4"
                          onClick={clearForm}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Team Section */}
            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
              <h3 className="text-sky-800 text-xl font-semibold">
                8. Team Section
              </h3>
              <p>Label's Name</p>
              <div className="bg-gray-200 w-40 space-x-4 px-2 my-2 py-2 rounded-full flex justify-center items-center">
                <span className="bg-sky-700 h-2 w-2 rounded-full"></span>
                <span className="text-gray-400">e.g., "Team"</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6 mt-4">
                {/* section title */}
                <div className="col-span-1 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Section Title
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="sectionTitle"
                      placeholder="e.g. ''Our Vission''"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.writersName}
                      onChange={handleInputChange}
                      required
                      maxLength={50}
                    />
                  </div>
                </div>

                {/* section description */}
                <div className="col-span-2 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Section Description
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="sectionDescription2"
                      placeholder="write something here..."
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.writersName}
                      onChange={handleInputChange}
                      required
                      maxLength={50}
                    />
                  </div>
                </div>
              </div>

              {/* upload images */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                <div className="border border-gray-300 border-dashed rounded-xl px-4 py-8">
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                    <div className="relative text-center">
                      <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                        <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                          {files.galleryPhoto2 ? (
                            <div className="relative">
                              <Image
                                src={URL.createObjectURL(files.galleryPhoto2)}
                                alt="Gallery Photo 2 Preview"
                                className="mx-auto size-16 object-cover"
                              />
                              <IoMdClose
                                className="absolute top-0 right-0 cursor-pointer"
                                onClick={() => {
                                  setFiles((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
                                  setFormData((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
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
                            onChange={(e) =>
                              handleFileChange(e, "galleryPhoto2")
                            }
                            className="sr-only focus:outline-none active:outline-none bg-transparent"
                          />
                        </label>
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

                  <input
                    type="text"
                    placeholder="Enter Person's Name..."
                    className="border-none focus:ring-0 w-full mt-2 placeholder:text-lg"
                  />
                  <input
                    type="text"
                    placeholder="Enter their role..."
                    className="border-none focus:ring-0 w-full"
                  />
                  <textarea
                    rows={2}
                    className=" border-none focus:ring-0 resize-none w-full placeholder:font-medium"
                    placeholder="Enter a short biography"
                  />
                  <div className="flex justify-end space-x-3 my-4">
                    <div className="relative">
                      <label
                        htmlFor="icon"
                        className="bg-gray-100 text-sm  xl:text-base px-1 xl:px-3 py-2 rounded-xl cursor-pointer border border-gray-400"
                      >
                        Add Link +
                        <input type="file" id="icon" className="hidden" />
                      </label>
                    </div>

                    <div className="relative">
                      <label
                        htmlFor="icon"
                        className="bg-gray-100 text-sm  xl:text-base px-1 xl:px-3 py-2 rounded-xl cursor-pointer border border-gray-400"
                      >
                        upload Icon +
                        <input type="file" id="icon" className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 col-span-2 mt-5">
                    <FaSquarePlus className="text-blue-600 cursor-pointer hover:text-blue-700" />
                    <FaTrash
                      className="text-red-500 hover:text-red-600 cursor-pointer size-4"
                      onClick={clearForm}
                    />
                  </div>
                </div>

                <div className="border border-gray-300 border-dashed rounded-xl px-4 py-8">
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                    <div className="relative text-center">
                      <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                        <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                          {files.galleryPhoto2 ? (
                            <div className="relative">
                              <Image
                                src={URL.createObjectURL(files.galleryPhoto2)}
                                alt="Gallery Photo 2 Preview"
                                className="mx-auto size-16 object-cover"
                              />
                              <IoMdClose
                                className="absolute top-0 right-0 cursor-pointer"
                                onClick={() => {
                                  setFiles((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
                                  setFormData((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
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
                            onChange={(e) =>
                              handleFileChange(e, "galleryPhoto2")
                            }
                            className="sr-only focus:outline-none active:outline-none bg-transparent"
                          />
                        </label>
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

                  <input
                    type="text"
                    placeholder="Enter Person's Name..."
                    className="border-none focus:ring-0 w-full mt-2 placeholder:text-lg"
                  />
                  <input
                    type="text"
                    placeholder="Enter their role..."
                    className="border-none focus:ring-0 w-full"
                  />
                  <textarea
                    rows={2}
                    className=" border-none focus:ring-0 resize-none w-full placeholder:font-medium"
                    placeholder="Enter a short biography"
                  />
                  <div className="flex justify-end space-x-3 my-4">
                    <div className="relative">
                      <label
                        htmlFor="icon"
                        className="bg-gray-100 text-sm  xl:text-base px-1 xl:px-3 py-2 rounded-xl cursor-pointer border border-gray-400"
                      >
                        Add Link +
                        <input type="file" id="icon" className="hidden" />
                      </label>
                    </div>

                    <div className="relative">
                      <label
                        htmlFor="icon"
                        className="bg-gray-100 text-sm  xl:text-base px-1 xl:px-3 py-2 rounded-xl cursor-pointer border border-gray-400"
                      >
                        upload Icon +
                        <input type="file" id="icon" className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 col-span-2 mt-5">
                    <FaSquarePlus className="text-blue-600 cursor-pointer hover:text-blue-700" />
                    <FaTrash
                      className="text-red-500 hover:text-red-600 cursor-pointer size-4"
                      onClick={clearForm}
                    />
                  </div>
                </div>

                <div className="border border-gray-300 border-dashed rounded-xl px-4 py-8">
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                    <div className="relative text-center">
                      <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                        <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                          {files.galleryPhoto2 ? (
                            <div className="relative">
                              <Image
                                src={URL.createObjectURL(files.galleryPhoto2)}
                                alt="Gallery Photo 2 Preview"
                                className="mx-auto size-16 object-cover"
                              />
                              <IoMdClose
                                className="absolute top-0 right-0 cursor-pointer"
                                onClick={() => {
                                  setFiles((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
                                  setFormData((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
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
                            onChange={(e) =>
                              handleFileChange(e, "galleryPhoto2")
                            }
                            className="sr-only focus:outline-none active:outline-none bg-transparent"
                          />
                        </label>
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

                  <input
                    type="text"
                    placeholder="Enter Person's Name..."
                    className="border-none focus:ring-0 w-full mt-2 placeholder:text-lg"
                  />
                  <input
                    type="text"
                    placeholder="Enter their role..."
                    className="border-none focus:ring-0 w-full"
                  />
                  <textarea
                    rows={2}
                    className=" border-none focus:ring-0 resize-none w-full placeholder:font-medium"
                    placeholder="Enter a short biography"
                  />
                  <div className="flex justify-end space-x-3 my-4">
                    <div className="relative">
                      <label
                        htmlFor="icon"
                        className="bg-gray-100 text-sm  xl:text-base px-1 xl:px-3 py-2 rounded-xl cursor-pointer border border-gray-400"
                      >
                        Add Link +
                        <input type="file" id="icon" className="hidden" />
                      </label>
                    </div>

                    <div className="relative">
                      <label
                        htmlFor="icon"
                        className="bg-gray-100 text-sm  xl:text-base px-1 xl:px-3 py-2 rounded-xl cursor-pointer border border-gray-400"
                      >
                        upload Icon +
                        <input type="file" id="icon" className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 col-span-2 mt-5">
                    <FaSquarePlus className="text-blue-600 cursor-pointer hover:text-blue-700" />
                    <FaTrash
                      className="text-red-500 hover:text-red-600 cursor-pointer size-4"
                      onClick={clearForm}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Students Section */}
            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
              <h3 className="text-sky-800 text-xl font-semibold">
                9. Students Section
              </h3>
              <p>Label's Name</p>
              <div className="bg-gray-200 w-40 space-x-4 px-2 my-2 py-2 rounded-full flex justify-center items-center">
                <span className="bg-sky-700 h-2 w-2 rounded-full"></span>
                <span className="text-gray-400">e.g., "Students"</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6 mt-4">
                {/* section title */}
                <div className="col-span-1 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Section Title
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="sectionTitle2"
                      placeholder="e.g. ''Our Vission''"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.writersName}
                      onChange={handleInputChange}
                      required
                      maxLength={50}
                    />
                  </div>
                </div>

                {/* section description */}
                <div className="col-span-2 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Section Description
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="sectionDescription3"
                      placeholder="write something here..."
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.writersName}
                      onChange={handleInputChange}
                      required
                      maxLength={50}
                    />
                  </div>
                </div>
              </div>

              {/* upload images */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                <div className="border border-gray-300 border-dashed rounded-xl px-4 py-8">
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                    <div className="relative text-center">
                      <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                        <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                          {files.galleryPhoto2 ? (
                            <div className="relative">
                              <Image
                                src={URL.createObjectURL(files.galleryPhoto2)}
                                alt="Gallery Photo 2 Preview"
                                className="mx-auto size-16 object-cover"
                              />
                              <IoMdClose
                                className="absolute top-0 right-0 cursor-pointer"
                                onClick={() => {
                                  setFiles((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
                                  setFormData((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
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
                            onChange={(e) =>
                              handleFileChange(e, "galleryPhoto2")
                            }
                            className="sr-only focus:outline-none active:outline-none bg-transparent"
                          />
                        </label>
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

                  <input
                    type="text"
                    placeholder="Enter Person's Name..."
                    className="border-none focus:ring-0 w-full mt-2 placeholder:text-lg"
                  />
                  <input
                    type="text"
                    placeholder="Enter their role..."
                    className="border-none focus:ring-0 w-full"
                  />
                  <textarea
                    rows={2}
                    className=" border-none focus:ring-0 resize-none w-full placeholder:font-medium"
                    placeholder="Enter a short biography"
                  />
                  <div className="flex justify-end space-x-3 my-4">
                    <div className="relative">
                      <label
                        htmlFor="icon"
                        className="bg-gray-100 text-sm  xl:text-base px-1 xl:px-3 py-2 rounded-xl cursor-pointer border border-gray-400"
                      >
                        Add Link +
                        <input type="file" id="icon" className="hidden" />
                      </label>
                    </div>

                    <div className="relative">
                      <label
                        htmlFor="icon"
                        className="bg-gray-100 text-sm  xl:text-base px-1 xl:px-3 py-2 rounded-xl cursor-pointer border border-gray-400"
                      >
                        upload Icon +
                        <input type="file" id="icon" className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 col-span-2 mt-5">
                    <FaSquarePlus className="text-blue-600 cursor-pointer hover:text-blue-700" />
                    <FaTrash
                      className="text-red-500 hover:text-red-600 cursor-pointer size-4"
                      onClick={clearForm}
                    />
                  </div>
                </div>

                <div className="border border-gray-300 border-dashed rounded-xl px-4 py-8">
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                    <div className="relative text-center">
                      <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                        <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                          {files.galleryPhoto2 ? (
                            <div className="relative">
                              <Image
                                src={URL.createObjectURL(files.galleryPhoto2)}
                                alt="Gallery Photo 2 Preview"
                                className="mx-auto size-16 object-cover"
                              />
                              <IoMdClose
                                className="absolute top-0 right-0 cursor-pointer"
                                onClick={() => {
                                  setFiles((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
                                  setFormData((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
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
                            onChange={(e) =>
                              handleFileChange(e, "galleryPhoto2")
                            }
                            className="sr-only focus:outline-none active:outline-none bg-transparent"
                          />
                        </label>
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

                  <input
                    type="text"
                    placeholder="Enter Person's Name..."
                    className="border-none focus:ring-0 w-full mt-2 placeholder:text-lg"
                  />
                  <input
                    type="text"
                    placeholder="Enter their role..."
                    className="border-none focus:ring-0 w-full"
                  />
                  <textarea
                    rows={2}
                    className=" border-none focus:ring-0 resize-none w-full placeholder:font-medium"
                    placeholder="Enter a short biography"
                  />
                  <div className="flex justify-end space-x-3 my-4">
                    <div className="relative">
                      <label
                        htmlFor="icon"
                        className="bg-gray-100 text-sm  xl:text-base px-1 xl:px-3 py-2 rounded-xl cursor-pointer border border-gray-400"
                      >
                        Add Link +
                        <input type="file" id="icon" className="hidden" />
                      </label>
                    </div>

                    <div className="relative">
                      <label
                        htmlFor="icon"
                        className="bg-gray-100 text-sm  xl:text-base px-1 xl:px-3 py-2 rounded-xl cursor-pointer border border-gray-400"
                      >
                        upload Icon +
                        <input type="file" id="icon" className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 col-span-2 mt-5">
                    <FaSquarePlus className="text-blue-600 cursor-pointer hover:text-blue-700" />
                    <FaTrash
                      className="text-red-500 hover:text-red-600 cursor-pointer size-4"
                      onClick={clearForm}
                    />
                  </div>
                </div>

                <div className="border border-gray-300 border-dashed rounded-xl px-4 py-8">
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                    <div className="relative text-center">
                      <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                        <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                          {files.galleryPhoto2 ? (
                            <div className="relative">
                              <Image
                                src={URL.createObjectURL(files.galleryPhoto2)}
                                alt="Gallery Photo 2 Preview"
                                className="mx-auto size-16 object-cover"
                              />
                              <IoMdClose
                                className="absolute top-0 right-0 cursor-pointer"
                                onClick={() => {
                                  setFiles((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
                                  setFormData((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
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
                            onChange={(e) =>
                              handleFileChange(e, "galleryPhoto2")
                            }
                            className="sr-only focus:outline-none active:outline-none bg-transparent"
                          />
                        </label>
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

                  <input
                    type="text"
                    placeholder="Enter Person's Name..."
                    className="border-none focus:ring-0 w-full mt-2 placeholder:text-lg"
                  />
                  <input
                    type="text"
                    placeholder="Enter their role..."
                    className="border-none focus:ring-0 w-full"
                  />
                  <textarea
                    rows={2}
                    className=" border-none focus:ring-0 resize-none w-full placeholder:font-medium"
                    placeholder="Enter a short biography"
                  />
                  <div className="flex justify-end space-x-3 my-4">
                    <div className="relative">
                      <label
                        htmlFor="icon"
                        className="bg-gray-100 text-sm  xl:text-base px-1 xl:px-3 py-2 rounded-xl cursor-pointer border border-gray-400"
                      >
                        Add Link +
                        <input type="file" id="icon" className="hidden" />
                      </label>
                    </div>

                    <div className="relative">
                      <label
                        htmlFor="icon"
                        className="bg-gray-100 text-sm  xl:text-base px-1 xl:px-3 py-2 rounded-xl cursor-pointer border border-gray-400"
                      >
                        upload Icon +
                        <input type="file" id="icon" className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 col-span-2 mt-5">
                    <FaSquarePlus className="text-blue-600 cursor-pointer hover:text-blue-700" />
                    <FaTrash
                      className="text-red-500 hover:text-red-600 cursor-pointer size-4"
                      onClick={clearForm}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Quotation Section */}
            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
              <h3 className="text-sky-800 text-xl font-semibold">
                10. Quotation Section
              </h3>

              {/* Add Quote */}
              <div className="col-span-1 mt-4 ">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Add Quote
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="addQuote"
                    placeholder="e.g. ''Our Vission''"
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                    value={formData.writersName}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                  />
                </div>
              </div>

              {/* Name + Role */}
              <div className="col-span-1 mt-4">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Name + Role
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="nameRole"
                    placeholder="e.g. ''Our Vission''"
                    className="block w-full md:w-1/2 rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                    value={formData.writersName}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                  />
                </div>
              </div>
            </section>

            {/* Photo Album */}
            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
              <h3 className="text-sky-800 text-xl font-semibold">
                11. Photo Album
              </h3>
              <p className="my-2">Label's Name</p>
              <div className="bg-gray-200 px-3 py-2 w-40 space-x-3 flex justify-center items-center rounded-full">
                <span className="w-2 h-2 bg-sky-800 rounded-full"></span>
                <span className="text-gray-400">e.g., "photos"</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6 mt-4">
                {/* Section title */}
                <div className="col-span-1 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Section Title
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="sectionTitle3"
                      placeholder="e.g. ''Our Vission''"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.writersName}
                      onChange={handleInputChange}
                      required
                      maxLength={50}
                    />
                  </div>
                </div>

                {/* Section Description */}
                <div className="col-span-2 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Section Description
                  </label>
                  <div className="mt-2">
                    <textarea
                      name="sectionDescription4"
                      rows={4}
                      placeholder="write something here..."
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.writersName}
                      onChange={handleInputChange}
                      required
                      maxLength={50}
                    />
                  </div>
                </div>
              </div>

              {/* upload images */}
              <div className="mt-5">
                <label className="block text-sm/6 font-medium ">
                  Upload Image(s),{" "}
                  <span className="text-gray-500 text-sm">
                    Maximum 4 Images
                  </span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                    <div className="relative text-center">
                      <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                        <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                          {files.galleryPhoto2 ? (
                            <div className="relative">
                              <Image
                                src={URL.createObjectURL(files.galleryPhoto2)}
                                alt="Gallery Photo 2 Preview"
                                className="mx-auto size-16 object-cover"
                              />
                              <IoMdClose
                                className="absolute top-0 right-0 cursor-pointer"
                                onClick={() => {
                                  setFiles((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
                                  setFormData((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
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
                            onChange={(e) =>
                              handleFileChange(e, "galleryPhoto2")
                            }
                            className="sr-only focus:outline-none active:outline-none bg-transparent"
                          />
                        </label>
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

                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                    <div className="relative text-center">
                      <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                        <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                          {files.galleryPhoto2 ? (
                            <div className="relative">
                              <Image
                                src={URL.createObjectURL(files.galleryPhoto2)}
                                alt="Gallery Photo 2 Preview"
                                className="mx-auto size-16 object-cover"
                              />
                              <IoMdClose
                                className="absolute top-0 right-0 cursor-pointer"
                                onClick={() => {
                                  setFiles((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
                                  setFormData((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
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
                            onChange={(e) =>
                              handleFileChange(e, "galleryPhoto2")
                            }
                            className="sr-only focus:outline-none active:outline-none bg-transparent"
                          />
                        </label>
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

                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                    <div className="relative text-center">
                      <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                        <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                          {files.galleryPhoto2 ? (
                            <div className="relative">
                              <Image
                                src={URL.createObjectURL(files.galleryPhoto2)}
                                alt="Gallery Photo 2 Preview"
                                className="mx-auto size-16 object-cover"
                              />
                              <IoMdClose
                                className="absolute top-0 right-0 cursor-pointer"
                                onClick={() => {
                                  setFiles((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
                                  setFormData((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
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
                            onChange={(e) =>
                              handleFileChange(e, "galleryPhoto2")
                            }
                            className="sr-only focus:outline-none active:outline-none bg-transparent"
                          />
                        </label>
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

                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                    <div className="relative text-center">
                      <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                        <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                          {files.galleryPhoto2 ? (
                            <div className="relative">
                              <Image
                                src={URL.createObjectURL(files.galleryPhoto2)}
                                alt="Gallery Photo 2 Preview"
                                className="mx-auto size-16 object-cover"
                              />
                              <IoMdClose
                                className="absolute top-0 right-0 cursor-pointer"
                                onClick={() => {
                                  setFiles((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
                                  setFormData((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
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
                            onChange={(e) =>
                              handleFileChange(e, "galleryPhoto2")
                            }
                            className="sr-only focus:outline-none active:outline-none bg-transparent"
                          />
                        </label>
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
              </div>
            </section>

            {/* Newsletter/Archive Document */}
            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
              <h3 className="text-sky-800 text-xl font-semibold">
                12. Newsletter/Archive Document
              </h3>
              <p className="my-2">Label's Name</p>
              <div className="bg-gray-200 px-3 py-2 w-48 space-x-3 flex justify-center items-center rounded-full">
                <span className="w-2 h-2 bg-sky-800 rounded-full"></span>
                <span className="text-gray-400">e.g., "Newsletter"</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6 mt-4">
                {/* Section title */}
                <div className="col-span-1 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Section Title
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="sectionTitle4"
                      placeholder="e.g. ''Our Vission''"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.writersName}
                      onChange={handleInputChange}
                      required
                      maxLength={50}
                    />
                  </div>
                </div>

                {/* Section Description */}
                <div className="col-span-2 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Section Description
                  </label>
                  <div className="mt-2">
                    <input
                      name="sectionDescription5"
                      placeholder="write something here..."
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.writersName}
                      onChange={handleInputChange}
                      required
                      maxLength={50}
                    />
                  </div>
                </div>
              </div>

              {/* upload images */}
              <div className="mt-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div className="border border-gray-300 xl:space-x-2 rounded-md border-dashed px-3 py-5 flex flex-col xl:flex-row space-y-4 xl:space-y-0 justify-between">
                    <div>
                      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                        <div className="relative text-center">
                          <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                            <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                              {files.galleryPhoto2 ? (
                                <div className="relative">
                                  <Image
                                    src={URL.createObjectURL(
                                      files.galleryPhoto2
                                    )}
                                    alt="Gallery Photo 2 Preview"
                                    className="mx-auto size-16 object-cover"
                                  />
                                  <IoMdClose
                                    className="absolute top-0 right-0 cursor-pointer"
                                    onClick={() => {
                                      setFiles((prev) => ({
                                        ...prev,
                                        galleryPhoto2: null,
                                      }));
                                      setFormData((prev) => ({
                                        ...prev,
                                        galleryPhoto2: null,
                                      }));
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
                                onChange={(e) =>
                                  handleFileChange(e, "galleryPhoto2")
                                }
                                className="sr-only focus:outline-none active:outline-none bg-transparent"
                              />
                            </label>
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
                      <input
                        type="text"
                        className="w-full border-dashed rounded-lg border border-gray-400 mt-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        placeholder="Enter Downoadable URl"
                      />
                    </div>

                    <div className="space-y-1">
                      <div>
                        <div className="flex justify-between mb-1">
                          <label htmlFor="date" className="text-gray-500 block">
                            Date:
                          </label>
                          <div className="flex justify-center md:justify-end mb-6 md:mb-0 space-x-4">
                            <FaSquarePlus className="text-blue-600 cursor-pointer size-4 hover:to-blue-800" />
                            <FaTrash className="text-red-600 cursor-pointer size-4 hover:to-red-800" />
                            <FaEdit className="text-blue-600 cursor-pointer size-4 hover:to-blue-800" />
                          </div>
                        </div>
                        <input
                          type="text"
                          placeholder="Enter the date"
                          name="date"
                          className="border w-full border-dashed border-gray-400 rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        />
                      </div>
                      <div>
                        <label htmlFor="title" className="text-gray-500 block">
                          Title:
                        </label>
                        <input
                          type="text"
                          placeholder="write somthing here..."
                          className="border w-full border-dashed border-gray-400 rounded-lg text-gray-400 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="description"
                          className="text-gray-500 block"
                        >
                          Short Description:
                        </label>
                        <input
                          type="text"
                          placeholder="write somthing here..."
                          className="border w-full border-dashed border-gray-400 rounded-lg text-gray-400 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-300 xl:space-x-2 rounded-md border-dashed px-3 py-5 flex flex-col xl:flex-row space-y-4 xl:space-y-0 justify-between">
                    <div>
                      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                        <div className="relative text-center">
                          <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                            <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                              {files.galleryPhoto2 ? (
                                <div className="relative">
                                  <Image
                                    src={URL.createObjectURL(
                                      files.galleryPhoto2
                                    )}
                                    alt="Gallery Photo 2 Preview"
                                    className="mx-auto size-16 object-cover"
                                  />
                                  <IoMdClose
                                    className="absolute top-0 right-0 cursor-pointer"
                                    onClick={() => {
                                      setFiles((prev) => ({
                                        ...prev,
                                        galleryPhoto2: null,
                                      }));
                                      setFormData((prev) => ({
                                        ...prev,
                                        galleryPhoto2: null,
                                      }));
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
                                onChange={(e) =>
                                  handleFileChange(e, "galleryPhoto2")
                                }
                                className="sr-only focus:outline-none active:outline-none bg-transparent"
                              />
                            </label>
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
                      <input
                        type="text"
                        className="w-full border-dashed rounded-lg border border-gray-400 mt-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        placeholder="Enter Downoadable URl"
                      />
                    </div>

                    <div className="space-y-1">
                      <div>
                        <div className="flex justify-between mb-1">
                          <label htmlFor="date" className="text-gray-500 block">
                            Date:
                          </label>
                          <div className="flex justify-center md:justify-end mb-6 md:mb-0 space-x-4">
                            <FaSquarePlus className="text-blue-600 cursor-pointer size-4 hover:to-blue-800" />
                            <FaTrash className="text-red-600 cursor-pointer size-4 hover:to-red-800" />
                            <FaEdit className="text-blue-600 cursor-pointer size-4 hover:to-blue-800" />
                          </div>
                        </div>
                        <input
                          type="text"
                          placeholder="Enter the date"
                          name="date"
                          className="border w-full border-gray-400 border-dashed rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        />
                      </div>
                      <div>
                        <label htmlFor="title" className="text-gray-500 block">
                          Title:
                        </label>
                        <input
                          type="text"
                          placeholder="write somthing here..."
                          className="border w-full border-gray-400 border-dashed rounded-lg text-gray-400 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="description"
                          className="text-gray-500 block"
                        >
                          Short Description:
                        </label>
                        <input
                          type="text"
                          placeholder="write somthing here..."
                          className="border w-full border-gray-400 border-dashed rounded-lg text-gray-400 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Live Moments: Follow Us */}
            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white space-y-5 py-10">
              <h3 className="text-sky-800 font-medium text-xl">13. Live Moments: Follow Us</h3>
              <div className="flex flex-col md:flex-row-reverse items-center justify-between">
                <div className="flex justify-center md:justify-end mb-4 md:mb-0 space-x-4">
                  <FaSquarePlus className="text-blue-600 cursor-pointer size-4 hover:to-blue-800" />
                  <FaTrash className="text-red-600 cursor-pointer size-4 hover:to-red-800" />
                  <FaEdit className="text-blue-600 cursor-pointer size-4 hover:to-blue-800" />
                </div>
                <div className="w-full">
                  <label htmlFor="choose lnike or embed code" className="block">
                    Choose link or Embed code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the date"
                    name="date"
                    className="border w-full md:w-1/2 mt-2 border-gray-400 border-dashed rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row-reverse items-center justify-between">
                <div className="flex justify-center md:justify-end mb-4 md:mb-0 space-x-4">
                  <FaSquarePlus className="text-blue-600 cursor-pointer size-4 hover:to-blue-800" />
                  <FaTrash className="text-red-600 cursor-pointer size-4 hover:to-red-800" />
                  <FaEdit className="text-blue-600 cursor-pointer size-4 hover:to-blue-800" />
                </div>
                <div className="w-full">
                  <label htmlFor="choose lnike or embed code" className="block">
                    Choose link or Embed code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the date"
                    name="date"
                    className="border w-full md:w-[90%] mt-2 border-gray-400 border-dashed rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row-reverse items-center justify-between">
                <div className="flex justify-center md:justify-end mb-4 md:mb-0 space-x-4">
                  <FaSquarePlus className="text-blue-600 cursor-pointer size-4 hover:to-blue-800" />
                  <FaTrash className="text-red-600 cursor-pointer size-4 hover:to-red-800" />
                  <FaEdit className="text-blue-600 cursor-pointer size-4 hover:to-blue-800" />
                </div>
                <div className="w-full">
                  <label htmlFor="choose lnike or embed code" className="block">
                    Choose link or Embed code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the date"
                    name="date"
                    className="border w-full md:w-[90%] mt-2 border-gray-400 border-dashed rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                  />
                </div>
              </div>
            </section>

            {/* Global Goals (SDGs) */}
            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
              <h3 className="text-sky-800 text-xl font-semibold">
                14. Global Goals (SDGs)
              </h3>
              <p className="my-2">Label's Name</p>

              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6 mt-4">
                {/* Section title */}
                <div className="col-span-1 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Section Title
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="sectionTitle4"
                      placeholder="e.g. ''Our Vission''"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.writersName}
                      onChange={handleInputChange}
                      required
                      maxLength={50}
                    />
                  </div>
                </div>

                {/* Section Description */}
                <div className="col-span-2 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Section Text
                  </label>
                  <div className="mt-2">
                    <textarea
                      name="sectionText"
                      rows={4}
                      placeholder="write something here..."
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.writersName}
                      onChange={handleInputChange}
                      required
                      maxLength={50}
                    />
                  </div>
                </div>
              </div>

              {/* upload images */}
              <div className="mt-5">
                <label className="block text-sm/6 font-medium ">
                  Add SDGs Icons or Images
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                    <div className="relative text-center">
                      <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                        <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                          {files.galleryPhoto2 ? (
                            <div className="relative">
                              <Image
                                src={URL.createObjectURL(files.galleryPhoto2)}
                                alt="Gallery Photo 2 Preview"
                                className="mx-auto size-16 object-cover"
                              />
                              <IoMdClose
                                className="absolute top-0 right-0 cursor-pointer"
                                onClick={() => {
                                  setFiles((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
                                  setFormData((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
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
                            onChange={(e) =>
                              handleFileChange(e, "galleryPhoto2")
                            }
                            className="sr-only focus:outline-none active:outline-none bg-transparent"
                          />
                        </label>
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

                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                    <div className="relative text-center">
                      <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                        <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                          {files.galleryPhoto2 ? (
                            <div className="relative">
                              <Image
                                src={URL.createObjectURL(files.galleryPhoto2)}
                                alt="Gallery Photo 2 Preview"
                                className="mx-auto size-16 object-cover"
                              />
                              <IoMdClose
                                className="absolute top-0 right-0 cursor-pointer"
                                onClick={() => {
                                  setFiles((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
                                  setFormData((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
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
                            onChange={(e) =>
                              handleFileChange(e, "galleryPhoto2")
                            }
                            className="sr-only focus:outline-none active:outline-none bg-transparent"
                          />
                        </label>
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

                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                    <div className="relative text-center">
                      <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                        <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                          {files.galleryPhoto2 ? (
                            <div className="relative">
                              <Image
                                src={URL.createObjectURL(files.galleryPhoto2)}
                                alt="Gallery Photo 2 Preview"
                                className="mx-auto size-16 object-cover"
                              />
                              <IoMdClose
                                className="absolute top-0 right-0 cursor-pointer"
                                onClick={() => {
                                  setFiles((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
                                  setFormData((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
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
                            onChange={(e) =>
                              handleFileChange(e, "galleryPhoto2")
                            }
                            className="sr-only focus:outline-none active:outline-none bg-transparent"
                          />
                        </label>
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

                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                    <div className="relative text-center">
                      <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                        <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                          {files.galleryPhoto2 ? (
                            <div className="relative">
                              <Image
                                src={URL.createObjectURL(files.galleryPhoto2)}
                                alt="Gallery Photo 2 Preview"
                                className="mx-auto size-16 object-cover"
                              />
                              <IoMdClose
                                className="absolute top-0 right-0 cursor-pointer"
                                onClick={() => {
                                  setFiles((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
                                  setFormData((prev) => ({
                                    ...prev,
                                    galleryPhoto2: null,
                                  }));
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
                            onChange={(e) =>
                              handleFileChange(e, "galleryPhoto2")
                            }
                            className="sr-only focus:outline-none active:outline-none bg-transparent"
                          />
                        </label>
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
              </div>
            </section>

              {/* Rlated Links */}
            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white space-y-5 py-10">
              <h3 className="text-sky-800 font-medium text-xl">15. Rlated Links</h3>
              <div className="flex flex-col md:flex-row-reverse items-center gap-7">
                <div className="flex md:justify-end mb-4 md:mb-0 space-x-4 md:pt-8">
                  <FaSquarePlus className="text-blue-600 cursor-pointer size-4 hover:to-blue-800" />
                  <FaTrash className="text-red-600 cursor-pointer size-4 hover:to-red-800" />
                  <FaEdit className="text-blue-600 cursor-pointer size-4 hover:to-blue-800" />
                </div>

                <div className="w-full">
                  <label htmlFor="choose lnike or embed code" className="block">
                    Button's Link
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the URL"
                    name="buttonsLink1"
                    className="border w-full mt-2 border-gray-400 border-dashed rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="choose lnike or embed code" className="block">
                    Button's Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the button's name"
                    name="buttonsName1"
                    className="border w-full mt-2 border-gray-400 border-dashed rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row-reverse items-center md:gap-4 lg:gap-7">
                <div className="flex md:justify-end mb-4 md:mb-0 space-x-4 md:pt-8">
                  <FaSquarePlus className="text-blue-600 cursor-pointer size-4 hover:to-blue-800" />
                  <FaTrash className="text-red-600 cursor-pointer size-4 hover:to-red-800" />
                  <FaEdit className="text-blue-600 cursor-pointer size-4 hover:to-blue-800" />
                </div>

                <div className="w-full">
                  <label htmlFor="choose lnike or embed code" className="block">
                    Button's Link
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the date"
                    name="buttonsLink2"
                    className="border w-full mt-2 border-gray-400 border-dashed rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="choose lnike or embed code" className="block">
                    Button's Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the date"
                    name="buttonsName2"
                    className="border w-full mt-2 border-gray-400 border-dashed rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                  />
                </div>
              </div>
              <div className="flex flex-col md:flex-row-reverse items-center gap-7">
                <div className="flex md:justify-end mb-4 md:mb-0 space-x-4 md:pt-8">
                  <FaSquarePlus className="text-blue-600 cursor-pointer size-4 hover:to-blue-800" />
                  <FaTrash className="text-red-600 cursor-pointer size-4 hover:to-red-800" />
                  <FaEdit className="text-blue-600 cursor-pointer size-4 hover:to-blue-800" />
                </div>

                <div className="w-full">
                  <label htmlFor="choose lnike or embed code" className="block">
                    Button's Link
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the date"
                    name="buttonsLink3"
                    className="border w-full mt-2 border-gray-400 border-dashed rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="choose lnike or embed code" className="block">
                    Button's Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the date"
                    name="buttonsName3"
                    className="border w-full mt-2 border-gray-400 border-dashed rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                  />
                </div>
              </div>
            </section>

            {/* Final Call to Action / Statement */}
            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
                <h3 className="text-xl font-medium text-sky-800">16. Final Call to Action / Statement</h3>
                 <label htmlFor="choose lnike or embed code" className="block mt-4">
                    Final Big Statement
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the URL"
                    name="finalStatement"
                    className="border w-full mt-2 border-gray-400 border-dashed rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                  />
            </section>

            {/* Navigation Settings */}
            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white space-y-4">
              <h3 className="text-xl font-medium text-sky-800">Navigation Settings</h3>
              <div className="flex space-x-5 items-center">
                <input type="checkbox" className="border border-gray-400 rounded" />
                <div>
                  <span className="block text-gray-700">Show in Main Navigation</span>
                  <span className="block text-sm text-gray-600">Enable this option if you want this program/project to appear in the main site menu.</span>
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <h4 className="text-gray-700">Navigation Label</h4>
                <p className="text-gray-600 text-sm">Only visible if toggle is enabled. This is the name that will appear in the top menu. Leave blank to use the Project Title.</p>
                <input
                    type="text"
                    placeholder="Write somthing..."
                    name="navigationLabel"
                    className="border w-full mt-2 border-gray-400 border-dashed rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                  />
              </div>
            </section>

            {/* submit button */}
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
