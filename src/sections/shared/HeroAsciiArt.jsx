'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { ASCII_GSAP_DURATION, ASCII_EASE, ASCII_COLOR_DELAY } from '@/libs/constants/config'
import { useIsTouchDevice } from '@/hooks/useBreakpoint'
import { useMousePosition } from '@/hooks/useMousePosition'
import { usePageEnter } from '@/hooks/usePageEnter'

gsap.registerPlugin(useGSAP, ScrollTrigger);

function HeroImageFallback({ imageSrc }) {
  return (
    <div className="absolute inset-0 flex animate-fade-in items-center justify-center">
      <Image
        src={imageSrc}
        priority={true}
        alt=""
        className="h-full object-contain"
      />
    </div>
  );
}

export function HeroAsciiArt({
  imageSrc,
  mobileImageSrc,
  depthMapSrc,
  parallaxIntensity = 0.02,
  cellSize = 20,
  color,
  colorDark,
  revealOriginX,
  revealOriginY
}) {

  const isTouchDevice = useIsTouchDevice();
  const [mounted, setMounted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const containerRef = useRef(null);
  
  const [progress, setProgress] = useState(0);
  const [colorProgress, setColorProgress] = useState(0);
  const animationState = useRef({
    progress: 0,
    colorProgress: 0
  });

  const shouldAnimate = mounted && !reduceMotion;
  const [AsciiComponent, setAsciiComponent] = useState(null);

  useEffect(() => {
    if (shouldAnimate) {
      import('@/components/ascii/AsciiTypewriter').then(mod => {
        setAsciiComponent(() => mod.AsciiTypewriter);
      });
    }
  }, [shouldAnimate]);

  const { mouseX, mouseY, isHovering } = useMousePosition({
    enabled: shouldAnimate && !isTouchDevice,
    containerRef: containerRef
  });

  const onPageEnter = useCallback((delay) => {
    if (reduceMotion) {
      setProgress(1);
      setColorProgress(1);
      return;
    }

    gsap.to(animationState.current, {
      progress: 1,
      duration: ASCII_GSAP_DURATION,
      delay: delay,
      ease: ASCII_EASE,
      onUpdate: () => {
        setProgress(animationState.current.progress);
      }
    });

    gsap.to(animationState.current, {
      colorProgress: 1,
      duration: ASCII_GSAP_DURATION,
      delay: delay + ASCII_COLOR_DELAY,
      ease: ASCII_EASE,
      onUpdate: () => {
        setColorProgress(animationState.current.colorProgress);
      }
    });
  }, [reduceMotion]);

  usePageEnter(onPageEnter, {
    priority: 0
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mediaQuery.matches);

    const handleChange = (e) => setReduceMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const currentImageSrc = isTouchDevice ? (mobileImageSrc ?? imageSrc) : imageSrc;

  if (mounted && reduceMotion) {
    return <HeroImageFallback imageSrc={currentImageSrc} />;
  }

  if (shouldAnimate && AsciiComponent) {
    return (
      <div ref={containerRef} className="absolute inset-0">
        <AsciiComponent
          imageSrc={currentImageSrc}
          cellSize={cellSize}
          color={color}
          colorDark={colorDark}
          className="size-full"
          alignX="center"
          alignY="bottom"
          fit="contain"
          mobileFit="contain"
          revealEnd={1}
          randomness={0.6}
          mouseX={isTouchDevice ? undefined : mouseX}
          mouseY={isTouchDevice ? undefined : mouseY}
          enableGooeyReveal={!isTouchDevice}
          isHovering={!isTouchDevice && isHovering}
          gooeyRadius={0.035}
          gooeySoftness={0.04}
          gooeyNoiseIntensity={0.02}
          enableDepthParallax={!isTouchDevice && !!depthMapSrc}
          depthMapSrc={isTouchDevice ? undefined : depthMapSrc}
          parallaxIntensity={parallaxIntensity}
          externalProgress={progress}
          externalColorProgress={colorProgress}
          disableInternalAnimation={true}
          {...(revealOriginX != null && revealOriginY != null && {
            revealOrigin: {
              x: revealOriginX,
              y: revealOriginY
            }
          })}
        />
      </div>
    );
  }

  return null;
}
