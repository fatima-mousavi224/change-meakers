import Icon from "@/components/common/IconComponent";

export default function OurVision() {
    const visionAndChallanges = [
        {
            id: 1,
            icon: "lamp",
            title: "OUR VISION",
            descript: "We envision a world where every child and young person affected by crises can access education freely, safely, and without fear, enabling them to grow and reach their full potential."
        },
        {
            id: 2,
            icon: "cup",
            title: "CHALLANGES",
            descript: "UNESCO reports that global out-of-school children have increased by 6 million since 2021, reaching a total of 250 million. In Afghanistan alone, over 7.8 million children are out of school, with 80% of Afghan school-age girls—about 2.5 million—denied their right to education."
        }
    ];

    return (
        <section className="w-full my-32">
            <div className="md:px-36 xl:text-4xl flex-col w-auto flex items-center justify-center">
                <h3 className="text-2xl md:text-3xl my-2 lg:text-4xl 2xl:text-5xl text-center py-2 font-semibold">
                    “Facing Challenges, Building a Better Future”
                </h3>
                <p className="text-gray-400 text-center text-sm md:text-base">
                    Millions of children, especially girls, are denied education, but we are determined to overcome these challenges and bring hope. See our vision and challenges in more detail below.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 mt-14 gap-x-3 gap-y-4">
                {
                    visionAndChallanges.map((item) => (
                        <div key={item.id} className="border flex flex-col border-dark_gray rounded-xl p-3">
                            <div className="w-14 h-14 bg-light_gray rounded-full flex items-center justify-center">
                                <Icon icon={item.icon as 'lamp' | 'cup'} width={35} height={35} />
                            </div>
                            <h4 className="text-base font-semibold my-3">{item.title}</h4>
                            <p className="text-sm text-paragraph_color">{item.descript}</p>
                        </div>
                    ))
                }
            </div>
        </section>
    );
}
