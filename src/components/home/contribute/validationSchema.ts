import * as Yup from "yup";

export const donationValidationSchema = Yup.object({
  donationType: Yup.string().required("Donation type is required"),
  donationAmount: Yup.number()
    .required("Donation amount is required")
    .positive("Amount must be greater than 0"),
  donationFrequency: Yup.string()
    .oneOf(["monthly", "one-time"], "Invalid frequency")
    .required("Donation frequency is required"),
  customAmount: Yup.number()
    .min(1, "Custom amount must be at least $1")
    .nullable(),
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
});
