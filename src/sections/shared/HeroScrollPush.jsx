'use client'

import React, { useRef, useEffect } from 'react' 
import gsap from 'gsap' 
import { ScrollTrigger } from 'gsap/ScrollTrigger' 

gsap.registerPlugin(ScrollTrigger);


export function HeroScrollPush({ children, className }) {
  
  const containerRef = useRef(null);
  useEffect(() => {
    let gsapCtx;
    
    if (!containerRef.current) return;
    
    const element = containerRef.current;
    const parentSection = element.closest("section");
    
    if (!parentSection) return;

    const timeoutId = setTimeout(() => {
      gsapCtx = gsap.context(() => {
        gsap.to(element, {
          yPercent: 35,
          ease: "none",
          scrollTrigger: {
            trigger: parentSection,
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });
      }, containerRef);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      gsapCtx?.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}