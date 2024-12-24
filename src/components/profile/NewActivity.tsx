import React from 'react'
import { FaPlus } from 'react-icons/fa6'

interface INewActivity{
  onclick:()=>void;
}
export default function NewActivity({onclick}:INewActivity) {
  return (
    <div className="flex px-4 sm:px-0 items-center">
    <div onClick={onclick} className="sm:w-[57px] sm:h-[57px] w-[18px] h-[18px] rounded-full bg-[#134C83] flex justify-center items-center text-white text-xl">
      <FaPlus className='sm:text-2xl text-[10px]'/>
    </div>
    <div className="flex items-center text-[#134C83] text-lg ml-4 font-bold">
      <h2 className='sm:text-[20px] text-[10.9px] font-bold'>Nwe Activity </h2>
    </div>
  </div>
  )
}
