import { redirect } from "next/navigation";

import {
  getProgramCategoryHref,
  isProgramCategoryId,
  PROGRAMS_BASE_PATH,
} from "@/constant/programTabs";

type ProgramCategoryPageProps = {
  params: {
    category: string;
  };
};

export default function ProgramCategoryPage({ params }: ProgramCategoryPageProps) {
  if (!isProgramCategoryId(params.category)) {
    redirect(PROGRAMS_BASE_PATH);
  }

  redirect(getProgramCategoryHref(params.category));
}
