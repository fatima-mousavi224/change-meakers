import { GET_INVOLVED_ITEMS } from "@/constant/getInvolved";
import GetInvolvedCard from "./GetInvolvedCard";

export default function GetInvolved() {
  return (
    <section className="py-8 lg:py-12 lg:px-[16px] px-4">
      <div className="mb-8 flex items-center gap-6 lg:mb-10">
        <h2 className="shrink-0 font-plusJakartaSans text-[22px] font-bold text-[#000000] sm:text-[34px] lg:text-[36px]">
          Get Involved
        </h2>
        <div className="flex min-w-0 flex-1 items-center mt-2">
          <div className="h-px flex-1 bg-[#9E9E9E]" />

          <span className="mx-5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#9E9E9E] bg-white">
            <span className="h-3 w-3 rounded-full bg-[#9E9E9E]" />
          </span>

          <div className="h-px md:w-24 w-6 bg-[#9E9E9E]" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {GET_INVOLVED_ITEMS.map((item) => (
          <GetInvolvedCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
