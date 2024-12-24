"use client";
import { useMemo, useState } from "react";

import NoDonationMessage from "@/components/common/NoDonationMessage";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PaymentInfo } from "@prisma/client";
import moment from "moment";

interface DonationsTableProps {
  donations: PaymentInfo[];
}

export default function DonationsTable({ donations }: DonationsTableProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"Date" | "Name" | "">("");

  const handleSortChange = (sortItem: "Date" | "Name" | "") => {
    setSort(sortItem);
  };

  // Derived sorted and filtered posts
  const filteredAndSortedUsers = useMemo(() => {
    let filteredPosts = donations.filter((donation) =>
      donation?.first_name?.toLowerCase().includes(search.toLowerCase())
    );

    if (sort === "Date") {
      filteredPosts = filteredPosts.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    } else if (sort === "Name") {
      // @ts-ignore
      filteredPosts = filteredPosts.sort((a, b) =>
        // @ts-ignore
        a?.first_name?.localeCompare(b?.first_name)
      );
    }

    return filteredPosts;
  }, [donations, search, sort]);

  if (donations.length === 0) {
    return <NoDonationMessage />;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 mb-8">
      <div className="sm:flex sm:items-center justify-between">
        <div />
        <div className="flex items-center justify-end gap-x-2.5">
          <div className="grid w-full max-w-lg grid-cols-1 lg:max-w-xs">
            <input
              name="search"
              type="search"
              placeholder="Search by name"
              className="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-10 pr-3 text-base text-gray-900 border-gray-300 placeholder:text-gray-400 sm:text-sm/6 focus:border-primary-50"
              onChange={(e) => setSearch(e.target.value)}
            />
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400"
            />
          </div>
          <select
            className="rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 border-gray-300 focus:outline-2 sm:text-sm/6 focus:border-primary-50"
            onChange={(e) =>
              handleSortChange(e.target.value as "Date" | "Name" | "")
            }
            value={sort}
          >
            <option value="">Sort by: All</option>
            <option value="Name">Name</option>
            <option value="Date">Date</option>
          </select>
        </div>
      </div>
      <div className="mt-4 flow-root bg-white shadow-sm ring-1 ring-gray-900/5 rounded-[20px] p-5">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-2 xl:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full">
              <thead>
                <tr className="p-2 rounded-xl bg-[#EAEAEA]">
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 rounded-tl-xl rounded-bl-xl"
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
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 rounded-tr-xl rounded-br-xl"
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 flex items-center gap-x-2">
                      <span>
                        {user.first_name} {user.last_name}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.amount}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.donationType}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {user.donationFrequency}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {moment(user.createdAt).format("MMM Do YYYY")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
