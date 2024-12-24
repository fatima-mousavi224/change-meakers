import Image from "next/image";

export default function HomePage() {
  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold text-primary-50">Hi there 👋 !</h1>
        <h1 className="text-3xl font-bold text-primary-50">
          Welcome to your dashboard.
        </h1>
      </div>
      <div className="flex  items-center xl:flex-row flex-col-reverse justify-center gap-4 mt-10">
        <div className="bg-white xl:w-1/2 px-4 py-10 rounded-lg">
          <div className="flex gap-4">
            <div className="flex items-center justify-center bg-slate-400 size-11 rounded-full">
              <Image
                src="/images/logo.jpg"
                alt="user image"
                width={800}
                height={800}
                className="size-10 rounded-full"
              />
            </div>
            <h1 className="font-bold text-2xl">Here, you can:</h1>
          </div>
          <div>
            <ul className="mt-5 pl-16">
              <li className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="size-2 bg-black rounded-full"></div>
                  <h1 className="text-black font-bold">Support Insights</h1>
                </div>
                <p className="text-[#A3AED0] sm:w-[80%] justify-center">
                  Easily track your contributions, including dates, amounts, and
                  current statuses. Stay organized and prepared for your next
                  support efforts—all in one place.
                </p>
              </li>
              <li className="flex flex-col gap-2 sm:py-10 py-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="size-2 bg-black rounded-full"></div>
                  <h1 className="text-black font-bold">Contact Us Easily</h1>
                </div>
                <p className="text-[#A3AED0] sm:w-[80%] justify-center">
                  Reach out to us through our contact form and receive quick,
                  helpful responses. We’re here to support you as you support
                  others!
                </p>
              </li>
              <li className="flex flex-col gap-2 mb-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="size-2 bg-black rounded-full"></div>
                  <h1 className="text-black font-bold">Manage Your Account</h1>
                </div>
                <p className="text-[#A3AED0] sm:w-[80%] justify-center">
                  Update your email, change your password, or delete your
                  account—all with ease. Stay in control of your profile and
                  preferences.
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div className="xl:w-1/2 flex items-center justify-center">
          <Image
            src="/images/home_dashboard.png"
            alt="user image"
            width={1200}
            height={1200}
            className="w-full rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
