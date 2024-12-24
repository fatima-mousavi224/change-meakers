import Image from "next/image";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center px-4">
      <div className=" text-primary-50 sm:p-8 max-w-md text-center">
        <div className="sm:mb-6">
          <Image
            src="/images/thanks.jpg"
            alt="Thank You"
            width={800}
            height={800}
            className="w-full mx-auto"
          />
        </div>
        <h1 className="text-3xl font-bold mb-4">
          Thank You for Your Donation!
        </h1>
        <p className="text-lg mb-6">
          Your generosity is greatly appreciated. Together, we are making a
          difference in the lives of many. 💖
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/" // Replace with your home or relevant page link
            className="px-6 py-3 rounded-full bg-primary-50 text-white hover:bg-primary-100 transition duration-300"
          >
            Back To Home
          </Link>
        </div>
      </div>
      <footer className="mt-6 text-sm opacity-75">
        © {new Date().getFullYear()} Your Organization. All Rights Reserved.
      </footer>
    </div>
  );
}
