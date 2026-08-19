"use client";
import React from "react";
import { SITE_CONTAINER_CLASS } from "@/constant/siteContainer";
import { Award, BookOpen, FileText, ShieldCheck } from "lucide-react";

export default function NewMissionDesign() {
  return (
    <section className="mt-8">
      <div className={SITE_CONTAINER_CLASS}>

        <div className="grid gap-6 mt-6 lg:grid-cols-2">
          <article className="bg-white rounded-xl shadow-lg p-6 flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-md bg-sky-50 flex items-center justify-center">
              <Award className="text-sky-600" size={28} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Our Mission</h3>
              <p className="mt-2 text-sm text-slate-700 leading-7">
                Change Makers of the World works to support Afghan girls’ education and human rights. The organization focuses on improving access to learning opportunities and strengthening youth participation in Afghanistan.
                The mission guides the design and implementation of education related activities and informs how the organization engages with public platforms and partners on issues affecting girls and youth.
              </p>
            </div>
          </article>

          <article className="bg-white rounded-xl shadow-lg p-6 flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-md bg-indigo-50 flex items-center justify-center">
              <BookOpen className="text-indigo-600" size={28} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Our Impact</h3>
              <p className="mt-2 text-sm text-slate-700 leading-7">
                Change Makers of the World’s work has resulted in concrete education related outputs and sustained engagement with youth and community actors. The organization has supported access to learning through the organization of education activities, distribution of learning materials, and coordination of locally implemented initiatives.
                The organization’s impact is reflected through completed activities, ongoing initiatives, and documented outputs presented across program pages and publications.
              </p>
            </div>
          </article>
        </div>

        <div className="grid gap-6 mt-6 md:grid-cols-2">
          <article className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-md bg-yellow-50 flex flex-shrink-0 items-center justify-center">
                <FileText className="text-yellow-600" size={28} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Context and Challenges</h4>
                <p className="mt-2 text-sm text-slate-700 leading-6">
                  Educational access for girls in Afghanistan is constrained by formal restrictions on schooling, limited availability of alternative learning spaces, and practical barriers such as cost, location, and access to materials. These conditions affect the continuity and quality of learning for many students.
                </p>
              </div>
            </div>
          </article>

          <article className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-md bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="text-emerald-600" size={28} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">Our Approach to Accountability</h4>
                <p className="mt-2 text-sm text-slate-700 leading-6">
                  Change Makers of the World ensures its internal review and documentation practices remain aligned with commitments to education activities and related initiatives. Organizational decisions are shared through official channels to support transparency and clarity.
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
