import Hero from "./Hero";
import InformationAmani from "./InformationAmani";
import { SITE_CONTAINER_CLASS } from "@/constant/siteContainer";

export default function Amani() {
  return (
    <div className={`${SITE_CONTAINER_CLASS} pb-20`}>
      <Hero />
      <InformationAmani />
    </div>
  );
}
