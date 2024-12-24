'use client';
import { useEffect, useState } from 'react';
import MobileAdminSidebar from './MobileAdminSidebar';
import MainAdminSidebar from './MainAdminSidebar';



export default function AdminSidebar() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);

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
        <MobileAdminSidebar />
      ) : (
        
        <MainAdminSidebar />
      )}
    </>
  );
}
