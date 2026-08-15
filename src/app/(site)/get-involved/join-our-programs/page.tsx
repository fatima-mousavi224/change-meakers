import GetInvolvedFormPage from "@/components/get-involved/GetInvolvedFormPage";
import { getGetInvolvedFormConfig } from "@/constant/getInvolvedForms";
import type { Metadata } from "next";

const config = getGetInvolvedFormConfig("join-programs");

export const metadata: Metadata = {
  title: config.title,
  description: config.description,
};

export default function JoinOurProgramsPage() {
  return <GetInvolvedFormPage config={config} />;
}
