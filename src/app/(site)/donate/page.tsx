import Contribute from '@/components/home/contribute/Contribute'
import React from 'react'

export default function DonatePage() {
  return (
    <div className="max-w-screen-2xl px-4 mx-auto my-4">
    <div className="bg-bannerProgram bg-no-repeat bg-center bg-cover sm:h-[357px] h-[200px] rounded-[20px] flex justify-center items-center relative">
      <div className="absolute inset-0 flex items-center justify-center w-full text-white font-bold text-3xl md:text-5xl ">
        <h1>Donate Us</h1>
      </div>
    </div>
    <div className="flex lg:flex-row flex-col gap-4 w-full mx-auto justify-between py-20">
    <Contribute />
   </div>
  </div>
  )
}
