import Image from "next/image";
import React from "react";

export default function NoDataMessage() {
  return (
    <div className="flex justify-center items-center px-4 sm:px-0">
      <Image
        src="/images/No data-amico.svg"
        alt="No Data"
        width={400}
        height={400}
      />
    </div>
  );
}
