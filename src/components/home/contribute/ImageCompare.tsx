import { cn } from "@/utilities/cn";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

const imgSrc = {
  1: "/images/home-page/about-slide-one.jpg",
  2: "/images/home-page/about-slide-two.png",
};

interface ImageCompareProps {
  className?: string;
}

export default function ImageCompare({ className }: ImageCompareProps) {
  return (
    <div className={cn("shadow-md shadow-gray-900/5", className)}>
      <ReactCompareSlider
        className="lg:h-[544px] rounded-lg"
        itemOne={<ReactCompareSliderImage src={imgSrc[1]} alt="Image one" />}
        itemTwo={<ReactCompareSliderImage src={imgSrc[2]} />}
      />
    </div>
  );
}
