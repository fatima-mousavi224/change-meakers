"use client";
import NoDonationMessage from "@/components/common/NoDonationMessage";
import Contribute from "@/components/home/contribute/Contribute";
import Link from "next/link";
import React, { useState } from "react";
import DashboardContribute from "./DashboardContribute";

interface Donation {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  amount: number;
  donationFrequency: string;
  donationType: string;
  createdAt: string;
  updatedAt: string;
}

const DashboardTable: React.FC<{ donations: Donation[] }> = ({ donations }) => {
  const [showDonationForm, setShowDonationForm] = useState(false);

  const toggleView = () => {
    setShowDonationForm((prev) => !prev);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {showDonationForm ? "Contribute" : "Donations"}
          </h1>
          {donations.length === 0 && (
            <p className="text-base">
              Your donation history will appear here after your first donation.
            </p>
          )}
        </div>

        {donations.length !== 0 && (
          <button
            onClick={toggleView}
            className="bg-primary-50 p-2 rounded-lg font-medium text-white hover:bg-primary-200 transition duration-300 ease-in-out"
          >
            {showDonationForm ? "Back" : "Donate Now"}
          </button>
        )}
      </div>

      <div className="">
        {showDonationForm ? (
          <div className="inline-block min-w-full py-2 align-middle bg-white shadow-lg rounded-lg mt-10 min-h-[600px]">
            <div className="sm:px-8 px-4">
              <DashboardContribute />
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg px-4 lg:px-8">
            <div className="mt-8 flow-root ">
              <div className="-mx-4 -my-2 overflow-auto sm:-mx-6 lg:-mx-8">
                {donations.length === 0 ? (
                  <div className="sm:px-8 px-4">
                    <DashboardContribute />
                  </div>
                ) : (
                  <div className="inline-block min-w-full py-2 align-middle bg-white shadow-lg rounded-lg min-h-[600px]">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead>
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                          >
                            Full Name
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Email
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Amount
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Donation Type
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Frequency
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white w-full">
                        {donations.map((donation) => (
                          <tr
                            key={donation.id}
                            className="hover:bg-gray-200 text-sm font-normal text-paragraph_color"
                          >
                            <td className="whitespace-nowrap py-4 pl-4 pr-3  sm:pl-6 lg:pl-8">
                              {donation.first_name} {donation.last_name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 ">
                              {donation.email}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 ">
                              ${donation.amount}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 ">
                              {donation.donationType}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 ">
                              {donation.donationFrequency}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 ">
                              {new Date(
                                donation.createdAt
                              ).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTable;
