import Hero from "./Hero";
import InformationHussaini from "./InformationHussaini";
import { SITE_CONTAINER_CLASS } from "@/constant/siteContainer";

export default function Hussaini() {
  return (
    <div className={`py-5 ${SITE_CONTAINER_CLASS}`}>
      <Hero />
      <InformationHussaini />
    </div>
  );
}
