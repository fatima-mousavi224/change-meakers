"use client";

import { useState } from "react";

import ContentDetailModal from "@/components/common/ContentDetailModal";
import SectionHeading from "@/components/common/SectionHeading";
import SiteContainer from "@/components/common/SiteContainer";
import type { InitiativeAtAGlanceCard as AtAGlanceCard } from "@/constant/initiativeDetailsContent";
import type { ContentDetailModalContent } from "@/types/contentDetailModal";
import { cn } from "@/utilities/cn";
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

  const hasWideMiddleCard = cards[1]?.variant === "report";

  return (
    <>
      <SiteContainer as="section" className="pb-4 md:py-3">
        <SectionHeading title="At a Glance" />

        <div
          className={cn(
            "grid grid-cols-2 items-start gap-3 lg:items-start",
            hasWideMiddleCard
              ? "lg:grid-cols-12 lg:gap-6"
              : "lg:grid-cols-3 lg:gap-8",
          )}
        >
          {cards.map((card, index) => (
            <InitiativeAtAGlanceCard
              key={card.title}
              card={card}
              mobileVariant={index === 2 ? "full" : "half"}
              className={cn(
                hasWideMiddleCard && index === 0 && "lg:col-span-4",
                hasWideMiddleCard && index === 1 && "lg:col-span-5",
                hasWideMiddleCard && index === 2 && "lg:col-span-3",
              )}
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
