'use client'
import React, { useRef, useState, useEffect, Fragment } from "react";
import { SpotsBadge } from '@/components/ui/SpotsBadge'
import { useIsTouchDevice } from '@/hooks/useBreakpoint'
import { useMousePosition } from '@/hooks/useMousePosition'
import { NewsletterForm } from '@/components/ui/NewsletterForm'
import { SanityRichText } from '@/components/sanity/SanityRichText'
import { SanityImage,getImageSrc } from '@/components/sanity/SanityImage'
import { GoodFellaWatermark } from '@/components/ui/GoodFellaWatermark'
import { clamp, sineEase } from '@/components/layout/utils/mathUtils'
import { AsciiWrapper } from '@/components/layout/AsciiWrapper'
import { FooterNavigation } from '@/components/layout/FooterNavigation'
import { FooterShortcuts } from '@/components/layout/FooterShortcuts'

import { cx } from '@/libs/utils/className'

const BRAND_COLOR = "#FB460D";

export function FooterClient(props) {
  const {
    navigation,
    contactInformation,
    copyrightNotice,
    asciiImageLeft,
    asciiDepthMapLeft,
    asciiColorLeft,
    asciiColorDarkLeft,
    asciiCellSizeLeft,
    asciiParallaxIntensityLeft,
    asciiRevealOriginXLeft,
    asciiRevealOriginYLeft,
    asciiMobileFallbackLeft,
    asciiImage,
    asciiDepthMap,
    asciiColor,
    asciiColorDark,
    asciiCellSize,
    asciiParallaxIntensity,
    asciiRevealOriginX,
    asciiRevealOriginY,
    asciiMobileFallback,
    showWatermark,
    spotsRemaining
  } = props;

  const footerContainerRef = useRef(null);
  const footerRef = useRef(null);
  const gridContainerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const scrollRafRef = useRef(null);
  const leftAsciiRef = useRef(null);
  const rightAsciiRef = useRef(null);
  const hasIntersectedRef = useRef(false);

  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isScrollReady, setIsScrollReady] = useState(false);
  
  const isTouch = useIsTouchDevice();

  useEffect(() => {
    if (!document.documentElement.classList.contains("scroll-locked")) {
      const raf = requestAnimationFrame(() => setIsScrollReady(true));
      return () => cancelAnimationFrame(raf);
    }
    const observer = new MutationObserver(() => {
      if (!document.documentElement.classList.contains("scroll-locked")) {
        observer.disconnect();
        requestAnimationFrame(() => setIsScrollReady(true));
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
    return () => observer.disconnect();
  }, []);

  const leftProgressRef = useRef({ progress: 0, colorProgress: 0 });
  const rightProgressRef = useRef({ progress: 0, colorProgress: 0 });
  
  const [progressState, setProgressState] = useState({
    left: 0, leftColor: 0, right: 0, rightColor: 0
  });

  const computedImageLeft = asciiImageLeft ? getImageSrc(asciiImageLeft, isTouch ? { width: 400 } : undefined) : null;
  const computedDepthMapLeft = isTouch ? null : (asciiDepthMapLeft ? getImageSrc(asciiDepthMapLeft) : null);
  
  const computedImageRight = asciiImage ? getImageSrc(asciiImage, isTouch ? { width: 400 } : undefined) : null;
  const computedDepthMapRight = isTouch ? null : (asciiDepthMap ? getImageSrc(asciiDepthMap) : null);

  const enableAscii = isMounted && !prefersReducedMotion;
  const enableMouseLeft = enableAscii && !isTouch;

  const { isHovering: isHoverLeft, mouseRef: mouseRefLeft } = useMousePosition({
    enabled: enableMouseLeft,
    containerRef: leftAsciiRef,
    refOnly: true
  });

  const enableMouseRight = enableAscii && !isTouch;
  const { isHovering: isHoverRight, mouseRef: mouseRefRight } = useMousePosition({
    enabled: enableMouseRight,
    containerRef: rightAsciiRef,
    refOnly: true
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!footerRef.current) return;
    
    if (prefersReducedMotion) {
      setIsVisible(true);
      leftProgressRef.current = { progress: 1, colorProgress: 1 };
      rightProgressRef.current = { progress: 1, colorProgress: 1 };
      setProgressState({ left: 1, leftColor: 1, right: 1, rightColor: 1 });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry?.isIntersecting && !hasIntersectedRef.current) {
        hasIntersectedRef.current = true;
        setIsVisible(true);
        
        const startTime = performance.now();
        
        const animate = (time) => {
          const elapsed = time - startTime;
          const prog = sineEase(clamp(elapsed / 3000));
          const colorProg = sineEase(clamp((elapsed - 500) / 3000));
          
          if (computedImageLeft) {
            leftProgressRef.current = { progress: prog, colorProgress: colorProg };
          }
          if (computedImageRight) {
            rightProgressRef.current = { progress: prog, colorProgress: colorProg };
          }
          
          setProgressState({
            left: leftProgressRef.current.progress,
            leftColor: leftProgressRef.current.colorProgress,
            right: rightProgressRef.current.progress,
            rightColor: rightProgressRef.current.colorProgress
          });
          
          if (elapsed < 3500) {
            animationFrameRef.current = requestAnimationFrame(animate);
            return;
          }
          
          animationFrameRef.current = null;
          setProgressState({ left: 1, leftColor: 1, right: 1, rightColor: 1 });
        };
        
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    }, { threshold: 0.2 });
    
    observer.observe(footerRef.current);
    
    return () => {
      observer.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [computedImageLeft, computedImageRight, prefersReducedMotion]);

  useEffect(() => {
    if (!footerRef.current || !footerContainerRef.current || !isScrollReady || prefersReducedMotion) return;
    
    const el = footerRef.current;
    const container = footerContainerRef.current;
    const grid = gridContainerRef.current;

    const onFrame = () => {
      scrollRafRef.current = null;
      const rect = container.getBoundingClientRect();
      const progress = clamp((window.innerHeight - rect.top) / Math.max(rect.height, 1));
      
      el.style.transform = `translate3d(0, ${-20 + 20 * progress}%, 0)`;
      if (grid) {
        grid.style.opacity = String(progress);
      }
    };

    const queueFrame = () => {
      if (scrollRafRef.current == null) {
        scrollRafRef.current = requestAnimationFrame(onFrame);
      }
    };

    const onScroll = () => queueFrame();
    const onResize = () => queueFrame();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    
    const resizeObserver = new ResizeObserver(() => queueFrame());
    resizeObserver.observe(document.body);
    queueFrame();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      resizeObserver.disconnect();
      
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = null;
      }
      
      el.style.transform = "";
      if (grid) {
        grid.style.opacity = "";
      }
    };
  }, [isScrollReady, prefersReducedMotion]);

  return (
    <Fragment>
      <div ref={footerContainerRef}>
        <footer
          data-theme="dark"
          ref={footerRef}
          className="relative h-auto min-h-svh overflow-hidden bg-background pt-48 lg:h-svh"
        >
          {computedImageLeft && enableAscii && (
            <div ref={leftAsciiRef} className="pointer-events-none absolute top-[12.5%] bottom-0 left-0 z-20 w-1/2">
              <AsciiWrapper
                imageSrc={computedImageLeft}
                color={asciiColorLeft ?? BRAND_COLOR}
                colorDark={asciiColorDarkLeft ?? undefined}
                cellSize={asciiCellSizeLeft ?? 20}
                alignX="left"
                mobileFit="contain"
                externalProgress={progressState.left}
                externalColorProgress={progressState.leftColor}
                depthMapSrc={isTouch ? undefined : (computedDepthMapLeft ?? undefined)}
                parallaxIntensity={asciiParallaxIntensityLeft ?? 0.02}
                mouseRef={isTouch ? undefined : mouseRefLeft}
                isHovering={!isTouch && isHoverLeft}
                isTouch={isTouch}
                revealOriginX={asciiRevealOriginXLeft ?? undefined}
                revealOriginY={asciiRevealOriginYLeft ?? undefined}
                frameloop="demand"
                dpr={[1, 1.5]}
              />
            </div>
          )}
          
          {asciiMobileFallbackLeft && isMounted && !enableAscii && (
            <div className="pointer-events-none absolute top-1/5 -left-1/3 flex w-3/4 items-end lg:hidden">
              <SanityImage
                image={asciiMobileFallbackLeft}
                className="h-full w-full"
                style={{ objectFit: "contain", objectPosition: "left bottom" }}
              />
            </div>
          )}
          
          {computedImageRight && enableAscii && (
            <div ref={rightAsciiRef} className="pointer-events-none absolute top-[12.5%] right-0 bottom-0 z-20 w-1/2">
              <AsciiWrapper
                imageSrc={computedImageRight}
                color={asciiColor ?? BRAND_COLOR}
                colorDark={asciiColorDark ?? undefined}
                cellSize={asciiCellSize ?? 20}
                alignX="right"
                mobileFit="contain"
                externalProgress={progressState.right}
                externalColorProgress={progressState.rightColor}
                depthMapSrc={isTouch ? undefined : (computedDepthMapRight ?? undefined)}
                parallaxIntensity={asciiParallaxIntensity ?? 0.02}
                mouseRef={isTouch ? undefined : mouseRefRight}
                isHovering={!isTouch && isHoverRight}
                isTouch={isTouch}
                revealOriginX={asciiRevealOriginX ?? undefined}
                revealOriginY={asciiRevealOriginY ?? undefined}
                frameloop="demand"
                dpr={[1, 1.5]}
              />
            </div>
          )}
          
          {asciiMobileFallback && isMounted && !enableAscii && (
            <div className="pointer-events-none absolute top-1/5 -right-1/3 flex w-3/4 items-end lg:hidden">
              <SanityImage
                image={asciiMobileFallback}
                className="h-full w-full"
                style={{ objectFit: "contain", objectPosition: "right bottom" }}
              />
            </div>
          )}
          
          <div ref={gridContainerRef} className="grid-container pointer-events-none relative z-30 flex h-full flex-col">
            <div className="grid-layout !gap-y-48 lg:gap-y-0">
              <div className="grid-span-12 lg:grid-span-3 lg:grid-start-1 pointer-events-auto flex flex-col gap-16">
                <NewsletterForm heading="Don't miss out on future updates." buttonText="Subscribe" buttonTheme="light" />
                {navigation?.availability?.isAvailable && navigation.availability.text && (
                  <div className="flex flex-col items-start gap-4">
                    <p className="flex items-center gap-8 text-accent-sm text-foreground-muted">
                      <span className="inline-block size-8 shrink-0 animate-pulse bg-brand"></span>
                      <span>{navigation.availability.text}</span>
                    </p>
                    <SpotsBadge className="tex-foreground-muted" spots={spotsRemaining} />
                  </div>
                )}
              </div>
              
              <FooterNavigation items={navigation?.items} />
              
              <div className="grid-span-12 lg:grid-span-3 lg:grid-start-10 pointer-events-auto flex flex-col gap-16">
                {contactInformation && (
                  <div className="prose prose-sm text-foreground-muted">
                    <SanityRichText value={contactInformation} />
                  </div>
                )}
                <FooterShortcuts />
              </div>
            </div>
            
            <div className="pointer-events-auto pt-[12.5%] text-center text-body text-foreground-muted">
              <span>© {new Date().getFullYear()}</span>
              {copyrightNotice && (
                <span className="prose prose-sm inline">
                  {" "}<SanityRichText value={copyrightNotice} />
                </span>
              )}
            </div>
            
            <div className="mt-auto flex flex-col">
              {showWatermark && (
                <div className="mt-auto overflow-hidden">
                  <GoodFellaWatermark
                    className={cx(
                      "text-foreground opacity-10",
                      isVisible && !prefersReducedMotion && "animate-watermark"
                    )}
                    animate={isVisible && !prefersReducedMotion}
                  />
                </div>
              )}
            </div>
          </div>
        </footer>
      </div>
    </Fragment>
  );
}
