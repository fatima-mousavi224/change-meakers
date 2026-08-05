import { Metadata } from "next";

import UpdateListing from "@/components/updates/UpdateListing";
import UpdatesPageHero from "@/components/updates/UpdatesPageHero";

export const metadata: Metadata = {
  title: "Updates",
  description:
    "Explore the latest news, stories, and program updates from Change Makers of the World.",
};

export default function UpdatePage() {
  return (
    <main>
      <UpdatesPageHero />
      <UpdateListing />
    </main>
  );
}
