"use client";

import React, { useRef, useState, useEffect } from 'react';
import { gsap, useGSAP } from '@/libs/vendor';
import { usePreloader } from '@/providers/PreloaderProvider'
import { ScrambleText } from '@/components/animations/ScrambleText'
import { cx } from '@/libs/utils/className'


export function Preloader() {
  const { phase, setPhase, isInitialLoad } = usePreloader();
  const containerRef = useRef(null);
  const contentWrapperRef = useRef(null);
  const boxesContainerRef = useRef(null);
  const boxRefs = useRef([]);
  const scramblePlayRef = useRef(null);
  const timelineRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleScrambleReady = (playFn) => {
    scramblePlayRef.current = playFn;
  };

  useGSAP(() => {
    if (!isInitialLoad || phase !== "loading") return;

    if (reducedMotion) {
      setPhase("complete");
      return;
    }

    const boxes = boxRefs.current.filter(Boolean);
    if (boxes.length === 0) return;

    const startAnimation = () => {
      if (!scramblePlayRef.current) {
        requestAnimationFrame(startAnimation);
        return;
      }

      timelineRef.current = gsap.timeline();
      scramblePlayRef.current();

      boxes.forEach((box, index) => {
        timelineRef.current?.fromTo(box, {
          x: index === 0 ? -16 : (index - 1) * 18,
          rotate: 0
        }, {
          x: 18 * index - 16,
          rotate: 90,
          duration: 0.7,
          ease: "expo.inOut",
          immediateRender: false
        }, index === 0 ? 0 : ">-25%");
      });

      const fadeOutDelay = 2.275;

      timelineRef.current?.to(contentWrapperRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power3.out"
      }, fadeOutDelay + 0.2);

      const proxyObj = { value: 0 };
      const stateObj = { value: false };

      timelineRef.current?.to(proxyObj, {
        value: 1,
        duration: 1.5,
        ease: "expo.inOut",
        onUpdate: () => {
          const val = proxyObj.value;
          
          if (containerRef.current) {
            if (val <= 0) {
              containerRef.current.style.clipPath = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
            } else if (val >= 1) {
              containerRef.current.style.clipPath = "polygon(0% 100%, 0% 100%, 0% 100%)";
            } else if (val <= 0.5) {
              containerRef.current.style.clipPath = `polygon(0% 100%, ${2 * val * 100}% 0%, 100% 0%, 100% 100%)`;
            } else {
              containerRef.current.style.clipPath = `polygon(0% 100%, 100% ${(val - 0.5) * 200}%, 100% 100%)`;
            }
          }

          if (!stateObj.value && val >= 0.9) {
            stateObj.value = true;
            setPhase("revealing");
          }
        }
      }, fadeOutDelay);
    };

    const timeoutId = setTimeout(startAnimation, 100);

    return () => {
      clearTimeout(timeoutId);
      timelineRef.current?.kill();
    };
  }, { dependencies: [isInitialLoad, phase, reducedMotion, setPhase] });

  if (!isInitialLoad || phase === "hidden") return null;

  const isComplete = phase === "complete";
  const containerClasses = cx(
    "fixed inset-0 z-[10000] flex items-center justify-center bg-background",
    isComplete && "pointer-events-none"
  );

  return (
    <div ref={containerRef} data-theme="brand" className={containerClasses}>
      <div ref={contentWrapperRef} className="flex flex-col items-center gap-4">
        
        {/* Animated Loading Boxes */}
        <div 
          ref={boxesContainerRef} 
          className="relative overflow-x-clip overflow-y-visible" 
          style={{ width: 70, height: 16 }}
        >
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              ref={(el) => { boxRefs.current[index] = el; }}
              className="absolute top-0 left-0 bg-foreground"
              style={{
                width: 16,
                height: 16,
                transform: "translateX(-16px)",
                transformOrigin: "bottom right"
              }}
            />
          ))}
        </div>

        {/* LOADING Scramble Text */}
        <div className="overflow-hidden">
          <ScrambleText 
            revealMode={true} 
            duration={1} 
            onReady={handleScrambleReady}
          >
            LOADING
          </ScrambleText>
        </div>

      </div>
    </div>
  );
}