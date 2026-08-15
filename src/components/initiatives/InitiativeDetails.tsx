import { notFound } from "next/navigation";

import InitiativeAtAGlanceNycp from "@/components/initiatives/InitiativeAtAGlanceNycp";
import InitiativeAtAGlance from "@/components/initiatives/InitiativeAtAGlance";
import InitiativeAtAGlanceDigitalLibrary from "@/components/initiatives/InitiativeAtAGlanceDigitalLibrary";
import InitiativeDetailBentoAdditional from "@/components/initiatives/InitiativeDetailBentoAdditional";
import InitiativeDetailBento from "@/components/initiatives/InitiativeDetailBento";
import InitiativeDetailBentoAyc from "@/components/initiatives/InitiativeDetailBentoAyc";
import InitiativeDetailBentoMaktab from "@/components/initiatives/InitiativeDetailBentoMaktab";
import InitiativeDetailBentoNycp from "@/components/initiatives/InitiativeDetailBentoNycp";
import InitiativeDetailHero from "@/components/initiatives/InitiativeDetailHero";
import InitiativeDetailHeroMaktab from "@/components/initiatives/InitiativeDetailHeroMaktab";
import InitiativeDetailIntro from "@/components/initiatives/InitiativeDetailIntro";
import InitiativeLetGirlsLearnSection from "@/components/initiatives/InitiativeLetGirlsLearnSection";
import ScrollReveal from "@/components/common/ScrollReveal";
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
      <ScrollReveal>
        <InitiativeDetailIntro
          paragraphs={initiative.introParagraphs}
          cta={initiative.introCta}
        />
      </ScrollReveal>
      {initiative.atGlanceNycp ? (
        <InitiativeAtAGlanceNycp section={initiative.atGlanceNycp} />
      ) : initiative.atGlanceDigitalLibrary ? (
        <InitiativeAtAGlanceDigitalLibrary
          section={initiative.atGlanceDigitalLibrary}
        />
      ) : initiative.atGlanceCards?.length ? (
        <InitiativeAtAGlance cards={initiative.atGlanceCards} />
      ) : null}
      {initiative.bentoNycpSection ? (
        <InitiativeDetailBentoNycp section={initiative.bentoNycpSection} />
      ) : initiative.bentoMaktabSection ? (
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
        <ScrollReveal delay={0.05}>
          <InitiativeLetGirlsLearnSection
            section={initiative.letGirlsLearnSection}
          />
        </ScrollReveal>
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
