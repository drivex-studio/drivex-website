import React from 'react'; 
import { cx } from '@/libs/utils/className'; 

export function ChevronIcon({ className }) {
  return (
    <svg className={cx("size-[0.75em]", className)} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}