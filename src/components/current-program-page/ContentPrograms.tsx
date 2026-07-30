import React from 'react';
import { SITE_CONTAINER_CLASS } from '@/constant/siteContainer';

export default function MissionOverview() {
    return (
        <div className="bg-gray-50 py-20 sm:py-28">
            <div className={SITE_CONTAINER_CLASS}>

                <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">

                    {/* CARD 1: Education Programs Overview (Image 1 top) */}
                    <div className="relative lg:col-span-3">
                        <div className="absolute inset-0 rounded-lg bg-white max-lg:rounded-t-4xl lg:rounded-tl-4xl" />
                        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl transition-transform duration-200">
                            <div className="bg-primary-50 h-48 flex items-center justify-center">
                                <span className="text-white text-5xl font-bold opacity-20">01</span>
                            </div>
                            <div className="p-10 pt-4">
                                <h3 className="text-sm/4 font-semibold text-primary-50">Core Mission</h3>
                                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950">Education Programs</p>
                                <p className="mt-2 max-w-lg text-sm/6 text-gray-600">
                                    Education programs form the core of our activities. We support access to learning for Afghan girls and youth through structured, capacity-based approaches tailored to local conditions.
                                </p>
                               
                            </div>
                        </div>
                        <div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-t-4xl lg:rounded-tl-4xl" />
                    </div>

                    {/* CARD 2: Advocacy Initiatives (Image 2) */}
                    <div className="relative lg:col-span-3">
                        <div className="absolute inset-0 rounded-lg bg-white lg:rounded-tr-4xl" />
                        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl transition-transform duration-200 lg:rounded-tr-2xl">
                            <div className="bg-primary-100 h-48 flex items-center justify-center">
                                <span className="text-white text-5xl font-bold opacity-20">02</span>
                            </div>
                            <div className="p-10 pt-4">
                                <h3 className="text-sm/4 font-semibold text-primary-50">Rights & Awareness</h3>
                                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950">Advocacy Initiatives</p>
                                <div className="mt-2 space-y-2 text-sm/6 text-gray-600">
                                    <p><strong>Education & Rights:</strong> Engaging in structured dialogue and coordination with partners regarding human rights.</p>
                                    <p><strong>Storytelling:</strong> Documentation that reflects experiences through written profiles and interviews with safety and consent.</p>
                                </div>
                               
                            </div>
                        </div>
                        <div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-black/5 lg:rounded-tr-4xl" />
                    </div>

                    {/* CARD 3: Learning Spaces (Image 1 middle) */}
                    <div className="relative lg:col-span-2">
                        <div className="absolute inset-0 rounded-lg bg-white lg:rounded-bl-4xl" />
                        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl lg:rounded-bl-2xl hover:shadow  transition">
                            <div className="p-10">
                                <h3 className="text-sm/4 font-semibold text-primary-50">Environments</h3>
                                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950">Learning Spaces</p>
                                <ul className="mt-4 space-y-3 text-sm/6 text-gray-600 list-disc pl-4">
                                    <li><strong>In-Person:</strong> Community-based spaces for basic education continuity.</li>
                                    <li><strong>Online:</strong> Virtual instruction in school subjects and preparatory courses.</li>
                                </ul>
                               
                            </div>
                        </div>
                        <div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-black/5 lg:rounded-bl-4xl" />
                    </div>

                    {/* CARD 4: Educational Resources (Image 1 bottom) */}
                    <div className="relative lg:col-span-2">
                        <div className="absolute inset-0 rounded-lg bg-white" />
                        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl hover:shadow-sm transition">
                            <div className="p-10">
                                <h3 className="text-sm/4 font-semibold text-primary-50">Support</h3>
                                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950">Resource Sharing</p>
                                <p className="mt-2 text-sm/6 text-gray-600">
                                    We provide recorded lessons, supplementary learning materials, and curated scholarship opportunities to support self-paced learning and student wellbeing.
                                </p>
                               
                            </div>
                        </div>
                        <div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-black/5" />
                    </div>

                    {/* CARD 5: Scope and Limitations (Image 3) */}
                    <div className="relative lg:col-span-2">
                        <div className="absolute inset-0 rounded-lg bg-white max-lg:rounded-b-4xl lg:rounded-br-4xl" />
                        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl max-lg:rounded-b-2xl lg:rounded-br-2xl hover:shadow-sm transition">
                            <div className="p-10">
                                <h3 className="text-sm/4 font-semibold text-primary-50">Transparency</h3>
                                <p className="mt-2 text-lg font-medium tracking-tight text-gray-950">Scope & Limitations</p>
                                <p className="mt-2 text-sm/6 text-gray-600 italic">
                                    Change Makers of the World operates within defined resource limits and is not a humanitarian aid agency or political organization.
                                </p>
                               
                            </div>
                        </div>
                        <div className="pointer-events-none absolute inset-0 rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-b-4xl lg:rounded-br-4xl" />
                    </div>

                </div>
            </div>
        </div>
    );
}