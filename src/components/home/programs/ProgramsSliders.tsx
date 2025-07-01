// components/CustomSlider.tsx
import { PhotoAlbum } from "@prisma/client";
import Image, { StaticImageData } from "next/image";
import { FC, useState } from "react";

interface CustomSliderProps {
  data: PhotoAlbum[];
}

const ProgramsSliders: FC<CustomSliderProps> = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Move to the previous image
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? data.length - 1 : prevIndex - 1
    );
  };

  // Move to the next image
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === data.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Get the indices of the three images to display
  const getDisplayedIndices = () => {
    const leftIndex = (currentIndex - 1 + data.length) % data.length;
    const centerIndex = currentIndex;
    const rightIndex = (currentIndex + 1) % data.length;

    return [leftIndex, centerIndex, rightIndex];
  };

  const displayedIndices = getDisplayedIndices();

  return (
    <div className="relative max-w-screen-xl mx-auto overflow-hidden">
      {/* Slider container */}
      <div className="">
        {/* Previous button */}
        <div className="absolute sm:left-7 sm:bottom-1 left-5 bottom-0 size-11">
          <button
            onClick={handlePrev}
            className=" text-primary-50 sm:w-[41px] sm:h-[39px] w-[35px] h-[30px] bg-white/100 rounded-xl shadow-[0px_0px_5px_5px_#2222220D] text-lg"
          >
            ❮
          </button>
        </div>

        {/* Images */}
        <div className="flex items-center justify-center w-full">
          <div className="flex justify-center items-center transition-all duration-500 w-full">
            {displayedIndices.map((index, position) => {
              const image = data[index];
              const isCenter = position === 1; // Center item in the displayed trio

              return (
                <div
                  className="flex items-center justify-center flex-col sm:px-0 px-1"
                  key={index}
                >
                  <div
                    key={index}
                    className={`relative  ${
                      isCenter
                        ? " lg:w-[500px] lg:h-[360px] xl:w-[762px] xl:h-[444px] w-[80%] opacity-100 z-10 scale-100 lg:top-5 top-10"
                        : "lg:block hidden lg:w-[200px] lg:h-[280px] xl:w-[420px] xl:h-[424px] opacity-50 scale-75"
                    } ${
                      position === 0
                        ? "translate-x-20 sm:translate-x-10 md:translate-x-20"
                        : ""
                    } ${
                      position === 2
                        ? "-translate-x-20 sm:-translate-x-10 md:-translate-x-20"
                        : ""
                    }`}
                  >
                    <Image
                      src={image.image ?? ""}
                      alt={image.title ?? ""}
                      width={1200}
                      height={1200}
                      className="w-full h-full object-cover rounded-lg shadow-lg"
                    />
                  </div>
                  {isCenter && (
                    <div className="lg:mt-6 mt-10 sm:text-start text-center flex flex-col gap-2 lg:w-full w-[75%]">
                      <p className="text-sm lg:text-lg font-semibold text-primary-50 flex items-center sm:justify-start justify-center gap-3">
                        <div className="w-5 h-0.5 bg-primary-50 sm:block hidden"></div>
                        {image.title}
                      </p>
                      <p className="text-[10px] sm:text-sm text-primary-100 ">
                        {image.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Next button */}
        <div className="absolute sm:right-6 sm:bottom-1 right-2 bottom-0 size-11">
          <button
            onClick={handleNext}
            className=" text-primary-50 sm:w-[41px] sm:h-[39px] w-[35px] h-[30px] bg-white/100 rounded-xl shadow-[0px_0px_5px_5px_#2222220D] text-lg"
          >
            ❯
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgramsSliders;
