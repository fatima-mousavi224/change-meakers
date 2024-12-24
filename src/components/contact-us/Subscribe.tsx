"use client";
import React, { useState } from "react";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import { Slash } from "@/icons/Icons";
import { SubscriptionMessageIcon } from "../icons/Icons";
export default function Subscribe() {
  const [loading, setLoading] = useState(false);
  function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = e.currentTarget.querySelector("input")?.value;
    setLoading(true);
    if (email) {
      fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
        .then((res) => res.json())
        .then((data) => {
          toast.success(data.message);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.error);
        });
    }
  }
  return (
    <div>
      <div className="flex flex-col justify-center items-center p-8 bg-light_gray rounded-[10px]">
        <div className="flex justify-center items-center lg:flex-row flex-col w-[90%] mx-auto gap-4">
          <div className="flex gap-4 sm:flex-row flex-col items-center lg:justify-start justify-center lg:w-[60%] w-full">
            <div>
              <div className="md:size-[74px] size-14 rounded-full flex items-center justify-center bg-primary-50 bg-opacity-20">
                <SubscriptionMessageIcon />
              </div>
            </div>
            <h2 className="text-sm md:text-lg text-black  md:font-bold font-semibold sm:text-start text-center">
              Stay updated! Subscribe to receive the latest news, events, and
              impact stories from our work.
            </h2>
          </div>
          <div className="lg:w-[40%] w-full">
            <form
              className="w-full flex lg:items-end lg:justify-end items-center justify-center"
              onSubmit={handleSubscribe}
            >
              <div className="flex  border-2 border-gray-200 rounded-md sm:w-[495px] w-full">
                <input
                  type="email"
                  placeholder="Enter Your Email Address"
                  className="p-2 text-sm outline-none w-full rounded-l-md border-none placeholder-gray-400 focus:ring-0"
                />
                <button
                  type="submit"
                  className="bg-primary-50 text-white p-2 rounded-md scale-105"
                >
                  {loading ? (
                    <Loader />
                  ) : (
                    <Slash className="h-5 w-5 duration-150 hover:scale-105" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
