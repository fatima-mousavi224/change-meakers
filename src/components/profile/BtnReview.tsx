import React from 'react';
import type { IconType } from 'react-icons';

interface BtnProps {
  Icon?: IconType;
  name: string;
}
export default function BtnReview({ name, Icon }: BtnProps) {
  return (
    <div className="sm:w-[60%] w-full sm:justify-end justify-center pr-8 sm:pr-0 items-center flex">
      <button className="flex justify-center items-center bg-[#706F6F21] text-[#134C83] sm:text-[13.88px] text-[3.54px] font-bold sm:gap-3 gap-1 rounded sm:w-[162px] sm:h-[35px] w-[41.34px] h-[8.93px] cursor-pointer">
        {Icon && <Icon />}
        {Icon && ''}
        {name}
      </button>
    </div>
  );
}
