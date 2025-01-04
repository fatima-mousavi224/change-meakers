"use client";
import { forgotPasswordSchema, TForgotPasswordSchema } from "@/lib/types";
import { cn } from "@/utilities/cn";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface ForgotPasswordFormProps {
  className?: string;
}

export default function ForgotPasswordForm({
  className,
}: ForgotPasswordFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TForgotPasswordSchema>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: TForgotPasswordSchema) => {
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
        }),
      });
      if (res.status === 400) {
        setError("email", { message: "Email not registered" });
        toast.error("Email not registered");
      }
      if (res.status === 200) {
        toast.success("Email sent");
        setError("email", { message: "" });
      }
    } catch (error) {
      toast.error("Error, try again");
      setError("email", { message: "Error, try again" });
      console.log(error);
    }
  };

  return (
    <div className={cn("w-full flex flex-col p-6", className)}>
      <div className="flex sm:justify-between flex-col sm:flex-row items-center gap-4 mb-6">
        <h2 className="text-[32px] font-medium">Forgot Password</h2>
      </div>

      <form
        className="flex flex-col gap-3  max-w-md mx-auto w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* email */}

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-paragraph_color">
            Email address
          </label>
          <input
            {...register("email")}
            type="text"
            id="email"
            placeholder="Enter your email"
            className={cn(
              "block w-full rounded-xl border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[#6666665b] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-50 sm:text-sm/6"
            )}
          />
          {errors["email"] && (
            <p className="text-red-500 text-sm">
              {errors["email"]?.message?.toString()}
            </p>
          )}
          <p className="text-xs md:text-sm text-slate-600 flex-1 text-right">
            We will send you a link to reset your password
          </p>
        </div>

        {/* submit button */}

        <div className="flex items-center justify-between gap-3">
          <button
            type="submit"
            className={cn(
              "rounded-full bg-primary-50 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-50",
              isSubmitting && "opacity-50 cursor-not-allowed"
            )}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send reset link"}
          </button>
          <p className="text-xs md:text-sm text-slate-600 flex-1 text-right">
            <Link href="/login" className="underline">
              Back to login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
