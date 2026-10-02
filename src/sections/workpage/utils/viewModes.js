import { cva } from '@/libs/utils/className';
import React from 'react'; 

export const filterButtonStyles = cva({
  base: ["group inline-flex min-w-0 shrink-0 cursor-pointer items-center justify-center whitespace-nowrap", "text-accent-sm", "outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"],
  variants: {
    size: {
      sm: "text-body-sm",
      default: "text-body-sm lg:text-body",
      lg: "text-body lg:text-body-lg"
    }
  },
  defaultVariants: {
    size: "default"
  }
});

export const filterIconStyles = cva({
  base: ["flex items-center justify-center", "transition-transform duration-700 [transition-timing-function:var(--ease-power4-in-out)]"],
  variants: {
    size: {
      sm: "size-32 lg:size-40",
      default: "size-40 lg:size-48",
      lg: "size-48 lg:size-56"
    },
    position: {
      left: "origin-left -rotate-45 scale-0",
      right: "absolute right-0 z-10 origin-right rotate-0 scale-100"
    },
    theme: {
      light: "bg-foreground text-background",
      dark: "bg-foreground text-background",
      brand: "bg-brand text-black"
    }
  },
  defaultVariants: {
    size: "default",
    theme: "light"
  }
});

export const filterTextStyles = cva({
  base: ["flex w-full flex-1 items-center justify-center gap-8", "transition-transform duration-700 [transition-timing-function:var(--ease-power4-in-out)]"],
  variants: {
    size: {
      sm: "h-32 -translate-x-[calc(32px+6px)] px-8 lg:h-40 lg:-translate-x-[calc(40px+6px)] lg:px-12",
      default: "h-40 -translate-x-[calc(40px+6px)] px-12 lg:h-48 lg:-translate-x-[calc(48px+6px)] lg:px-16",
      lg: "h-48 -translate-x-[calc(48px+6px)] px-16 lg:h-56 lg:-translate-x-[calc(56px+6px)] lg:px-24"
    },
    theme: {
      light: "bg-foreground text-background",
      dark: "bg-foreground text-background",
      brand: "bg-brand text-black"
    }
  },
  defaultVariants: {
    size: "default",
    theme: "light"
  }
});

export const VIEW_MODES = [
  {
    mode: "slider",
    label: "Slider view",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1" y="4" width="6" height="8" stroke="currentColor" strokeWidth="1.5" />
        <rect x="9" y="4" width="6" height="8" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    mode: "duo",
    label: "Two column view",
    visibility: "hidden md:flex",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="6" height="14" stroke="currentColor" strokeWidth="1.5" />
        <rect x="9" y="1" width="6" height="14" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    mode: "grid",
    label: "Grid view",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
        <rect x="6" y="1" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="1" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1" y="6" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
        <rect x="6" y="6" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="6" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1" y="11" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
        <rect x="6" y="11" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="11" width="4" height="4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  },
  {
    mode: "list",
    label: "List view",
    visibility: "flex md:hidden",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <line x1="1" y1="4" x2="15" y2="4" stroke="currentColor" strokeWidth="1.5" />
        <line x1="1" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.5" />
        <line x1="1" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  }
];