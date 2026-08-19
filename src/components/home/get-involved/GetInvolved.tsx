import SectionHeading from "@/components/common/SectionHeading";
import { GET_INVOLVED_ITEMS } from "@/constant/getInvolved";
import GetInvolvedCard from "./GetInvolvedCard";

export default function GetInvolved() {
  return (
    <section className="py-8 lg:py-12">
      <SectionHeading title="Get Involved" />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {GET_INVOLVED_ITEMS.map((item) => (
          <GetInvolvedCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
