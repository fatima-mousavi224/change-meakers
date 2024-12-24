"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface CheckOutFormProps {
  amount: number;
  handleAmountChange: (newAmount: number) => void;
}

export default function CheckOutForm({
  amount,
  handleAmountChange,
}: CheckOutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntent, setPaymentIntent] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: amount,
    },
  });

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

  const onSubmit = async (data: any) => {
    setLoading(true);
    console.log(data);

    try {
      if (!stripe || !elements) {
        throw new Error("Stripe or Elements not available");
      }

      const { error: submitError } = await elements.submit();

      if (submitError) {
        throw new Error(submitError.message);
      }

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `http://localhost:3000/donate`,
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

  // if (!clientSecret || !stripe || !elements) {
  //   return <Loader />;
  // }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto p-2 rounded-md max-w-xl"
    >
      <div className="mb-8">
        <h2 className="lg:text-4xl md:text-3xl text-lg font-bold text-primary-50 text-center mb-8">
          Your Information
        </h2>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-neutral-600">
              Amount (USD)
            </label>
            <input
              {...register("amount")}
              type="number"
              name="amount"
              step="0.01"
              min="0.50"
              onChange={(e) => handleAmountChange(parseFloat(e.target.value))}
              autoComplete="off"
              placeholder="Enter Amount"
              className="px-4 py-3 outline-none rounded-md"
            />
            <p className="text-red-500">{errors.amount?.message}</p>
          </div>
        </div>
      </div>
      <>
        {clientSecret && elements && stripe && (
          <h3 className="md:text-2xl text-base font-bold text-primary-50 text-center mb-8">
            credit card billing information{" "}
          </h3>
        )}
        {!clientSecret || !elements || !stripe ? (
          <Loader />
        ) : (
          <PaymentElement />
        )}
      </>

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={!stripe || loading}
          className=" w-max  disabled:opacity-50 disabled:animate-pulse mt-4 bg-white border border-neutral-500 hover:bg-primary-50 hover:text-white text-black px-4 disabled:cursor-not-allowed"
        >
          {!loading ? `Donate` : "Processing..."}
        </button>
      </div>
    </form>
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
