"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { BadgeAlertIcon, ChevronLeft } from "lucide-react";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import toast from "react-hot-toast";
import { z } from "zod";

interface DonationFormData {
  donationType: string;
  donationFrequency: "monthly" | "one-time";
  first_name: string;
  last_name: string;
  email: string;
}

const donateSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
});
export default function DonateModal({
  open,
  setOpen,
  formData,
  setFormData,
  amount,
  handleAmountChange,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  formData: DonationFormData;
  setFormData: (data: DonationFormData) => void;
  amount: number;
  handleAmountChange: (amount: number) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [lastStep, setLastStep] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const [paymentIntent, setPaymentIntent] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: amount * 100 }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret),
          setPaymentIntent(data.paymentIntent);
      });
  }, [amount]);

  const tip = (typeof amount === "number" ? amount : 0) * 0.029 + 0.3;

  const handleContinue = () => {
    //validate form data
    const validationResult = donateSchema.safeParse({
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
    });

    if (!validationResult.success) {
      const newErrors = validationResult.error.errors.reduce((acc, curr) => {
        acc[curr.path[0] as string] = curr.message;
        return acc;
      }, {} as Record<string, string>);
      setErrors(newErrors);
      setLoading(false);
      return;
    }
    setLastStep(true);
  };

  const handleCancel = () => {
    // Reset form to default state
    setFormData({
      donationType: "General Fund",
      donationFrequency: "monthly",
      first_name: "",
      last_name: "",
      email: "",
    });
    setOpen(false);
    setLastStep(false);
  };

  const onSubmit = async (data: any) => {
    data.preventDefault();
    setLoading(true);

    try {
      if (!stripe || !elements) {
        throw new Error("Stripe or Elements not available");
      }

      const { error: submitError } = await elements.submit();

      if (submitError) {
        throw new Error(submitError.message);
      }

      const res = await fetch("/api/donation", {
        method: "POST",
        body: JSON.stringify({ ...formData, amount }),
      });

      const response = await res.json();
      if (res.status === 400) {
        throw new Error(response.message);
      }
      if (res.status === 500) {
        throw new Error("Internal Server Error");
      }
      if (response.ok) {
        setLoading(false);
        setErrors({});
        toast.success("Payment successful!");

        return;
      }

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `https://www.cmworld.org/success`,
        },
      });
      if (error) {
        throw new Error(error.message);
      } else {
        // The payment UI automatically closes with a success animation.
        // Your customer is redirected to your `return_url`.
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setLastStep(false);
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-600/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden r px-4 pb-4 pt-5 text-left transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <button
              onClick={handleCancel}
              className="text-gray-400  rounded-lg bg-slate-100 border border-primary-50/75 border-1 cursor-pointer px-4 py-2 hover:bg-slate-200 "
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <div className=" mt-2 transition-all.duration-300.h-full bg-white px-8 py-3 rounded-lg">
              {!lastStep ? (
                <div className="mt-4">
                  <p className="font-normal">Choose a donation amount:</p>
                  <div className="flex items-center gap-4 mt-2">
                    {[25, 50, 100].map((selectedAmount) => (
                      <label
                        key={selectedAmount}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="radio"
                          name="donationAmount"
                          className="focus:outline-primary-50 text-primary-50"
                          value={selectedAmount}
                          checked={selectedAmount === amount}
                          onChange={() => handleAmountChange(selectedAmount)}
                        />
                        <span>${selectedAmount}</span>
                      </label>
                    ))}
                  </div>
                  <div className="relative mt-4">
                    <input
                      id="DonationInput"
                      type="number"
                      className="font-semibold pl-[14px] pt-[18px] pb-2 border border-gray-400 focus:border-primary-50 focus:ring-transparent rounded-lg w-full text-black"
                      onChange={(e) =>
                        handleAmountChange(parseFloat(e.target.value))
                      }
                      min={1}
                      value={amount > 0 ? amount : 0}
                    />
                    <label
                      className="px-2 transition-all absolute duration-300 left-0 top-1 -z-1 origin-0 text-gray-400 pointer-events-none text-xs"
                      htmlFor="DonationInput"
                    >
                      Enter an amount to support
                    </label>
                    <span className="absolute text-gray-500 top-1/2 -translate-y-1/2 right-4">
                      USD
                    </span>
                  </div>

                  <div className="mt-6 flex justify-between w-full lg:gap-4">
                    {/* Donar Information */}
                    <div className="grid grid-cols-1 gap-y-2 false">
                      <div className="bg-[#fff] rounded-xl">
                        <div className="bg-[#fff] ">
                          <p className="font-semibold ">Your Information</p>
                          <p className="text-sm my-2">
                            Kindly provide the necessary information to proceed
                            with the payment.
                          </p>
                          <div className="grid grid-cols-2 gap-x-2">
                            <div>
                              <div className="relative z-0 w-full text-base-regular">
                                <input
                                  type="text"
                                  id="first_name"
                                  name="first_name"
                                  onChange={(e) => {
                                    setFormData({
                                      ...formData,
                                      first_name: e.target.value,
                                    });
                                  }}
                                  className="pt-4 pb-1 block w-full px-4 bg-transparent appearance-none focus:outline-none focus:ring-0 border border-gray-400 focus:border-primary-50 focus:ring-transparent rounded-md mt-2 transition-colors duration-300"
                                />
                                <label
                                  htmlFor="first_name"
                                  className="px-2 transition-all absolute duration-300 top-1 -z-1 origin-0 text-gray-400 pointer-events-none text-xs"
                                >
                                  First Name
                                </label>
                                {errors.first_name && (
                                  <p className="text-red-400 text-left w-full mt-1  text-xs">
                                    {errors.first_name}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="relative z-0 w-full text-base-regular">
                                <input
                                  type="text"
                                  id="last_name"
                                  name="last_name"
                                  onChange={(e) => {
                                    setFormData({
                                      ...formData,
                                      last_name: e.target.value,
                                    });
                                  }}
                                  className="pt-4 pb-1 block w-full px-4 bg-transparent appearance-none focus:outline-none focus:ring-0 border border-gray-400 focus:border-primary-50 focus:ring-transparent rounded-md mt-2 transition-colors duration-300"
                                />
                                <label
                                  htmlFor="last_name"
                                  className="px-2 transition-all absolute duration-300 top-1 -z-1 origin-0 text-gray-400 pointer-events-none text-xs"
                                >
                                  Last Name
                                </label>
                                {errors.last_name && (
                                  <p className="text-red-400 text-left w-full mt-1  text-xs">
                                    {errors.last_name}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="col-span-2">
                              <div className="relative z-0 w-full text-base-regular">
                                <input
                                  type="text"
                                  id="email"
                                  name="email"
                                  onChange={(e) => {
                                    setFormData({
                                      ...formData,
                                      email: e.target.value,
                                    });
                                  }}
                                  className="pt-4 pb-1 block w-full px-4 bg-transparent appearance-none focus:outline-none focus:ring-0 border border-gray-400 focus:border-primary-50 focus:ring-transparent rounded-md mt-2 transition-colors duration-300"
                                />
                                <label
                                  htmlFor="email"
                                  className="px-2 transition-all absolute duration-300 top-1 -z-1 origin-0 text-gray-400 pointer-events-none text-xs"
                                >
                                  Email
                                </label>
                                {errors.email && (
                                  <p className="text-red-400 text-left w-full mt-1  text-xs">
                                    {errors.email}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="col-span-2 mt-2">
                              <div></div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#fff] rounded-xl ">
                          <div className="flex flex-row justify-between items-center mt-8">
                            <button
                              type="button"
                              className="flex justify-center items-center  transition-colors duration-500 group bg-white text-black border border-primary-200 hover:bg-primary-50 hover:bg-opacity-20 active:bg-primary-600 hover:border-primary-200 active:border-primary-400 active:text-white px-8 py-2 rounded-lg cursor-pointer"
                              onClick={handleCancel}
                            >
                              back
                            </button>
                            <div className="relative group">
                              <button
                                className="flex justify-center items-center  transition-colors duration-500 group py-2.5 text-white hover:text-primary-100 active:text-white hover:bg-primary-50 hover:bg-opacity-20 bg-primary-50 active:bg-primary-50 border border-primary-50 active:border-primary-200 px-8 rounded-lg cursor-pointer"
                                onClick={handleContinue}
                              >
                                continue
                              </button>
                              <div className="hidden absolute top-[-40px] left-[50%] -translate-x-1/2 bg-primary-50 text-center text-xs p-2 rounded-md whitespace-nowrap false">
                                Please Enter support amount
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <div className="bg-[#fff] rounded-xl">
                    <div className="flex flex-col gap-2 false">
                      <h2 className="mb-1 text-xl llg:text-2xl font-semibold">
                        Payment Summary:
                      </h2>
                      <div className="flex justify-between items-center text-gray-600">
                        <p className="text-[1rem] leading-[1]">Amount:</p>
                        <p className="text-[1rem] leading-[1]">
                          ${amount.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex justify-between items-center text-gray-600">
                        <p className="text-[1rem] leading-[1]">Tip:</p>
                        <p className="text-[1rem] leading-[1]">
                          ${tip.toFixed(2)}
                        </p>
                      </div>
                      <div className="mt-1 h-[1px] bg-gray-400"></div>
                      <div className="flex justify-between items-center text-xl font-medium">
                        <p className="leading-[1.5] lg:text-xl llg:text-2xl font-semibold">
                          Total:
                        </p>
                        <p className="leading-[1.5] lg:text-xl llg:text-2xl font-semibold">
                          ${amount + tip}
                        </p>
                      </div>
                      <div className="flex justify-between items-center bg-primary-50 bg-opacity-15 p-2 rounded-xl gap-x-2 text-sm">
                        <BadgeAlertIcon className="w-12 h-12 text-primary-50" />
                        <p>
                          The ${amount + tip} donation amount includes a 2.9% +
                          30c transaction fee, which is collected by the payment
                          processor and does not go to Change Makers.
                        </p>
                      </div>

                      <div className="mt-1 h-[1px] bg-gray-400"></div>
                      <form
                        onSubmit={onSubmit}
                        className="mx-auto py-4 rounded-md"
                      >
                        <>
                          {!clientSecret || !elements || !stripe ? (
                            <Loader />
                          ) : (
                            <PaymentElement />
                          )}
                        </>

                        <div className="flex justify-between">
                          <button
                            type="button"
                            className=" mt-4 px-8  flex justify-center items-center  transition-colors duration-500 group bg-white text-black border border-primary-200 hover:bg-primary-50 hover:bg-opacity-20 active:bg-primary-600 hover:border-primary-200 active:border-primary-400 active:text-white py-2.5 rounded-lg cursor-pointer"
                            onClick={handleBack}
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            disabled={!stripe || loading}
                            className="disabled:opacity-50 disabled:animate-pulse mt-4  disabled:cursor-not-allowed flex justify-center items-center  transition-colors duration-500 group py-2.5 text-white hover:text-primary-100 active:text-white hover:bg-primary-50 hover:bg-opacity-20 bg-primary-50 active:bg-primary-50 border border-primary-50 active:border-primary-200 px-8 rounded-lg cursor-pointer"
                          >
                            {!loading ? `Donate` : "Processing..."}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

function Loader() {
  return (
    <div className="flex items-center justify-center">
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-primary-50"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  );
}
