"use client";
import ToggleShowPassword from "@/components/common/ToggleShowPassword";
import { resetPasswordSchema, TResetPasswordSchema } from "@/lib/types";
import { cn } from "@/utilities/cn";
import { yupResolver } from "@hookform/resolvers/yup";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface ResetPasswordFormProps {
  className?: string;
  token: string | null;
}

export default function ResetPasswordForm({
  className,
  token,
}: ResetPasswordFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TResetPasswordSchema>({
    resolver: yupResolver(resetPasswordSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch("/api/verify-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
          }),
        });
        if (res.status === 400) {
          setError("password", { message: "Invalid or expired token" });
        }
        if (res.status === 200) {
          setError("password", { message: "" });
          const userData = await res.json();
          setUser(userData);
        }
      } catch (error) {
        setError("password", { message: "Error, try again" });
        console.log(error);
      }
    };
    verifyToken();
  }, [token, router, setError]);

  const onSubmit = async (data: TResetPasswordSchema) => {
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: data.password,
          email: user?.email,
        }),
      });
      if (res.status === 400) {
        toast.error("Something went wrong");
        setError("password", { message: "Something went wrong" });
      }
      if (res.status === 200) {
        toast.success("Password reset successfully");
        setError("password", { message: "" });
        router.push("/login");
      }
    } catch (error) {
      toast.error("Error, try again");
      setError("password", { message: "Error, try again" });
      console.log(error);
    }
  };

  return (
    <div className={cn("w-full flex flex-col p-6", className)}>
      <div className="flex sm:justify-between flex-col sm:flex-row items-center gap-4 mb-6">
        <h2 className="text-[32px] font-medium">Reset Password</h2>
      </div>

      <form
        className="flex flex-col gap-3  max-w-md mx-auto w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* password */}

        <div className="flex flex-col gap-1 relative">
          <label htmlFor="password" className="text-paragraph_color">
            New Password
          </label>
          <div className="relative">
            <input
              {...register("password", { required: "This field is required" })}
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

        <div className="flex items-center justify-between gap-3">
          <button
            type="submit"
            className={cn(
              "rounded-full bg-primary-50 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-50",
              isSubmitting && "opacity-50 cursor-not-allowed"
            )}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Resetting..." : "Reset password"}
          </button>
        </div>
      </form>
    </div>
  );
}
