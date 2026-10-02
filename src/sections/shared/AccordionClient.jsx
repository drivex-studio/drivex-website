'use client' 

import React, { useRef, useEffect, useState, useCallback } from 'react'; 
import { gsap } from 'gsap'; 
import { SplitText } from 'gsap/SplitText';
import { ScrambleGroup } from '@/components/animations/ScrambleGroup'; 
import { ScrambleText } from '@/components/animations/ScrambleText'; 
import { useBreakpoint } from '@/hooks/useBreakpoint'; 
import { SanityRichText } from '@/components/sanity/SanityRichText'; 

gsap.registerPlugin(SplitText);

function AccordionItem({
    headline,
    text,
    isOpen,
    onToggle,
    isDesktop,
    duration = 0.8,
    ease = "expo.inOut",
    enableStagger = false,
    staggerDuration = 0.6,
    staggerDelay = 0.15,
    staggerEase = "expo.out"
}) {
    const contentRef = useRef(null); 
    const iconRef = useRef(null); 
    const verticalLineRef = useRef(null); 
    const timelineRef = useRef(null); 
    const splitTextRef = useRef(null); 
    const tweenRef = useRef(null); 
    const prevIsOpen = useRef(isOpen); 
    const scrambleRef = useRef(null); 

    const animateText = useCallback(() => { 
        if (!enableStagger || !contentRef.current) return;
        
        const elements = contentRef.current.querySelectorAll("p, span");
        if (elements.length) {
            elements.forEach(el => {
                if (el.querySelector(".split-line")) return;
                
                splitTextRef.current = SplitText.create(el, {
                    type: "lines",
                    mask: "lines",
                    linesClass: "split-line"
                });
                
                const lines = splitTextRef.current.lines;
                gsap.set(lines, { yPercent: 110, force3D: true });
                tweenRef.current = gsap.to(lines, {
                    yPercent: 0,
                    duration: staggerDuration,
                    stagger: staggerDelay,
                    ease: staggerEase,
                    force3D: true
                });
            });
        }
    }, [enableStagger, staggerDuration, staggerDelay, staggerEase]);

    const revertText = useCallback(() => { 
        if (tweenRef.current) {
            tweenRef.current.kill();
            tweenRef.current = null;
        }
        if (splitTextRef.current) {
            splitTextRef.current.revert();
            splitTextRef.current = null;
        }
    }, []);

    useEffect(() => { 
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && contentRef.current) {
            gsap.set(contentRef.current, { height: 0, overflow: "hidden", force3D: true });
            
            timelineRef.current = gsap.timeline({ 
                paused: true, 
                defaults: { duration, ease } 
            });

            timelineRef.current.to(contentRef.current, { height: "auto", duration, ease }, 0);

            if (iconRef.current) {
                timelineRef.current.to(iconRef.current, { rotation: -180, duration, ease }, 0);
            }
            if (verticalLineRef.current) {
                timelineRef.current.to(
                    verticalLineRef.current, 
                    { opacity: 0, duration: 0.5 * duration, ease: "power2.inOut" }, 
                    0.25 * duration
                );
            }
        }
        
        return () => {
            timelineRef.current?.kill();
            tweenRef.current?.kill();
            splitTextRef.current?.revert();
        };
    }, [duration, ease]);

    useEffect(() => { 
        if (!timelineRef.current || isOpen === prevIsOpen.current) return;
        prevIsOpen.current = isOpen;

        if (isOpen) {
            timelineRef.current.play();
            if (isDesktop) {
                scrambleRef.current?.();
            }
            if (enableStagger && contentRef.current) {
                setTimeout(() => {
                    document.fonts.ready.then(() => animateText());
                }, 200);
            }
        } else {
            timelineRef.current.reverse();
            revertText();
        }
    }, [isOpen, enableStagger, animateText, revertText, isDesktop]);

    const buttonClass = `group flex w-full cursor-pointer items-start justify-between gap-16 py-24 text-left transition-colors lg:items-center ${isOpen ? "text-foreground" : "text-foreground-muted hover:text-foreground"}`;

    return (
        <div className="border-border border-b">
            <button 
                type="button" 
                onClick={onToggle} 
                className={buttonClass} 
                aria-expanded={isOpen}
            >
                <span className="text-accent uppercase">
                    {isDesktop ? (
                        <ScrambleText 
                            revealMode={true} 
                            multiLine={true} 
                            secondColorClass="scramble-inherit" 
                            onReady={e => { scrambleRef.current = e; }}
                        >
                            {headline}
                        </ScrambleText>
                    ) : (
                        headline
                    )}
                </span>
                <svg ref={iconRef} className="h-16 w-16 shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path ref={verticalLineRef} d="M8 1V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                    <path d="M1 8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                </svg>
            </button>
            <div ref={contentRef}>
                <div className="pb-24 text-body text-foreground-muted lg:max-w-2/3">
                    <SanityRichText value={text} />
                </div>
            </div>
        </div>
    );
}


export function AccordionClient({
    items,
    allowMultiple = false,
    duration = 0.8,
    ease = "expo.inOut",
    enableStagger = true
}) {
    const isDesktop = useBreakpoint("lg");
    const [openKeys, setOpenKeys] = useState(new Set());

    const handleToggle = (key) => {
        setOpenKeys((prev) => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                if (!allowMultiple) {
                    next.clear();
                }
                next.add(key);
            }
            return next;
        });
    };

    return (
        <ScrambleGroup stagger={0.08} start="top 85%">
            <div className="w-full">
                {items.map(item => (
                    <AccordionItem 
                        key={item._key}
                        headline={item.headline}
                        text={item.text}
                        isOpen={openKeys.has(item._key)}
                        onToggle={() => handleToggle(item._key)}
                        isDesktop={isDesktop}
                        duration={duration}
                        ease={ease}
                        enableStagger={enableStagger}
                    />
                ))}
            </div>
        </ScrambleGroup>
    );
}