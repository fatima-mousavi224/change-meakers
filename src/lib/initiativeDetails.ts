import type { Initiative } from "@/constant/initiatives";
import {
  getInitiativeDetailContent,
  type InitiativeDetailContent,
  type InitiativeSocialLink,
} from "@/constant/initiativeDetailsContent";
import { getInitiativeById } from "@/constant/initiatives";

export type InitiativeDetailItem = Initiative &
  InitiativeDetailContent;

export function getInitiativeDetail(id: string): InitiativeDetailItem | null {
  const initiative = getInitiativeById(id);
  const content = getInitiativeDetailContent(id);

  if (!initiative || !content) {
    return null;
  }

  return {
    ...initiative,
    ...content,
    heroImage: content.heroImage,
    heroLogo: content.heroLogo ?? initiative.logo,
    heroImagePosition: content.heroImagePosition,
  };
}

export type { InitiativeSocialLink };
