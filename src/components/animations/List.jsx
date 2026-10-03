"use client";
import React, { useRef } from 'react'; 
import { useGSAP } from '@gsap/react'; 
import { gsap } from 'gsap'; 
import { ScrollTrigger } from 'gsap/ScrollTrigger'; 
import { cx } from '@/libs/utils/className'; 

gsap.registerPlugin(useGSAP, ScrollTrigger);

function isValidItemRef(ref) {
    return ref !== null;
}

function createQuickX(el) {
    return gsap.quickTo(el, "x", { duration: 0.5, ease: "back.out(1.4)" });
}

function calculatePushAmount(distance) {
    return distance >= 5 ? 0 : 64 * (1 - distance / 5) ** 3;
}

export function List({
    items, 
    className, 
    animated = true, 
    pushEffect = false 
}) {
    let containerRef = useRef(null);
    let dotRef = useRef(null);
    let itemRefs = useRef([]);

    useGSAP(() => {
        if (!animated || window.matchMedia("(max-width: 1023px)").matches) return;
        
        let containerEl = containerRef.current;
        let dotEl = dotRef.current;
        
        if (!containerEl || !dotEl || itemRefs.current.filter(isValidItemRef).length === 0) return;
        
        let quickY = gsap.quickTo(dotEl, "y", { duration: 0.3, ease: "power2.out" });
        let quickRotation = gsap.quickTo(dotEl, "rotation", { duration: 0.1, ease: "none" });
        
        let updatePosition = () => {
            let rect = containerEl.getBoundingClientRect();
            quickY(window.innerHeight / 2 - rect.top);
        };
        
        let trigger = ScrollTrigger.create({
            trigger: containerEl,
            start: "top 55%",
            end: "bottom 45%",
            onUpdate: (self) => {
                quickRotation(360 * self.progress);
                updatePosition();
            },
            onEnter: () => {
                gsap.to(dotEl, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" });
            },
            onLeave: () => {
                gsap.to(dotEl, { opacity: 0, scale: 0, duration: 0.3, ease: "power2.in" });
            },
            onEnterBack: () => {
                gsap.to(dotEl, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" });
            },
            onLeaveBack: () => {
                gsap.to(dotEl, { opacity: 0, scale: 0, duration: 0.3, ease: "power2.in" });
            }
        });
        
        let handleResize = () => updatePosition();
        window.addEventListener("resize", handleResize);
        
        return () => {
            window.removeEventListener("resize", handleResize);
            trigger.kill();
        };
    }, { dependencies: [animated] });

    
    useGSAP(() => {
        if (!pushEffect || window.matchMedia("(max-width: 1023px)").matches) return;
        
        let containerEl = containerRef.current;
        if (!containerEl) return;
        
        let validItemRefs = itemRefs.current.filter(isValidItemRef);
        if (validItemRefs.length === 0) return;
        
        let itemsCount = validItemRefs.length;
        let itemQuickXs = validItemRefs.map(createQuickX);
        
        let trigger = ScrollTrigger.create({
            trigger: containerEl,
            start: "top 55%",
            end: "bottom 45%",
            onUpdate: (self) => {
                let activeIndex = self.progress * (itemsCount - 1 + 2) - 1;
                for (let i = 0; i < itemsCount; i++) {
                    let distance = Math.abs(i - activeIndex);
                    itemQuickXs[i]?.(calculatePushAmount(distance));
                }
            },
            onLeave: () => {
                for (let quickX of itemQuickXs) quickX(0);
            },
            onLeaveBack: () => {
                for (let quickX of itemQuickXs) quickX(0);
            }
        });
        
        return () => trigger.kill();
    }, { dependencies: [pushEffect] });

    
    useGSAP(() => {
        if (!animated || !window.matchMedia("(max-width: 1023px)").matches) return;
        
        let containerEl = containerRef.current;
        if (!containerEl) return;
        
        let validItemRefs = itemRefs.current.filter(isValidItemRef);
        if (validItemRefs.length !== 0) {
            gsap.set(validItemRefs, { opacity: 0 });
            gsap.to(validItemRefs, { 
                opacity: 1, 
                duration: 0.5, 
                stagger: 0.08, 
                ease: "power2.out", 
                scrollTrigger: { 
                    trigger: containerEl, 
                    start: "top 80%", 
                    once: true 
                } 
            });
        }
    }, { dependencies: [animated] });

    if (!items?.length) return null;

    return (
        <div ref={containerRef} className={cx("relative flex w-full flex-col", className)}>
            {animated && (
                <div
                    ref={dotRef}
                    className="pointer-events-none absolute top-0 z-10 hidden size-8 bg-brand lg:block"
                    style={{ left: -0, opacity: 0, scale: 0, transform: "translateY(-50%)" }}
                    aria-hidden="true"
                />
            )}
            {items.map((item, index) => {
                let isFirst = index === 0;
                let isLast = index === items.length - 1;
                return (
                    <ul
                        key={item.text}
                        ref={(el) => { itemRefs.current[index] = el; }}
                        className={cx(
                            "list-none py-10 text-body",
                            !isFirst && "border-foreground/10 border-t",
                            isLast && "pb-0",
                            isFirst && "pt-0"
                        )}
                    >
                        <li>{item.text}</li>
                    </ul>
                );
            })}
        </div>
    );
}