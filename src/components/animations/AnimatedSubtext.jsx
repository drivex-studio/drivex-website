import React, { forwardRef, useRef, useState, useLayoutEffect, useImperativeHandle } from 'react'; 
import gsap from 'gsap'; 
import { SplitText } from 'gsap/SplitText';
import cx from 'clsx';

// module id: 410264
export const AnimatedSubtext = forwardRef(({
  children,
  className,
  skip = false,
  staggerDelay = 0.05,
  duration = 0.8
}, ref) => {
  // Renamed mangled identifiers for clarity:
  // u -> containerRef
  // m -> splitTextInstance
  // g -> isSplit
  // f -> setIsSplit
  // x -> renderLines

  const containerRef = useRef(null);
  const splitTextInstance = useRef(null);
  const [isSplit, setIsSplit] = useState(false);

  useLayoutEffect(() => {
    if (containerRef.current && !skip) {
      setIsSplit(false);
      splitTextInstance.current = new SplitText(containerRef.current, {
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
        splitTextInstance.current?.revert();
        splitTextInstance.current = null;
      };
    }
  }, [skip]);

  useImperativeHandle(ref, () => ({
    reveal: (delay = 0) => {
      if (!containerRef.current || !splitTextInstance.current || skip) return;
      
      const lines = splitTextInstance.current.lines ?? [];
      if (lines.length !== 0) {
        containerRef.current.style.visibility = "visible";
        gsap.fromTo(lines, {
          y: "100%"
        }, {
          y: "0%",
          duration: duration,
          ease: "power3.out",
          stagger: staggerDelay,
          delay: delay
        });
      }
    }
  }), [skip, duration, staggerDelay]);

  const renderLines = (text) => {
    const lines = text.split("\n");
    return lines.map((line, index) => (
      <span key={index}>
        {line}
        {index < lines.length - 1 && <br />}
      </span>
    ));
  };

  if (skip) {
    return (
      <p className={className}>
        {renderLines(children)}
      </p>
    );
  }

  return (
    <p ref={containerRef} className={cx("invisible", className)}>
      {renderLines(children)}
    </p>
  );
});

AnimatedSubtext.displayName = "AnimatedSubtext";