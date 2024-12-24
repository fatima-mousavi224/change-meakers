"use client";
import ToggleShowPassword from "@/components/common/ToggleShowPassword";
import { Divider } from "@/components/divider/Divider";
import SocialButton from "@/components/social-button/SocialButton";
import { signUpSchema, TSignUpSchema } from "@/lib/types";
import { cn } from "@/utilities/cn";
import signInWithThirdParty from "@/utilities/signInWithThirdParty";
import { yupResolver } from "@hookform/resolvers/yup";
import { User } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaTwitter } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

type UserData = {
  name: string;
  email: string;
  password: string;
  verifyCode: string;
};

interface SignUpFormProps {
  className?: string;
  user: User | null;
  handleOpenModal: () => void;
  handleSetUserData: (data: UserData) => void;
}

export default function SignUpForm({
  className,
  user,
  handleOpenModal,
  handleSetUserData,
}: SignUpFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TSignUpSchema>({
    resolver: yupResolver(signUpSchema),
  });
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: FieldValues) => {
    setLoading(true);
    try {
      const res = await fetch("/api/user-exists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (!res.ok) {
        throw new Error("Couldn't check user existence");
      }

      const { user } = await res.json();
      if (user && user !== null) {
        toast.error("user already exists!");
        return;
      }

      if (!user) {
        handleSetUserData({
          name: data.name as string,
          email: data.email as string,
          password: data.password as string,
          verifyCode: "111111",
        });

        const res = await fetch("/api/verifyEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.email }),
        });

        if (res.ok) {
          handleOpenModal();
        }
      }
    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn("w-full flex flex-col p-6 sm:p-12 sm:pt-6 pt-0", className)}
    >
      <div className="flex sm:justify-between flex-col sm:flex-row items-end gap-4 mb-6 ">
        <h2 className="text-[32px] font-medium opacity-0 pointer-events-none">
          Sign up
        </h2>
        <p>
          Do you have an account?{" "}
          <Link
            href="/login"
            className="border-b-[1.5px]  border-b-primary-50 text-primary-50 pb-[1px]"
          >
            Sign in
          </Link>
        </p>
      </div>
      <div className="mb-12 max-w-md mx-auto w-full">
        <h2 className="text-[32px] font-medium">Sign up</h2>
        <p className="text-dark_gray">
          Hi, welcome to Change Makers of the World
        </p>
      </div>
      <div className="max-w-md mx-auto w-full flex flex-col  justify-center gap-4 ">
        <SocialButton
          icon={FcGoogle}
          text="Continue with Google"
          className=" hover:border-gray-300 transition"
          onClick={() =>
            signInWithThirdParty(
              "google",
              user?.role === "ADMIN" ? "/admin" : "/dashboard"
            )
          }
        />
        <SocialButton
          icon={FaTwitter}
          text="Continue with Twitter"
          className=" hover:border-gray-300 transition"
          onClick={() =>
            signInWithThirdParty(
              "twitter",
              user?.role === "ADMIN" ? "/admin" : "/dashboard"
            )
          }
        />
      </div>
      <div className="flex items-center gap-3 my-6 max-w-md mx-auto w-full">
        <Divider />
        <span className="text-lg text-[#666666]">OR</span>
        <Divider />
      </div>
      <form
        className="flex flex-col gap-1  w-full max-w-md mx-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-paragraph_color">
              Name
            </label>
            <input
              {...register("name")}
              type="text"
              id="name"
              placeholder="John Doe"
              className={cn(
                "block w-full rounded-xl border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[#6666665b] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-50 sm:text-sm/6"
              )}
              autoFocus
            />
            {errors["name"] && (
              <p className="text-red-500 text-sm">
                {errors["name"]?.message?.toString()}
              </p>
            )}
          </div>

          {/* password */}

          <div className="flex flex-col gap-1 relative">
            <label htmlFor="password" className="text-paragraph_color">
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Your password"
                className={cn(
                  "block w-full rounded-xl border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[#6666665b] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-50 sm:text-sm/6"
                )}
              />
              <ToggleShowPassword
                isShowPassword={showPassword}
                toggleShowPassword={toggleShowPassword}
              />
            </div>
            {errors["password"] && (
              <p className="text-red-500 text-sm">
                {errors["password"]?.message?.toString()}
              </p>
            )}
          </div>
        </div>

        {/* email */}

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-paragraph_color">
            Email address
          </label>
          <input
            {...register("email")}
            type="text"
            id="email"
            placeholder="john@dev.com"
            className={cn(
              "block w-full rounded-xl border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[#6666665b] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-50 sm:text-sm/6"
            )}
          />
          {errors["email"] && (
            <p className="text-red-500 text-sm">
              {errors["email"]?.message?.toString()}
            </p>
          )}
        </div>

        {/* submit button */}

        <div className="flex items-center justify-between gap-3 mt-2 mb-4 lg:mb-0">
          <button
            type="submit"
            className={cn(
              "rounded-full bg-primary-50 px-4 md:px-12 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-50",
              (isSubmitting || isLoading) && "opacity-50 cursor-not-allowed"
            )}
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? "Please wait..." : "Sign up"}
          </button>
          <p className="text-xs md:text-sm text-slate-600 flex-1 text-right">
            Already have an account?{" "}
            <Link
              href="/login"
              className="border-b-[1.5px]  border-b-primary-50 text-primary-50 pb-[1px]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
