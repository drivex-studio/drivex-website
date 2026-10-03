'use client' 
import React, { useRef, useEffect, useMemo } from 'react'; 
import { gsap } from 'gsap'; 
import { ScrollTrigger } from 'gsap/ScrollTrigger'; 
import { useGSAP } from '@gsap/react'; 
import { AnimatedHeadline } from '@/components/animations/AnimatedHeadline'; 
import { AnimatedSubtext } from '@/components/animations/AnimatedSubtext'; 
import { ButtonGroup } from '@/components/ui/ButtonGroup'; 
import { Image } from '@/components/sanity/Image'; 
import { usePageEnter } from '@/hooks/usePageEnter'; 
import { usePageEnterContext } from '@/providers/PageEnterProvider'; 
import { SanityMedia } from '@/components/sanity/SanityMedia'; 
import { HIGH_RES_SOURCE_WIDTHS } from '@/libs/constants/config'; 
import { getImageSrc, getImageSrcSet } from '@/components/sanity/SanityImage'; 
import { GoodFellaWatermark } from '@/components/ui/GoodFellaWatermark'; 
import { cx } from '@/libs/utils/className'; 

gsap.registerPlugin(useGSAP, ScrollTrigger);

function ScrollText({ text, className }) {
    let containerRef = useRef(null);
    let textRef = useRef(null);

    useEffect(() => {
        let containerEl = containerRef.current;
        let textEl = textRef.current;
        if (!containerEl || !textEl) return;

        let resize = () => {
            if (!containerEl || !textEl) return;
            textEl.style.fontSize = "100px";
            textEl.style.width = "max-content";
            
            let containerWidth = containerEl.offsetWidth;
            let textWidth = textEl.offsetWidth;
            
            textEl.style.width = "";
            if (textWidth > 0) {
                textEl.style.fontSize = `${(100 * containerWidth) / textWidth}px`;
            }
        };

        resize();
        let resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(containerEl);
        
        return () => resizeObserver.disconnect();
    }, []);

    let chars = text.split("");

    return (
        <div ref={containerRef} className={`overflow-hidden ${className}`}>
            <div ref={textRef} className="whitespace-nowrap font-bold tracking-tighter" style={{ lineHeight: "0.75em" }}>
                {chars.map(ScrollTextChar)}
            </div>
        </div>
    );
}

function ScrollTextChar(char, index) {
    return (
        <span data-scroll-char={true} className="inline-block" key={index}>
            {char === " " ? " " : char}
        </span>
    );
}


