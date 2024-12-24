import React from 'react';
import type { IconType } from 'react-icons';
import BtnDate from './BtnDate';
import BtnReview from './BtnReview';

import { FaCheck } from 'react-icons/fa6';

interface IProfileNotification {
  children: React.ReactNode;
  Icon: IconType;
  count: number;
  title: string;
  subTitle?: string;
}
export default function ProfileNotifications({
  count,
  Icon,
  subTitle,
  title,
  children
}: IProfileNotification) {
  return (
    <div className="w-full">
      <div className="w-full flex items-end flex-col sm:flex-row sm:gap-3 gap-1 justify-center">
        <div className="flex w-full gap-1 sm:justify-start justify-center">
          <div className="sm:w-[43.11px] sm:h-[43.11px] w-[18px] h-[18px] rounded-full relative sm:bg-[#FFFFFF] bg-[#E2F1FF] border border-[#000000A6] flex justify-center items-center">
            <div className="absolute sm:w-[12.5px] sm:h-[12.5px] w-[8px] h-[8px] bg-[#FF0000] sm:text-[7.93px] text-[4px] font-bold top-0 rounded-full sm:right-0 -right-1 flex justify-center items-center text-sm text-white  ">
              {count}
            </div>
            <Icon className="text-[#134C83] sm:text-2xl text-[10px]" />
          </div>
          <div className="sm:w-[147px] h-4 w-[55px] flex flex-col sm:pt-3 pt-1 text-[#000000A6] font-bold sm:text-[9.91px] text-[4.82px]">
            <h1>{title}</h1>
            <h2>{subTitle}</h2>
          </div>
        </div>
        {title == 'Missed Call' ? (
          <BtnDate date="3 july,2024 at 12:45 pm" />
        ) : title == 'E-Mail' ? (
          <BtnReview Icon={FaCheck} name={'Review E-mail'} />
        ) : (
          <BtnReview name={'Review All Comments'} />
        )}
      </div>
      {children}
    </div>
  );
}
