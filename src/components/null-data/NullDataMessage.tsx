import React from 'react';

interface NullDataMessageProps {
  children: React.ReactNode;
}

export default function NullDataMessage({ children }: NullDataMessageProps) {
  return (
    <div className="max-w-[30rem] mx-auto p-8 flex justify-center items-center rounded shadow-md text-center my-14">
      <p className="font-bold">{children}</p>
    </div>
  );
}
