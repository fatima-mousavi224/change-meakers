"use client";

import FooterSocialLinks from "@/components/footer/FooterSocialLinks";
import ContactSubmitButton from "@/components/contact-us/ContactSubmitButton";
import { cn } from "@/utilities/cn";
import {
  EnvelopeIcon,
  InformationCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { z } from "zod";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

const INPUT_CLASS =
  "w-full rounded-[12px] border border-[#D0D5DD] bg-white py-3 pl-10 pr-4 font-plusJakartaSans text-[14px] text-[#252525] placeholder:text-[#98A2B3] outline-none transition-colors focus:border-primary-50";

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block font-plusJakartaSans text-[14px] font-medium text-[#252525]"
    >
      {children}
      <span className="text-[#D92D20]"> *</span>
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-1 font-plusJakartaSans text-[13px] text-[#D92D20]">
      {message}
    </p>
  );
}

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationResult = contactSchema.safeParse(formData);

    if (!validationResult.success) {
      const newErrors = validationResult.error.errors.reduce(
        (accumulator, current) => {
          accumulator[current.path[0] as string] = current.message;
          return accumulator;
        },
        {} as Record<string, string>,
      );
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      toast.success("Message sent successfully");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1062px] rounded-[16px] bg-white px-5 pb-10 pt-10 shadow-[0_3px_8px_rgba(0,0,0,0.12)] max-md:w-[92%] sm:rounded-[24px] sm:px-10 sm:pb-[60px] sm:pt-16 lg:px-[60px] lg:pt-20">
      <h1 className="text-center font-plusJakartaSans text-[26px] font-bold leading-tight text-[#252525] sm:text-[32px]">
        Contact Us
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 sm:mt-12 sm:space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <FieldLabel htmlFor="firstName">First Name</FieldLabel>
            <div className="relative">
              <UserIcon
                className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#98A2B3]"
                strokeWidth={1.8}
                aria-hidden
              />
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Insert your first name"
                className={INPUT_CLASS}
              />
            </div>
            <FieldError message={errors.firstName} />
          </div>

          <div>
            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
            <div className="relative">
              <UserIcon
                className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#98A2B3]"
                strokeWidth={1.8}
                aria-hidden
              />
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Insert your last name"
                className={INPUT_CLASS}
              />
            </div>
            <FieldError message={errors.lastName} />
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="email">Email Address</FieldLabel>
          <div className="relative">
            <EnvelopeIcon
              className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#98A2B3]"
              strokeWidth={1.8}
              aria-hidden
            />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Insert email address"
              className={INPUT_CLASS}
            />
          </div>
          <FieldError message={errors.email} />
        </div>

        <div>
          <FieldLabel htmlFor="subject">Subject</FieldLabel>
          <div className="relative">
            <InformationCircleIcon
              className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#98A2B3]"
              strokeWidth={1.8}
              aria-hidden
            />
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Insert your subject"
              className={INPUT_CLASS}
            />
          </div>
          <FieldError message={errors.subject} />
        </div>

        <div>
          <FieldLabel htmlFor="message">Message</FieldLabel>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Insert Message"
            rows={5}
            className={cn(
              INPUT_CLASS,
              "min-h-[140px] resize-y py-3 pl-4 leading-relaxed",
            )}
          />
          <FieldError message={errors.message} />
        </div>

        <div className="flex justify-end pt-1">
          <ContactSubmitButton loading={loading} />
        </div>
      </form>

      <div className="mt-10 border-t border-[#E4E7EC] pt-6 sm:mt-14 sm:pt-10">
        <div className="flex items-center max-md:gap-3 md:justify-between">
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
            <a
              href="mailto:info@cmworld.org"
              className="group flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80 sm:gap-3 md:gap-4"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-[#134C8333] md:size-12 md:rounded-[12px]">
                <EnvelopeIcon
                  className="size-[15px] text-[#134C83] md:size-5"
                  strokeWidth={1.8}
                  aria-hidden
                />
              </span>
              <span className="min-w-0">
                <span className="block font-plusJakartaSans text-[12px] font-semibold leading-snug text-[#242424] md:text-[16px]">
                  Email Address
                </span>
                <span className="block max-w-[108px] truncate font-plusJakartaSans text-[11px] leading-snug text-[#717171] font-normal md:max-w-none md:overflow-visible md:whitespace-normal md:text-[14px]">
                  info@cmworld.org
                </span>
              </span>
            </a>

            <div
              className="h-9 w-px shrink-0 bg-[#E4E7EC] md:h-12"
              aria-hidden
            />
          </div>

          <FooterSocialLinks
            compact
            className="min-w-0 flex-1 justify-start gap-0.5 md:flex-none md:justify-end md:gap-2"
          />
        </div>
      </div>
    </div>
  );
}
