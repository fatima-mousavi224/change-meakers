import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';
import { IconType } from 'react-icons';
import { FaBars } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';

type EditProfileProps = {
  icon: IconType;
  name: string;
  link: string;
};

type ArrayProps = {
  data: EditProfileProps[];
};

export default function SidebarProfileMobile({ data }: ArrayProps) {
  const [expanded, setExpanded] = useState(false);
  const pathName = usePathname();
  const windowWidth = useRef(0);
  const resizeTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleResize = () => {
      windowWidth.current = window.innerWidth;
      setExpanded(false);
    };

    handleResize();

    const handleResizeWithTimeout = () => {
      clearTimeout(resizeTimeout.current);
      resizeTimeout.current = setTimeout(handleResize, 200);
    };

    window.addEventListener('resize', handleResizeWithTimeout);

    return () => {
      clearTimeout(resizeTimeout.current);
      window.removeEventListener('resize', handleResizeWithTimeout);
    };
  }, []);

  const handleSelectItem = () => {
    setExpanded(!expanded);
  };

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="flex">
      {expanded && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10">
          <div className="fixed z-20 right-0 p-1" onClick={toggleSidebar}>
            {expanded && <FaXmark className="text-xl text-white" />}
          </div>
        </div>
      )}
      <div
        className={`flex-col ${
          expanded ? 'w-40 flex z-50' : 'w-0 hidden'
        } items-center shadow-lg bg-white transition-all duration-300 ${
          windowWidth.current < 768 ? 'fixed top-0 left-0 h-screen' : ''
        }`}
      >
        <div className="w-1/2 flex flex-col items-center gap-10 px-4">
          <div className="flex items-center justify-center relative pt-7">
            <h1
              className={`w-32 ${
                expanded ? 'text-2xl' : 'text-sm'
              } text-center font-bold`}
            >
              Setting
            </h1>
            <span
              onClick={toggleSidebar}
              className={`absolute ${
                expanded ? '-right-[1.2rem]' : '-right-1'
              } text-3xl top-2 cursor-pointer`}
            ></span>
          </div>
          {data.map((item, index) => (
            <Link href={item.link} key={index}>
              <div
                className={`flex ${
                  expanded
                    ? 'w-32 justify-start items-center gap-2'
                    : 'w-16 justify-center'
                } p-2 rounded-md ${
                  pathName === item.link
                    ? 'bg-blue-500 hover:bg-none text-white'
                    : 'hover:bg-slate-400 hover:text-white'
                }`}
                onClick={() => handleSelectItem}
              >
                <div
                  className={`${
                    !expanded && 'text-center flex justify-center items-center'
                  }`}
                >
                  <item.icon className="text-2xl" />
                </div>
                <div className={`${expanded ? 'block' : 'hidden'}`}>
                  {item.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {!expanded && (
        <div
          className="absolute top-20 left-4 z-50 text-gray-600 cursor-pointer"
          onClick={toggleSidebar}
        >
          {windowWidth.current < 768 && <FaBars className="text-xl" />}
        </div>
      )}
    </div>
  );
}
