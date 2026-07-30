import MissionSlider from "@/components/mission-and-impact/OurMission/MissionSlider";
import SiteContainer from "@/components/common/SiteContainer";
import Link from "next/link";
import { MdArrowBackIos } from "react-icons/md";



export default function Details() {
    return (
        <SiteContainer className="flex flex-col my-4">
               <div className="md:h-[656px]  w-full">
            <MissionSlider />
            </div>
            <div className="pt-3 pb-6 w-[95%] mx-auto">
                <h3 className="text-lg md:text-xl xl:text-2xl py-2 font-semibold">
                    Our Mission and Impact
                </h3>
                <p className="text-sm md:text-base mb-2 text-justify text-paragraph_color sm:leading-[4rem]">
                    Our Impact: Our educational initiatives in Afghanistan have had a significant impact, benefiting around 10,000 individuals, primarily children, youths, and girls. The focus of our efforts has been on providing educational resources and support in a challenging environment. Despite facing social barriers, security threats, and restrictions from the Taliban, we achieved notable outcomes. We distributed thousands of books and educational materials, especially targeting girl students and those affected by war. Our support extended to funding small educational initiatives such as the Dynamic Girls for Change program and other similar projects. We facilitated online access to educational materials for 60,000 Afghans through an online library and established collaborations with schools to enhance learning. Our comprehensive programs, delivered both in person and online, covered school subjects and included teachings on rights, public speaking, empowerment, and self-awareness. In total, we conducted over 186 initiatives and assisted students in securing scholarships and preparing for them. The primary focus of our educational programs has been on girls and war-affected students, demonstrating our commitment to advancing education in Afghanistan despite numerous challenges.

                    Change Makers of the World is dedicated to advancing human rights in Afghanistan, with a particular focus on women's and girls' rights and quality education. The current Taliban government’s oppressive rules severely restrict women’s access to education, employment, and public spaces. In response, we have strongly supported advocacy efforts against these repressive measures. We have actively collaborated with human rights organizations in Europe and America and engaged with international bodies such as Amnesty International and the United Nations. We sent open letters to the UN and its Secretary-General, António Guterres, and participated in international conferences to promote the rights of women and address broader human rights issues.

                    Our advocacy also extends to protecting minority ethnic and religious groups in Afghanistan, such as the Hazara and Sikh communities, who face severe persecution and genocide. We have campaigned vigorously against these atrocities and the discriminatory laws targeting these communities. Additionally, we have worked to combat gender apartheid in Afghanistan by organizing and presenting numerous projects, including conferences, seminars, and educational classes, aimed at raising awareness about human rights, self-empowerment, and gender equality for Afghan girls and the broader population. Our collaboration with human rights organizations across Europe and America underscores our commitment to the freedom and rights of the Afghan people.
                </p>
            </div>
            <div className="flex items-center justify-center">
                <button className="rounded-3xl border border-primary-50 hover:bg-primary-50 text-primary-50 hover:text-white">
                    <Link href="/mission&impact" className="px-3 py-2  flex items-center">
                        <MdArrowBackIos size={18} className="" />
                        <span className="px-10 text-sm md:text-base">
                            Back
                        </span>
                    </Link>
                </button>
            </div>
        </SiteContainer>
    )
}