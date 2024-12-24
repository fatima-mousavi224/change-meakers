"use client";

import { resetVerifyEmailCodeSchema } from "@/lib/types";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { User } from "@prisma/client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface VerificationModalProps {
  user: User | null;
  open: boolean;
  handleCloseModal: () => void;
  userData: {
    name: string;
    email: string;
    password: string;
    verifyCode: string;
  };
}

export default function VerificationModal({
  open,
  handleCloseModal,
  userData,
  user,
}: VerificationModalProps) {
  const router = useRouter();
  const [signInLoading, setSignInLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(resetVerifyEmailCodeSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: FieldValues) => {
    const newData = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      verifyCode: data.verifyCode,
    };
    console.log("new data", newData);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...userData,
          verifyCode: data.verifyCode.toString().trim(),
        }),
      });
      const registerData = await res.json();
      if (registerData.status === 400) {
        toast.error(registerData.message);
      }

      if (registerData.status === 201) {
        toast.success("account created successfully");
        setSignInLoading(true);
        const res = await signIn("credentials", {
          email: userData.email,
          password: userData.password,
          redirect: false,
        });
        if (res?.error) {
          toast.error(res.error);
          setSignInLoading(false);
        } else if (res?.ok) {
          router.push(user?.role === "ADMIN" ? "/admin" : "/dashboard");
        }
      }
    } catch (error) {
      toast.error("Failed to sign in after registration");
      console.log(error);
    } finally {
      setSignInLoading(false);
    }
  };
  return (
    <Dialog open={open} onClose={handleCloseModal} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div>
              <div className="mt-3  sm:mt-5">
                <DialogTitle
                  as="h3"
                  className="text-base font-semibold text-gray-900 mb-5 text-center"
                >
                  Verification code
                </DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <label
                      htmlFor="verifyCode"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Code
                    </label>
                    <div className="mt-2">
                      <input
                        {...register("verifyCode")}
                        autoComplete="off"
                        id="verifyCode"
                        name="verifyCode"
                        type="text"
                        placeholder="Enter the verification code"
                        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 border-none placeholder:text-gray-400 focus:outline focus:outline-none   sm:text-sm/6 focus:border-primary-50 focus:border-[1.5px]"
                      />
                      {errors.verifyCode && (
                        <span className="mt-1 text-red-500 text-sm">
                          {errors.verifyCode.message as string}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting || signInLoading}
                      className="inline-flex w-full justify-center rounded-md bg-primary-50 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-200 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-primary-50"
                    >
                      {signInLoading
                        ? "Signing in..."
                        : isSubmitting
                        ? "Verifying..."
                        : "Verify email"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
