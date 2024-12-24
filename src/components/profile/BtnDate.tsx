import React from 'react'

export default function BtnDate({date}:{date:string}) {
  return (
    <div className="sm:w-[60%] w-full sm:justify-end justify-center pr-6 sm:pr-0 items-center flex">
            <div className="flex justify-center items-center font-bold text-[#000000A6] sm:text-[16.82px] text-[3.98px] bg-[#706F6F21] sm:w-[221px] sm:h-[34.64px] w-[52.36px] h-[8.21px] rounded">
          {date}
            </div>
          </div>
  )
}
