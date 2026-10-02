'use client'
import React, { useState, useRef, useEffect } from 'react'; 
import dynamic from 'next/dynamic'; 
import Link from 'next/link'; 
import gsap from 'gsap'; 
import { useGSAP } from '@gsap/react'; 

import { AnimatedHeadline } from '@/components/animations/AnimatedHeadline'; 
import { AnimatedButton } from '@/components/animations/AnimatedButton';
import { ASCII_GSAP_DURATION, ASCII_EASE, ASCII_COLOR_DELAY } from '@/libs/constants/config'; 
import { 
  useAsciiDelay,
  useIsTouchDevice,
  useMousePosition,
  usePageEnter } from '@/hooks/helper';
import { useHideFooter } from '@/providers/FooterSlot';

const AsciiTypewriter = dynamic(() => import('@/components/ascii/AsciiTypewriter').then(e => e.AsciiTypewriter), {
  ssr: false
}); 

export default function NotFoundPage(props = {}) {
  const {
    headline = "Seems like you're lost.",
    description = "Looks like this page was moved or the link is broken.",
    imageSrc = "/images/The_Great_Wave_off_Kanagawa_edited.png",
    mobileImageSrc,
    depthMapSrc = "/images/The_Great_Wave_off_Kanagawa_edited_depth.png",
    color = "#ff6b4a",
    colorDark = "#1a0a2e",
    cellSize = 10,
    parallaxIntensity = 0.12,
    revealOriginX,
    revealOriginY
  } = props;

  const isTouchDevice = useIsTouchDevice();
  const [isMounted, setIsMounted] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  const containerRef = useRef(null);
  const headlineRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonRef = useRef(null);

  const asciiDelay = useAsciiDelay();
  const [progress, setProgress] = useState(0);
  const [colorProgress, setColorProgress] = useState(0);
  const progressRef = useRef({ progress: 0, colorProgress: 0 });

  const canAnimate = isMounted && !isReducedMotion;
  const enableMousePosition = canAnimate && !isTouchDevice;

  const { mouseX, mouseY, isHovering } = useMousePosition({
    enabled: enableMousePosition,
    containerRef: containerRef
  });

  const playAnimation = (delay) => {
    if (isReducedMotion) {
      setProgress(1);
      setColorProgress(1);
      headlineRef.current?.reveal();
      
      if (descriptionRef.current) {
        gsap.set(descriptionRef.current.querySelector("[data-line-inner]"), { yPercent: 0 });
      }
      if (buttonRef.current) {
        gsap.set(buttonRef.current, { opacity: 1 });
      }
      return;
    }

    gsap.to(progressRef.current, {
      progress: 1,
      duration: ASCII_GSAP_DURATION,
      delay: delay,
      ease: ASCII_EASE,
      onUpdate: () => {
        setProgress(progressRef.current.progress);
      }
    });

    gsap.to(progressRef.current, {
      colorProgress: 1,
      duration: ASCII_GSAP_DURATION,
      delay: delay + ASCII_COLOR_DELAY,
      ease: ASCII_EASE,
      onUpdate: () => {
        setColorProgress(progressRef.current.colorProgress);
      }
    });

    const textDelay = delay + asciiDelay;

    headlineRef.current?.reveal(textDelay);

    if (descriptionRef.current) {
      const innerLine = descriptionRef.current.querySelector("[data-line-inner]");
      if (innerLine) {
        gsap.to(innerLine, {
          yPercent: 0,
          duration: 0.8,
          ease: "expo.out",
          delay: textDelay + 0.15
        });
      }
    }

    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        delay: textDelay + 0.3
      });
    }
  };

  usePageEnter(playAnimation, { priority: 0 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useGSAP(() => {
    if (isReducedMotion || !descriptionRef.current) return;
    const innerLine = descriptionRef.current.querySelector("[data-line-inner]");
    
    if (innerLine) {
      gsap.set(innerLine, { yPercent: 110 });
    }
  }, {
    dependencies: [isReducedMotion]
  });

  useHideFooter();

  const activeImageSrc = isTouchDevice ? (mobileImageSrc ?? imageSrc) : imageSrc;

  const typewriterElement = canAnimate ? (
    <AsciiTypewriter
      imageSrc={activeImageSrc}
      alignX="center"
      alignY="bottom"
      fit="contain"
      mobileFit="cover"
      mouseX={isTouchDevice ? undefined : mouseX}
      mouseY={isTouchDevice ? undefined : mouseY}
      enableGooeyReveal={!isTouchDevice}
      isHovering={!isTouchDevice && isHovering}
      gooeyRadius={0.035}
      gooeySoftness={0.04}
      gooeyNoiseIntensity={0.02}
      color={color}
      colorDark={colorDark}
      cellSize={cellSize}
      depthMapSrc={isTouchDevice ? undefined : depthMapSrc}
      enableDepthParallax={!isTouchDevice && !!depthMapSrc}
      parallaxIntensity={parallaxIntensity}
      externalProgress={progress}
      externalColorProgress={colorProgress}
      disableInternalAnimation={true}
      {...(revealOriginX != null && revealOriginY != null && {
        revealOrigin: { x: revealOriginX, y: revealOriginY }
      })}
    />
  ) : (
    isMounted && (mobileImageSrc || imageSrc) && (
      <div className="absolute inset-0 flex animate-fade-in items-end justify-end">
        <img src={mobileImageSrc || imageSrc} alt="" className="h-full" />
      </div>
    )
  );

  return (
    <div data-theme="dark" className="relative flex h-svh flex-col bg-background">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[115%] w-full">
          <div ref={containerRef} className="relative size-full">
            {typewriterElement}
          </div>
        </div>
      </div>
      <div className="pointer-events-none relative z-10 mb-[10vh] flex flex-1 flex-col items-center justify-center px-16">
        <div className="flex flex-col items-center gap-36 text-center">
          <div className="flex flex-col items-center gap-4">
            <AnimatedHeadline
              ref={headlineRef}
              as="h1"
              className="text-foreground text-h3"
              skip={isReducedMotion}
            >
              {headline}
            </AnimatedHeadline>
            <p ref={descriptionRef} className="-mb-[0.1em] overflow-hidden pb-[0.1em] text-body text-foreground-muted">
              <span data-line-inner className="block">
                {description}
              </span>
            </p>
          </div>
          <div ref={buttonRef} className="pointer-events-auto opacity-0">
            <AnimatedButton asChild>
              <Link href="/">Back to homepage</Link>
            </AnimatedButton>
          </div>
        </div>
      </div>
    </div>
  );
}
