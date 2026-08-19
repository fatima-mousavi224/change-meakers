"use client";

import { useEffect, useState } from "react";

import type { EducationDeniedDuration } from "@/utilities/getEducationDeniedDuration";
import {
  getEducationDeniedDuration,
  padCountdownUnit,
} from "@/utilities/getEducationDeniedDuration";
import { cn } from "@/utilities/cn";

type EducationDeniedCountdownProps = {
  startDate: string;
  className?: string;
};

type CountdownUnit = {
  label: string;
  value: keyof EducationDeniedDuration;
  pad?: boolean;
};

const COUNTDOWN_UNITS: CountdownUnit[] = [
  { label: "Years", value: "years" },
  { label: "Months", value: "months" },
  { label: "Days", value: "days", pad: true },
  { label: "Hours", value: "hours", pad: true },
  { label: "Mins", value: "minutes", pad: true },
  { label: "Secs", value: "seconds", pad: true },
];

export default function EducationDeniedCountdown({
  startDate,
  className,
}: EducationDeniedCountdownProps) {
  const [duration, setDuration] = useState<EducationDeniedDuration>(() =>
    getEducationDeniedDuration(new Date(startDate)),
  );

  useEffect(() => {
    const start = new Date(startDate);

    const updateDuration = () => {
      setDuration(getEducationDeniedDuration(start));
    };

    updateDuration();
    const intervalId = window.setInterval(updateDuration, 1000);

    return () => window.clearInterval(intervalId);
  }, [startDate]);

  return (
    <div
      className={cn(
        "grid w-full grid-cols-6 gap-1 lg:flex lg:flex-nowrap lg:justify-between lg:gap-2",
        className,
      )}
    >
      {COUNTDOWN_UNITS.map(({ label, value, pad }) => (
        <div
          key={label}
          className="flex min-h-[72px] w-full flex-col items-center justify-center gap-1.5 rounded-[12px] border border-[#E6E6E6] bg-white px-1 py-3 lg:min-h-[92px] lg:w-[74px] lg:gap-2 lg:px-2 lg:py-4"
        >
          <span className="font-plusJakartaSans text-[14px] font-bold leading-none text-[#000000] lg:text-[28px]">
            {pad ? padCountdownUnit(duration[value]) : duration[value]}
          </span>
          <span className="font-plusJakartaSans text-[9px] font-normal leading-none text-[#575757] lg:text-[14px]">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
