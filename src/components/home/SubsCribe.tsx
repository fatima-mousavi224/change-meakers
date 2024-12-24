'use client'
import React from 'react'
import toast from "react-hot-toast";
import {  useState } from "react";
import { Loader } from "lucide-react";
import { Slash } from '../icons/Icons';

export default function SubsCribe() {
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
    <div className="flex flex-col justify-center items-center p-8 bg-secondary_color">
    <div className="flex justify-center items-center">
      <h2 className="text-sm md:text-lg pr-0 sm:pr-2 text-black  font-bold">
        Stay up to date & Subscribe
      </h2>
      <form className="flex md:mt-0" onSubmit={handleSubscribe}>
        <div className="flex  border-2 border-gray-200 rounded-md sm:w-[300px] w-[210px]">
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
    <p className="text-gray-400 text-sm text-start pt-1">
      Join our community for exclusive updates, tips and special offers
      delivered straight to your inbox!
    </p>
  </div>
  )
}
