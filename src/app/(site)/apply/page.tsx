"use client";
import Banner from "@/components/common/Banner";
import SiteContainer from "@/components/common/SiteContainer";
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
import toast from "react-hot-toast";
import { z } from "zod";

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  date_birth: string;
  gender: string;
  email: string;
  country: string;
  nationality: string;
  educationStatus: string;
  girlsProgram: string;
  subjectsProgram: string;
  englishTestTaken: string;
  englishLevel: string;
  motivationMessage: string;
  referralSource: string;
  additionalMessage: string;
  invitaionProgram: string;
  selectedProgram: string;
  signatureName: string;
  signatureDate: string;
}

interface Files {
  idPhoto: File | null;
  englishDoc: File | null;
  supportingDocs: File[];
}

const formDataSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  phone: z.string().min(1, "Phone/WhatsApp Number is required"),
  date_birth: z.string().min(1, "Date of Birth is required"),
  gender: z.string().min(1, "Gender is required"),
  email: z.string().email("Invalid email address"),
  country: z.string().min(1, "Country of Residence is required"),
  nationality: z.string().min(1, "Nationality is required"),
  educationStatus: z.string().min(1, "Current Education Status is required"),
  girlsProgram: z.string().min(1, "Online Education for Girls is required"),
  subjectsProgram: z.string().min(1, "Online School Subjects is required"),
  englishTestTaken: z
    .string()
    .min(1, "English proficiency test status is required"),
  englishLevel: z.string().min(1, "English level is required"),
  motivationMessage: z.string().optional(),
  referralSource: z.string().min(1, "Referral source is required"),
  additionalMessage: z.string().optional(),
  invitaionProgram: z.string().optional(),
  selectedProgram: z.string().min(1, "Please select a program"),
  signatureName: z.string().min(1, "Full Name for signature is required"),
  signatureDate: z.string().min(1, "Date for signature is required"),
});

