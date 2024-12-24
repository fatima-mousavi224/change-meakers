import Slider from "./Slider";
import WhatDoWeDo from "./WhatDoWeDo";
import image2 from "public/images/home-page/who-we-are-sectoin/computer/c2.jpg";
import image8 from "public/images/home-page/who-we-are-sectoin/computer/c8.jpg";
import image9 from "public/images/home-page/who-we-are-sectoin/computer/c9.jpg";

import image2Mobile from "public/images/home-page/who-we-are-sectoin/mobile/m2.jpg";
import image8Mobile from "public/images/home-page/who-we-are-sectoin/mobile/m8.jpg";
import image9Mobile from "public/images/home-page/who-we-are-sectoin/mobile/m9.jpg";

const images = [image2, image8, image9];
const mobileImages = [image2Mobile, image8Mobile, image9Mobile];

export default function WhoWeAre() {
  return (
    <section className="py-10">
      <div className="flex flex-col-reverse lg:flex-row gap-4 justify-between h-fit">
        <WhatDoWeDo />
        <Slider images={images} mobileImages={mobileImages} />
      </div>
    </section>
  );
}
