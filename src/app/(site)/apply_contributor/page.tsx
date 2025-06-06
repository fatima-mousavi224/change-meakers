"use client";
import Banner from "@/components/common/Banner";
import React, { useState } from "react";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import firebaseApp from "lib/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  date_birth: string;
  gender: string;
  email: string;
  country: string;
  nationality: string;
  employmentStatus: string;
  educationStatus: string;
  educationLevel: string;
  professionalRole: string;
  fieldOfStudy: string;
  motivationMessage?: string;
  interestTeaching: string;
  interestArea: string;
  program: string;
  englishLevel: string;
  message: string;
  referred: string;
  notes: string;
  consent: boolean;
  signatureName: string;
  signatureDate: string;
}

interface Files {
  idPhoto: File | null;
  identityDocs: File[];
  supportingDocs: File[];
}

export default function ApplyContribution() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    date_birth: "",
    gender: "",
    email: "",
    country: "",
    nationality: "",
    educationStatus: "",
    educationLevel: "",
    professionalRole: "",
    program: "",
    fieldOfStudy: "",
    englishLevel: "",
    interestTeaching: "",
    interestArea: "",
    message: "",
    referred: "",
    notes: "",
    employmentStatus: "",
    consent: false,
    signatureName: "",
    signatureDate: "",
  });
  const [files, setFiles] = useState<Files>({
    idPhoto: null,
    identityDocs: [],
    supportingDocs: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const maxSize = 10 * 1024 * 1024; // 10 MB
    for (let file of Array.from(fileList)) {
      if (file.size > maxSize) {
        alert("File size exceeds 10 MB limit.");
        return;
      }
    }

    if (field === "idPhoto") {
      setFiles((prev) => ({ ...prev, idPhoto: fileList[0] }));
    } else if (field === "identityDocs" || field === "supportingDocs") {
      setFiles((prev) => ({
        ...prev,
        [field]: [...prev[field], ...Array.from(fileList)],
      }));
    }
  };

  const uploadImageUrl = async (file: File, folder: string) => {
    const filename = new Date().getTime() + "_" + file.name;
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, `${folder}/${filename}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Error uploading image:", error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => resolve(downloadURL))
            .catch((error) => {
              console.error("Error getting download URL:", error);
              reject(error);
            });
        }
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString());
    });

    const uploadedFiles: { [key: string]: string | string[] } = {};

    try {
      if (files.idPhoto) {
        uploadedFiles.idPhoto = (await uploadImageUrl(
          files.idPhoto,
          "idPhotos"
        )) as string;
      }
      if (files.identityDocs.length > 0) {
        uploadedFiles.identityDocs = (await Promise.all(
          files.identityDocs.map((file) => uploadImageUrl(file, "identityDocs"))
        )) as string[];
      }
      if (files.supportingDocs.length > 0) {
        uploadedFiles.supportingDocs = (await Promise.all(
          files.supportingDocs.map((file) =>
            uploadImageUrl(file, "supportingDocs")
          )
        )) as string[];
      }

      const formDataToSend = {
        ...Object.fromEntries(data),
        idPhotoUrl: uploadedFiles.idPhoto || "",
        identityDocsUrls: uploadedFiles.identityDocs || [],
        supportingDocsUrls: uploadedFiles.supportingDocs || [],
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
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          date_birth: "",
          gender: "",
          email: "",
          country: "",
          nationality: "",
          employmentStatus: "",
          educationStatus: "",
          educationLevel: "",
          professionalRole: "",
          fieldOfStudy: "",
          motivationMessage: "",
          interestTeaching: "",
          interestArea: "",
          program: "",
          englishLevel: "",
          message: "",
          referred: "",
          notes: "",
          consent: false,
          signatureName: "",
          signatureDate: "",
        });
        setFiles({ idPhoto: null, identityDocs: [], supportingDocs: [] });
      } else {
        setSubmitStatus("error");
        setSubmitMessage("Error submitting form");
      }
    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
      setSubmitMessage("Error submitting form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex mt-4 max-w-screen-2xl mx-auto px-4">
      <main>
        <div className="md:px-5">
          <Banner>
            <span className="text-lg md:text-5xl block font-bold">
              Join the Movement:
            </span>
            <span className="text-lg md:text-5xl block font-bold">
              Become a Changemaker
            </span>
          </Banner>
          <div className="px-8 py-6 border-2 rounded-lg mt-12">
            <h1 className="text-2xl font-bold">
              Universal Contributor Application Form
            </h1>
            <p className="pt-3 text-gray-600">
              Whether you’re a volunteer, teacher, technical expert, trainer,
              creative, or someone with a powerful offer, thank you for stepping
              forward. This form helps us match your skills, passions, and
              availability with the right opportunities within our global
              mission. We work in education, empowerment, advocacy, and
              humanitarian support, especially for Afghan students, girls, and
              vulnerable communities.
            </p>
          </div>
        </div>
        <div className="lg:px-40 mx-auto">
          <h2 className="text-lg md:text-2xl font-semibold my-12 max-w-md mx-auto text-center">
            Please fill this form to join our growing network of change-makers.
          </h2>
          <form className="mt-12 space-y-8">
            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-[#F2F2F2]">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <p className="text-sm text-gray-600 mb-6">
                Key personal details for identification and contact:
              </p>
              <div className="md:grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    First Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="firstName"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      maxLength={50}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Last Name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="lastName"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      maxLength={50}
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm/6 font-medium text-gray-900">
                        Phone/WhatsApp Number
                      </label>
                      <div className="mt-2">
                        <input
                          type="tel"
                          name="phone"
                          className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm/6 font-medium text-gray-900">
                        Date of Birth
                      </label>
                      <div className="mt-2">
                        <input
                          type="date"
                          name="date_birth"
                          className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                          value={formData.date_birth}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm/6 font-medium text-gray-900">
                        Gender
                      </label>
                      <div className="mt-2">
                        <select
                          name="gender"
                          className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                          value={formData.gender}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Email Address
                  </label>
                  <div className="mt-2">
                    <input
                      type="email"
                      name="email"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Country of Residence
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="country"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Nationality
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="nationality"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                {/* <div className="col-span-2">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Upload Photo
                  </label>
                  <span className="text-xs text-gray-600 italic">
                    (Professional headshot or passport-style)
                  </span>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="relative text-center">
                      {files.idPhoto &&
                      files.idPhoto.type.startsWith("image/") ? (
                        <div className="relative">
                          <img
                            src={URL.createObjectURL(files.idPhoto)}
                            alt="ID Photo Preview"
                            className="mx-auto size-16 object-cover"
                          />
                          <IoMdClose
                            className="absolute top-0 right-0 cursor-pointer"
                            onClick={() => {
                              files.idPhoto = null;
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
                         accept=".pdf,.docx,.jpg,."
                        onChange={(e) => handleFileChange(e, "idPhoto")}
                        className="sr-only focus:outline-none active:outline-none bg-transparent"
                      />
                      <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                        <p className="font-semibold text-blue-500">
                          Drag & Drop your Photo
                        </p>
                        <p className="text-gray-500">
                          here or Browse up to 10 MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="col-span-2">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Upload Photo
                  </label>
                  <span className="text-xs text-gray-600 italic">
                    (Professional headshot or passport-style)
                  </span>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="relative text-center">
                      <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                        <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                          {files.idPhoto &&
                          files.idPhoto.type.startsWith("image/") ? (
                            <div className="relative">
                              <img
                                src={URL.createObjectURL(files.idPhoto)}
                                alt="ID Photo Preview"
                                className="mx-auto size-16 object-cover"
                              />
                              <IoMdClose
                                className="absolute top-0 right-0"
                                onClick={() => {
                                  files.idPhoto = null;
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
                            accept=".pdf,.docx,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, "idPhoto")}
                            className="sr-only focus:outline-none active:outline-none bg-transparent"
                          />
                        </label>
                        <div>
                          <p className="font-semibold text-blue-500">
                            Drag & Drop your Photo{" "}
                          </p>
                          <p className="text-gray-500">
                            {" "}
                            here or Browse up to 10 MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Upload Documents
                  </label>
                  <span className="text-xs text-gray-600 italic">
                    (Passport, National ID, etc.)
                  </span>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="relative text-center">
                      <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                        <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                          {files.identityDocs &&
                          files.identityDocs.length > 0 ? (
                            <div className="relative">
                              <Image
                                src={"/images/pdf.png"}
                                width={200}
                                height={300}
                                title="PDF Preview"
                                alt="image file"
                                style={{ border: "1px solid #ccc" }}
                              />
                              <IoMdClose
                                className="absolute top-2 right-2"
                                onClick={() => {
                                  // files.supportingDocs = null;
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
                            accept=".pdf,.docx,.jpg,.png,.jpeg"
                            onChange={(e) =>
                              handleFileChange(e, "identityDocs")
                            }
                            multiple
                            className="sr-only focus:outline-none active:outline-none bg-transparent"
                          />
                        </label>
                        <div>
                          <p className="font-semibold text-blue-500">
                            Drag & Drop your Photo{" "}
                          </p>
                          <p className="text-gray-500">
                            {" "}
                            here or Browse up to 10 MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-[#F2F2F2]">
              <h2 className="text-xl font-semibold mb-10">
                Skills & Background
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Current Employment Status
                  </label>
                  <div className="mt-2">
                    <select
                      name="employmentStatus"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.employmentStatus}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Employed">Employed</option>
                      <option value="Freelancer">Freelancer</option>
                      <option value="Unemployed">Unemployed</option>
                      <option value="Student">Student</option>
                      <option value="Retired">Retired</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Highest Level of Education Completed
                  </label>
                  <div className="mt-2">
                    <select
                      name="educationLevel"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.educationLevel}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="High School">High School</option>
                      <option value="Vocational Training">
                        Vocational Training
                      </option>
                      <option value="Bachelor’s Degree">
                        Bachelor’s Degree
                      </option>
                      <option value="Master’s Degree">Master’s Degree</option>
                      <option value="PhD or Doctorate">PhD or Doctorate</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Professional Skills or Roles You Can Offer
                  </label>
                  <div className="mt-2">
                    <select
                      name="professionalRole"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.professionalRole}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Teacher / Trainer">
                        Teacher / Trainer
                      </option>
                      <option value="Curriculum Developer">
                        Curriculum Developer
                      </option>
                      <option value="Editor / Proofreader">
                        Editor / Proofreader
                      </option>
                      <option value="Translator">Translator</option>
                      <option value="Graphic Designer">Graphic Designer</option>
                      <option value="Video Editor / Animator">
                        Video Editor / Animator
                      </option>
                      <option value="Web / App Developer">
                        Web / App Developer
                      </option>
                      <option value="Social Media Manager">
                        Social Media Manager
                      </option>
                      <option value="Mental Health Counselor">
                        Mental Health Counselor
                      </option>
                      <option value="Humanitarian Worker">
                        Humanitarian Worker
                      </option>
                      <option value="Fundraiser">Fundraiser</option>
                      <option value="Project Coordinator">
                        Project Coordinator
                      </option>
                      <option value="Admin Support">Admin Support</option>
                      <option value="Other (Please specify)">
                        Other (Please specify)
                      </option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Languages Spoken & Proficiency
                  </label>
                  <div className="mt-2">
                    <select
                      name="englishLevel"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.englishLevel}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="A1 – Beginner">A1 – Beginner</option>
                      <option value="A2 – Elementary">A2 – Elementary</option>
                      <option value="B1 – Intermediate">
                        B1 – Intermediate
                      </option>
                      <option value="B2 – Upper-Intermediate">
                        B2 – Upper-Intermediate
                      </option>
                      <option value="C1 – Advanced">C1 – Advanced</option>
                      <option value="C2 – Proficient">C2 – Proficient</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Field of Study / Specialization
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="fieldOfStudy"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.fieldOfStudy}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-[#F2F2F2]">
              <h2 className="text-base text-center md:text-left md:text-xl font-semibold mb-10">
                Online Teaching or Training Interest (if applicable)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Are you interested in teaching or leading sessions online
                  </label>
                  <div className="mt-2">
                    <select
                      name="interestTeaching"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.interestTeaching}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="yes">yes</option>
                      <option value="no">no</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    If yes, please select your area(s) of interest
                  </label>
                  <div className="mt-2">
                    <select
                      name="interestArea"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.interestArea}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="English Language">English Language</option>
                      <option value="Science Subjects">Science Subjects</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Flexible / As Needed">
                        Flexible / As Needed
                      </option>
                      <option value="Weekends Only">Weekends Only</option>
                      <option value="One-time Project Collaboration">
                        One-time Project Collaboration
                      </option>
                      <option value="Specific Hours">Specific Hours</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-[#F2F2F2]">
              <h2 className="text-base text-center md:text-left md:text-xl font-semibold mb-10">
                Type of Contribution
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    What type of involvement are you applying for?
                  </label>
                  <div className="mt-2">
                    <select
                      name="educationStatus"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.educationStatus}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Paid Position">Paid Position</option>
                      <option value="Volunteer Position">
                        Volunteer Position
                      </option>
                      <option value="Part-time Support">
                        Part-time Support
                      </option>
                      <option value="Internship">Internship</option>
                      <option value="Mentorship">Mentorship</option>
                      <option value="One-time Project Collaboration">
                        One-time Project Collaboration
                      </option>
                      <option value="Donation of Resources / Equipment">
                        Donation of Resources / Equipment
                      </option>
                      <option value="Offering Educational Content / Materials">
                        Offering Educational Content / Materials
                      </option>
                      <option value="Other">Other</option>
                      <option value="Humanitarian Worker">
                        Humanitarian Worker
                      </option>
                      <option value="Fundraiser">Fundraiser</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Availability
                  </label>
                  <div className="mt-2">
                    <select
                      name="program"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.program}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Volunteer Position">
                        Volunteer Position
                      </option>
                      <option value="Part-time">Part-time</option>
                      <option value="Flexible / As Needed">
                        Flexible / As Needed
                      </option>
                      <option value="Weekends Only">Weekends Only</option>
                      <option value="One-time Project Collaboration">
                        One-time Project Collaboration
                      </option>

                      <option value="Specific Hours">Specific Hours</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-[#F2F2F2]">
              <h2 className="text-lg md:text-xl font-semibold mb-4">
                Motivation & Message
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm/6 fo text-gray-900">
                    Why do you want to join Change Makers of the World (Optional
                    but strongly encouraged)
                  </label>
                  <div className="mt-2">
                    <textarea
                      name="message"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      maxLength={1000}
                      placeholder="Describe your situation or reason for applying"
                    />
                  </div>
                  <div>
                    <label className="block text-sm/6 font-medium text-gray-900 mt-2">
                      How did you hear about us?
                    </label>
                    <div className="mt-2">
                      <select
                        name="referred"
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.referred}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="Social Media">Social Media</option>
                        <option value="Referred by a friend">
                          Referred by a friend
                        </option>
                        <option value="Through a student">
                          Through a student
                        </option>
                        <option value="Attended an event">
                          Attended an event
                        </option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </section>

              <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-[#F2F2F2]">
                    <h2 className="md:text-lg text-xl font-semibold mb-4">
                      Supporting Documents (Optional)
                    </h2>
                    <p className="text-sm text-gray-600 mb-6">
                      <p className="mb-6 text-base">
                        You may upload any of the following:
                      </p>
                      <p className="text-base">• CV/Resume</p>
                      <p className="text-base">• Portfolio or sample work</p>
                      <p className="text-base">• Certificates or degrees</p>
                      <p className="text-base">• Teaching license or credentials</p>
                      <p className="text-base">• Recommendation letters</p>
                      <p className="text-base">
                        • Proposal of support or program idea
                      </p>
                      <p className="text-base">
                        • Any other document that supports your role
                      </p>
                    </p>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-sm/6 font-medium text-gray-900">
                          Upload Documents
                        </label>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                          <div className="relative text-center">
                            <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                              <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                                {files.supportingDocs &&
                                files.supportingDocs.length > 0 ? (
                                  <div className="relative">
                                    <Image
                                      src={"/images/pdf.png"}
                                      width={200}
                                      height={300}
                                      title="PDF Preview"
                                      alt="image file"
                                      style={{ border: "1px solid #ccc" }}
                                    />
                                    <IoMdClose
                                      className="absolute top-2 right-2"
                                      onClick={() => {
                                        files.supportingDocs = [];
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
                                  accept=".pdf,.docx"
                                  onChange={(e) =>
                                    handleFileChange(e, "supportingDocs")
                                  }
                                  multiple
                                  className="sr-only focus:outline-none active:outline-none bg-transparent"
                                />
                              </label>
                              <div>
                                <p className="font-semibold text-blue-500">
                                  Drag & Drop your Photo{" "}
                                </p>
                                <p className="text-gray-500">
                                  {" "}
                                  here or Browse up to 10 MB
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-[#F2F2F2]">
              <h2 className="text-lg md:text-xl font-semibold mb-4">
                Other Notes or Special Offers
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-gray-900">
                    Do you have a unique program, donation, or opportunity you’d
                    like to offer to our students or team? Share it here
                  </label>
                  <div className="mt-2">
                    <textarea
                      name="notes"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={7}
                      placeholder="Have you been referred to a program or invited?"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-[#F2F2F2] md:py-14">
              <h2 className="text-lg md:text-xl font-semibold mb-4">
                Privacy Notice
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm md:text-base text-gray-900">
                    We respect your privacy. The information you provide will
                    only be used to process your application and connect you
                    with suitable opportunities. Your data will be handled
                    confidentially and will not be shared without your consent.
                  </label>
                </div>
              </div>
            </section>

            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-[#F2F2F2]">
              <h2 className="text-lg md:text-xl font-semibold mb-4">
                Consent & Digital Signature
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                <span className="block mb-5">
                  By submitting this form, I confirm that:
                </span>
                <li>The information I’ve provided is true and accurate.</li>
                <li>
                  I consent to the collection and use of my data for application
                  and participation purposes, following data protection laws.
                </li>
                <li>
                  I can withdraw my consent at any time by contacting Change
                  Makers of the World.
                </li>
              </p>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="flex items-center">
                    <span className="text-sm/6 text-sky-900 border-b font-bold border-sky-700">
                      By typing my name and date below, I give my digital
                      signature.
                    </span>
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Full Name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="signatureName"
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.signatureName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Date
                    </label>
                    <div className="mt-2">
                      <input
                        type="date"
                        name="signatureDate"
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.signatureDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="flex justify-between mb-10">
              <button
                type="button"
                className="border-2 border-gray-300 px-4 md:px-6 py-2 md:py-3 rounded-md"
                onClick={() => {
                  setFormData({
                    firstName: "",
                    lastName: "",
                    phone: "",
                    date_birth: "",
                    gender: "",
                    email: "",
                    country: "",
                    nationality: "",
                    employmentStatus: "",
                    educationStatus: "",
                    educationLevel: "",
                    professionalRole: "",
                    fieldOfStudy: "",
                    motivationMessage: "",
                    interestTeaching: "",
                    interestArea: "",
                    program: "",
                    englishLevel: "",
                    message: "",
                    referred: "",
                    notes: "",
                    consent: false,
                    signatureName: "",
                    signatureDate: "",
                  });
                  setFiles({
                    idPhoto: null,
                    identityDocs: [],
                    supportingDocs: [],
                  });
                }}
              >
                Clear Form
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary-100 text-white px-4 md:px-6 py-1 md:py-3 rounded-md disabled:opacity-50"
                onClick={handleSubmit}
              >
                Submit
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
