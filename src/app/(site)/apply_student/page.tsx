"use client";
import Banner from "@/components/common/Banner";
import React, { useState } from "react";
import Image from "next/image";

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  dob: string;
  gender: string;
  email: string;
  country: string;
  nationality: string;
  educationStatus: string;
  program: string;
  englishLevel: string;
  message: string;
  referred: string;
  consent: boolean;
  signatureName: string;
  signatureDate: string;
}

interface Files {
  idPhoto: File | null;
  englishDoc: File | null;
  supportingDocs: File[];
}

export default function StudentApplication() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    gender: "",
    email: "",
    country: "",
    nationality: "",
    educationStatus: "",
    program: "",
    englishLevel: "",
    message: "",
    referred: "",
    consent: false,
    signatureName: "",
    signatureDate: "",
  });
  const [files, setFiles] = useState<Files>({
    idPhoto: null,
    englishDoc: null,
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

    const file = fileList[0];
    if (field === "supportingDocs") {
      setFiles((prev) => ({
        ...prev,
        supportingDocs: [...prev.supportingDocs, ...Array.from(fileList)],
      }));
    } else {
      setFiles((prev) => ({ ...prev, [field]: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString());
    });
    if (files.idPhoto) data.append("idPhoto", files.idPhoto);
    if (files.englishDoc) data.append("englishDoc", files.englishDoc);
    files.supportingDocs.forEach((file) => data.append("supportingDocs", file));

    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        body: data,
      });
      if (response.ok) {
        setSubmitStatus("success");
        setSubmitMessage("Form submitted successfully");
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          dob: "",
          gender: "",
          email: "",
          country: "",
          nationality: "",
          educationStatus: "",
          program: "",
          englishLevel: "",
          message: "",
          referred: "",
          consent: false,
          signatureName: "",
          signatureDate: "",
        });
        setFiles({ idPhoto: null, englishDoc: null, supportingDocs: [] });
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
      {/* Sidebar
      <aside className="w-1/4 pr-4">
        <div className="sticky top-4">
          <h2 className="text-xl font-bold mb-4">Become a Changemaker</h2>
          <p className="text-sm text-gray-600 mb-4">
            Universal Contributor Application Form
          </p>
          <p className="text-xs text-gray-500">
            Please fill this form to join our growing network of change-makers.
          </p>
        </div>
      </aside> */}

      {/* Main Content */}
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
          <h2 className="text-lg md:text-2xl my-12  mx-auto text-center">
            <p>
              Programs are highly tailored and space is restricted. For this
              reason, each
            </p>
            <p className="font-bold">
              {" "}
              applicant may request only one program per submission. Choose
              carefully.
            </p>
          </h2>
          <form className="mt-12 space-y-8">
            {/* Basic Information */}
            <section className="border-2 rounded-lg p-4  md:p-8 lg:px-14 bg-[#F2F2F2]">
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
                          name="dob"
                          className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                          value={formData.dob}
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
                          <input
                            type="file"
                            accept=".pdf,.docx"
                            onChange={(e) => handleFileChange(e, "englishDoc")}
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

            {/* Education Background*/}
            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-[#F2F2F2]">
              <h2 className="text-xl font-semibold mb-10">
                Skills & Background
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* firs input */}
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
                  </div>
                </div>
                {/* second input */}
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Online Education for Girls
                  </label>
                  <div className="mt-2">
                    <select
                      name="program"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.program}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="English Language Class">
                        English Language Class
                      </option>
                      <option value="English Language Class">
                        English Language Class
                      </option>
                      <option value="Italian Language Class">
                        Italian Language Class
                      </option>
                      <option value="Italian Language Class">
                        Italian Language Class
                      </option>
                      <option value="Women’s Rights & Advocacy">
                        Women’s Rights & Advocacy
                      </option>
                    </select>
                  </div>
                </div>
                {/* third input */}
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Online School Subjects
                  </label>
                  <div className="mt-2">
                    <select
                      name="program"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.program}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Math">Math</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="History">History</option>
                      <option value="Literature">Literature</option>
                      <option value="Islamic Studies">Islamic Studies</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Select the Programs or Support You’re Interested In */}
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Select the Programs or Support You’re Interested In
                  </label>
                  <div className="mt-2">
                    <select
                      name="program"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.program}
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

                </div>
                {/* Select the Programs or Support You’re Interested In */}
                <div className="mt-7">
                  <h1 className="mb-4">
                    Select the Programs or Support You’re Interested In
                  </h1>
                  <div className="flex flex-col gap-3 w-full">
                    <label className="flex items-center space-x-3 border border-gray-300 rounded-md px-5 py-3 w-full">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-500 rounded focus:ring-blue-500"
                      />
                      <span>Access To Recorded School Subject Videos</span>
                    </label>

                    <label className="flex items-center space-x-3 border border-gray-300 rounded-md px-5 py-3 w-full">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-500 rounded focus:ring-blue-500"
                      />
                      <span>
                        Request Books & School Supplies
                        <br />
                        <span className="text-sm text-gray-500">
                          For War-Affected Children Or Girls
                        </span>
                      </span>
                    </label>

                    <label className="flex items-center space-x-3 border border-gray-300 rounded-md px-5 py-3 w-full">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-500 rounded focus:ring-blue-500"
                      />
                      <span>
                        Join The Change ELibrary
                        <br />
                        <span className="text-sm text-gray-500">
                          Access To Daily Reading Materials & Educational
                          Resources
                        </span>
                      </span>
                    </label>

                    <label className="flex items-center space-x-3 border border-gray-300 rounded-md px-5 py-3 w-full">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-500 rounded focus:ring-blue-500"
                      />
                      <span>
                        Apply For International Scholarship Preparation Program
                        <br />
                        <span className="text-sm text-gray-500">
                          For Girls In Science And Language Tracks
                        </span>
                      </span>
                    </label>

                    <label className="flex items-center space-x-3 border border-gray-300 rounded-md px-5 py-3 w-full">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-500 rounded focus:ring-blue-500"
                      />
                      <span>
                        Afghan Girl Coders Program
                        <br />
                        <span className="text-sm text-gray-500">
                          Learn Coding And Computer Science
                        </span>
                      </span>
                    </label>

                    <label className="flex items-center space-x-3 border border-gray-300 rounded-md px-5 py-3 w-full">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-500 rounded focus:ring-blue-500"
                      />
                      <span>
                        Human Rights & Advocacy Program
                        <br />
                        <span className="text-sm text-gray-500">
                          Global Awareness & Reporting Network
                        </span>
                      </span>
                    </label>

                    <label className="flex items-center space-x-3 border border-gray-300 rounded-md px-5 py-3 w-full">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-500 rounded focus:ring-blue-500"
                      />
                      <span>
                        Mental Health & Empowerment Seminars
                        <br />
                        <span className="text-sm text-gray-500">
                          Online Support And Self-Empowerment
                        </span>
                      </span>
                    </label>

                    <label className="flex items-center space-x-3 border border-gray-300 rounded-md px-5 py-3 w-full">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-500 rounded focus:ring-blue-500"
                      />
                      <span>
                        Online Support And Self-Empowerment
                        <br />
                        <span className="text-sm text-gray-500">
                          For Families In Critical Crisis
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
            </section>

            {/* English Language Proficiency */}
            <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-[#F2F2F2]">
              <h2 className="text-base text-center md:text-left md:text-xl font-semibold mb-10">
                English Language Proficiency
              </h2>
              <div className="space-y-5">
                {/* firs input */}
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    What is your current level?
                  </label>
                  <div className="mt-2">
                    <select
                      name="educationStatus"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.educationStatus}
                      onChange={handleInputChange}
                      required
                    >
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
                  </div>
                </div>

                {/* second input */}
                <div>
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Have you taken any English proficiency tests?
                  </label>
                  <div className="mt-2">
                    <select
                      name="program"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.program}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Yes (attach score/report below)">
                        Yes (attach score/report below)
                      </option>
                      <option value="No">No</option>
                    </select>
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
                          <input
                            type="file"
                            accept=".pdf,.docx"
                            onChange={(e) => handleFileChange(e, "englishDoc")}
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

            {/* Motivation & Message */}
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
                  {/* firs input */}
                  <div>
                    <label className="block text-sm/6 font-medium text-gray-900 mt-2">
                      How did you hear about us?
                    </label>
                    <div className="mt-2">
                      <select
                        name="educationStatus"
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                        value={formData.educationStatus}
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
                          <input
                            type="file"
                            accept=".pdf,.docx"
                            onChange={(e) => handleFileChange(e, "englishDoc")}
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
                      name="referred"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.referred}
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
                      name="referred"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2"
                      value={formData.referred}
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

            {/* Submit */}
            <div className="flex justify-between mb-10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary-100 text-white px-4 md:px-6 py-1 md:py-3 rounded-md disabled:opacity-50"
                onClick={handleSubmit}
              >
                Submit
              </button>
              <button
                type="button"
                className="border-2 border-gray-300 px-4 md:px-6 py-2 md:py-3 rounded-md"
                onClick={() => {
                  setFormData({
                    firstName: "",
                    lastName: "",
                    phone: "",
                    dob: "",
                    gender: "",
                    email: "",
                    country: "",
                    nationality: "",
                    educationStatus: "",
                    program: "",
                    englishLevel: "",
                    message: "",
                    referred: "",
                    consent: false,
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
