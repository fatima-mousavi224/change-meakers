import type { LeadershipMember } from "@/constant/aboutLeadership";

import TeamCards from "./TeamCards";

type TeamProps = {
  members: LeadershipMember[];
};

export default function Team({ members }: TeamProps) {
  return (
    <section className="pb-10">
      <h2 className="mb-10 text-center font-plusJakartaSans text-[26px] font-bold text-[#252525] sm:text-[30px] lg:text-[32px]">
        Our Executive Team
      </h2>
      <TeamCards members={members} />
    </section>
  );
}
