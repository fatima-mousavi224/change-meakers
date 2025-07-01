import Icon from "@/components/common/IconComponent";
import ParticipantsInfo from "./ParticipantsInfo";

export default function Participants() {
  return (
    <div className="bg-light_gray lg:p-20 md:p-16 p-10 my-8">
      <div className="flex items-center mx-auto justify-center gap-2 w-40 rounded-2xl bg-primary-50 bg-opacity-15 p-2">
        <Icon icon="dot" height={8} width={10} />
        <span className="text-xs text-primary-50 font-semibold">
          Empowered Voices
        </span>
      </div>
      <h3 className="text-2xl md:text-3xl my-2 lg:text-4xl 2xl:text-5xl text-center py-2 font-semibold">
        “Voices of Our Students and Participants”
      </h3>
      <p className="text-paragraph_color text-center text-sm md:text-base">
        For their safety in Afghanistan, we use nicknames and symbolic photos to
        protect our students from potential security threats.
      </p>
      <ParticipantsInfo />
    </div>
  );
}
