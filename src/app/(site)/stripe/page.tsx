"use client";
import SiteContainer from "@/components/common/SiteContainer";
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
    <SiteContainer className="my-10 md:my-20">
      <div className="mx-auto max-w-3xl bg-light_gray p-8">
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
    </SiteContainer>
  );
}
