'use client' 
import React, { useRef, useEffect } from 'react'; 
import { useRouter } from 'next/navigation'; 
import { Link } from '@/components/pageTransition/TransitionLink'; 
import { gsap } from 'gsap'; 
import { ScrollTrigger } from 'gsap/ScrollTrigger'; 
import { useGSAP } from '@gsap/react'; 
import { usePageTransition } from '@/hooks/usePageTransition'; 
import { SanityMedia } from '@/components/sanity/SanityMedia'; 

gsap.registerPlugin(useGSAP, ScrollTrigger);

function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function hideFooterEffect() {
    document.body.dataset.hideFooter = "true";
    return cleanupFooter;
}

function cleanupFooter() {
    delete document.body.dataset.hideFooter;
}

export function NextProjectSection({ nextProject }) {
    let sectionRef = useRef(null);
    let progressBarRef = useRef(null);
    let nextCaseTextRef = useRef(null);
    let titleTextRef = useRef(null);
    let isNavigatingRef = useRef(false);
    
    let router = useRouter();
    let { startTransition, isTransitioning } = usePageTransition();
    let isTransitioningRef = useRef(isTransitioning);

    useEffect(() => {
        isTransitioningRef.current = isTransitioning;
    }, [isTransitioning]);

    let handleClick = (e) => {
        e.preventDefault();
        if (!isTransitioning && !isNavigatingRef.current) {
            isNavigatingRef.current = true;
            if (prefersReducedMotion()) {
                return void router.push(nextProject.uri, { scroll: true });
            }
            startTransition(() => {
                router.push(nextProject.uri, { scroll: true });
            });
        }
    };

    useEffect(hideFooterEffect, []);

    let gsapEffect = () => {
        if (!sectionRef.current || !progressBarRef.current) return;
        
        isNavigatingRef.current = false;
        gsap.set(progressBarRef.current, { scaleX: 0 });
        
        ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (e) => {
                gsap.set(progressBarRef.current, { scaleX: e.progress });
                if (e.progress >= 0.99 && !isNavigatingRef.current && !isTransitioningRef.current) {
                    isNavigatingRef.current = true;
                    if (prefersReducedMotion()) {
                        return void router.push(nextProject.uri, { scroll: true });
                    }
                    startTransition(() => {
                        router.push(nextProject.uri, { scroll: true });
                    });
                }
            }
        });

        let targets = [nextCaseTextRef.current, titleTextRef.current].filter(Boolean);
        if (targets.length > 0) {
            gsap.set(targets, { yPercent: 110 });
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top 10%",
                end: "top 10%",
                onEnter: () => {
                    gsap.to(targets, { yPercent: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 });
                },
                onLeaveBack: () => {
                    gsap.to(targets, { yPercent: 110, duration: 0.8, ease: "power3.out", stagger: 0.1 });
                }
            });
        }
    };

    useGSAP(gsapEffect, { scope: sectionRef, dependencies: [nextProject.uri] });

    return (
        <section ref={sectionRef} data-theme="dark" data-hide-header={true} className="h-[300vh]">
            <Link href={nextProject.uri} onClick={handleClick} className="sticky top-0 block h-dvh" data-cursor-text="VIEW PROJECT">
                {nextProject.mainImage && (
                    <SanityMedia 
                        media={nextProject.mainImage} 
                        className="absolute inset-0 h-full w-full object-cover" 
                        autoPlay={true} 
                        loop={true} 
                    />
                )}
                
                <div className="absolute inset-x-0 top-0 h-256" style={{ background: "linear-gradient(to bottom, rgb(20 19 20 / 0.5), transparent)" }} />
                
                <div className="grid-container absolute inset-x-0 top-0 pt-32">
                    <p className="text-accent text-foreground uppercase">[Keep scrolling to see more]</p>
                </div>
                
                <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: "linear-gradient(to top, rgba(0, 0, 0, 0.75), transparent)" }} />
                
                <div className="absolute inset-x-0 bottom-0 pb-32">
                    <div className="grid-container">
                        <div className="grid-layout !gap-y-0 items-end">
                            <div className="grid-span-12 lg:grid-span-6 overflow-hidden">
                                <p ref={nextCaseTextRef} className="text-foreground-muted text-h2">Next case</p>
                            </div>
                            <div className="grid-span-12 lg:grid-span-6 overflow-hidden lg:text-right">
                                <h2 ref={titleTextRef} className="text-foreground text-h1">{nextProject.title}</h2>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="absolute inset-x-0 bottom-0 h-4 bg-foreground/10">
                    <div ref={progressBarRef} className="h-full origin-left bg-brand" />
                </div>
            </Link>
        </section>
    );
}