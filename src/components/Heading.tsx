import React from 'react';
import { cn } from '../utilities/cn';

interface HeadingProps {
  center?: boolean;
  title: string;
}

export default function Heading({ center, title }: HeadingProps) {
  return (
    <h1
      className={cn('text-3xl font-bold mb-8 mt-10', { 'text-center': center })}
    >
      {title}
    </h1>
  );
}
