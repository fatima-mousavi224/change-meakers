"use client";
import React, { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import firebaseApp from "lib/firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { FaSquarePlus, FaTrash } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import { BsArrowRight } from "react-icons/bs";
import Tabs from "@/components/create-project-tabs/Tabs";
// FormData interface
const FormDataInterface = {
  projectTitle: "",
  cardDescription: "",
  heroTitle: "",
  subheading: "",
  slogan: "",
  buttonName: "",
  buttonLink: "",
  iconTitleStatus1: "",
  shortDescriptionStatus1: "",
  iconTitleStatus2: "",
  shortDescriptionStatus2: "",
  visionTitle: "",
  visionText: "",
  goalTitle: "",
  goalText: "",
  sectionTitleAbout: "",
  bodyText: "",
  buttonName2: "",
  buttonLink2: "",
  sectionTitleVoices: "",
  sectionDescriptionVoices: "",
  heroTitleMedia: "",
  shortDescriptionMedia: "",
  videoLink: "",
  fullVideoDescription: "",
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
  [key: string]: File | null;
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

// TeamCard interface
interface TeamCard {
  image: File | null;
  name: string;
  role: string;
  biography: string;
  link: string;
  icon: File | null;
  showLinkInput: boolean;
}

// StudentItem interface
interface StudentItem {
  image: File | null;
  link: string;
  showLinkInput: boolean;
  icon: File | null;
  name: string;
  role: string;
  biography: string;
}

export default function CreateNewProject() {
  // React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      ...FormDataInterface,
      teamCards: [
        { name: "", role: "", biography: "", link: "", showLinkInput: false },
        { name: "", role: "", biography: "", link: "", showLinkInput: false },
        { name: "", role: "", biography: "", link: "", showLinkInput: false },
      ],
      studentItems: Array.from({ length: 3 }, () => ({
        link: "",
        showLinkInput: false,
        name: "",
        role: "",
        biography: "",
      })),
      voices: Array.from({ length: 3 }, () => ({
        quote: "",
        name: "",
        description: "",
      })),
      liveMoments: Array.from({ length: 3 }, () => ({ link: "" })),
      relatedLinks: Array.from({ length: 3 }, () => ({
        buttonName: "",
        buttonLink: "",
      })),
      newsletterItems: Array.from({ length: 2 }, () => ({
        date: "",
        title: "",
        description: "",
        url: "",
      })),
      offerIcons: Array.from({ length: 2 }, () => ({
        iconTitle: "",
        shortDescription: "",
      })),
      showInMainNavigation: false,
    },
  });

  // State for files and previews
  const [files, setFiles] = useState<FilesState>(FilesStateInterface);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );
  const [offerIcons, setOfferIcons] = useState<(string | null)[]>([null, null]);
  const [iconPreviews, setIconPreviews] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);
  const [iconPreview1, setIconPreview1] = useState<string | null>(null);
  const [iconPreview2, setIconPreview2] = useState<string | null>(null);
  const [teamCardFiles, setTeamCardFiles] = useState<{
    images: (File | null)[];
    icons: (File | null)[];
  }>({ images: [null, null, null], icons: [null, null, null] });
  const [studentFiles, setStudentFiles] = useState<{
    images: (File | null)[];
    icons: (File | null)[];
  }>({ images: [null, null, null], icons: [null, null, null] });
  const [voicesIcons, setVoicesIcons] = useState<(File | null)[]>([
    null,
    null,
    null,
  ]);

  // File input refs for uncontrolled file inputs
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Update the ref type and setter
  const setRef =
    (key: string) =>
    (el: HTMLInputElement | null): void => {
      fileInputRefs.current[key] = el;
    };

  // Handlers
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

    // Create a preview URL for display
    const previewUrl = URL.createObjectURL(file);
    setFiles((prev) => ({ ...prev, [field]: file }));
    // Also set the preview
    setImagePreviews((prev) => ({ ...prev, [field]: previewUrl }));
  };

  const handleOfferIconChange = (index: number, file: File | null) => {
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setOfferIcons((prev) => {
      const updated = [...prev];
      updated[index] = imageUrl;
      return updated;
    });
  };

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

  const handleStudentIconPreviewChange = (index: number, file: File | null) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setIconPreviews((prev) => {
        const newPreviews = [...prev];
        newPreviews[index] = imageUrl;
        return newPreviews;
      });
      setVoicesIcons((prev) => {
        const newIcons = [...prev];
        newIcons[index] = file;
        return newIcons;
      });
    }
  };

  const handleTeamImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setTeamCardFiles((prev) => {
        const newImages = [...prev.images];
        newImages[index] = file;
        return { ...prev, images: newImages };
      });
      handleImagePreview(file, `teamImage${index}`);
    }
  };

  const handleTeamIconChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setTeamCardFiles((prev) => {
        const newIcons = [...prev.icons];
        newIcons[index] = file;
        return { ...prev, icons: newIcons };
      });
    }
  };

  const handleStudentImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setStudentFiles((prev) => {
        const newImages = [...prev.images];
        newImages[index] = file;
        return { ...prev, images: newImages };
      });
      handleImagePreview(file, `studentImage${index}`);
    }
  };

  const handleStudentIconChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setStudentFiles((prev) => {
        const newIcons = [...prev.icons];
        newIcons[index] = file;
        return { ...prev, icons: newIcons };
      });
    }
  };

  const toggleLinkInput = (index: number, type: "team" | "student") => {
    const field = type === "team" ? "teamCards" : "studentItems";
    setValue(
      `${field}.${index}.showLinkInput`,
      !getValues(`${field}.${index}.showLinkInput`)
    );
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

  // Add a new function to handle image previews
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string }>(
    {}
  );

  const handleImagePreview = (file: File, field: string) => {
    const previewUrl = URL.createObjectURL(file);
    setImagePreviews((prev) => ({ ...prev, [field]: previewUrl }));
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // Validate required fields
      if (
        !data.projectTitle ||
        !data.cardDescription ||
        !data.heroTitle ||
        !data.subheading ||
        !data.slogan ||
        !data.buttonName ||
        !data.buttonLink ||
        !data.iconTitleStatus1 ||
        !data.shortDescriptionStatus1 ||
        !data.iconTitleStatus2 ||
        !data.shortDescriptionStatus2 ||
        !data.visionTitle ||
        !data.visionText ||
        !data.goalTitle ||
        !data.goalText ||
        !data.sectionTitleAbout ||
        !data.bodyText ||
        !data.buttonName2 ||
        !data.buttonLink2 ||
        !data.sectionTitleVoices ||
        !data.sectionDescriptionVoices ||
        !data.heroTitleMedia ||
        !data.shortDescriptionMedia ||
        !data.videoLink ||
        !data.fullVideoDescription ||
        !data.sectionTitleTeam ||
        !data.sectionDescriptionTeam ||
        !data.sectionTitleStudents ||
        !data.sectionDescriptionStudents ||
        !data.addQuote ||
        !data.nameRole ||
        !data.sectionTitlePhoto ||
        !data.sectionDescriptionPhoto ||
        !data.sectionTitleNewsletter ||
        !data.sectionDescriptionNewsletter ||
        !data.sectionTitleSDGs ||
        !data.sectionTextSDGs ||
        !data.finalStatement
      ) {
        setSubmitStatus("error");
        setSubmitMessage("Please fill in all required fields");
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      // Prepare file uploads
      const uploadedFiles: { [key: string]: string } = {};
      const fileFields = Object.keys(FilesStateInterface);

      // Upload all main files
      for (const field of fileFields) {
        const file = files[field];
        if (file) {
          const url = await uploadImageUrl(file, `projects/${field}`);
          uploadedFiles[field] = url;
        }
      }

      // Upload status icons (iconPreview1, iconPreview2)
      const statusIcons: string[] = [];
      if (iconPreview1) {
        // Find the file from the ref
        const icon1File = fileInputRefs.current.icon1?.files?.[0];
        if (icon1File) {
          const url = await uploadImageUrl(
            icon1File,
            `projects/statusIcons/icon1`
          );
          statusIcons[0] = url;
        }
      }
      if (iconPreview2) {
        // Find the file from the ref
        const icon2File = fileInputRefs.current.icon2?.files?.[0];
        if (icon2File) {
          const url = await uploadImageUrl(
            icon2File,
            `projects/statusIcons/icon2`
          );
          statusIcons[1] = url;
        }
      }

      // Upload offer icons
      const offerIconUrls: string[] = [];
      for (let i = 0; i < offerIcons.length; i++) {
        if (offerIcons[i]) {
          // Find the file from the ref
          const offerIconFile =
            fileInputRefs.current[`offerIcon${i}`]?.files?.[0];
          if (offerIconFile) {
            const url = await uploadImageUrl(
              offerIconFile,
              `projects/offerIcons/${i}`
            );
            offerIconUrls[i] = url;
          }
        }
      }

      // Validate that at least one offer icon has both URL and title
      const hasValidOfferIcons = offerIconUrls.some(
        (url, index) => url && data.offerIcons[index]?.iconTitle
      );

      console.log("Offer icon validation:", {
        offerIconUrls,
        offerIconsData: data.offerIcons,
        hasValidOfferIcons,
        validationResult: offerIconUrls.map((url, index) => ({
          url,
          title: data.offerIcons[index]?.iconTitle,
          isValid: url && data.offerIcons[index]?.iconTitle,
        })),
      });

      if (!hasValidOfferIcons) {
        setSubmitStatus("error");
        setSubmitMessage(
          "Please add at least one offer icon with both image and title"
        );
        toast.error(
          "Please add at least one offer icon with both image and title"
        );
        setIsSubmitting(false);
        return;
      }

      // Upload team card images and icons
      const teamCardImages: string[] = [];
      const teamCardIcons: string[] = [];
      for (let i = 0; i < teamCardFiles.images.length; i++) {
        if (teamCardFiles.images[i]) {
          const url = await uploadImageUrl(
            teamCardFiles.images[i]!,
            `projects/team/images/${i}`
          );
          teamCardImages[i] = url;
        }
        if (teamCardFiles.icons[i]) {
          const url = await uploadImageUrl(
            teamCardFiles.icons[i]!,
            `projects/team/icons/${i}`
          );
          teamCardIcons[i] = url;
        }
      }

      // Upload student images and icons
      const studentImages: string[] = [];
      const studentIcons: string[] = [];
      for (let i = 0; i < studentFiles.images.length; i++) {
        if (studentFiles.images[i]) {
          const url = await uploadImageUrl(
            studentFiles.images[i]!,
            `projects/students/images/${i}`
          );
          studentImages[i] = url;
        }
        if (studentFiles.icons[i]) {
          const url = await uploadImageUrl(
            studentFiles.icons[i]!,
            `projects/students/icons/${i}`
          );
          studentIcons[i] = url;
        }
      }

      // Upload voices icons
      const voicesIconUrls: string[] = [];
      for (let i = 0; i < voicesIcons.length; i++) {
        if (voicesIcons[i]) {
          const url = await uploadImageUrl(
            voicesIcons[i]!,
            `projects/voices/icons/${i}`
          );
          voicesIconUrls[i] = url;
        }
      }

      // Combine all data with Firebase Storage URLs
      const formDataToSend = {
        ...data,
        uploadedFiles,
        teamCards: data.teamCards
          .filter((card: any) => card.name && card.role && card.biography)
          .map((card: any, index: number) => ({
            ...card,
            image: teamCardImages[index] || null,
            icon: teamCardIcons[index] || null,
          })),
        studentItems: data.studentItems
          .filter((item: any) => item.name && item.role && item.biography)
          .map((item: any, index: number) => ({
            ...item,
            image: studentImages[index] || null,
            icon: studentIcons[index] || null,
          })),
        voices: data.voices
          .filter(
            (voice: any) => voice.quote && voice.name && voice.description
          )
          .map((voice: any, index: number) => ({
            ...voice,
            icon: voicesIconUrls[index] || null,
          })),
        liveMoments: data.liveMoments
          .filter((moment: any) => moment.link)
          .map((moment: any) => ({
            ...moment,
          })),
        relatedLinks: data.relatedLinks
          .filter((link: any) => link.buttonName && link.buttonLink)
          .map((link: any) => ({
            ...link,
          })),
        newsletterItems: data.newsletterItems
          .filter((item: any) => item.title && item.description && item.date)
          .map((item: any) => ({
            ...item,
            date: item.date || new Date().toISOString().split("T")[0], // Ensure valid date format
          })),
        offerIcons: offerIconUrls
          .filter((url) => url)
          .map((url: string, index: number) => ({
            url: url,
            iconTitle: data.offerIcons[index]?.iconTitle || "",
            shortDescription: data.offerIcons[index]?.shortDescription || "",
          })),
        ...(statusIcons[0] && { iconPreview1: statusIcons[0] }),
        ...(statusIcons[1] && { iconPreview2: statusIcons[1] }),
        // Add all the new form fields
        subheading: data.subheading,
        slogan: data.slogan,
        buttonName: data.buttonName,
        buttonLink: data.buttonLink,
        visionTitle: data.visionTitle,
        visionText: data.visionText,
        goalTitle: data.goalTitle,
        goalText: data.goalText,
        sectionTitleAbout: data.sectionTitleAbout,
        bodyText: data.bodyText,
        buttonName2: data.buttonName2,
        buttonLink2: data.buttonLink2,
        heroTitleMedia: data.heroTitleMedia,
        shortDescriptionMedia: data.shortDescriptionMedia,
        videoLink: data.videoLink,
        fullVideoDescription: data.fullVideoDescription,
        addQuote: data.addQuote,
        nameRole: data.nameRole,
        sectionTitlePhoto: data.sectionTitlePhoto,
        sectionDescriptionPhoto: data.sectionDescriptionPhoto,
        sectionTitleSDGs: data.sectionTitleSDGs,
        sectionTextSDGs: data.sectionTextSDGs,
        finalStatement: data.finalStatement,
      };
      console.log("🚀 ~ onSubmit ~ formDataToSend:", formDataToSend);
      // Remove empty properties but keep required fields
      const cleanFormData = Object.fromEntries(
        Object.entries(formDataToSend).filter(([key, value]) => {
          // Always keep these special fields and required fields
          if (
            key === "uploadedFiles" ||
            key === "teamCards" ||
            key === "studentItems" ||
            key === "voices" ||
            key === "liveMoments" ||
            key === "relatedLinks" ||
            key === "newsletterItems" ||
            key === "offerIcons" ||
            key === "iconPreview1" ||
            key === "iconPreview2" ||
            key === "showInMainNavigation" ||
            key === "projectTitle" ||
            key === "cardDescription" ||
            key === "heroTitle" ||
            key === "subheading" ||
            key === "slogan" ||
            key === "buttonName" ||
            key === "buttonLink" ||
            key === "visionTitle" ||
            key === "visionText" ||
            key === "goalTitle" ||
            key === "goalText" ||
            key === "sectionTitleAbout" ||
            key === "bodyText" ||
            key === "buttonName2" ||
            key === "buttonLink2" ||
            key === "heroTitleMedia" ||
            key === "shortDescriptionMedia" ||
            key === "videoLink" ||
            key === "fullVideoDescription" ||
            key === "addQuote" ||
            key === "nameRole" ||
            key === "sectionTitlePhoto" ||
            key === "sectionDescriptionPhoto" ||
            key === "sectionTitleSDGs" ||
            key === "sectionTextSDGs" ||
            key === "finalStatement" ||
            key === "navigationLabel"
          ) {
            return true; // Keep these fields
          }
          // For other fields, only keep if they have values
          return value !== "" && value !== null && value !== undefined;
        })
      );

      console.log("🚀 ~ onSubmit ~ formDataToSend:", formDataToSend);
      console.log("Required fields check:", {
        projectTitle: data.projectTitle,
        cardDescription: data.cardDescription,
        heroTitle: data.heroTitle,
      });
      console.log("Offer Icons data:", {
        formData: data.offerIcons,
        urls: offerIconUrls,
        final: cleanFormData.offerIcons,
      });
      console.log("Final clean data being sent:", cleanFormData);

      // Test the data structure
      const testData = {
        projectTitle: cleanFormData.projectTitle,
        cardDescription: cleanFormData.cardDescription,
        heroTitle: cleanFormData.heroTitle,
        offerIcons: cleanFormData.offerIcons,
        iconPreview1: cleanFormData.iconPreview1,
        iconPreview2: cleanFormData.iconPreview2,
      };
      console.log("Test data structure:", testData);

      // Send to API
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanFormData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setSubmitMessage("Project created successfully!");
        toast.success("Project created successfully!");
        // Reset form and previews
        setFiles(FilesStateInterface);
        setImagePreviews({});
        setOfferIcons([null, null]);
        setIconPreviews([null, null, null]);
        setIconPreview1(null);
        setIconPreview2(null);
        setTeamCardFiles({
          images: [null, null, null],
          icons: [null, null, null],
        });
        setStudentFiles({
          images: [null, null, null],
          icons: [null, null, null],
        });
        setVoicesIcons([null, null, null]);
        // Reset form values
        Object.keys(FormDataInterface).forEach((key) => {
          setValue(key as any, "");
        });
        setValue(
          "offerIcons",
          Array.from({ length: 2 }, () => ({
            iconTitle: "",
            shortDescription: "",
          }))
        );
      } else {
        setSubmitStatus("error");
        setSubmitMessage(
          result.error ||
            result.message ||
            `Error creating project: ${response.status}`
        );
        toast.error(result.message || "Error creating project");
        console.error("API Error Details:", result.message);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
      setSubmitMessage("Error submitting form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setFiles(FilesStateInterface);
    setImagePreviews({});
    setOfferIcons([null, null]);
    setIconPreviews([null, null, null]);
    setIconPreview1(null);
    setIconPreview2(null);
    setTeamCardFiles({ images: [null, null, null], icons: [null, null, null] });
    setStudentFiles({ images: [null, null, null], icons: [null, null, null] });
    setVoicesIcons([null, null, null]);
    Object.keys(fileInputRefs.current).forEach((key) => {
      if (fileInputRefs.current[key]) {
        fileInputRefs.current[key]!.value = "";
      }
    });
    // Reset all form values
    Object.keys(FormDataInterface).forEach((key) => {
      setValue(key as any, "");
    });
    // Reset array fields
    setValue("teamCards", [
      { name: "", role: "", biography: "", link: "", showLinkInput: false },
      { name: "", role: "", biography: "", link: "", showLinkInput: false },
      { name: "", role: "", biography: "", link: "", showLinkInput: false },
    ]);
    setValue(
      "studentItems",
      Array.from({ length: 3 }, () => ({
        link: "",
        showLinkInput: false,
        name: "",
        role: "",
        biography: "",
      }))
    );
    setValue(
      "voices",
      Array.from({ length: 3 }, () => ({
        quote: "",
        name: "",
        description: "",
      }))
    );
    setValue(
      "liveMoments",
      Array.from({ length: 3 }, () => ({ link: "" }))
    );
    setValue(
      "relatedLinks",
      Array.from({ length: 3 }, () => ({
        buttonName: "",
        buttonLink: "",
      }))
    );
    setValue(
      "newsletterItems",
      Array.from({ length: 2 }, () => ({
        date: "",
        title: "",
        description: "",
        url: "",
      }))
    );
    setValue(
      "offerIcons",
      Array.from({ length: 2 }, () => ({
        iconTitle: "",
        shortDescription: "",
      }))
    );
    setValue("showInMainNavigation", false);
  };

  return (
    <div className="flex mt-4 max-w-screen-2xl mx-auto">
      <main className="mx-auto">
        <h2 className="text-lg md:text-3xl font-bold text-sky-800 my-6 text-center md:text-left">
          Create New Project
        </h2>
       <Tabs />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-12 space-y-8 md:w-full lg:w-full xl:w-[1000px] 2xl:w-[60vw]"
        >
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
                <Controller
                  name="projectTitle"
                  control={control}
                  rules={{
                    required: "Project Title is required",
                    maxLength: 50,
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="write something here..."
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    />
                  )}
                />
                {errors.projectTitle && (
                  <p className="text-red-500 text-sm">
                    {errors.projectTitle.message}
                  </p>
                )}
              </div>
              <div className="col-span-5">
                <label className="block text-sm/6 font-medium text-gray-900 mt-4 md:mt-0">
                  Card Description
                </label>
                <Controller
                  name="cardDescription"
                  control={control}
                  rules={{
                    required: "Card Description is required",
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
                {errors.cardDescription && (
                  <p className="text-red-500 text-sm">
                    {errors.cardDescription.message}
                  </p>
                )}
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
                            src={imagePreviews.cardImage}
                            alt="Card Image Preview"
                            className="mx-auto w-16 h-16 object-cover"
                          />
                          <span
                            className="absolute top-0 right-0 cursor-pointer"
                            onClick={() => {
                              setFiles((prev) => ({
                                ...prev,
                                cardImage: null,
                              }));
                              setImagePreviews((prev) => {
                                const newPreviews = { ...prev };
                                delete newPreviews.cardImage;
                                return newPreviews;
                              });
                              if (fileInputRefs.current.cardImage) {
                                fileInputRefs.current.cardImage.value = "";
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
                        onChange={(e) => handleFileChange(e, "cardImage")}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        ref={setRef("cardImage")}
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
                            src={imagePreviews.heroImage}
                            alt="Hero Image Preview"
                            className="mx-auto w-16 h-16 object-cover"
                          />
                          <span
                            className="absolute top-0 right-0 cursor-pointer"
                            onClick={() => {
                              setFiles((prev) => ({
                                ...prev,
                                heroImage: null,
                              }));
                              setImagePreviews((prev) => {
                                const newPreviews = { ...prev };
                                delete newPreviews.heroImage;
                                return newPreviews;
                              });
                              if (fileInputRefs.current.heroImage) {
                                fileInputRefs.current.heroImage.value = "";
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
                        onChange={(e) => handleFileChange(e, "heroImage")}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        ref={setRef("heroImage")}
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
                  <Controller
                    name="heroTitle"
                    control={control}
                    rules={{
                      required: "Hero Title is required",
                      maxLength: 50,
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="write something here..."
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                      />
                    )}
                  />
                  {errors.heroTitle && (
                    <p className="text-red-500 text-sm">
                      {errors.heroTitle.message}
                    </p>
                  )}
                </div>
                <div className="col-span-1 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Subheading
                  </label>
                  <Controller
                    name="subheading"
                    control={control}
                    rules={{
                      required: "Subheading is required",
                      maxLength: 50,
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="write something here..."
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                      />
                    )}
                  />
                  {errors.subheading && (
                    <p className="text-red-500 text-sm">
                      {errors.subheading.message}
                    </p>
                  )}
                </div>
                <div className="col-span-1 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Subheading Line or Slogan
                  </label>
                  <Controller
                    name="slogan"
                    control={control}
                    rules={{
                      required: "Slogan is required",
                      maxLength: 50,
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="write something here..."
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                      />
                    )}
                  />
                  {errors.slogan && (
                    <p className="text-red-500 text-sm">
                      {errors.slogan.message}
                    </p>
                  )}
                </div>
                <div className="col-span-1 mt-4 md:mt-0 relative">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Button Name
                  </label>
                  <Controller
                    name="buttonName"
                    control={control}
                    rules={{
                      required: "Button Name is required",
                      maxLength: 50,
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Enter the button's name"
                        className="block w-full border rounded-full border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                      />
                    )}
                  />
                  {errors.buttonName && (
                    <p className="text-red-500 text-sm">
                      {errors.buttonName.message}
                    </p>
                  )}
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
                  <Controller
                    name="buttonLink"
                    control={control}
                    rules={{
                      required: "Button Link is required",
                      maxLength: 200,
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Enter the URL"
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                      />
                    )}
                  />
                  {errors.buttonLink && (
                    <p className="text-red-500 text-sm">
                      {errors.buttonLink.message}
                    </p>
                  )}
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
                      onChange={(e) =>
                        handleIconPreviewChange(e, setIconPreview1)
                      }
                      ref={setRef("icon1")}
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
                      <Controller
                        name="iconTitleStatus1"
                        control={control}
                        rules={{ required: "Title is required", maxLength: 50 }}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            placeholder="Enter the title"
                            className="block w-full md:w-[215px] 2xl:w-[340px] rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                          />
                        )}
                      />
                      {errors.iconTitleStatus1 && (
                        <p className="text-red-500 text-sm">
                          {errors.iconTitleStatus1.message}
                        </p>
                      )}
                    </div>
                    <div className="col-span-1 mt-4 md:mt-0">
                      <label className="block text-sm/6 font-medium text-gray-900">
                        Short Description
                      </label>
                      <Controller
                        name="shortDescriptionStatus1"
                        control={control}
                        rules={{
                          required: "Short Description is required",
                          maxLength: 200,
                        }}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            placeholder="Enter short description"
                            className="block w-full md:w-[215px] 2xl:w-[340px] rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                            rows={3}
                          />
                        )}
                      />
                      {errors.shortDescriptionStatus1 && (
                        <p className="text-red-500 text-sm">
                          {errors.shortDescriptionStatus1.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Status & Icons section */}
              <div className="bg-white rounded-lg shadow px-3 py-6 col-span-1">
                <h2 className="text-sky-800 text-xl font-semibold pl-4">
                  2. Status & Icons (Second)
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
                      onChange={(e) =>
                        handleIconPreviewChange(e, setIconPreview2)
                      }
                      ref={setRef("icon2")}
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
                      <Controller
                        name="iconTitleStatus2"
                        control={control}
                        rules={{ required: "Title is required", maxLength: 50 }}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            placeholder="Enter the title"
                            className="block w-full md:w-[215px] 2xl:w-[340px] rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                          />
                        )}
                      />
                      {errors.iconTitleStatus2 && (
                        <p className="text-red-500 text-sm">
                          {errors.iconTitleStatus2.message}
                        </p>
                      )}
                    </div>
                    <div className="col-span-1 mt-4 md:mt-0">
                      <label className="block text-sm/6 font-medium text-gray-900">
                        Short Description
                      </label>
                      <Controller
                        name="shortDescriptionStatus2"
                        control={control}
                        rules={{
                          required: "Short Description is required",
                          maxLength: 200,
                        }}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            placeholder="Enter short description"
                            className="block w-full md:w-[215px] 2xl:w-[340px] rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                            rows={3}
                          />
                        )}
                      />
                      {errors.shortDescriptionStatus2 && (
                        <p className="text-red-500 text-sm">
                          {errors.shortDescriptionStatus2.message}
                        </p>
                      )}
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
                <Controller
                  name="visionTitle"
                  control={control}
                  rules={{
                    required: "Vision Title is required",
                    maxLength: 50,
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="e.g. 'Our Vision'"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    />
                  )}
                />
                {errors.visionTitle && (
                  <p className="text-red-500 text-sm">
                    {errors.visionTitle.message}
                  </p>
                )}
              </div>
              <div className="col-span-1 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Vision Text
                </label>
                <Controller
                  name="visionText"
                  control={control}
                  rules={{
                    required: "Vision Text is required",
                    maxLength: 200,
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="write something here..."
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    />
                  )}
                />
                {errors.visionText && (
                  <p className="text-red-500 text-sm">
                    {errors.visionText.message}
                  </p>
                )}
              </div>
              <div className="col-span-1 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Goal Title
                </label>
                <Controller
                  name="goalTitle"
                  control={control}
                  rules={{
                    required: "Goal Title is required",
                    maxLength: 50,
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="e.g. 'Our Goal'"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    />
                  )}
                />
                {errors.goalTitle && (
                  <p className="text-red-500 text-sm">
                    {errors.goalTitle.message}
                  </p>
                )}
              </div>
              <div className="col-span-1 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Goal Text
                </label>
                <Controller
                  name="goalText"
                  control={control}
                  rules={{
                    required: "Goal Text is required",
                    maxLength: 200,
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="write something here..."
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    />
                  )}
                />
                {errors.goalText && (
                  <p className="text-red-500 text-sm">
                    {errors.goalText.message}
                  </p>
                )}
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
                          <img
                            src={imagePreviews[`visionGoalImage${index}`]}
                            alt={`Vision Goal Image ${index} Preview`}
                            className="mx-auto w-16 h-16 object-cover"
                          />
                          <span
                            className="absolute top-0 right-0 cursor-pointer"
                            onClick={() => {
                              setFiles((prev) => ({
                                ...prev,
                                [`visionGoalImage${index}`]: null,
                              }));
                              setImagePreviews((prev) => {
                                const newPreviews = { ...prev };
                                delete newPreviews[`visionGoalImage${index}`];
                                return newPreviews;
                              });
                              if (
                                fileInputRefs.current[`visionGoalImage${index}`]
                              ) {
                                fileInputRefs.current[
                                  `visionGoalImage${index}`
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
                        onChange={(e) =>
                          handleFileChange(e, `visionGoalImage${index}`)
                        }
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        ref={setRef(`visionGoalImage${index}`)}
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
                  <Controller
                    name="sectionTitleAbout"
                    control={control}
                    rules={{
                      required: "Section Title is required",
                      maxLength: 50,
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="e.g. 'About the Program'"
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                      />
                    )}
                  />
                  {errors.sectionTitleAbout && (
                    <p className="text-red-500 text-sm">
                      {errors.sectionTitleAbout.message}
                    </p>
                  )}
                </div>
                <div className="col-span-3 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Body Text
                  </label>
                  <Controller
                    name="bodyText"
                    control={control}
                    rules={{
                      required: "Body Text is required",
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
                  {errors.bodyText && (
                    <p className="text-red-500 text-sm">
                      {errors.bodyText.message}
                    </p>
                  )}
                </div>
                <div className="col-span-1 mt-4 md:mt-0 relative">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Button Name
                  </label>
                  <Controller
                    name="buttonName2"
                    control={control}
                    rules={{
                      required: "Button Name is required",
                      maxLength: 50,
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Enter the button's name"
                        className="block w-full border rounded-full border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                      />
                    )}
                  />
                  {errors.buttonName2 && (
                    <p className="text-red-500 text-sm">
                      {errors.buttonName2.message}
                    </p>
                  )}
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
                  <Controller
                    name="buttonLink2"
                    control={control}
                    rules={{
                      required: "Button Link is required",
                      maxLength: 200,
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Enter the URL"
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                      />
                    )}
                  />
                  {errors.buttonLink2 && (
                    <p className="text-red-500 text-sm">
                      {errors.buttonLink2.message}
                    </p>
                  )}
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
                <div className="col-span-3 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Section Title
                  </label>
                  <Controller
                    name="sectionTitleVoices"
                    control={control}
                    rules={{
                      required: "Section Title is required",
                      maxLength: 50,
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="e.g. 'About the Program'"
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                      />
                    )}
                  />
                  {errors.sectionTitleVoices && (
                    <p className="text-red-500 text-sm">
                      {errors.sectionTitleVoices.message}
                    </p>
                  )}
                </div>
                <div className="col-span-3">
                  <label className="block text-sm/6 font-medium text-gray-900 mt-4 md:mt-0">
                    Section Description
                  </label>
                  <Controller
                    name="sectionDescriptionVoices"
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
                  {errors.sectionDescriptionVoices && (
                    <p className="text-red-500 text-sm">
                      {errors.sectionDescriptionVoices.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 col-span-3">
                  {[0, 1, 2].map((index) => (
                    <div
                      key={index}
                      className="border border-gray-400 rounded-lg border-dashed px-5 py-4 w-full"
                    >
                      <Controller
                        name={`voices.${index}.quote`}
                        control={control}
                        render={({ field }) => (
                          <textarea
                            {...field}
                            placeholder="write something here..."
                            rows={3}
                            className="my-3 w-full border-none focus:ring-0 resize-none"
                          />
                        )}
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
                              handleStudentIconPreviewChange(
                                index,
                                e.target.files?.[0] ?? null
                              )
                            }
                            ref={setRef(`voiceOfClassRoomIcon${index}`)}
                          />
                          {iconPreviews[index] && (
                            <img
                              src={iconPreviews[index]!}
                              alt="Icon Preview"
                              className="mt-2 size-10 object-cover rounded-full border"
                            />
                          )}
                        </div>
                        <div>
                          <Controller
                            name={`voices.${index}.name`}
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                placeholder="Student Name block"
                                className="placeholder:text-base xl:placeholder:text-lg border-none focus:ring-0 w-full"
                              />
                            )}
                          />
                          <Controller
                            name={`voices.${index}.description`}
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                placeholder="Short Description block"
                                className="border-none focus:ring-0 w-full"
                              />
                            )}
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
                            src={imagePreviews.mediaHeroImage}
                            alt="Media Hero Image Preview"
                            className="mx-auto w-16 h-16 object-cover"
                          />
                          <span
                            className="absolute top-0 right-0 cursor-pointer"
                            onClick={() => {
                              setFiles((prev) => ({
                                ...prev,
                                mediaHeroImage: null,
                              }));
                              setImagePreviews((prev) => {
                                const newPreviews = { ...prev };
                                delete newPreviews.mediaHeroImage;
                                return newPreviews;
                              });
                              if (fileInputRefs.current.mediaHeroImage) {
                                fileInputRefs.current.mediaHeroImage.value = "";
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
                        onChange={(e) => handleFileChange(e, "mediaHeroImage")}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        ref={setRef("mediaHeroImage")}
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
                  <Controller
                    name="heroTitleMedia"
                    control={control}
                    rules={{
                      required: "Hero Title is required",
                      maxLength: 50,
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="write something here..."
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                      />
                    )}
                  />
                  {errors.heroTitleMedia && (
                    <p className="text-red-500 text-sm">
                      {errors.heroTitleMedia.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Short Description
                  </label>
                  <Controller
                    name="shortDescriptionMedia"
                    control={control}
                    rules={{
                      required: "Short Description is required",
                      maxLength: 200,
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="write something here..."
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                      />
                    )}
                  />
                  {errors.shortDescriptionMedia && (
                    <p className="text-red-500 text-sm">
                      {errors.shortDescriptionMedia.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Video Link
                  </label>
                  <Controller
                    name="videoLink"
                    control={control}
                    rules={{
                      required: "Video Link is required",
                      maxLength: 200,
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="write something here..."
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                      />
                    )}
                  />
                  {errors.videoLink && (
                    <p className="text-red-500 text-sm">
                      {errors.videoLink.message}
                    </p>
                  )}
                </div>
                <div className="col-span-2 mt-4 md:mt-0">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Full Video Description
                  </label>
                  <Controller
                    name="fullVideoDescription"
                    control={control}
                    rules={{
                      required: "Full Video Description is required",
                      maxLength: 500,
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Enter the description"
                        className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                      />
                    )}
                  />
                  {errors.fullVideoDescription && (
                    <p className="text-red-500 text-sm">
                      {errors.fullVideoDescription.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
          {/* Offer Icons Section */}
          <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
            <h2 className="text-xl font-semibold mb-4 text-sky-800">
              7.‘What We Offer?’ Section
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
                          if (file) {
                            handleOfferIconChange(index, file);
                          }
                        }}
                        ref={setRef(`offerIcon${index}`)}
                      />
                      {offerIcons[index] && (
                        <img
                          src={offerIcons[index]!}
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
                  <p className="text-red-500 text-sm">
                    {errors.sectionTitleTeam.message}
                  </p>
                )}
              </div>
              <div className="col-span-2 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Section Description
                </label>
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
                  <p className="text-red-500 text-sm">
                    {errors.sectionDescriptionTeam.message}
                  </p>
                )}
              </div>
            </div>
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
                                fileInputRefs.current[
                                  `teamImage${index}`
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
                        onChange={(e) => handleTeamImageChange(e, index)}
                        ref={setRef(`teamImage${index}`)}
                      />
                      <p className="mt-4 font-semibold text-blue-500">
                        Drag & Drop your Photo
                      </p>
                      <p className="text-gray-500">
                        here or Browse up to 10 MB
                      </p>
                    </div>
                  </div>
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
                  <div className="flex justify-end space-x-3 my-4">
                    <button
                      type="button"
                      onClick={() => toggleLinkInput(index, "team")}
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
                  {teamCardFiles.icons[index] && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(teamCardFiles.icons[index]!)}
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
                <Controller
                  name="sectionTitleStudents"
                  control={control}
                  rules={{
                    required: "Section Title is required",
                    maxLength: 50,
                  }}
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
                <label className="block text-sm/6 font-medium text-gray-900">
                  Section Description
                </label>
                <Controller
                  name="sectionDescriptionStudents"
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
                {errors.sectionDescriptionStudents && (
                  <p className="text-red-500 text-sm">
                    {errors.sectionDescriptionStudents.message}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="border border-gray-300 border-dashed rounded-xl px-4 py-8"
                >
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                    <div className="relative text-center">
                      {studentFiles.images[index] ? (
                        <div className="relative">
                          <img
                            src={imagePreviews[`studentImage${index}`]}
                            alt="Uploaded"
                            className="size-20 object-cover mx-auto"
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
                              if (
                                fileInputRefs.current[`studentImage${index}`]
                              ) {
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
                        className="absolute opacity-0 inset-0 cursor-pointer"
                        onChange={(e) => handleStudentImageChange(e, index)}
                        ref={setRef(`studentImage${index}`)}
                      />
                      <p className="mt-4 font-semibold text-blue-500">
                        Drag & Drop your Photo
                      </p>
                      <p className="text-gray-500">
                        here or Browse up to 10 MB
                      </p>
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
                      onClick={() => toggleLinkInput(index, "student")}
                      className="bg-gray-100 text-sm xl:text-base px-1 xl:px-3 py-2 rounded-xl border border-gray-400"
                    >
                      Add Link +
                    </button>
                    <div className="relative">
                      <button
                        type="button"
                        className="bg-gray-100 text-sm xl:text-base px-1 xl:px-3 py-2 rounded-xl border border-gray-400"
                      >
                        Upload Icon +
                      </button>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => handleStudentIconChange(e, index)}
                        ref={setRef(`studentIcon${index}`)}
                      />
                    </div>
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
                        className="w-12 h-12"
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

          {/* Quotation Section */}
          <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white">
            <h3 className="text-sky-800 text-xl font-semibold">
              10. Quotation Section
            </h3>
            <div className="col-span-1 mt-4">
              <label className="block text-sm/6 font-medium text-gray-900">
                Add Quote
              </label>
              <Controller
                name="addQuote"
                control={control}
                rules={{
                  required: "Quote is required",
                  maxLength: 500,
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="write something here..."
                    className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  />
                )}
              />
              {errors.addQuote && (
                <p className="text-red-500 text-sm">
                  {errors.addQuote.message}
                </p>
              )}
            </div>
            <div className="col-span-1 mt-4">
              <label className="block text-sm/6 font-medium text-gray-900">
                Name + Role
              </label>
              <Controller
                name="nameRole"
                control={control}
                rules={{
                  required: "Name + Role is required",
                  maxLength: 100,
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="write something here..."
                    className="block w-full md:w-1/2 rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  />
                )}
              />
              {errors.nameRole && (
                <p className="text-red-500 text-sm">
                  {errors.nameRole.message}
                </p>
              )}
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
                <Controller
                  name="sectionTitlePhoto"
                  control={control}
                  rules={{
                    required: "Section Title is required",
                    maxLength: 50,
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="e.g. 'Photo Album'"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    />
                  )}
                />
                {errors.sectionTitlePhoto && (
                  <p className="text-red-500 text-sm">
                    {errors.sectionTitlePhoto.message}
                  </p>
                )}
              </div>
              <div className="col-span-2 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Section Description
                </label>
                <Controller
                  name="sectionDescriptionPhoto"
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
                {errors.sectionDescriptionPhoto && (
                  <p className="text-red-500 text-sm">
                    {errors.sectionDescriptionPhoto.message}
                  </p>
                )}
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
                          src={imagePreviews[`photoAlbumImage${index}`]}
                          alt={`Photo Album Image ${index} Preview`}
                          className="mx-auto w-16 h-16 object-cover"
                        />
                        <span
                          className="absolute top-0 right-0 cursor-pointer"
                          onClick={() => {
                            setFiles((prev) => ({
                              ...prev,
                              [`photoAlbumImage${index}`]: null,
                            }));
                            setImagePreviews((prev) => {
                              const newPreviews = { ...prev };
                              delete newPreviews[`photoAlbumImage${index}`];
                              return newPreviews;
                            });
                            if (
                              fileInputRefs.current[`photoAlbumImage${index}`]
                            ) {
                              fileInputRefs.current[
                                `photoAlbumImage${index}`
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
                      onChange={(e) =>
                        handleFileChange(e, `photoAlbumImage${index}`)
                      }
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      ref={setRef(`photoAlbumImage${index}`)}
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
                <Controller
                  name="sectionTitleNewsletter"
                  control={control}
                  rules={{
                    required: "Section Title is required",
                    maxLength: 50,
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="e.g. 'Newsletter'"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    />
                  )}
                />
                {errors.sectionTitleNewsletter && (
                  <p className="text-red-500 text-sm">
                    {errors.sectionTitleNewsletter.message}
                  </p>
                )}
              </div>
              <div className="col-span-2 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Section Description
                </label>
                <Controller
                  name="sectionDescriptionNewsletter"
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
                {errors.sectionDescriptionNewsletter && (
                  <p className="text-red-500 text-sm">
                    {errors.sectionDescriptionNewsletter.message}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
              {[0, 1].map((index) => (
                <div
                  key={index}
                  className="border border-gray-300 xl:space-x-2 rounded-md border-dashed px-3 py-5 flex flex-col xl:flex-row space-y-4 xl:space-y-0 justify-between"
                >
                  <div>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-2">
                      <div className="relative text-center">
                        {files[`newsletterImage${index + 1}`] ? (
                          <div className="relative">
                            <img
                              src={imagePreviews[`newsletterImage${index + 1}`]}
                              alt={`Newsletter Image ${index + 1} Preview`}
                              className="mx-auto w-16 h-16 object-cover"
                            />
                            <span
                              className="absolute top-0 right-0 cursor-pointer"
                              onClick={() => {
                                setFiles((prev) => ({
                                  ...prev,
                                  [`newsletterImage${index + 1}`]: null,
                                }));
                                setImagePreviews((prev) => {
                                  const newPreviews = { ...prev };
                                  delete newPreviews[
                                    `newsletterImage${index + 1}`
                                  ];
                                  return newPreviews;
                                });
                                if (
                                  fileInputRefs.current[
                                    `newsletterImage${index + 1}`
                                  ]
                                ) {
                                  fileInputRefs.current[
                                    `newsletterImage${index + 1}`
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
                          onChange={(e) =>
                            handleFileChange(e, `newsletterImage${index + 1}`)
                          }
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          ref={setRef(`newsletterImage${index + 1}`)}
                        />
                        <p className="mt-4 font-semibold text-blue-500">
                          Drag & Drop your Photo
                        </p>
                        <p className="text-gray-500">
                          here or Browse up to 10 MB
                        </p>
                      </div>
                    </div>
                    <Controller
                      name={`newsletterItems.${index}.url`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full border-dashed rounded-lg border border-gray-400 mt-2 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                          placeholder="Enter Downloadable URL"
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between mb-1">
                      <label className="text-gray-500 block">Date:</label>
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
                    <Controller
                      name={`newsletterItems.${index}.date`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Enter the date"
                          className="border w-full border-dashed border-gray-400 rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                        />
                      )}
                    />
                    <label className="text-gray-500 block">Title:</label>
                    <Controller
                      name={`newsletterItems.${index}.title`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="write something here..."
                          className="border w-full border-dashed border-gray-400 rounded-lg text-gray-400 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                        />
                      )}
                    />
                    <label className="text-gray-500 block">
                      Short Description:
                    </label>
                    <Controller
                      name={`newsletterItems.${index}.description`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="write something here..."
                          className="border w-full border-dashed border-gray-400 rounded-lg text-gray-400 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                        />
                      )}
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
            {[0, 1, 2].map((index) => (
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
                  <label className="block">Choose link or Embed code</label>
                  <Controller
                    name={`liveMoments.${index}.link`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Enter the link or embed code"
                        className="border w-full md:w-[90%] mt-2 border-gray-400 border-dashed rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                      />
                    )}
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
                <Controller
                  name="sectionTitleSDGs"
                  control={control}
                  rules={{
                    required: "Section Title is required",
                    maxLength: 50,
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="e.g. 'Sustainable Development Goals'"
                      className="block w-full rounded-md border border-dashed border-gray-900/25 px-6 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                    />
                  )}
                />
                {errors.sectionTitleSDGs && (
                  <p className="text-red-500 text-sm">
                    {errors.sectionTitleSDGs.message}
                  </p>
                )}
              </div>
              <div className="col-span-2 mt-4 md:mt-0">
                <label className="block text-sm/6 font-medium text-gray-900">
                  Section Text
                </label>
                <Controller
                  name="sectionTextSDGs"
                  control={control}
                  rules={{
                    required: "Section Text is required",
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
                {errors.sectionTextSDGs && (
                  <p className="text-red-500 text-sm">
                    {errors.sectionTextSDGs.message}
                  </p>
                )}
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
                          src={imagePreviews[`sdgsImage${index}`]}
                          alt={`SDGs Image ${index} Preview`}
                          className="mx-auto w-16 h-16 object-cover"
                        />
                        <span
                          className="absolute top-0 right-0 cursor-pointer"
                          onClick={() => {
                            setFiles((prev) => ({
                              ...prev,
                              [`sdgsImage${index}`]: null,
                            }));
                            setImagePreviews((prev) => {
                              const newPreviews = { ...prev };
                              delete newPreviews[`sdgsImage${index}`];
                              return newPreviews;
                            });
                            if (fileInputRefs.current[`sdgsImage${index}`]) {
                              fileInputRefs.current[
                                `sdgsImage${index}`
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
                      onChange={(e) => handleFileChange(e, `sdgsImage${index}`)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      ref={setRef(`sdgsImage${index}`)}
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
            {[0, 1, 2].map((index) => (
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
                  <label className="block">Button's Link</label>
                  <Controller
                    name={`relatedLinks.${index}.buttonLink`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Enter the URL"
                        className="border w-full mt-2 border-gray-400 border-dashed rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                      />
                    )}
                  />
                </div>
                <div className="w-full">
                  <label className="block">Button's Name</label>
                  <Controller
                    name={`relatedLinks.${index}.buttonName`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Enter the button's name"
                        className="border w-full mt-2 border-gray-400 border-dashed rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                      />
                    )}
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
            <label className="block mt-4">Final Big Statement</label>
            <Controller
              name="finalStatement"
              control={control}
              rules={{
                required: "Final Statement is required",
                maxLength: 500,
              }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="write something here..."
                  className="border w-full mt-2 border-gray-400 border-dashed rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                />
              )}
            />
            {errors.finalStatement && (
              <p className="text-red-500 text-sm">
                {errors.finalStatement.message}
              </p>
            )}
          </section>

          {/* Navigation Settings Section */}
          <section className="border-2 rounded-lg p-4 md:p-8 lg:px-14 bg-white space-y-4">
            <h3 className="text-xl font-medium text-sky-800">
              Navigation Settings
            </h3>
            <div className="flex space-x-5 items-center">
              <Controller
                name="showInMainNavigation"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="border border-gray-400 rounded"
                  />
                )}
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
              <Controller
                name="navigationLabel"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="write something here..."
                    className="border w-full mt-2 border-gray-400 border-dashed rounded-lg text-gray-500 block placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:ring-offset-2"
                  />
                )}
              />
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-between mb-10">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-sky-800 hover:opacity-90 text-white px-4 md:px-10 py-1 md:py-3 rounded-md disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <button
              type="button"
              className="text-base md:text-lg md:font-semibold border-b md:border-b-2 border-black hover:text-blue-700 hover:border-blue-700"
              onClick={clearForm}
            >
              Clear Changes
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
