import InitiativeDetails from "@/components/initiatives/InitiativeDetails";
import { getInitiativeDetail } from "@/lib/initiativeDetails";
import type { Metadata } from "next";

export function createInitiativePage(initiativeId: string) {
  async function generateMetadata(): Promise<Metadata> {
    const initiative = getInitiativeDetail(initiativeId);

    if (!initiative) {
      return { title: "Not Found" };
    }

    return {
      title: initiative.title,
      description: initiative.description,
    };
  }

  function InitiativePage() {
    return <InitiativeDetails id={initiativeId} />;
  }

  return {
    generateMetadata,
    Page: InitiativePage,
  };
}
