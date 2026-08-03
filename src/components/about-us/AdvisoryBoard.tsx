import AdvisoryBoardCards from "./AdvisoryBoardCards";

export default function AdvisoryBoard() {
  return (
    <section className="pb-12">
      <h2 className="mb-10 text-center font-plusJakartaSans text-[26px] font-bold text-[#252525] sm:text-[30px] lg:text-[32px]">
        Our Advisory Board
      </h2>
      <AdvisoryBoardCards />
    </section>
  );
}
