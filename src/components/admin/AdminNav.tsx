'use client';
import { Avatar } from '@mui/material';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Backdrop from './Backdrop';

interface AdminNavProps {
  email?: string | null;
}

export default function AdminNav({ email }: AdminNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleIsOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <nav className="border-b">
      <div className="flex justify-between items-center p-2  w-full  md:px-10 max-w-[75rem] mx-auto">
        <Link href="/" className="my-2 h-14 w-14">
          <Image
            src="/images/logo.png"
            height={60}
            width={60}
            alt="Change Makers Logo"
          />
        </Link>

        <div className="relative">
          <Avatar className="text-4xl cursor-pointer" onClick={handleIsOpen} />

          {isOpen && (
            <>
              <div className=" bg-slate-100 p-2 absolute right-0 top-12 z-30 text-center rounded">
                <div className="text-slate-600 text-sm ">{email}</div>
                <div
                  onClick={() => signOut()}
                  className="cursor-pointer mt-2 hover:bg-slate-200 transition rounded"
                >
                  sign out
                </div>
              </div>
              <Backdrop onClick={handleIsOpen} />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
