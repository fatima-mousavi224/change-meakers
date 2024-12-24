"use client";
import React, { useState } from "react";
import DonateModal from "./DonateModal";
import { z } from "zod";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

interface DonationFormData {
  donationType: string;
  donationFrequency: "monthly" | "one-time";
  first_name: string;
  last_name: string;
  email: string;
}

const donateSchema = z.object({
  donationType: z.string().min(1, "Donation type is required"),
  donationFrequency: z.string().min(1, "Donation frequency is required"),
  customAmount: z.number().optional(),
});

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function DonationForm() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<DonationFormData>({
    donationType: "General Fund",
    donationFrequency: "monthly",
    first_name: "",
    last_name: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [amount, setAmount] = useState(25);

  // Handle all input changes
  const handleChangeInput = (
    e:
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleOpenModal = (e: React.FormEvent) => {
    const validationResult = donateSchema.safeParse(formData);

    if (!validationResult.success) {
      const newErrors = validationResult.error.errors.reduce((acc, curr) => {
        acc[curr.path[0] as string] = curr.message;
        return acc;
      }, {} as Record<string, string>);
      setErrors(newErrors);
      return;
    }
    setOpen(true);
  };

  const handleDonationAmountChange = (newAmount: number) => {
    setAmount(newAmount);
  };
  // Handle form cancellation
  const handleCancel = () => {
    // Reset form to default state
    setFormData({
      donationType: "General Fund",
      donationFrequency: "monthly",
      first_name: "",
      last_name: "",
      email: "",
    });
  };

  return (
    <div>
      <div className="p-6 bg-light_gray shadow-lg rounded-lg w-full lg:h-[544px]">
        <p className="text-lg font-semibold text-black_color text-justify">
          Girls and children belong in school.{" "}
          <span className="font-normal">
            However, in Afghanistan, girls are denied the right to education.
            Join us in advocating for girls’ education in the only country where
            they cannot attend school. Your support can help dismantle these
            barriers.
          </span>
        </p>

        {/* Donation Type */}
        <label htmlFor="donationType" className="block mt-6 font-normal">
          Choose a donation type:
        </label>
        <select
          id="donationType"
          name="donationType"
          value={formData.donationType}
          onChange={handleChangeInput}
          className="w-full mt-2 p-2 border rounded-md bg-dark_gray/30 border-dark_gray/30 focus:ring-1 focus:ring-dark_gray/30 focus:border-dark_gray"
        >
          <option value="General Fund">General Fund</option>
          <option value="Cost of Education">Cost of Education</option>
          <option value="Emergency Relief Fund">Emergency Relief Fund</option>
          <option value="Human Rights Advocacy">Human Rights Advocacy</option>
          <option value="Scholarship Fund">Scholarship Fund</option>
        </select>
        {errors.donationType && (
          <p className="text-red-400 text-center w-full mt-1 px-2 text-sm">
            {errors.donationType}
          </p>
        )}

        {/* Donation Amount */}
        <div className="mt-6">
          <p className="font-normal">Choose a donation amount:</p>
          <div className="flex items-center gap-4 mt-2">
            {[25, 50, 100].map((amountValue) => (
              <label key={amountValue} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="donationAmount"
                  className="focus:outline-primary-50 text-primary-50"
                  value={amountValue}
                  checked={amountValue === amount}
                  onChange={(e) =>
                    handleDonationAmountChange(Number(e.target.value))
                  }
                />
                <span>${amountValue}</span>
              </label>
            ))}
            {errors.donationAmount && (
              <p className="text-red-400 text-center w-full mt-1 px-2 text-sm">
                {errors.donationAmount}
              </p>
            )}
          </div>
        </div>

        {/* Donation Frequency */}
        <div className="mt-6">
          <p className="font-normal">Choose a donation frequency:</p>
          <div className="flex items-center gap-4 mt-2">
            {["monthly", "one-time"].map((frequency) => (
              <label
                key={frequency}
                className={`flex items-center gap-2 px-4 py-2 lg:w-1/2 rounded-lg cursor-pointer ${
                  formData.donationFrequency === frequency
                    ? "bg-primary-50 bg-opacity-20 text-black_color"
                    : "text-[#828282]"
                }`}
              >
                <input
                  type="radio"
                  name="donationFrequency"
                  className="focus:outline-primary-50 text-primary-50"
                  value={frequency}
                  checked={formData.donationFrequency === frequency}
                  onChange={handleChangeInput}
                />
                <span className="capitalize">
                  {frequency === "one-time" ? "One-Time" : "Monthly"}
                </span>
              </label>
            ))}
            {errors.donationFrequency && (
              <p className="text-red-400 text-center w-full mt-1 px-2 text-sm">
                {errors.donationFrequency}
              </p>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            You can donate the amount you choose every month.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between w-full lg:gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-transparent rounded-lg hover:bg-gray-300 lg:w-1/2 border border-primary-50 text-primary-50"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 font-light bg-primary-50 text-white rounded-lg hover:bg-primary-200 lg:w-1/2"
            onClick={handleOpenModal}
          >
            Support Now
          </button>
        </div>
      </div>
      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: isNaN(amount) ? 1000 : amount * 100,
          currency: "usd",
        }}
      >
        <DonateModal
          open={open}
          setOpen={setOpen}
          formData={formData}
          setFormData={setFormData}
          amount={amount}
          handleAmountChange={handleDonationAmountChange}
        />
      </Elements>
    </div>
  );
}
