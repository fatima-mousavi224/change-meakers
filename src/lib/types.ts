import { z } from "zod";
import * as Yup from "yup";

export type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  howFindUs: string;
  message: string;
};

const passwordValidation = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
);

export const signUpSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(passwordValidation, {
      message:
        "Minimum 6 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
    }),
});

export type TSignUpSchema = Yup.InferType<typeof signUpSchema>;

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export type TForgotPasswordSchema = Yup.InferType<typeof forgotPasswordSchema>;

export const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export type TResetPasswordSchema = Yup.InferType<typeof resetPasswordSchema>;

export const editProfileSchema = Yup.object().shape({
  image: Yup.mixed().test(
    "fileSize",
    "Image size should be less than 10MB",
    (value) => {
      if (!value) return true; // If no file is selected, skip validation

      if (value instanceof File) {
        return value.size <= 10 * 1024 * 1024; // 10MB in bytes
      }

      return true; // For existing images or other valid cases
    }
  ),
  firstName: Yup.string()
    .min(3, "First name must be at least 3 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(4, "Last name must be at least 4 characters")
    .required("Last name is required"),
  country: Yup.string().required("Country is required"),
});

export type TEditProfileSchema = Yup.InferType<typeof editProfileSchema>;

export const dashboardResetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm Password is required"),
  currentPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const postSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  categoryId: Yup.string().required("Category is required"),
  author: Yup.string().required("Author is required"),
  authorImage: Yup.mixed()
    .test("fileType", "Invalid file type", (value) => {
      if (!value) return false;
      // @ts-ignore
      return value && (value instanceof File || value.type?.includes("image"));
    })
    .required("Author image is required"),
  description: Yup.string().required("Description is required"),
  postDate: Yup.string().required("Post date is required"),
  postImages: Yup.array()
    .transform((value) => {
      // Convert FileList or object to array
      return value ? Array.from(value) : [];
    })
    .of(
      Yup.mixed().test("fileType", "Invalid file type", (value) => {
        return (
          // @ts-ignore
          value && (value instanceof File || value.type?.includes("image"))
        );
      })
    )
    .min(1, "At least one image is required")
    .required("Post images are required"),
});
export type TPostSchema = Yup.InferType<typeof postSchema>;

export type TDashboardResetPasswordSchema = Yup.InferType<
  typeof dashboardResetPasswordSchema
>;

export const resetVerifyEmailCodeSchema = Yup.object().shape({
  verifyCode: Yup.string()
    .min(6, "Code must be at least 6 characters")
    .required("Code is required"),
});

export type TVerifyEmailCodeSchema = Yup.InferType<
  typeof resetVerifyEmailCodeSchema
>;
