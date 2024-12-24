import React from "react";

type props = {
  btnName: string;
  title: string;
};
export default function Header({ btnName, title }: props) {
  return (
    <div className="flex items-center justify-center flex-col gap-2">
      <div className="bg-primary-50 bg-opacity-10 rounded-full w-fit px-4 h-10 flex items-center justify-center gap-2">
        <span className="size-2 rounded-full bg-primary-50"></span>
        <p className="text-primary-50 font-semibold text-base">{btnName}</p>
      </div>
      <h2 className="lg:text-4xl text-lg font-semibold text-center">{title}</h2>
    </div>
  );
}
