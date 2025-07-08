import React from "react";

type props = {
  btnName: string;
  title: string;
};
export default function Header({ title }: props) {
  return (
    <div className="flex items-center justify-center flex-col gap-2">
      <h2 className="lg:text-4xl text-lg font-semibold text-center">{title}</h2>
    </div>
  );
}
