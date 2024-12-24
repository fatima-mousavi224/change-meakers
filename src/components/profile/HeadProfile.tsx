import Image from 'next/image';
import Link from 'next/link';
import { HiMiniPencil } from 'react-icons/hi2';

interface HeadProfileProps {
  userProfile: any;
}

export default function HeadProfile({ userProfile }: HeadProfileProps) {
  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex flex-col justify-end items-center w-full">
        <div className="relative">
          <Image
            alt="cover profile"
            src={
              userProfile?.coverPhoto[0]?.image ||
              '/images/profile/cover-Image.png'
            }
            className="md:px-5 xl:px-0 h-[40vh] bg-cover"
            width={1200}
            height={600}
            objectFit="cover"
          />
        </div>

        <div className="absolute flex items-end justify-between xl:w-1/2 md:w-2/3 w-full sm:px-8 px-10 ">
          <div className="flex gap-2 items-center relative sm:top-8 top-5">
            <Image
              alt="user image"
              src={
                userProfile?.profilePhoto[0].image ||
                '/images/profile/user-Image.jpg'
              }
              className="rounded-full border border-black sm:w-[121px] sm:h-[121px] w-[80.63px] h-[80.63px]"
              width={80.63}
              height={80.63}
            />

            <div>
              <h1 className="text-white sm:text-4xl text-lg">
                {userProfile.user.firstName
                  ? userProfile.user.firstName + '' + userProfile.user.lastName
                  : 'John Doe'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end lg:w-[70%] w-full gap-4 py-5 px-4">
        <div className="text-center">
          <a
            href={`mailto:${userProfile ? userProfile?.user?.email : 'example@example.com'}`}
            className="bg-[#134C83] text-white w-[127.31px] h-[36-49px] p-2 rounded-[5.94px] font-bold text-[13.78px] inline-block"
          >
            Send E-Mail
          </a>
        </div>
        <div>
          <Link href={'/profile/edite-profile'}>
            <button
              type="button"
              className="bg-[#FFFFFF] w-[85.72px] h-[36-49px] border border-[#000000A6] text-[#000000A6] font-bold text-[12.06px] flex justify-center items-center gap-2 p-2 rounded-[5.94px]"
            >
              <HiMiniPencil className=" text-lg " />
              Edit
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