export function HeroParallax({
    media, 
    mobileImage, 
    headline, 
    headlineLevel, 
    headlineDisplay, 
    subtext, 
    ctas, 
    scrollText, 
    useWatermark, 
    className 
}) {
    let containerRef = useRef(null);
    let mediaWrapperRef = useRef(null);
    let contentWrapperRef = useRef(null);
    let subtextRef = useRef(null);
    let ctasRef = useRef(null);
    let footerTextRef = useRef(null);
    let hasRevealedRef = useRef(false);
    
    let { prefersReducedMotion } = usePageEnterContext();
    let headlineRef = useRef(null);
    
    let isVideo = media.type === "video" || media.type === "externalVideo";
    let mediaHighResSettings = media.highResolution ? { sourceWidths: HIGH_RES_SOURCE_WIDTHS } : {};
    
    let desktopSrc = media.type === "image" && media.image ? getImageSrc(media.image, { width: 1920, ...mediaHighResSettings }) : null;
    let desktopSrcSet = media.type === "image" && media.image ? getImageSrcSet(media.image, mediaHighResSettings) : undefined;
    let desktopAlt = media.type === "image" && media.image ? media.image.altText ?? media.image.description ?? media.image.title ?? "" : "";
    
    let mobileSrc = mobileImage ? getImageSrc(mobileImage, { width: 720, quality: 80 }) : null;
    let mobileSrcSet = mobileImage ? getImageSrcSet(mobileImage, { quality: 80, sourceWidths: [320, 480, 600, 720, 828, 960, 1080, 1200, 1440] }) : undefined;
    let mobileAlt = mobileImage ? mobileImage.altText ?? mobileImage.description ?? mobileImage.title ?? "" : "";

    let { contextSafe } = useGSAP(() => {
        if (containerRef.current && mediaWrapperRef.current) {
            if (!prefersReducedMotion) {
                let ctasTargets = [ctasRef.current].filter(Boolean);
                gsap.set(ctasTargets, { opacity: 0, y: 20 });
            }
            
            if (!prefersReducedMotion) {
                gsap.set(mediaWrapperRef.current, { clearProps: "transform" });
                gsap.to(mediaWrapperRef.current, {
                    yPercent: 30,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true,
                        invalidateOnRefresh: true
                    }
                });
            }

            if (!prefersReducedMotion && contentWrapperRef.current) {
                gsap.set(contentWrapperRef.current, { clearProps: "transform" });
                gsap.to(contentWrapperRef.current, {
                    yPercent: 10,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: true,
                        invalidateOnRefresh: true
                    }
                });
            }

            if (!prefersReducedMotion && footerTextRef.current) {
                let hasScrollText = !!scrollText;
                let targets = footerTextRef.current.querySelectorAll(hasScrollText ? "[data-scroll-char]" : "svg > g");
                
                if (targets.length > 0) {
                    gsap.set(targets, { clearProps: "all" });
                    let isMobile = window.matchMedia("(max-width: 1023px)").matches;
                    
                    hasScrollText ? gsap.set(targets, { yPercent: 110 }) : gsap.set(targets, { y: 345 });
                    
                    gsap.to(targets, {
                        y: 0,
                        yPercent: 0,
                        ease: "power3.out",
                        stagger: isMobile ? 0.01 : 0.025,
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: "10% top",
                            end: isMobile ? "30% top" : "80% top",
                            scrub: 1,
                            invalidateOnRefresh: true
                        }
                    });
                }
            }
        }
    }, { scope: containerRef, dependencies: [prefersReducedMotion, scrollText, useWatermark] });

    let revealCallback = useMemo(() => contextSafe((delay) => {
        if (hasRevealedRef.current) return;
        hasRevealedRef.current = true;
        
        let t = delay + 0.3;
        headlineRef.current?.reveal(t);
        subtextRef.current?.reveal(t + 0.15);
        
        let tl = gsap.timeline({ delay: t + 0.2 });
        if (ctasRef.current) {
            tl.to(ctasRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.1);
        }
    }), [contextSafe]);

    usePageEnter(revealCallback, { priority: 1, skip: prefersReducedMotion });

    return (
        <div ref={containerRef} className={cx("relative h-svh lg:h-[150vh]", className)}>
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {mobileImage && (
                    <div className="size-full lg:hidden">
                        <Image src={mobileSrc} srcSet={mobileSrcSet} sizes="100vw lg:0px" priority={true} alt={mobileAlt} className="size-full object-cover" />
                    </div>
                )}
                
                <div ref={mediaWrapperRef} className={cx("size-full", mobileImage && "hidden lg:block")} style={{ willChange: "transform" }}>
                    {isVideo ? (
                        <SanityMedia media={media} className="size-full" autoPlay={true} loop={true} imageProps={{ sizes: "100vw" }} />
                    ) : desktopSrc ? (
                        <Image src={desktopSrc} srcSet={desktopSrcSet} sizes="100vw" priority={true} alt={desktopAlt} className="size-full object-cover" />
                    ) : null}
                </div>
                
                <div className="absolute inset-0 bg-background/10" />
                <div className="absolute inset-x-0 top-0 h-1/2" style={{ background: "linear-gradient(to bottom, rgb(20 19 20 / 0.5), transparent)" }} />
            </div>
            
            <div ref={contentWrapperRef} className="grid-container relative min-h-svh pt-80 lg:h-screen">
                <div className="grid-layout">
                    <div className="grid-span-12 lg:grid-subgrid flex flex-col justify-center gap-16">
                        {headline && (
                            <AnimatedHeadline ref={headlineRef} as={headlineLevel ?? "h1"} displayAs={headlineDisplay ?? undefined} className="lg:grid-span-12 lg:grid-subgrid text-foreground" skip={prefersReducedMotion}>
                                {headline}
                            </AnimatedHeadline>
                        )}
                        {subtext && (
                            <AnimatedSubtext ref={subtextRef} className="text-body lg:max-w-xl" skip={prefersReducedMotion}>
                                {subtext}
                            </AnimatedSubtext>
                        )}
                        {ctas && (
                            <div ref={ctasRef}>
                                <ButtonGroup buttonGroup={ctas} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {(scrollText || useWatermark) && (
                <div ref={footerTextRef} className="absolute inset-x-0 bottom-0 overflow-hidden text-foreground/40">
                    {scrollText ? (
                        <ScrollText text={scrollText} className="w-full" />
                    ) : (
                        <GoodFellaWatermark />
                    )}
                </div>
            )}
        </div>
    );
}