"use client";

import { useState } from "react";

import ContentDetailModal from "@/components/common/ContentDetailModal";
import ScrollReveal from "@/components/common/ScrollReveal";
import SectionHeading from "@/components/common/SectionHeading";
import SiteContainer from "@/components/common/SiteContainer";
import StaggerReveal, { StaggerItem } from "@/components/common/StaggerReveal";
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
      <SiteContainer as="section" className="pb-3">
        <ScrollReveal>
          <SectionHeading title="At a Glance" />
        </ScrollReveal>

        <StaggerReveal
          className={cn(
            "grid grid-cols-2 items-stretch gap-3 lg:grid-cols-3 lg:gap-3",
            hasWideMiddleCard && "lg:grid-cols-12",
          )}
        >
          {cards.map((card, index) => (
            <StaggerItem
              key={card.title}
              className={cn(
                "h-full",
                index === 2 && "col-span-2 lg:col-span-1",
                hasWideMiddleCard && index === 0 && "lg:col-span-4",
                hasWideMiddleCard && index === 1 && "lg:col-span-5",
                hasWideMiddleCard && index === 2 && "lg:col-span-3",
              )}
            >
              <InitiativeAtAGlanceCard
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
            </StaggerItem>
          ))}
        </StaggerReveal>
      </SiteContainer>

      <ContentDetailModal
        open={modalContent !== null}
        onClose={() => setModalContent(null)}
        content={modalContent}
      />
    </>
  );
}
