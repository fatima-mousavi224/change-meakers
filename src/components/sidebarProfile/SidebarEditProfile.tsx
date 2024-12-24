'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { IconType } from 'react-icons';
import {
  IoArrowBackCircleOutline,
  IoArrowForwardCircleOutline
} from 'react-icons/io5';

type editProfileProps = {
  icon: IconType;
  name: string;
  link: string;
};
type arrayProps = {
  data: editProfileProps[];
};
export default function SidebarEditProfile({ data }: arrayProps) {
  const [expended, setExpended] = useState(true);
  const pathName = usePathname();

  return (
    <div className={`flex`}>
      <div
        className={`flex flex-col ${expended ? 'w-40' : 'w-20'}  items-center shadow-lg`}
      >
        <div className="w-1/2 flex flex-col items-center gap-10 px-4">
          <div className="flex items-center justify-center relative pt-7">
            <h1
              className={`w-32  ${expended ? 'text-2xl' : ' text-sm'} text-center font-bold `}
            >
              Setting
            </h1>
            <span
              onClick={() => setExpended((curr) => !curr)}
              className={`absolute ${expended ? '-right-[1.2rem]' : '-right-1'} text-3xl top-2 cursor-pointer`}
            >
              {expended ? (
                <IoArrowBackCircleOutline />
              ) : (
                <IoArrowForwardCircleOutline />
              )}
            </span>
          </div>
          {data.map((item, index) => (
            <Link href={item.link} key={index}>
              <div
                className={`flex ${expended ? 'w-32 justify-start items-center  gap-2 p-2' : 'w-16 justify-center p-1'}  rounded-md group    ${
                  pathName === item.link
                    ? 'bg-primary-50 hover:bg-none text-white'
                    : 'hover:bg-slate-400 hover:text-white'
                }`}
              >
                <div
                  className={`${!expended && 'text-center flex justify-center items-center'}`}
                >
                  <item.icon className={`text-2xl`} />
                </div>
                <div className={` ${expended ? ' block' : ' hidden'}`}>
                  {item.name}
                </div>
                {!expended && (
                  <div
                    className={`absolute left-20 invisible opacity-20 -translate-x-4 transition-all duration-100 p-1 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 bg-gray-200 rounded-md shadow-md text-black`}
                  >
                    {item.name}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="w-1 bg-[#E2F1FF]"></div>
    </div>
  );
}
