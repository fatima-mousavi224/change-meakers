import Link from 'next/link';
import React from 'react';
import { cn } from '@/utilities/cn';

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  type?: 'submit' | 'reset' | 'button';
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({
  children,
  className,
  href,
  type,
  disabled,
  onClick
}: ButtonProps){
  if (!href)
    return (
      <button
        type={type}
        className={cn(
          'bg-slate-800 px-2 py-3 text-white transition hover:text-slate-800 hover:bg-slate-400 rounded',
          className
        )}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    );

  return (
    <Link
      href={href}
      className={cn(
        'bg-white to-black py-[18px] px-[60px] rounded-[8px]',
        className
      )}
    >
      {children}
    </Link>
  );
}
