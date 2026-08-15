"use client";

import ContactSubmitButton from "@/components/contact-us/ContactSubmitButton";
import type {
  GetInvolvedFormConfig,
  GetInvolvedFormField,
  GetInvolvedFormFieldName,
} from "@/constant/getInvolvedForms";
import { cn } from "@/utilities/cn";
import {
  BriefcaseIcon,
  BuildingOffice2Icon,
  EnvelopeIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { z } from "zod";

const INPUT_CLASS =
  "w-full rounded-[12px] border border-[#D0D5DD] bg-white py-3.5 pl-10 pr-4 font-plusJakartaSans text-[14px] text-[#252525] placeholder:text-[#98A2B3] outline-none transition-colors focus:border-primary-50 sm:py-4 sm:text-[15px]";

type FormValues = Record<GetInvolvedFormFieldName, string>;

function buildInitialValues(config: GetInvolvedFormConfig): FormValues {
  return config.fields.reduce<FormValues>((accumulator, field) => {
    accumulator[field.name] = "";
    return accumulator;
  }, {} as FormValues);
}

function buildSchema(config: GetInvolvedFormConfig) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of config.fields) {
    const isRequired = field.required !== false;

    if (field.type === "email") {
      shape[field.name] = isRequired
        ? z.string().email("Invalid email address").min(1, "Email is required")
        : z.string().email("Invalid email address").or(z.literal(""));
      continue;
    }

    shape[field.name] = isRequired
      ? z.string().min(1, `${field.label} is required`)
      : z.string().optional();
  }

  return z.object(shape);
}

function FieldIcon({ field }: { field: GetInvolvedFormField }) {
  const className =
    "pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#98A2B3]";

  switch (field.icon) {
    case "email":
      return <EnvelopeIcon className={className} strokeWidth={1.8} aria-hidden />;
    case "building":
      return (
        <BuildingOffice2Icon className={className} strokeWidth={1.8} aria-hidden />
      );
    case "briefcase":
      return <BriefcaseIcon className={className} strokeWidth={1.8} aria-hidden />;
    default:
      return <UserIcon className={className} strokeWidth={1.8} aria-hidden />;
  }
}

function FieldLabel({
  htmlFor,
  children,
  required = true,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block font-plusJakartaSans text-[14px] font-medium text-[#252525] sm:text-[15px]"
    >
      {children}
      {required ? <span className="text-[#D92D20]"> *</span> : null}
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

type GetInvolvedFormProps = {
  config: GetInvolvedFormConfig;
};

export default function GetInvolvedForm({ config }: GetInvolvedFormProps) {
  const schema = useMemo(() => buildSchema(config), [config]);
  const [formData, setFormData] = useState(() => buildInitialValues(config));
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

    const validationResult = schema.safeParse(formData);

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
      const response = await fetch("/api/get-involved", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formType: config.id,
          emailSubject: config.emailSubject,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send form");
      }

      toast.success("Message sent successfully");
      setFormData(buildInitialValues(config));
    } catch {
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const pairedFields = config.fields.filter((field) => !field.fullWidth);
  const fullWidthFields = config.fields.filter((field) => field.fullWidth);

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">
      {pairedFields.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {pairedFields.map((field) => (
            <div key={field.name}>
              <FieldLabel htmlFor={field.name} required={field.required !== false}>
                {field.label}
              </FieldLabel>
              <div className="relative">
                <FieldIcon field={field} />
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className={INPUT_CLASS}
                />
              </div>
              <FieldError message={errors[field.name]} />
            </div>
          ))}
        </div>
      ) : null}

      {fullWidthFields.map((field) => (
        <div key={field.name}>
          <FieldLabel htmlFor={field.name} required={field.required !== false}>
            {field.label}
          </FieldLabel>
          {field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              rows={6}
              className={cn(
                INPUT_CLASS,
                "min-h-[160px] resize-y py-3 pl-4 leading-relaxed sm:min-h-[180px]",
              )}
            />
          ) : (
            <div className="relative">
              <FieldIcon field={field} />
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className={INPUT_CLASS}
              />
            </div>
          )}
          <FieldError message={errors[field.name]} />
        </div>
      ))}

      <div className="pt-1">
        <ContactSubmitButton
          loading={loading}
          className="w-full px-10 sm:w-full"
          label="Send"
        />
      </div>
    </form>
  );
}
