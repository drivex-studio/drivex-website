import React from 'react';
import { motion } from 'framer-motion'; 
import { cx } from '@/libs/utils/className'; 
import { SanityImage } from '@/components/sanity/SanityImage'; 
import { easings } from '@/libs/constants/easings'; 

const backInOutSubtle = easings?.backInOutSubtle || [0.68, -0.6, 0.32, 1.6]; // Fallback if internal import differs

export function ThumbnailIndicator({ items, currentIndex, onSelect, rotationCount = 0, gap = 16, className }) {
  const count = items.length;
  if (count === 0) return null;

  const totalWidth = 80 * count + (count - 1) * gap;
  const itemSpace = 80 + gap;
  const indicatorX = currentIndex * itemSpace;
  const indicatorCenterX = currentIndex * itemSpace + 40;
  
  return (
    <div className={cx("relative flex flex-col items-center", className)}>
      <div className="relative overflow-hidden">
        <motion.div
          className="pointer-events-none absolute top-0 z-10 h-full border border-foreground/30"
          style={{ width: 80 }}
          animate={{ x: indicatorX }}
          transition={{ duration: 0.8, ease: backInOutSubtle }}
        />
        <div className="flex items-center" style={{ gap }}>
          {items.map((item, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={item._id}
                type="button"
                onClick={() => onSelect(idx)}
                className="group"
                aria-label={`Go to ${item.title ?? `slide ${idx + 1}`}`}
                aria-current={isActive ? "true" : undefined}
              >
                <div className={cx("relative aspect-[16/9] w-80 overflow-hidden transition-opacity duration-300", isActive ? "opacity-100" : "opacity-40 group-hover:opacity-70")}>
                  {item.mainImage?.image && (
                    <SanityImage image={item.mainImage.image} alt={item.title ?? ""} className="h-full w-full object-cover" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="relative mt-8" style={{ width: totalWidth }}>
        <motion.div
          className="absolute top-0 h-8 w-8 bg-brand"
          animate={{ x: indicatorCenterX - 4, rotate: rotationCount * 90 }}
          transition={{ x: { duration: 0.8, ease: backInOutSubtle }, rotate: { duration: 0.8, ease: backInOutSubtle } }}
        />
      </div>
    </div>
  );
}

export function SliderControls({ onPrev, onNext, className }) {
  return (
    <div className={cx("flex items-center gap-8", className)}>
      <button
        type="button"
        onClick={onPrev}
        className="flex size-32 cursor-pointer items-center justify-center bg-surface/75 transition-colors duration-400 hover:bg-surface"
        aria-label="Previous slide"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <button
        type="button"
        onClick={onNext}
        className="flex size-32 cursor-pointer items-center justify-center bg-surface/75 transition-colors duration-400 hover:bg-surface"
        aria-label="Next slide"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
    </div>
  );
}