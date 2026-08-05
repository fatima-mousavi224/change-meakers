"use client";

import { useState } from "react";

import ContentDetailModal from "@/components/common/ContentDetailModal";
import SectionHeading from "@/components/common/SectionHeading";
import SiteContainer from "@/components/common/SiteContainer";
import type { InitiativeAtAGlanceCard as AtAGlanceCard } from "@/constant/initiativeDetailsContent";
import type { ContentDetailModalContent } from "@/types/contentDetailModal";
import InitiativeAtAGlanceCard from "./InitiativeAtAGlanceCard";

type InitiativeAtAGlanceProps = {
  cards: AtAGlanceCard[];
};

export default function InitiativeAtAGlance({ cards }: InitiativeAtAGlanceProps) {
  const [modalContent, setModalContent] =
    useState<ContentDetailModalContent | null>(null);

  if (!cards.length) {
    return null;
  }

  return (
    <>
      <SiteContainer as="section" className="pb-12 sm:pb-16 lg:pb-20">
        <SectionHeading title="At a Glance" />

        <div className="grid grid-cols-2 items-start gap-3 lg:grid-cols-3 lg:items-stretch lg:gap-8">
          {cards.map((card, index) => (
            <InitiativeAtAGlanceCard
              key={card.title}
              card={card}
              mobileVariant={index === 2 ? "full" : "half"}
              onOpenModal={
                card.readMoreModal
                  ? () => {
                      window.scrollTo({ top: 0, behavior: "auto" });
                      setModalContent(card.readMoreModal!);
                    }
                  : undefined
              }
            />
          ))}
        </div>
      </SiteContainer>

      <ContentDetailModal
        open={modalContent !== null}
        onClose={() => setModalContent(null)}
        content={modalContent}
      />
    </>
  );
}
