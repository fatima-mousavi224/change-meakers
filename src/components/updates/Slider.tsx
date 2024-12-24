import Image from "next/image";
import React, { useEffect, useState } from "react";
import { cn } from "../../utilities/cn";

interface SliderProps {
  images: string[];
}

export default function Slider({ images }: SliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval); // Clean up the interval when the component unmounts
  }, [images.length]);
  const handleActiveIndex = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4">
      <div className="relative w-full h-fit overflow-hidden">
        <Image
          src={images[activeIndex]}
          alt="school girls"
          width={1200}
          height={1200}
          className="rounded-lg w-full mx-auto object-cover h-[400px]"
        />
      </div>
      <div className="space-x-[3px] -translate-y-12 flex items-center">
        {images.map((_, index) => (
          <span
            className={cn(
              "size-2 inline-block bg-[#D9D9D9] rounded-full  duration-200 transition-colors cursor-pointer",
              { "bg-primary-50 size-3": index === activeIndex }
            )}
            key={index}
            onClick={() => handleActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
