"use client";
import ToggleShowPassword from "@/components/common/ToggleShowPassword";
import { Divider } from "@/components/divider/Divider";
import SocialButton from "@/components/social-button/SocialButton";
import { cn } from "@/utilities/cn";
import signInWithThirdParty from "@/utilities/signInWithThirdParty";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { User } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import { signIn, getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaTwitter } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

interface LoginFormProps {
  className?: string;
  user: User | null;
}

export default function LoginForm({ className, user }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);

    try {
      const rememberMe = data.rememberMe || false;
      const res = await signIn("credentials", {
        ...data,
        remember: rememberMe,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
      } else if (res?.ok) {
        toast.success("Login successful");
        const session = await getSession();
        const role = (session?.user as { role?: string } | undefined)?.role;
        router.push(role === "ADMIN" ? "/admin" : "/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className={cn(
        "w-full flex flex-col p-6 sm:p-12 sm:pt-6 pt-0 ",
        className
      )}
    >
      {/* <div className="flex mt-6 lg:justify-end  justify-between items-center  flex-row  gap-4 mb-6 ">
        <Link
          href={"/"}
          className=" font-semibold text-primary-50 items-center justify-end gap-1 text-sm flex lg:hidden lg:opacity-0 lg:pointer-events-none "
        >
          <ArrowLeft className="size-5" /> Back to Website
        </Link>

        <p className="whitespace-nowrap">
          Need an account?{" "}
          <Link
            href="/sign-up"
            className="border-b-[1.5px]  border-b-primary-50 text-primary-50 pb-[1px]"
          >
            Sign up
          </Link>
        </p>
      </div> */}
      <p className="mt-6 mb-12 max-w-md mx-auto w-full  text-red-500 flex items-center gap-2">
        <LockClosedIcon className="size-6 inline-block stroke-red-500" />
        <span className="font-semibold text-lg">Admin Access Only</span>
      </p>
      <div className="mb-12 max-w-md mx-auto w-full">
        <h2 className="text-[32px] font-medium">Sign in</h2>
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
        className="flex flex-col gap-1   max-w-md mx-auto w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* email */}

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-paragraph_color">
            Email address
          </label>
          <input
            {...register("email", { required: "Email is required" })}
            type="text"
            id="email"
            placeholder="john@dev.com"
            className={cn(
              "block w-full rounded-xl border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-[#6666665b] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-50 sm:text-sm/6"
            )}
            autoFocus
          />
          {errors["email"] && (
            <p className="text-red-500 text-sm">
              {errors["email"]?.message?.toString()}
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
              {...register("password", {
                required: "Password is required",
              })}
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

        {/* submit button */}

        <div className="flex justify-between items-center text-xs md:text-sm">
          <div className="flex gap-2 items-center opacity-0">
            <input type="checkbox" id="rememberMe" name="remember" />
            <label htmlFor="rememberMe" className="text-paragraph_color">
              Remember me
            </label>
          </div>
          <Link
            href="/forgot-password"
            className="border-b-[1.5px]  border-b-primary-50 text-primary-50 pb-[1px]"
          >
            Forgot your password? Reset here.
          </Link>
        </div>
        <div className="flex  flex-col gap-3 mt-2 mb-4 sm:mb-0">
          <button
            type="submit"
            className={cn(
              "rounded-full bg-primary-50 px-12 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-50 lg:w-1/2 w-full",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
            disabled={isLoading}
          >
            {isLoading ? "Sign in..." : "Sign in"}
          </button>
          {/* <p className="text-xs md:text-sm text-slate-600 flex-1">
            Need an account?{" "}
            <Link
              href="/sign-up"
              className="border-b-[1.5px]  border-b-primary-50 text-primary-50 pb-[1px]"
            >
              Sign up
            </Link>
          </p> */}
        </div>
        <Link
          href={"/"}
          className="-m-2.5 mt-2  p-2 font-semibold text-primary-50 items-center justify-end gap-1 text-sm hidden lg:flex"
        >
          <ArrowLeft className="size-5" /> Back to Website
        </Link>
      </form>
    </div>
  );
}
