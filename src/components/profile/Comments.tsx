import React from 'react';

interface IComments {
  name: string;
  date: string;
  text: string;
}
interface ArrayIComments{
  data:IComments[]
}
export default function Comments({ data }: ArrayIComments) {
  return (
    <div className="flex w-full justify-center relative sm:bottom-14 bottom-5">
     {
      data.map((item,index)=>(
        <div key={index} className="sm:w-full sm:h-[238.79px] w-11/12 justify-center items-center sm:bg-transparent  bg-white rounded-lg flex flex-col z-10">
        <div className="p-4">
          <div>
            <h1 className="text-[12.5px] font-bold text-[#134C8394] leading-[16.66px]">
              {item.name}
            </h1>
            <h2 className="text-[4.72px] font-bold text-[#134C8394]">
              {item.date}
            </h2>
          </div>
          <div>
            <h1 className="sm:text-[18.73px] text-[10.96px] sm:leading-[29.97px] font-normal">
             {item.text}
            </h1>
          </div>
        </div>
      </div>
      ))
     }
    </div>
  );
}
