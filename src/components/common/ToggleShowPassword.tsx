"use client";
import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

interface ToggleShowPasswordProps {
  isShowPassword: boolean;
  toggleShowPassword: () => void;
}

export default function ToggleShowPassword({
  isShowPassword,
  toggleShowPassword,
}: ToggleShowPasswordProps) {
  return (
    <>
      {isShowPassword ? (
        <div
          className="flex items-center gap-1 absolute -top-6 right-1 cursor-pointer  transition"
          onClick={toggleShowPassword}
        >
          <FaEye className="text-gray-500" />
          <span className="text-paragraph_color sr-only">Hide</span>
        </div>
      ) : (
        <div
          className="flex items-center gap-1 absolute -top-6 right-1 cursor-pointer  transition"
          onClick={toggleShowPassword}
        >
          <FaEyeSlash className="text-gray-500" />
          <span className="text-paragraph_color sr-only">Show</span>
        </div>
      )}
    </>
  );
}
