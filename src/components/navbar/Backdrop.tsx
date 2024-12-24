import React from 'react';

interface BackdropProps {
  onClick: () => void;
}

export default function Backdrop({ onClick }: BackdropProps) {
  return (
    <div
      className="fixed top-0 left-0 z-20 duration-200 h-screen w-screen bg-gray-900/80 opacity-50 transition"
      onClick={onClick}
    />
  );
}
