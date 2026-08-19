import Hero from "./Hero";
import InformationRahmati from "./InformationRahmati";
import { SITE_CONTAINER_CLASS } from "@/constant/siteContainer";

export default function Rahmati() {
  return (
    <div className={`py-5 ${SITE_CONTAINER_CLASS}`}>
      <Hero />
      <InformationRahmati />
    </div>
  );
}
