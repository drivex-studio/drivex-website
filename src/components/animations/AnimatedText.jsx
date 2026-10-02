'use client'

import { useState, useRef, useContext, useLayoutEffect, useEffect } from 'react';
import { animate, stagger, motion } from 'framer-motion';
import { SplitText } from '@/libs/vendor';
import { AnimatedProseContext } from '@/components/animations/AnimatedProse';
import { cx } from '@/libs/utils/className'

export function AnimatedText({
  children,
  className,
  staggerDelay = 0.03,
  duration = 0.5,
  delay = 0,
  margin = "0px 0px -10% 0px",
  revert = false
}) {
  const [inView, setInView] = useState(false);
  const [isSplit, setIsSplit] = useState(false);
  const containerRef = useRef(null);
  const splitTextRef = useRef(null);
  const animatedProseContext = useContext(AnimatedProseContext);

  useLayoutEffect(() => {
    if (containerRef.current) {
      setIsSplit(false);
      splitTextRef.current = new SplitText(containerRef.current, {
        type: "lines",
        autoSplit: true,
        aria: false,
        deepSlice: true,
        reduceWhiteSpace: false,
        mask: "lines",
        linesClass: "split-line",
        onSplit: () => setIsSplit(true)
      });

      return () => {
        splitTextRef.current = null;
      };
    }
  }, []);

  useEffect(() => {
    if (animatedProseContext || !inView || !isSplit || !containerRef.current || !splitTextRef.current) {
      return;
    }

    const lines = splitTextRef.current.lines ?? [];
    if (lines.length === 0) {
      return;
    }

    containerRef.current.style.visibility = "visible";

    const controls = animate(
      lines,
      { y: ["100%", "0%"] },
      {
        delay: stagger(staggerDelay, { startDelay: delay }),
        duration,
        ease: [0.33, 1, 0.68, 1]
      }
    );

    controls.then(() => {
      revert && splitTextRef.current?.revert();
    });

    return () => {
      controls?.cancel();
    };
  }, [inView, isSplit, animatedProseContext, staggerDelay, duration, delay, revert]);

  return (
    <motion.span
      ref={containerRef}
      onViewportEnter={() => setInView(true)}
      viewport={{ once: true, margin }}
      className={cx("invisible", className)}
    >
      {children}
    </motion.span>
  );
}
