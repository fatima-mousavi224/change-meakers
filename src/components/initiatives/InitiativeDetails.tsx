import { notFound } from "next/navigation";

import InitiativeAtAGlance from "@/components/initiatives/InitiativeAtAGlance";
import InitiativeAtAGlanceDigitalLibrary from "@/components/initiatives/InitiativeAtAGlanceDigitalLibrary";
import InitiativeDetailBentoAdditional from "@/components/initiatives/InitiativeDetailBentoAdditional";
import InitiativeDetailBento from "@/components/initiatives/InitiativeDetailBento";
import InitiativeDetailBentoAyc from "@/components/initiatives/InitiativeDetailBentoAyc";
import InitiativeDetailBentoMaktab from "@/components/initiatives/InitiativeDetailBentoMaktab";
import InitiativeDetailHero from "@/components/initiatives/InitiativeDetailHero";
import InitiativeDetailHeroMaktab from "@/components/initiatives/InitiativeDetailHeroMaktab";
import InitiativeDetailIntro from "@/components/initiatives/InitiativeDetailIntro";
import InitiativeLetGirlsLearnSection from "@/components/initiatives/InitiativeLetGirlsLearnSection";
import { getInitiativeDetail } from "@/lib/initiativeDetails";

type InitiativeDetailsProps = {
  id: string;
};

export default function InitiativeDetails({ id }: InitiativeDetailsProps) {
  const initiative = getInitiativeDetail(id);

  if (!initiative) {
    notFound();
  }

  return (
    <main>
      {initiative.maktabHero ? (
        <InitiativeDetailHeroMaktab initiative={initiative} />
      ) : (
        <InitiativeDetailHero initiative={initiative} />
      )}
      <InitiativeDetailIntro paragraphs={initiative.introParagraphs} />
      {initiative.atGlanceDigitalLibrary ? (
        <InitiativeAtAGlanceDigitalLibrary
          section={initiative.atGlanceDigitalLibrary}
        />
      ) : initiative.atGlanceCards?.length ? (
        <InitiativeAtAGlance cards={initiative.atGlanceCards} />
      ) : null}
      {initiative.bentoMaktabSection ? (
        <InitiativeDetailBentoMaktab section={initiative.bentoMaktabSection} />
      ) : initiative.bentoAdditionalSection ? (
        <InitiativeDetailBentoAdditional
          section={initiative.bentoAdditionalSection}
        />
      ) : initiative.bentoSection ? (
        initiative.bentoSection.layout === "ayc" ? (
          <InitiativeDetailBentoAyc section={initiative.bentoSection} />
        ) : (
          <InitiativeDetailBento section={initiative.bentoSection} />
        )
      ) : null}
      {initiative.letGirlsLearnSection ? (
        <InitiativeLetGirlsLearnSection
          section={initiative.letGirlsLearnSection}
        />
      ) : null}
    </main>
  );
}

export function loadInitiativeDetails(id: string) {
  const initiative = getInitiativeDetail(id);

  if (!initiative) {
    notFound();
  }

  return initiative;
}
