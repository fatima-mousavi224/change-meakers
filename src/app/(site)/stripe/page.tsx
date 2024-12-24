"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckOutForm from "./CheckOutForm";
import { Suspense, useState } from "react";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
export default function Donate() {
  const [amount, setAmount] = useState(100);

  const handleAmountChange = (newAmount: number) => {
    setAmount(newAmount);
  };

  return (
    <div className="max-w-3xl sm:mx-auto my-10 md:my-20 px-4 md:px-8 bg-light_gray p-8 mx-2 ">
      <Suspense fallback={"loading..."}>
        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: isNaN(amount) ? 1000 : amount * 100,
            currency: "usd",
          }}
        >
          <CheckOutForm
            amount={amount}
            handleAmountChange={handleAmountChange}
          />
        </Elements>
      </Suspense>
    </div>
  );
}