export default function StudentApplication() {
  const programs = [
    { key: "accessVideos", label: "Access To Recorded School Subject Videos" },
    {
      key: "requestSupplies",
      label: "Request Books & School Supplies",
      sublabel: "For War-Affected Children Or Girls",
    },
    {
      key: "joinELibrary",
      label: "Join The Change ELibrary",
      sublabel: "Access To Daily Reading Materials & Educational Resources",
    },
    {
      key: "applyScholarship",
      label: "Apply For International Scholarship Preparation Program",
      sublabel: "For Girls In Science And Language Tracks",
    },
    {
      key: "girlCoders",
      label: "Afghan Girl Coders Program",
      sublabel: "Learn Coding And Computer Science",
    },
    {
      key: "humanRights",
      label: "Human Rights & Advocacy Program",
      sublabel: "Global Awareness & Reporting Network",
    },
    {
      key: "mentalHealth",
      label: "Mental Health & Empowerment Seminars",
      sublabel: "Online Support And Self-Empowerment",
    },
    {
      key: "onlineSupport",
      label: "Online Support And Self-Empowerment",
      sublabel: "For Families In Critical Crisis",
    },
  ];

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
    girlsProgram: "",
    subjectsProgram: "",
    englishTestTaken: "",
    englishLevel: "",
    motivationMessage: "",
    referralSource: "",
    additionalMessage: "",
    invitaionProgram: "",
    selectedProgram: "",
    signatureName: "",
    signatureDate: "",
  });

  const [files, setFiles] = useState<Files>({
    idPhoto: null,
    englishDoc: null,
    supportingDocs: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<z.inferFlattenedErrors<
    typeof formDataSchema
  > | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateFile = (
    file: File,
    acceptedTypes: string[],
    maxSize: number
  ) => {
    const fileType = file.type;
    const fileSize = file.size;
    if (!acceptedTypes.includes(fileType)) {
      return `Invalid file type. Accepted types: ${acceptedTypes.join(", ")}`;
    }
    if (fileSize > maxSize) {
      return `File size exceeds the limit of ${maxSize / (1024 * 1024)} MB`;
    }
    return null;
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const acceptedTypes =
      field === "idPhoto"
        ? [
            "image/jpeg",
            "image/png",
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ]
        : [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          ];
    const maxSize = 10 * 1024 * 1024; // 10 MB

    for (let file of Array.from(fileList)) {
      const error = validateFile(file, acceptedTypes, maxSize);
      if (error) {
        toast.error(error);
        return;
      }
    }

    if (field === "idPhoto" || field === "englishDoc") {
      setFiles((prev) => ({ ...prev, [field]: fileList[0] }));
    } else if (field === "supportingDocs") {
      setFiles((prev) => ({
        ...prev,
        supportingDocs: [...prev.supportingDocs, ...Array.from(fileList)],
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
            .then((downloadURL) => {
              resolve(downloadURL);
            })
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
    setErrors(null);

    const validationResult = formDataSchema.safeParse(formData);
    if (!validationResult.success) {
      setErrors(validationResult.error.flatten());
      setIsSubmitting(false);
      toast.error("Please fill in all required fields correctly");
      return;
    }

    toast
      .promise(
        (async () => {
          const data = new FormData();
          Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value.toString());
          });

          const uploadedFiles: { [key: string]: string | string[] } = {};

          if (files.idPhoto) {
            uploadedFiles.idPhoto = (await uploadImageUrl(
              files.idPhoto,
              "idPhotos"
            )) as string;
          }
          if (files.englishDoc) {
            uploadedFiles.englishDoc = (await uploadImageUrl(
              files.englishDoc,
              "englishDocs"
            )) as string;
          }
          for (const file of files.supportingDocs) {
            const url = await uploadImageUrl(file, "supportingDocs");
            if (!uploadedFiles.supportingDocs) {
              uploadedFiles.supportingDocs = [];
            }
            (uploadedFiles.supportingDocs as string[]).push(url as string);
          }

          data.append("idPhotoUrl", typeof uploadedFiles.idPhoto === "string" ? uploadedFiles.idPhoto : "");
          data.append("englishDocUrl", typeof uploadedFiles.englishDoc === "string" ? uploadedFiles.englishDoc : "");
          if (uploadedFiles.supportingDocs && Array.isArray(uploadedFiles.supportingDocs)) {
            (uploadedFiles.supportingDocs as string[]).forEach((url) => {
              data.append("supportingDocsUrls", url);
            });
          }

          const response = await fetch("/api/submit-form", {
            method: "POST",
            body: JSON.stringify(Object.fromEntries(data)),
          });

          if (response.ok) {
            setFormData({
              firstName: "",
              lastName: "",
              phone: "",
              date_birth: "",
              gender: "",
              email: "",
              country: "",
              nationality: "",
              educationStatus: "",
              girlsProgram: "",
              subjectsProgram: "",
              englishTestTaken: "",
              englishLevel: "",
              motivationMessage: "",
              referralSource: "",
              additionalMessage: "",
              invitaionProgram: "",
              selectedProgram: "",
              signatureName: "",
              signatureDate: "",
            });
            setFiles({ idPhoto: null, englishDoc: null, supportingDocs: [] });
            return "Form submitted successfully";
          } else {
            throw new Error("Error submitting form");
          }
        })(),
        {
          loading: "Submitting form...",
          success: (message) => message,
          error: (err) => err.message,
        }
      )
      .finally(() => setIsSubmitting(false));
  };

  return (
    <SiteContainer className="flex mt-4">
      <main>
        <div className="md:px-5">
          <Banner>
            <span className="text-lg md:text-5xl block font-bold">
              Student Application Portal
            </span>
          </Banner>
          <div className="px-8 py-6 border-2 rounded-lg mt-12">
            <h1 className="text-2xl font-bold">
              Universal Contributor Application Form
            </h1>
            <p className="pt-3 text-gray-600">
              You’re about to join a network of life-changing programs by Change
              Makers of the World. Whether you’re a student seeking education
              under restrictions, a girl banned from school, or someone in need
              of books or mental health support, this form helps us connect you
              with the right resources. Our programs are designed for Afghan
              students, especially girls, with options for online and in-person
              learning, humanitarian support, and international advocacy
              participation.
            </p>
          </div>
        </div>
        <div className="lg:px-40 mx-auto">
          <h2 className="text-lg md:text-2xl my-12 mx-auto text-center">
            <p>
              Programs are highly tailored and space is restricted. For this
              reason, each
            </p>
            <p className="font-bold">
              applicant may request only one program per submission. Choose
              carefully.
            </p>
          </h2>
          <div className="mt-12 space-y-8">
            {/* Basic Information */}
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
                    {errors?.fieldErrors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fieldErrors.firstName[0]}
                      </p>
                    )}
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
                    {errors?.fieldErrors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fieldErrors.lastName[0]}
                      </p>
                    )}
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
                        {errors?.fieldErrors.phone && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.fieldErrors.phone[0]}
                          </p>
                        )}
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
                        {errors?.fieldErrors.date_birth && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.fieldErrors.date_birth[0]}
                          </p>
                        )}
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
                        {errors?.fieldErrors.gender && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.fieldErrors.gender[0]}
                          </p>
                        )}
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
                    {errors?.fieldErrors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fieldErrors.email[0]}
                      </p>
                    )}
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
                    {errors?.fieldErrors.country && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fieldErrors.country[0]}
                      </p>
                    )}
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
                    {errors?.fieldErrors.nationality && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fieldErrors.nationality[0]}
                      </p>
                    )}
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
                                onClick={() =>
                                  setFiles((prev) => ({
                                    ...prev,
                                    idPhoto: null,
                                  }))
                                }
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

            {/* Education Background */}
            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-[#F2F2F2]">
              <h2 className="text-xl font-semibold mb-10">
                Skills & Background
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Current Education Status
                  </label>
                  <div className="mt-2">
                    <select
                      name="educationStatus"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.educationStatus}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Not in school">Not in school</option>
                      <option value="In public school">In public school</option>
                      <option value="In private school">
                        In private school
                      </option>
                      <option value="Graduated high school">
                        Graduated high school
                      </option>
                      <option value="University student">
                        University student
                      </option>
                      <option value="University graduate">
                        University graduate
                      </option>
                    </select>
                    {errors?.fieldErrors.educationStatus && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fieldErrors.educationStatus[0]}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Online Education for Girls
                  </label>
                  <div className="mt-2">
                    <select
                      name="girlsProgram"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.girlsProgram}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Program</option>
                      <option value="English Language Class">
                        English Language Class
                      </option>
                      <option value="Italian Language Class">
                        Italian Language Class
                      </option>
                      <option value="Women’s Rights & Advocacy">
                        Women’s Rights & Advocacy
                      </option>
                    </select>
                    {errors?.fieldErrors.girlsProgram && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fieldErrors.girlsProgram[0]}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Online School Subjects
                  </label>
                  <div className="mt-2">
                    <select
                      name="subjectsProgram"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.subjectsProgram}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Subject</option>
                      <option value="Math">Math</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="History">History</option>
                      <option value="Literature">Literature</option>
                      <option value="Islamic Studies">Islamic Studies</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors?.fieldErrors.subjectsProgram && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fieldErrors.subjectsProgram[0]}
                      </p>
                    )}
                  </div>
                </div>
                <div></div>
              </div>

              {/* Select the Programs or Support You’re Interested In */}
              <div className="mt-7">
                <h1 className="mb-4">
                  Select the Programs or Support You’re Interested In
                </h1>
                <div className="flex flex-col gap-3 w-full">
                  {programs.map((program) => (
                    <label
                      key={program.key}
                      htmlFor={program.key}
                      className="flex items-center space-x-3 border border-gray-300 rounded-md px-5 py-3 w-full"
                    >
                      <input
                        id={program.key}
                        type="radio"
                        name="program"
                        value={program.key}
                        checked={formData.selectedProgram === program.key}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            selectedProgram: e.target.value,
                          }))
                        }
                        className="h-4 w-4 text-blue-600 border-gray-500 rounded focus:ring-blue-500"
                      />
                      <span>
                        {program.label}
                        {program.sublabel && (
                          <>
                            <br />
                            <span className="text-sm text-gray-500">
                              {program.sublabel}
                            </span>
                          </>
                        )}
                      </span>
                    </label>
                  ))}
                </div>
                {errors?.fieldErrors.selectedProgram && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.fieldErrors.selectedProgram[0]}
                  </p>
                )}
              </div>
            </section>

            {/* English Language Proficiency */}
            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-[#F2F2F2]">
              <h2 className="text-base text-center md:text-left md:text-xl font-semibold mb-10">
                English Language Proficiency
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    What is your current level?
                  </label>
                  <div className="mt-2">
                    <select
                      name="englishLevel"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.englishLevel}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Level</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Pre-Intermediate">Pre-Intermediate</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Upper-Intermediate">
                        Upper-Intermediate
                      </option>
                      <option value="Advanced">Advanced</option>
                      <option value="Proficient">Proficient</option>
                      <option value="I don’t know my level">
                        I don’t know my level
                      </option>
                    </select>
                    {errors?.fieldErrors.englishLevel && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fieldErrors.englishLevel[0]}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Have you taken any English proficiency tests?
                  </label>
                  <div className="mt-2">
                    <select
                      name="englishTestTaken"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.englishTestTaken}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Option</option>
                      <option value="Yes (attach score/report below)">
                        Yes (attach score/report below)
                      </option>
                      <option value="No">No</option>
                    </select>
                    {errors?.fieldErrors.englishTestTaken && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fieldErrors.englishTestTaken[0]}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Upload Documents
                  </label>
                  <span className="text-xs text-gray-600 italic">
                    (Score/report document)
                  </span>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="relative text-center">
                      <div className="mt-4 flex flex-col space-y-4 text-sm/6 text-gray-600">
                        <label className="relative mx-auto cursor-pointer rounded-md font-semibold text-primary-100 focus-within:outline-hidden hover:text-primary-100">
                          {files.englishDoc ? (
                            <div className="relative">
                              <Image
                                src="/images/pdf.png"
                                width={200}
                                height={300}
                                title="PDF Preview"
                                alt="image file"
                                style={{ border: "1px solid #ccc" }}
                              />
                              <IoMdClose
                                className="absolute top-2 right-2"
                                onClick={() =>
                                  setFiles((prev) => ({
                                    ...prev,
                                    englishDoc: null,
                                  }))
                                }
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
                            onChange={(e) => handleFileChange(e, "englishDoc")}
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

            {/* Motivation & Message */}
            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-[#F2F2F2]">
              <h2 className="text-lg md:text-xl font-semibold mb-4">
                Motivation & Message
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Why do you want to join Change Makers of the World (Optional
                    but strongly encouraged)
                  </label>
                  <div className="mt-2">
                    <textarea
                      name="motivationMessage"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.motivationMessage}
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
                        name="referralSource"
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.referralSource}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Source</option>
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
                      {errors?.fieldErrors.referralSource && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fieldErrors.referralSource[0]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Supporting Documents */}
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
                                src="/images/pdf.png"
                                width={200}
                                height={300}
                                title="PDF Preview"
                                alt="image file"
                                style={{ border: "1px solid #ccc" }}
                              />
                              <IoMdClose
                                className="absolute top-2 right-2"
                                onClick={() =>
                                  setFiles((prev) => ({
                                    ...prev,
                                    supportingDocs: [],
                                  }))
                                }
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
                                d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 wymagań1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
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

            {/* Your Message (Optional) */}
            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-[#F2F2F2]">
              <h2 className="text-lg md:text-xl font-semibold mb-4">
                Your Message (Optional)
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-gray-900">
                    Describe your situation or reason for applying.
                  </label>
                  <div className="mt-2">
                    <textarea
                      name="additionalMessage"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.additionalMessage}
                      onChange={handleInputChange}
                      rows={7}
                      placeholder="Write here your message?"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Other Programs or Invitations */}
            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-[#F2F2F2]">
              <h2 className="text-lg md:text-xl font-semibold mb-4">
                Other Programs or Invitations
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-gray-900">
                    Have you been referred to a program not listed above?
                    Mention it here, including who invited you or where you saw
                    it.
                  </label>
                  <div className="mt-2">
                    <textarea
                      name="invitaionProgram"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.invitaionProgram}
                      onChange={handleInputChange}
                      rows={7}
                      placeholder="Write here your message?"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Privacy Notice */}
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

            {/* Consent */}
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
                      {errors?.fieldErrors.signatureName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fieldErrors.signatureName[0]}
                        </p>
                      )}
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
                      {errors?.fieldErrors.signatureDate && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fieldErrors.signatureDate[0]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Submit */}
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
                    educationStatus: "",
                    girlsProgram: "",
                    subjectsProgram: "",
                    englishTestTaken: "",
                    englishLevel: "",
                    motivationMessage: "",
                    referralSource: "",
                    additionalMessage: "",
                    invitaionProgram: "",
                    selectedProgram: "",
                    signatureName: "",
                    signatureDate: "",
                  });
                  setFiles({
                    idPhoto: null,
                    englishDoc: null,
                    supportingDocs: [],
                  });
                }}
              >
                Clear Form
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                className="bg-primary-100 text-white px-4 md:px-6 py-1 md:py-3 rounded-md disabled:opacity-50"
                onClick={handleSubmit}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </SiteContainer>
  );
}
