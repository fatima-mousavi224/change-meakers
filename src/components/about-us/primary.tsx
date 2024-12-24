"use client";
import React, { useState } from "react";
import unicef from "public/images/about/unicef.png";
import iom from "public/images/about/iom.png";
import rsf from "public/images/about/rsf.png";
import unesco from "public/images/about/unesco.png";
import Image from "next/image";
import Link from "next/link";

export default function Primary() {
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    // If the same card is clicked, collapse it; otherwise, expand the clicked card
    setExpandedCardId(expandedCardId === id ? null : id);
  };
  return (
    <section className="lg:py-16">
      <div className="lg:px-20 text-center">
        {/* Title */}
        <h2 className="sm:text-4xl text-2xl font-bold text-gray-800 mb-4">
          Why Is Afghanistan Our Primary Focus?
        </h2>
        <p className="text-lg text-gray-600 mb-12 text-justify">
          Change Makers of the World was established in Afghanistan in response
          to the urgent needs of its people. Despite facing significant
          challenges, including security threats, social barriers, and a lack of
          facilities and financial resources, we continue to operate actively in
          the country. Afghanistan remains at the core of our activities, and
          here’s why:
        </p>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 xl:gap-8 gap-6">
          {organizations.map((org) => (
            <div
              key={org.id}
              className={`bg-white shadow-md rounded-lg p-6 text-center flex flex-col justify-start items-start border transition-all duration-300 ${
                expandedCardId === org.id ? "h-full" : "h-fit"
              }`}
            >
              <Link href={org.link} className="flex flex-col items-start">
                <div className="mb-4 size-14 bg-light_gray rounded-full flex items-center justify-center">
                  <Image
                    src={org.logo}
                    alt={org.name}
                    height={1200}
                    width={1200}
                    className="w-9 mx-auto"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {org.name}
                </h3>
              </Link>
              <p
                className={`text-sm text-gray-600 text-start ${
                  expandedCardId === org.id ? "" : "line-clamp-4"
                }`}
              >
                {org.description}
              </p>
              <div className="flex items-start w-full">
                <button
                  onClick={() => toggleExpand(org.id)}
                  className="text-xs text-primary-50 mt-2 hover:underline text-start"
                >
                  {expandedCardId === org.id ? "Show Less" : "Learn More"}
                </button>{" "}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Organization Data
const organizations = [
  {
    id: 1,
    name: "UNICEF",
    logo: unicef,
    description:
      'The United Nations reported that Taliban restrictions on the rights of women and girls have "effectively trapped" most of them in their homes, making Afghanistan the "most repressive" country in the world for women.',
    link: "https://www.voanews.com/a/un-taliban-run-afghanistan-becomes-world-s-most-repressive-nation-for-women-/6995453.html",
  },
  {
    id: 2,
    name: "IOM UN Migration",
    logo: iom,
    description:
      "The International Organization for Migration (IOM) reports that nearly eight million Afghan citizens have migrated since 2020, with 85% of them moving to neighboring countries.",
    link: "https://missingmigrants.iom.int/sites/g/files/tmzbdl601/files/publication/file/A%20decade%20of%20documenting%20migrant%20deaths.pdf",
  },
  {
    id: 3,
    name: "UNESCO",
    logo: unesco,
    description:
      "A recent survey conducted in April this year by UNICEF found that there are 7.8 million children out of school in Afghanistan, with 80% of Afghan school-age girls—about 2.5 million—being denied their right to education.Approximately half of children of primary school age are enrolled, and only one-fifth of those of secondary school age are in school.",
    link: "https://www.unesco.org/en/articles/250-million-children-out-school-what-you-need-know-about-unescos-latest-education-data",
  },
  {
    id: 4,
    name: "RSF",
    logo: rsf,
    description:
      "Reporters Without Borders stated that Afghanistan is the third worst country in the world for press freedom under the Taliban. Afghanistan is described as the “most repressive country” in South Asia, according to Célia Mercier, who covers the region for RSF.",
    link: "https://www.voanews.com/a/afghanistan-third-worst-in-world-for-press-freedom/7596697.html",
  },
];
