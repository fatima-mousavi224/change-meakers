"use client";
import React, { useState } from "react";
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

// Updated FormData interface to include all form fields
// FormData interface
const FormDataInterface = {
  projectTitle: "",
  cardDescription: "",
  heroTitle: "",
  subheading: "",
  slogan: "",
  buttonName: "",
  buttonLink: "",
  iconTitle: "",
  shortDescription: "",
  iconTitle2: "",
  shortDescription2: "",
  visionTitle: "",
  visionText: "",
  goalTitle: "",
  goalText: "",
  sectionTitleAbout: "",
  bodyText: "",
  buttonName2: "",
  buttonLink2: "",
  sectionTitleVoices: "",
  sectionDescription: "",
  heroTitleMedia: "",
  shortDescriptionMedia: "",
  videoLink: "",
  fullVideoDescription: "",
  iconTitleOffer1: "",
  shortDescriptionOffer1: "",
  sectionTitleTeam: "",
  sectionDescriptionTeam: "",
  sectionTitleStudents: "",
  sectionDescriptionStudents: "",
  addQuote: "",
  nameRole: "",
  sectionTitlePhoto: "",
  sectionDescriptionPhoto: "",
  sectionTitleNewsletter: "",
  sectionDescriptionNewsletter: "",
  sectionTitleSDGs: "",
  sectionTextSDGs: "",
  finalStatement: "",
  navigationLabel: "",
};

// FilesState interface
interface FilesState {
  cardImage: File | null;
  heroImage: File | null;
  visionGoalImage1: File | null;
  visionGoalImage2: File | null;
  visionGoalImage3: File | null;
  visionGoalImage4: File | null;
  mediaHeroImage: File | null;
  photoAlbumImage1: File | null;
  photoAlbumImage2: File | null;
  photoAlbumImage3: File | null;
  photoAlbumImage4: File | null;
  newsletterImage1: File | null;
  newsletterImage2: File | null;
  sdgsImage1: File | null;
  sdgsImage2: File | null;
  sdgsImage3: File | null;
  sdgsImage4: File | null;
  [key: string]: File | null; // Add index signature
}
const FilesStateInterface: FilesState = {
  cardImage: null,
  heroImage: null,
  visionGoalImage1: null,
  visionGoalImage2: null,
  visionGoalImage3: null,
  visionGoalImage4: null,
  mediaHeroImage: null,
  photoAlbumImage1: null,
  photoAlbumImage2: null,
  photoAlbumImage3: null,
  photoAlbumImage4: null,
  newsletterImage1: null,
  newsletterImage2: null,
  sdgsImage1: null,
  sdgsImage2: null,
  sdgsImage3: null,
  sdgsImage4: null,
};

// Define the type for a team card
interface TeamCard {
  image: File | null;
  name: string;
  role: string;
  biography: string;
  link: string;
  icon: File | null;
  showLinkInput: boolean;
}

export default function CreateNewProject() {
  const [formData, setFormData] = React.useState(FormDataInterface);
  const [files, setFiles] = React.useState(FilesStateInterface);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitMessage, setSubmitMessage] = React.useState("");
  const [submitStatus, setSubmitStatus] = React.useState<
    "success" | "error" | null
  >(null);

  const [offerIcons, setOfferIcons] = useState<(string | null)[]>([null, null]);
  const handleOfferIconChange = (index: number, file: File | null) => {
  if (!file) return;

  const imageUrl = URL.createObjectURL(file);
  const updatedIcons = [...offerIcons];
  updatedIcons[index] = imageUrl;
  setOfferIcons(updatedIcons);
};



  const [iconPreviews, setIconPreviews] = useState<(string | null)[]>([null, null, null]);

  const handleStudentIconPreviewChange = (index: number, file: File | null) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setIconPreviews((prev) => {
        const newPreviews = [...prev];
        newPreviews[index] = imageUrl;
        return newPreviews;
      });
    }
  };
  

  // Add this to your component state
const [iconPreview1, setIconPreview1] = useState<string | null>(null);
const [iconPreview2, setIconPreview2] = useState<string | null>(null);

