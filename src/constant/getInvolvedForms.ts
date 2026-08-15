export type GetInvolvedFormId = "join-programs" | "partner" | "volunteer";

export type GetInvolvedFormFieldName =
  | "firstName"
  | "lastName"
  | "email"
  | "company"
  | "position"
  | "description";

export type GetInvolvedFormField = {
  name: GetInvolvedFormFieldName;
  label: string;
  type: "text" | "email" | "textarea";
  placeholder: string;
  required?: boolean;
  fullWidth?: boolean;
  icon?: "user" | "email" | "building" | "briefcase";
};

export type GetInvolvedFormConfig = {
  id: GetInvolvedFormId;
  title: string;
  description: string;
  href: string;
  emailSubject: string;
  fields: GetInvolvedFormField[];
};

export const GET_INVOLVED_FORM_CONFIGS: Record<
  GetInvolvedFormId,
  GetInvolvedFormConfig
> = {
  "join-programs": {
    id: "join-programs",
    title: "Join Our Programs",
    description:
      "If you are a student interested in joining our educational programs, classes, or initiatives, you can register here. Please complete the form below to receive information about available opportunities and upcoming programs.",
    href: "/get-involved/join-our-programs",
    emailSubject: "Join Our Programs registration",
    fields: [
      {
        name: "firstName",
        label: "First Name",
        type: "text",
        placeholder: "Insert your first name",
        icon: "user",
      },
      {
        name: "lastName",
        label: "Last Name",
        type: "text",
        placeholder: "Insert your last name",
        icon: "user",
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "Insert email address",
        fullWidth: true,
        icon: "email",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder:
          "Please tell us briefly about yourself, your education background, and which type of program you would like to join.",
        fullWidth: true,
      },
    ],
  },
  partner: {
    id: "partner",
    title: "Partner with Us",
    description:
      "If you are an organization or company interested in supporting education and youth opportunities in Afghanistan, we welcome collaboration. Please complete the form below and briefly tell us about your organization and how you would like to work with us.",
    href: "/get-involved/partner-with-us",
    emailSubject: "Partner with Us inquiry",
    fields: [
      {
        name: "firstName",
        label: "First Name",
        type: "text",
        placeholder: "Insert your first name",
        icon: "user",
      },
      {
        name: "lastName",
        label: "Last Name",
        type: "text",
        placeholder: "Insert your last name",
        icon: "user",
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "Business/Email address",
        fullWidth: true,
        icon: "email",
      },
      {
        name: "company",
        label: "Company / Organization",
        type: "text",
        placeholder: "Insert company or organization name",
        fullWidth: true,
        icon: "building",
      },
      {
        name: "position",
        label: "Your Position",
        type: "text",
        placeholder: "Insert your position",
        fullWidth: true,
        icon: "briefcase",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder:
          "Please tell us briefly about your organization and how you would like to work with us.",
        fullWidth: true,
      },
    ],
  },
  volunteer: {
    id: "volunteer",
    title: "Volunteer with Us",
    description:
      "If you are interested in volunteering with Change Makers of the World, we welcome your support. Please complete the form below and tell us about your background and how you would like to contribute.",
    href: "/get-involved/volunteer-with-us",
    emailSubject: "Volunteer with Us application",
    fields: [
      {
        name: "firstName",
        label: "First Name",
        type: "text",
        placeholder: "Insert your first name",
        icon: "user",
      },
      {
        name: "lastName",
        label: "Last Name",
        type: "text",
        placeholder: "Insert your last name",
        icon: "user",
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "Insert email address",
        fullWidth: true,
        icon: "email",
      },
      {
        name: "company",
        label: "Company",
        type: "text",
        placeholder: "Insert company name (optional)",
        fullWidth: true,
        icon: "building",
        required: false,
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder:
          "Please tell us about your background and how you would like to contribute.",
        fullWidth: true,
      },
    ],
  },
};

export function getGetInvolvedFormConfig(id: GetInvolvedFormId) {
  return GET_INVOLVED_FORM_CONFIGS[id];
}
