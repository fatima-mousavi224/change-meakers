import { redirect } from "next/navigation";

import {
  getProgramCategoryHref,
  isProgramCategoryId,
} from "@/constant/programTabs";

type ProgramCategoryPageProps = {
  params: {
    category: string;
  };
};

export default function ProgramCategoryPage({ params }: ProgramCategoryPageProps) {
  if (!isProgramCategoryId(params.category)) {
    redirect("/current-programs");
  }

  redirect(getProgramCategoryHref(params.category));
}
