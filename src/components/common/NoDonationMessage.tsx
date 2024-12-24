import Image from "next/image";

export default function NoDonationMessage() {
  return (
    <div className="flex items-center justify-center md:flex-row flex-col mx-auto w-full m-4">
      <div className="flex-1 items-center justify-center flex">
        <div className="flex flex-col px-4 items-center">
          <h2 className="text-2xl font-semibold text-black_color">
            Be the Light of Hope
          </h2>
          <p className="mt-2 text-gray-400 text-center">
            Your generosity can transform lives. Thousands of girls in
            Afghanistan and underprivileged families are in desperate need of
            support for education, food, and basic necessities. Every donation,
            no matter how small, brings them closer to a brighter future. Will
            you join us in making a difference?
          </p>
        </div>
      </div>
      <div className="flex-1 items-center justify-center flex">
        <Image
          src={"/images/noDonations.png"}
          alt="No Donations"
          width={500}
          height={500}
        />
      </div>
    </div>
  );
}
