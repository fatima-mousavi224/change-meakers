import { notFound } from "next/navigation";

import InitiativeAtAGlance from "@/components/initiatives/InitiativeAtAGlance";
import InitiativeDetailHero from "@/components/initiatives/InitiativeDetailHero";
import InitiativeDetailIntro from "@/components/initiatives/InitiativeDetailIntro";
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
      <InitiativeDetailHero initiative={initiative} />
      <InitiativeDetailIntro paragraphs={initiative.introParagraphs} />
      {initiative.atGlanceCards?.length ? (
        <InitiativeAtAGlance cards={initiative.atGlanceCards} />
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
