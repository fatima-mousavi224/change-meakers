import React from "react";
import { SITE_CONTAINER_CLASS } from "@/constant/siteContainer";

export default function RecognitionExperience() {
  return (
    <section className={`w-full ${SITE_CONTAINER_CLASS} py-12`}>
      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-xl bg-white shadow-lg overflow-hidden">
          <div className="px-8 py-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Recognition and Engagement
            </h3>
            <p className="text-sm text-slate-700 leading-7">
              Change Makers of the World has received international recognition
              for its work, including the Diana Award. Its activities have been
              referenced through public platforms and media related to
              education, youth, and human rights.
            </p>
          </div>
        </article>

        <article className="rounded-xl bg-white shadow-lg overflow-hidden">
          <div className="px-8 py-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Our Experience</h3>
            <p className="text-sm text-slate-700 leading-7">
              Since its establishment, Change Makers of the World has
              implemented education-related activities and supported access to
              learning materials. Its work has involved coordination with
              community-based groups and youth initiatives in the context of
              education and social participation.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
