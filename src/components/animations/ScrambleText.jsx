"use client";

import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { gsap, ScrambleTextPlugin } from '@/libs/vendor';
import { useScrambleGroup } from '@/hooks/useScrambleGroup';

const DEFAULT_CHARS = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

export function ScrambleText({
  children,
  className,
  duration = 0.6,
  chars = DEFAULT_CHARS,
  dualLayer = true,
  triggerOnHover = false,
  revealMode = false,
  theme = "dark",
  firstColorClass,
  secondColorClass,
  onComplete,
  onReady,
  multiLine = false
}) {
  const wrapperRef = useRef(null);
  const textRef = useRef(null);
  const timelineRef = useRef(null);
  const prevTextRef = useRef("");
  const hasAnimatedRef = useRef(false);

  
  const instanceIdRef = useRef();
  if (!instanceIdRef.current) {
    instanceIdRef.current = `scramble-${Math.random().toString(36).slice(2, 9)}`;
  }

  const themeColors = useMemo(() => {
    if (theme === "brand") {
      return {
        firstColorClass: "scramble-white",
        secondColorClass: "scramble-foreground"
      };
    }
    return {
      firstColorClass: "scramble-brand",
      secondColorClass: "scramble-foreground"
    };
  }, [theme]);

  const color1 = firstColorClass ?? themeColors.firstColorClass;
  const color2 = secondColorClass ?? themeColors.secondColorClass;
  const scrambleGroup = useScrambleGroup();
 
  let textContent = "";
  if (typeof children === "string") {
    textContent = children;
  } else if (typeof children === "number") {
    textContent = String(children);
  }

  useEffect(() => {
    prevTextRef.current = textContent;
  }, [textContent]);

  const killTimeline = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
  }, []);

  const scramble = useCallback(() => {
    if (!textRef.current) return null;
    
    const element = textRef.current;
    const targetText = prevTextRef.current || textContent;

    if (!targetText || targetText.length === 0) return null;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.textContent = targetText;
      element.className = element.className.replace(/\bscramble-\w+\b/g, "");
      hasAnimatedRef.current = true;
      onComplete?.();
      return null;
    }

    killTimeline();

    timelineRef.current = gsap.timeline({
      onComplete: () => {
        timelineRef.current = null;
        hasAnimatedRef.current = true;
        onComplete?.();
      }
    });

    if (dualLayer) {
      const generateScramble = (textStr, charSet = DEFAULT_CHARS) => {
        let res = "";
        for (let i = 0; i < textStr.length; i++) {
          const char = textStr[i];
          if (char === " " || char === "\n" || char === "\r") {
            res += char;
          } else {
            res += charSet[Math.floor(Math.random() * charSet.length)];
          }
        }
        return res;
      };

      const randomText = generateScramble(targetText, chars);
      const nonSpaceCount = targetText.replace(/\s/g, "").length;
      
      
      const phaseTwoPosition = nonSpaceCount > 0 ? duration / nonSpaceCount : 0;

      if (revealMode && !hasAnimatedRef.current) {
        element.textContent = targetText.replace(/[^\s\n\r]/g, " "); 
        
        timelineRef.current.to(element, {
          duration: duration,
          scrambleText: {
            text: randomText,
            chars: chars,
            speed: 1,
            revealDelay: 0.1,
            oldClass: color1,
            newClass: color1
          },
          ease: "none"
        });
      } else {
        timelineRef.current.to(element, {
          duration: duration,
          scrambleText: {
            text: randomText,
            chars: chars,
            speed: 1,
            revealDelay: 0.1,
            oldClass: color2,
            newClass: color1
          },
          ease: "none"
        });
      }

      timelineRef.current.to(element, {
        duration: duration,
        scrambleText: {
          text: targetText,
          chars: chars,
          speed: 1,
          revealDelay: 0.1,
          oldClass: color1,
          newClass: color2
        },
        ease: "none"
      }, phaseTwoPosition);

    } else {
      
      timelineRef.current.to(element, {
        duration: duration,
        scrambleText: {
          text: targetText,
          chars: chars,
          speed: 1,
          revealDelay: 0.2
        },
        ease: "none"
      });
    }

    return timelineRef.current;
  }, [
    chars, dualLayer, duration, color1, color2, 
    onComplete, revealMode, textContent, killTimeline
  ]);

  
  useEffect(() => {
    if (scrambleGroup && instanceIdRef.current) {
      scrambleGroup.register(instanceIdRef.current, scramble);
      return () => {
        scrambleGroup.unregister(instanceIdRef.current);
      };
    }
  }, [scrambleGroup, scramble]);

  
  useEffect(() => {
    onReady?.(scramble);
  }, [onReady, scramble]);

  const handleHover = triggerOnHover ? () => { if (triggerOnHover) scramble(); } : undefined;

  
  useEffect(() => {
    return () => killTimeline();
  }, [killTimeline]);

  const displayTargetText = (revealMode ? textContent.replace(/[^\s\n\r]/g, " ") : textContent);
  const whiteSpaceStyle = multiLine ? "normal" : "nowrap";
  const displayStyle = multiLine ? "inline" : "inline-block";

  const wrapperStyle = {
    position: "relative",
    display: displayStyle,
    whiteSpace: whiteSpaceStyle
  };

  const hiddenLayoutSpanStyle = {
    visibility: "hidden",
    whiteSpace: whiteSpaceStyle
  };

  const animatedSpanStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    whiteSpace: whiteSpaceStyle,
    ...(multiLine ? { width: "100%" } : {})
  };

  return (
    <span
      ref={wrapperRef}
      className={className}
      style={wrapperStyle}
      onMouseEnter={handleHover}
    >
      {}
      <span className="sr-only">
        {textContent}
      </span>
      {}
      <span aria-hidden="true" style={hiddenLayoutSpanStyle}>
        {textContent}
      </span>
      {}
      <span ref={textRef} aria-hidden="true" style={animatedSpanStyle}>
        {displayTargetText}
      </span>
    </span>
  );
}