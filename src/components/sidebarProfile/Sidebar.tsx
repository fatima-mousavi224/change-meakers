'use client';
import React, { useEffect, useState } from 'react';
import SidebarEditProfile from './SidebarEditProfile';
import { sidebarEditProfile } from '../../lib/data';
import SidebarProfileMobile from './SidebarProfileMobile';

export default function Sidebar() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 769);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {isMobile ? (
        <SidebarProfileMobile data={sidebarEditProfile} />
      ) : (
        <SidebarEditProfile data={sidebarEditProfile} />
      )}
    </>
  );
}