// Add these handlers
const handleIconPreviewChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setPreview: (value: string | null) => void
) => {
  const file = e.target.files?.[0];
  if (file) {
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  }
};


  interface StudentItem {
    image: File | null;
    link: string;
    showLinkInput: boolean;
    icon: File | null;
    showIconUpload: boolean;
  }

  const initialItems: StudentItem[] = Array.from({ length: 3 }, () => ({
    image: null,
    link: "",
    showLinkInput: false,
    icon: null,
    showIconUpload: false,
  }));

  const [items, setItems] = React.useState<StudentItem[]>(initialItems);

  const handleStudentImageChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (file) {
      const newItems = [...items];
      newItems[index].image = file;
      setItems(newItems);
    }
  };

  const handleStudentIconChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (file) {
      const newItems = [...items];
      newItems[index].icon = file;
      setItems(newItems);
    }
  };

  const toggleStudentLinkInput = (index: number) => {
    const newItems = [...items];
    newItems[index].showLinkInput = !newItems[index].showLinkInput;
    setItems(newItems);
  };

  const handleStudentLinkChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index].link = value;
    setItems(newItems);
  };

  // Team cards state and handlers moved to main component scope
  const [cards, setCards] = useState<TeamCard[]>([
    {
      image: null,
      name: "",
      role: "",
      biography: "",
      link: "",
      icon: null,
      showLinkInput: false,
    },
    {
      image: null,
      name: "",
      role: "",
      biography: "",
      link: "",
      icon: null,
      showLinkInput: false,
    },
    {
      image: null,
      name: "",
      role: "",
      biography: "",
      link: "",
      icon: null,
      showLinkInput: false,
    },
  ]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    cardIndex: number
  ) => {
    const files = e.target.files;
    if (!files) return;
    const file = files[0];
    if (file) {
      setCards((prevCards) => {
        const newCards = [...prevCards];
        newCards[cardIndex] = { ...newCards[cardIndex], image: file };
        return newCards;
      });
    }
  };

  const handleIconChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    cardIndex: number
  ) => {
    const files = e.target.files;
    if (!files) return;
    const file = files[0];
    if (file) {
      setCards((prevCards) => {
        const newCards = [...prevCards];
        newCards[cardIndex] = { ...newCards[cardIndex], icon: file };
        return newCards;
      });
    }
  };

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    cardIndex: number
  ) => {
    const value = e.target.value;
    setCards((prevCards) => {
      const newCards = [...prevCards];
      newCards[cardIndex] = { ...newCards[cardIndex], name: value };
      return newCards;
    });
  };

  const handleRoleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    cardIndex: number
  ) => {
    const value = e.target.value;
    setCards((prevCards) => {
      const newCards = [...prevCards];
      newCards[cardIndex] = { ...newCards[cardIndex], role: value };
      return newCards;
    });
  };

  const handleBiographyChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    cardIndex: number
  ) => {
    const value = e.target.value;
    setCards((prevCards) => {
      const newCards = [...prevCards];
      newCards[cardIndex] = { ...newCards[cardIndex], biography: value };
      return newCards;
    });
  };

  const handleLinkChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    cardIndex: number
  ) => {
    const value = e.target.value;
    setCards((prevCards) => {
      const newCards = [...prevCards];
      newCards[cardIndex] = { ...newCards[cardIndex], link: value };
      return newCards;
    });
  };

  const toggleLinkInput = (cardIndex: number) => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      newCards[cardIndex] = {
        ...newCards[cardIndex],
        showLinkInput: !newCards[cardIndex].showLinkInput,
      };
      return newCards;
    });
  };

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024; // 10 MB
    if (file.size > maxSize) {
      alert("File size exceeds 10 MB limit.");
      return;
    }

    setFiles((prev) => ({ ...prev, [field]: file }));
  };

  const uploadImageUrl = async (file: File, folder: string) => {
    const filename = `${Date.now()}_${file.name}`;
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, `${folder}/${filename}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise<string>((resolve, reject) => {
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
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              resolve(downloadURL);
            })
            .catch(reject);
        }
      );
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const uploadedFiles: { [key: string]: string } = {};
      const fileFields = Object.keys(FilesStateInterface);

      for (const field of fileFields) {
        // if (files[field]) {
          // const url = await uploadImageUrl(files[field], field);
          const file = files[field];
          if (file) {
            const url = await uploadImageUrl(file, field)
            uploadedFiles[field] = url;
        }
        
      }

      const formDataToSend = { ...formData, ...uploadedFiles };

      const response = await fetch("/api/submit-contribute-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataToSend),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setSubmitMessage("Form submitted successfully");
        setFormData(FormDataInterface);
        setFiles(FilesStateInterface);
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
    setFormData(FormDataInterface);
    setFiles(FilesStateInterface);
  };

  console.log("formdata is", formData);

  return (
    <div className="flex mt-4 max-w-screen-2xl mx-auto">
      <main className="mx-auto">
        <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-12 text-center md:text-left">
          Create New Project
        </h2>
        <div className="mt-12 space-y-8 md:w-full lg:w-full xl:w-[1000px] 2xl:w-[60vw]">
          {/* Card Components */}
          <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
            <h2 className="text-xl font-semibold mb-4 text-sky-800 text-center md:text-left">
              Card Components
            </h2>
            <div className="md:grid grid-cols-1 md:grid-cols-5 gap-5 col-span-2">
              <div className="md:col-span-4 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Project Title
                </label>
                <input
                  type="text"
                  name="projectTitle"
                  placeholder="write something here..."
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  value={formData.projectTitle}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                />
              </div>
              <div className="col-span-5">
                <label className="block text-sm/6 font-medium text-gray-900 mt-4 md:mt-0">
                  Card Description
                </label>
                <textarea
                  name="cardDescription"
                  placeholder="write something here..."
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  value={formData.cardDescription}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  maxLength={1000}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 col-span-3">
                <div className="col-span-2">
                  <label className="block text-sm/6 font-medium text-gray-900 mt-4 md:mt-0">
                    Upload Card Image
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="relative text-center">
                      {files.cardImage ? (
                        <div className="relative">
                          <img
                            src={URL.createObjectURL(files.cardImage)}
                            alt="Card Image Preview"
                            className="mx-auto w-16 h-16 object-cover"
                          />
                          <span
                            className="absolute top-0 right-0 cursor-pointer"
                            onClick={() =>
                              setFiles((prev) => ({ ...prev, cardImage: null }))
                            }
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
                        name="cardImage"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, "cardImage")}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <p className="mt-4 font-semibold text-blue-500">
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
          </section>

          {/* Hero Section */}
          <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
            <h2 className="text-xl font-semibold mb-4 text-sky-800">
              1. Hero Section
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 col-span-2">
                <div className="col-span-2">
                  <label className="block text-sm/6 font-medium">
                    Upload Hero Image(s)
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="relative text-center">
                      {files.heroImage ? (
                        <div className="relative">
                          <img
                            src={URL.createObjectURL(files.heroImage)}
                            alt="Hero Image Preview"
                            className="mx-auto w-16 h-16 object-cover"
                          />
                          <span
                            className="absolute top-0 right-0 cursor-pointer"
                            onClick={() =>
                              setFiles((prev) => ({ ...prev, heroImage: null }))
                            }
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
                        name="heroImage"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, "heroImage")}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <p className="mt-4 font-semibold text-blue-500">
                        Drag & Drop your Photo
                      </p>
                      <p className="text-gray-500">
                        here or Browse up to 10 MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2 mt-4 md:mt-0">
                <div className="col-span-1 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Hero Title
                  </label>
                  <input
                    type="text"
                    name="heroTitle"
                    placeholder="write something here..."
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    value={formData.heroTitle}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                  />
                </div>
                <div className="col-span-1 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Subheading
                  </label>
                  <input
                    type="text"
                    name="subheading"
                    placeholder="write something here..."
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    value={formData.subheading}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                  />
                </div>
                <div className="col-span-1 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Subheading Line or Slogan
                  </label>
                  <input
                    type="text"
                    name="slogan"
                    placeholder="write something here..."
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    value={formData.slogan}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                  />
                </div>
                <div className="col-span-1 mt-4 md:mt-0 relative">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Button Name
                  </label>
                  <input
                    type="text"
                    name="buttonName"
                    placeholder="Enter the button's name"
                    className="block w-full border rounded-full border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    value={formData.buttonName}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                  />
                  <a
                    href="#"
                    className="absolute top-8 right-2 p-2 bg-gray-100 rounded-full"
                  >
                    <span className="text-xl">
                      <BsArrowRight />
                    </span>
                  </a>
                </div>
                <div className="col-span-1 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Button Link
                  </label>
                  <input
                    type="text"
                    name="buttonLink"
                    placeholder="Enter the URL"
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    value={formData.buttonLink}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Status & Icons */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow px-3 py-6 col-span-1">
                <h2 className="text-sky-800 text-xl font-semibold pl-4">
                  2. Status & Icons
                </h2>
                <div className="flex flex-col md:flex-row mt-4 md:mt-0 items-center justify-between gap-3 px-4 py-2">
                  <div className="col-span-1 relative">
                  <label
                    htmlFor="icon1"
                    className="text-sm text-center xl:text-left xl:text-xl px-4 py-1 xl:py-3 rounded-xl cursor-pointer inline-block shadow-sm shadow-gray-500"
                  >
                    Add Icon +
                  </label>
                  <input
                    type="file"
                    id="icon1"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleIconPreviewChange(e, setIconPreview1)}
                  />
                  {iconPreview1 && (
                    <img
                      src={iconPreview1}
                      alt="Icon Preview"
                      className="mt-2 size-10 object-contain"
                    />
                  )}
                </div>
                  <div className="grid-cols-1 space-y-3">
                    <div className="col-span-1 mt-4 md:mt-0">
                      <label className="block text-sm/6 font-medium text-gray-900">
                        Title
                      </label>
                      <input
                        type="text"
                        name="iconTitle"
                        placeholder="Enter the title"
                        className="block w-full md:w-[215px] 2xl:w-[340px] rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                        value={formData.iconTitle}
                        onChange={handleInputChange}
                        required
                        maxLength={50}
                      />
                    </div>
                    <div className="col-span-1 mt-4 md:mt-0">
                      <label className="block text-sm/6 font-medium text-gray-900">
                        Short Description
                      </label>
                      <input
                        type="text"
                        name="shortDescription"
                        placeholder="Enter the description"
                        className="block w-full md:w-[215px] 2xl:w-[340px] rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                        value={formData.shortDescription}
                        onChange={handleInputChange}
                        required
                        maxLength={50}
                      />
                    </div>
                    <div className="flex justify-end space-x-4 col-span-2 mt-3">
                      <span className="text-blue-600 cursor-pointer hover:text-blue-700">
                        <FaSquarePlus />
                      </span>
                      <span className="text-red-500 hover:text-red-600 cursor-pointer w-4 h-4">
                        <FaTrash />
                      </span>
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
                      htmlFor="icon2"
                      className="text-sm text-center xl:text-left xl:text-xl px-4 py-1 xl:py-3 rounded-xl cursor-pointer inline-block shadow-sm shadow-gray-500"
                    >
                      Add Icon +
                    </label>
                    <input
                      type="file"
                      id="icon2"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleIconPreviewChange(e, setIconPreview2)}
                    />
                    {iconPreview2 && (
                      <img
                        src={iconPreview2}
                        alt="Icon Preview"
                        className="mt-2 size-10 object-contain"
                      />
                    )}
                  </div>
                  <div className="grid-cols-1 space-y-3">
                    <div className="col-span-1 mt-4 md:mt-0">
                      <label className="block text-sm/6 font-medium text-gray-900">
                        Title
                      </label>
                      <input
                        type="text"
                        name="iconTitle2"
                        placeholder="Enter the title"
                        className="block w-full md:w-[215px] 2xl:w-[340px] rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                        value={formData.iconTitle2}
                        onChange={handleInputChange}
                        required
                        maxLength={50}
                      />
                    </div>
                    <div className="col-span-1 mt-4 md:mt-0">
                      <label className="block text-sm/6 font-medium text-gray-900">
                        Short Description
                      </label>
                      <input
                        type="text"
                        name="shortDescription2"
                        placeholder="Enter the description"
                        className="block w-full md:w-[215px] 2xl:w-[340px] rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                        value={formData.shortDescription2}
                        onChange={handleInputChange}
                        required
                        maxLength={50}
                      />
                    </div>
                    <div className="flex justify-end space-x-4 col-span-2 mt-3">
                      <span className="text-blue-600 cursor-pointer hover:text-blue-700">
                        <FaSquarePlus />
                      </span>
                      <span className="text-red-500 hover:text-red-600 cursor-pointer w-4 h-4">
                        <FaTrash />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Vision & Goal Section */}
          <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
            <h3 className="text-sky-800 text-xl font-semibold">
              3. Vision & Goal Section
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="col-span-1 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Vision Title
                </label>
                <input
                  type="text"
                  name="visionTitle"
                  placeholder="e.g. 'Our Vision'"
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  value={formData.visionTitle}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                />
              </div>
              <div className="col-span-1 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Vision Text
                </label>
                <input
                  type="text"
                  name="visionText"
                  placeholder="write something here..."
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  value={formData.visionText}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                />
              </div>
              <div className="col-span-1 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Goal Title
                </label>
                <input
                  type="text"
                  name="goalTitle"
                  placeholder="e.g. 'Our Goal'"
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  value={formData.goalTitle}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                />
              </div>
              <div className="col-span-1 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Goal Text
                </label>
                <input
                  type="text"
                  name="goalText"
                  placeholder="write something here..."
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  value={formData.goalText}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                />
              </div>
            </div>
            <div className="mt-5">
              <label className="block text-sm/6 font-medium">
                Upload Image(s),{" "}
                <span className="text-gray-500 text-sm">Maximum 4 Images</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2"
                  >
                    <div className="relative text-center">
                      {files[`visionGoalImage${index}`] ? (
                        <div className="relative">
                          {files[`visionGoalImage${index}`] && (
                            <img
                              src={URL.createObjectURL(
                                files[`visionGoalImage${index}`] as File
                              )}
                              alt={`Vision Goal Image ${index} Preview`}
                              className="mx-auto w-16 h-16 object-cover"
                            />
                          )}
                          <span
                            className="absolute top-0 right-0 cursor-pointer"
                            onClick={() =>
                              setFiles((prev) => ({
                                ...prev,
                                [`visionGoalImage${index}`]: null,
                              }))
                            }
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
                        name={`visionGoalImage${index}`}
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) =>
                          handleFileChange(e, `visionGoalImage${index}`)
                        }
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <p className="mt-4 font-semibold text-blue-500">
                        Drag & Drop your Photo
                      </p>
                      <p className="text-gray-500">
                        here or Browse up to 10 MB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* About Program Section */}
          <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
            <h2 className="text-xl font-semibold mb-4 text-sky-800">
              4. About Program Section
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2 mt-4 md:mt-0">
                <div className="col-span-3 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Section Title
                  </label>
                  <input
                    type="text"
                    name="sectionTitleAbout"
                    placeholder="e.g. 'About the Program'"
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    value={formData.sectionTitleAbout}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                  />
                </div>
                <div className="col-span-3 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Body Text
                  </label>
                  <textarea
                    name="bodyText"
                    placeholder="write something here..."
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    value={formData.bodyText}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    maxLength={1000}
                  />
                </div>
                <div className="col-span-1 mt-4 md:mt-0 relative">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Button Name
                  </label>
                  <input
                    type="text"
                    name="buttonName2"
                    placeholder="Enter the button's name"
                    className="block w-full border rounded-full border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    value={formData.buttonName2}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                  />
                  <a
                    href="#"
                    className="absolute top-8 right-2 p-2 bg-gray-100 rounded-full"
                  >
                    <span className="text-xl">
                      <BsArrowRight />
                    </span>
                  </a>
                </div>
                <div className="col-span-1 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Button Link
                  </label>
                  <input
                    type="text"
                    name="buttonLink2"
                    placeholder="Enter the URL"
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    value={formData.buttonLink2}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                  />
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
        <span className="block text-lg text-gray-400">e.g., "For Students"</span>
      </div>

      <div className="inline-block md:grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2 mt-4 md:mt-0">
          <div className="col-span-3 mt-4 md:mt-0">
            <label className="block text-sm/6 font-medium text-gray-900">
              Section Title
            </label>
            <input
              type="text"
              name="sectionTitleVoices"
              placeholder="e.g. 'About the Program'"
              className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
              value={formData.sectionTitleVoices}
              onChange={handleInputChange}
              required
              maxLength={50}
            />
          </div>

          <div className="col-span-3">
            <label className="block text-sm/6 font-medium text-gray-900 mt-4 md:mt-0">
              Section Description
            </label>
            <textarea
              name="sectionDescription"
              placeholder="write something here..."
              className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
              value={formData.sectionDescription}
              onChange={handleInputChange}
              required
              rows={4}
              maxLength={1000}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 col-span-3">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className="border border-gray-400 rounded-lg border-dashed px-5 py-4 w-full"
              >
                <textarea
                  placeholder="write something here..."
                  rows={3}
                  className="my-3 w-full border-none focus:ring-0 resize-none"
                />

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

                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 mt-4 space-x-4 items-center">
                  <div className="col-span-1 relative">
                    <label
                      htmlFor={`voiceOfClassRoomIcon${index}`}
                      className="text-3xl w-12 h-12 px-4 flex justify-center items-center py-3 rounded-full cursor-pointer shadow-sm shadow-gray-500 bg-white"
                    >
                      +
                    </label>
                    <input
                      type="file"
                      id={`voiceOfClassRoomIcon${index}`}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) =>
                        handleStudentIconPreviewChange(index, e.target.files?.[0] ?? null)
                      }
                    />

                    {/* 👇 Image Preview */}
                    {iconPreviews[index] && (
                      <img
                        src={iconPreviews[index]!}
                        alt="Icon Preview"
                        className="mt-2 size-10 object-cover rounded-full border"
                      />
                    )}
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
                      className="border-none focus:ring-0 w-full"
                    />
                  </div>
                </div>
              </div>
            ))}
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
                  <label className="block text-sm/6 font-medium">
                    Upload Hero Image
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="relative text-center">
                      {files.mediaHeroImage ? (
                        <div className="relative">
                          <img
                            src={URL.createObjectURL(files.mediaHeroImage)}
                            alt="Media Hero Image Preview"
                            className="mx-auto w-16 h-16 object-cover"
                          />
                          <span
                            className="absolute top-0 right-0 cursor-pointer"
                            onClick={() =>
                              setFiles((prev) => ({
                                ...prev,
                                mediaHeroImage: null,
                              }))
                            }
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
                        name="mediaHeroImage"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => handleFileChange(e, "mediaHeroImage")}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <p className="mt-4 font-semibold text-blue-500">
                        Drag & Drop your Photo
                      </p>
                      <p className="text-gray-500">
                        here or Browse up to 10 MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:col-span-2 mt-4 md:mt-0">
                <div className="col-span-2 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Hero Title
                  </label>
                  <input
                    type="text"
                    name="heroTitleMedia"
                    placeholder="write something here..."
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    value={formData.heroTitleMedia}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                  />
                </div>
                <div className="col-span-2 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Short Description
                  </label>
                  <input
                    type="text"
                    name="shortDescriptionMedia"
                    placeholder="write something here..."
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    value={formData.shortDescriptionMedia}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                  />
                </div>
                <div className="col-span-2 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Video Link
                  </label>
                  <input
                    type="text"
                    name="videoLink"
                    placeholder="write something here..."
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    value={formData.videoLink}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                  />
                </div>
                <div className="col-span-2 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Full Video Description
                  </label>
                  <input
                    type="text"
                    name="fullVideoDescription"
                    placeholder="Enter the description"
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    value={formData.fullVideoDescription}
                    onChange={handleInputChange}
                    required
                    maxLength={50}
                  />
                </div>
              </div>
            </div>
          </section>

              {/* What We Offer Section */}
                    <section>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[0, 1].map((index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg shadow px-3 py-6 col-span-1"
                      >
                        <h2 className="text-sky-800 text-xl font-semibold pl-4">
                          7. 'What We Offer?' Section
                        </h2>

                        <div className="flex flex-col md:flex-row mt-4 items-center justify-between gap-3 px-4 py-2">
                          {/* Icon Upload */}
                          <div className="col-span-1 relative flex flex-col items-center space-y-2">
                            <label
                              htmlFor={`iconOffer${index}`}
                              className="text-sm text-center xl:text-left xl:text-xl px-4 py-1 xl:py-3 rounded-xl cursor-pointer inline-block shadow-sm shadow-gray-500"
                            >
                              Add Icon +
                            </label>
                            <input
                              type="file"
                              id={`iconOffer${index}`}
                              className="hidden"
                              onChange={(e) =>
                                handleOfferIconChange(index, e.target.files?.[0] ?? null)
                              }
                              accept="image/*"
                            />
                            {offerIcons[index] && (
                              <img
                                src={offerIcons[index]!}
                                alt="Icon Preview"
                                className="size-10 object-cover rounded-full border"
                              />
                            )}
                          </div>

                          {/* Title & Description */}
                          <div className="grid-cols-1 space-y-3">
                            <div className="col-span-1 mt-4 md:mt-0">
                              <label className="block text-sm/6 font-medium text-gray-900">
                                Title
                              </label>
                              <input
                                type="text"
                                name={`iconTitleOffer${index}`}
                                placeholder="Enter the title"
                                className="block w-full md:w-[215px] 2xl:w-[340px] rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                                value={formData.videoLink}
                                onChange={handleInputChange}
                                required
                                maxLength={50}
                              />
                            </div>
                            <div className="col-span-1 mt-4 md:mt-0">
                              <label className="block text-sm/6 font-medium text-gray-900">
                                Short Description
                              </label>
                              <input
                                type="text"
                                name={`shortDescriptionOffer${index}`}
                                placeholder="Enter the description"
                                className="block w-full md:w-[215px] 2xl:w-[340px] rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                                value={formData.videoLink}
                                onChange={handleInputChange}
                                required
                                maxLength={50}
                              />
                            </div>

                            {/* Action Icons */}
                            <div className="flex justify-end space-x-4 col-span-2 mt-3">
                              <span className="text-blue-600 cursor-pointer hover:text-blue-700">
                                <FaSquarePlus />
                              </span>
                              <span className="text-red-500 hover:text-red-600 cursor-pointer w-4 h-4">
                                <FaTrash />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="col-span-1 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Section Title
                </label>
                <input
                  type="text"
                  name="sectionTitleTeam"
                  placeholder="e.g. 'Our Team'"
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  value={formData.sectionTitleTeam}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                />
              </div>
              <div className="col-span-2 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Section Description
                </label>
                <textarea
                  name="sectionDescriptionTeam"
                  placeholder="write something here..."
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  value={formData.sectionDescriptionTeam}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  maxLength={1000}
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="border border-gray-300 border-dashed rounded-xl px-4 py-8"
                >
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                    <div className="relative text-center">
                      {cards[index - 1].image ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(cards[index - 1].image!)}
                          alt="Uploaded image"
                          className="mx-auto w-16 h-16 object-cover"
                        />
                            <span
                              className="absolute top-0 right-0 cursor-pointer"
                              
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
                        name={`teamImage${index}`}
                        accept=".jpg,.jpeg,.png"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleImageChange(e, index - 1)}
                      />
                      <p className="mt-4 font-semibold text-blue-500">
                        Drag & Drop your Photo
                      </p>
                      <p className="text-gray-500">
                        here or Browse up to 10 MB
                      </p>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter Person's Name..."
                    value={cards[index - 1].name}
                    onChange={(e) => handleNameChange(e, index - 1)}
                    className="border-none focus:ring-0 w-full mt-2 placeholder:text-lg"
                  />
                  <input
                    type="text"
                    placeholder="Enter their role..."
                    value={cards[index - 1].role}
                    onChange={(e) => handleRoleChange(e, index - 1)}
                    className="border-none focus:ring-0 w-full"
                  />
                  <textarea
                    rows={2}
                    placeholder="Enter a short biography"
                    value={cards[index - 1].biography}
                    onChange={(e) => handleBiographyChange(e, index - 1)}
                    className="border-none focus:ring-0 resize-none w-full placeholder:font-medium"
                  />
                  <div className="flex justify-end space-x-3 my-4">
                    <button
                      onClick={() => toggleLinkInput(index - 1)}
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
                      onChange={(e) => handleIconChange(e, index - 1)}
                    />
                  </div>
                  {cards[index - 1].showLinkInput && (
                    <input
                      type="text"
                      placeholder="Enter the link"
                      value={cards[index - 1].link}
                      onChange={(e) => handleLinkChange(e, index - 1)}
                      className="border w-full mt-2 border-gray-400 rounded-lg"
                    />
                  )}
                  {cards[index - 1].icon && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(cards[index - 1].icon!)}
                        alt="Uploaded icon"
                        className="w-8 h-8 object-cover"
                      />
                    </div>
                  )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="col-span-1 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Section Title
                </label>
                <input
                  type="text"
                  name="sectionTitleStudents"
                  placeholder="e.g. 'Our Students'"
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  value={formData.sectionTitleStudents}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                />
              </div>
              <div className="col-span-2 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Section Description
                </label>
                <textarea
                  name="sectionDescriptionStudents"
                  placeholder="write something here..."
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  value={formData.sectionDescriptionStudents}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  maxLength={1000}
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-300 border-dashed rounded-xl px-4 py-8"
                >
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                      <div className="relative text-center">
                        {item.image ? (
                          <div className="relative">
                            <img
                              src={item.image ? URL.createObjectURL(item.image) : ""}
                              alt="Uploaded"
                              className="size-20 object-cover mx-auto"
                            />
                            <span
                              className="absolute top-0 right-0 cursor-pointer"
                              
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
                          className="absolute  opacity-0 inset-0 cursor-pointer"
                          onChange={(e) => handleStudentImageChange(index, e)}
                        />
                        <p className="mt-4 font-semibold text-blue-500">
                          Drag & Drop your Photo
                        </p>
                        <p className="text-gray-500">
                          here or Browse up to 10 MB
                        </p>
                      </div>
                    </div>

                  {/* Person's Name & Role */}
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

                  {/* Biography */}
                  <textarea
                    rows={2}
                    className="border-none focus:ring-0 resize-none w-full placeholder:font-medium"
                    placeholder="Enter a short biography"
                  />

                  {/* Link & Icon Buttons */}
                  <div className="flex justify-end space-x-3 my-4">
                    <button
                      onClick={() => toggleStudentLinkInput(index)}
                      className="bg-gray-100 text-sm xl:text-base px-1 xl:px-3 py-2 rounded-xl border border-gray-400"
                    >
                      Add Link +
                    </button>

                    <div className="relative">
                      <button className="bg-gray-100 text-sm xl:text-base px-1 xl:px-3 py-2 rounded-xl border border-gray-400">
                        Upload Icon +
                      </button>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleStudentIconChange(index, e)}
                      />
                    </div>
                  </div>

                  {/* Show link input if toggled */}
                  {item.showLinkInput && (
                    <input
                      type="text"
                      placeholder="Enter URL..."
                      value={item.link}
                      onChange={(e) =>
                        handleStudentLinkChange(index, e.target.value)
                      }
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    />
                  )}

                  {/* Display icon if uploaded */}
                  {item.icon && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(item.icon as File)}
                        alt="Icon"
                        className="w-12 h-12"
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
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

          {/* Quotation Section */}
          <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
            <h3 className="text-sky-800 text-xl font-semibold">
              10. Quotation Section
            </h3>
            <div className="col-span-1 mt-4">
              <label className="block text-sm/6 font-medium text-gray-900">
                Add Quote
              </label>
              <input
                type="text"
                name="addQuote"
                placeholder="write something here..."
                className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                value={formData.addQuote}
                onChange={handleInputChange}
                required
                maxLength={50}
              />
            </div>
            <div className="col-span-1 mt-4">
              <label className="block text-sm/6 font-medium text-gray-900">
                Name + Role
              </label>
              <input
                type="text"
                name="nameRole"
                placeholder="write something here..."
                className="block w-full md:w-1/2 rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                value={formData.nameRole}
                onChange={handleInputChange}
                required
                maxLength={50}
              />
            </div>
          </section>

          {/* Photo Album Section */}
          <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
            <h3 className="text-sky-800 text-xl font-semibold">
              11. Photo Album Section
            </h3>
            <p className="my-2">Label's Name</p>
            <div className="bg-gray-200 w-40 space-x-4 px-2 my-2 py-2 rounded-full flex justify-center items-center">
              <span className="bg-sky-700 h-2 w-2 rounded-full"></span>
              <span className="text-gray-400">e.g., "Photos"</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="col-span-1 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Section Title
                </label>
                <input
                  type="text"
                  name="sectionTitlePhoto"
                  placeholder="e.g. 'Photo Album'"
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  value={formData.sectionTitlePhoto}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                />
              </div>
              <div className="col-span-2 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Section Description
                </label>
                <textarea
                  name="sectionDescriptionPhoto"
                  placeholder="write something here..."
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  value={formData.sectionDescriptionPhoto}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  maxLength={1000}
                />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2"
                >
                  <div className="relative text-center">
                    {files[`photoAlbumImage${index}`] ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(
                            files[`photoAlbumImage${index}`] as File
                          )}
                          alt={`Photo Album Image ${index} Preview`}
                          className="mx-auto w-16 h-16 object-cover"
                        />
                        <span
                          className="absolute top-0 right-0 cursor-pointer"
                          onClick={() =>
                            setFiles((prev) => ({
                              ...prev,
                              [`photoAlbumImage${index}`]: null,
                            }))
                          }
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
                      name={`photoAlbumImage${index}`}
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleFileChange(e, `photoAlbumImage${index}`)
                      }
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <p className="mt-4 font-semibold text-blue-500">
                      Drag & Drop your Photo
                    </p>
                    <p className="text-gray-500">here or Browse up to 10 MB</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Newsletter/Archive Document Section */}
          <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
            <h3 className="text-sky-800 text-xl font-semibold">
              12. Newsletter/Archive Document Section
            </h3>
            <p className="my-2">Label's Name</p>
            <div className="bg-gray-200 w-48 space-x-4 px-2 my-2 py-2 rounded-full flex justify-center items-center">
              <span className="bg-sky-700 h-2 w-2 rounded-full"></span>
              <span className="text-gray-400">e.g., "Newsletter"</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="col-span-1 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Section Title
                </label>
                <input
                  type="text"
                  name="sectionTitleNewsletter"
                  placeholder="e.g. 'Newsletter'"
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  value={formData.sectionTitleNewsletter}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                />
              </div>
              <div className="col-span-2 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Section Description
                </label>
                <textarea
                  name="sectionDescriptionNewsletter"
                  placeholder="write something here..."
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  value={formData.sectionDescriptionNewsletter}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  maxLength={1000}
                />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
              {[1, 2].map((index) => (
                <div
                  key={index}
                  className="border border-gray-300 xl:space-x-2 rounded-md border-dashed px-3 py-5 flex flex-col xl:flex-row space-y-4 xl:space-y-0 justify-between"
                >
                  <div>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                      <div className="relative text-center">
                        {files[`newsletterImage${index}`] ? (
                          <div className="relative">
                            <img
                              src={URL.createObjectURL(
                                files[`newsletterImage${index}`] as File
                              )}
                              alt={`Newsletter Image ${index} Preview`}
                              className="mx-auto w-16 h-16 object-cover"
                            />
                            <span
                              className="absolute top-0 right-0 cursor-pointer"
                              onClick={() =>
                                setFiles((prev) => ({
                                  ...prev,
                                  [`newsletterImage${index}`]: null,
                                }))
                              }
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
                          name={`newsletterImage${index}`}
                          accept=".jpg,.jpeg,.png"
                          onChange={(e) =>
                            handleFileChange(e, `newsletterImage${index}`)
                          }
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <p className="mt-4 font-semibold text-blue-500">
                          Drag & Drop your Photo
                        </p>
                        <p className="text-gray-500">
                          here or Browse up to 10 MB
                        </p>
                      </div>
                    </div>
                    <input
                      type="text"
                      className="w-full border-dashed rounded-lg border border-gray-400 mt-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                      placeholder="Enter Downloadable URL"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between mb-1">
                      <label
                        htmlFor={`date${index}`}
                        className="text-gray-500 block"
                      >
                        Date:
                      </label>
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
                    </div>
                    <input
                      type="text"
                      placeholder="Enter the date"
                      name={`date${index}`}
                      className="border w-full border-dashed border-gray-400 rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    />
                    <label
                      htmlFor={`title${index}`}
                      className="text-gray-500 block"
                    >
                      Title:
                    </label>
                    <input
                      type="text"
                      placeholder="write something here..."
                      className="border w-full border-dashed border-gray-400 rounded-lg text-gray-400 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    />
                    <label
                      htmlFor={`description${index}`}
                      className="text-gray-500 block"
                    >
                      Short Description:
                    </label>
                    <input
                      type="text"
                      placeholder="write something here..."
                      className="border w-full border-dashed border-gray-400 rounded-lg text-gray-400 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Live Moments: Follow Us Section */}
          <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white space-y-5 py-10">
            <h3 className="text-sky-800 font-medium text-xl">
              13. Live Moments: Follow Us
            </h3>
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row-reverse items-center justify-between"
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
                  <label htmlFor={`liveMoments${index}`} className="block">
                    Choose link or Embed code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the link or embed code"
                    name={`liveMoments${index}`}
                    className="border w-full md:w-[90%] mt-2 border-gray-400 border-dashed rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  />
                </div>
              </div>
            ))}
          </section>

          {/* Global Goals (SDGs) Section */}
          <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
            <h3 className="text-sky-800 text-xl font-semibold">
              14. Global Goals (SDGs)
            </h3>
            <p className="my-2">Label's Name</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="col-span-1 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Section Title
                </label>
                <input
                  type="text"
                  name="sectionTitleSDGs"
                  placeholder="e.g. 'Sustainable Development Goals'"
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  value={formData.sectionTitleSDGs}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                />
              </div>
              <div className="col-span-2 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Section Text
                </label>
                <textarea
                  name="sectionTextSDGs"
                  placeholder="write something here..."
                  className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  value={formData.sectionTextSDGs}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  maxLength={1000}
                />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2"
                >
                  <div className="relative text-center">
                    {files[`sdgsImage${index}`] ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(
                            files[`sdgsImage${index}`] as File
                          )}
                          alt={`SDGs Image ${index} Preview`}
                          className="mx-auto w-16 h-16 object-cover"
                        />
                        <span
                          className="absolute top-0 right-0 cursor-pointer"
                          onClick={() =>
                            setFiles((prev) => ({
                              ...prev,
                              [`sdgsImage${index}`]: null,
                            }))
                          }
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
                      name={`sdgsImage${index}`}
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, `sdgsImage${index}`)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <p className="mt-4 font-semibold text-blue-500">
                      Drag & Drop your Photo
                    </p>
                    <p className="text-gray-500">here or Browse up to 10 MB</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Related Links Section */}
          <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white space-y-5 py-10">
            <h3 className="text-sky-800 font-medium text-xl">
              15. Related Links
            </h3>
            {[1, 2, 3].map((index) => (
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
                  <label htmlFor={`buttonLink${index}`} className="block">
                    Button's Link
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the URL"
                    name={`buttonLink${index}`}
                    className="border w-full mt-2 border-gray-400 border-dashed rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  />
                </div>
                <div className="w-full">
                  <label htmlFor={`buttonName${index}`} className="block">
                    Button's Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter the button's name"
                    name={`buttonName${index}`}
                    className="border w-full mt-2 border-gray-400 border-dashed rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  />
                </div>
              </div>
            ))}
          </section>

          {/* Final Call to Action / Statement Section */}
          <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
            <h3 className="text-xl font-medium text-sky-800">
              16. Final Call to Action / Statement
            </h3>
            <label htmlFor="finalStatement" className="block mt-4">
              Final Big Statement
            </label>
            <input
              type="text"
              name="finalStatement"
              placeholder="write something here..."
              className="border w-full mt-2 border-gray-400 border-dashed rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
              value={formData.finalStatement}
              onChange={handleInputChange}
            />
          </section>

          {/* Navigation Settings Section */}
          <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white space-y-4">
            <h3 className="text-xl font-medium text-sky-800">
              Navigation Settings
            </h3>
            <div className="flex space-x-5 items-center">
              <input
                type="checkbox"
                className="border border-gray-400 rounded"
              />
              <div>
                <span className="block text-gray-700">
                  Show in Main Navigation
                </span>
                <span className="block text-sm text-gray-600">
                  Enable this option if you want this program/project to appear
                  in the main site menu.
                </span>
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <h4 className="text-gray-700">Navigation Label</h4>
              <p className="text-gray-600 text-sm">
                Only visible if toggle is enabled. This is the name that will
                appear in the top menu. Leave blank to use the Project Title.
              </p>
              <input
                type="text"
                name="navigationLabel"
                placeholder="write something here..."
                className="border w-full mt-2 border-gray-400 border-dashed rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                value={formData.navigationLabel}
                onChange={handleInputChange}
              />
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-between mb-10">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-sky-800 hover:opacity-90 text-white px-4 md:px-10 py-1 md:py-3 rounded-md disabled:opacity-50"
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
        </div>
      </main>
    </div>
  );
}
