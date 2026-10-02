'use client' 

import React, { useRef, useState, useEffect, Fragment } from 'react'; 
import { gsap } from 'gsap'; 
import { ScrollTrigger } from 'gsap/ScrollTrigger'; 
import { useLenis } from 'lenis/react'; 
import Link from 'next/link'; 
import { ScrollAnimatedHeadline } from '@/components/animations/ScrollAnimatedHeadline'; 
import { FlipIndicator } from '@/components/animations/FlipIndicator'; 
import useDualLayerScramble from '@/hooks/useDualLayerScramble'; 
import { useIdleGSAP } from '@/hooks/useIdleGSAP'; 
import { SanityButton } from '@/components/sanity/SanityButton'; 
import { SanityMedia } from '@/components/sanity/SanityMedia'; 
import { SanityImage } from '@/components/sanity/SanityImage'; 
import { cx } from '@/libs/utils/className'; 

gsap.registerPlugin(ScrollTrigger);

function easeOutCubic(t) {
    return 1 - (1 - t) ** 3;
}

function increment(val) {
    return val + 1;
}

function renderUppercaseTag(tag, index) {
    return (
        <Fragment key={tag}>
            {index > 0 && <span className="text-foreground-muted">--</span>}
            <span className="text-accent-sm uppercase">[{tag}]</span>
        </Fragment>
    );
}


function renderTag(tag, index) {
    return (
        <Fragment key={tag}>
            {index > 0 && <span className="text-foreground-muted">--</span>}
            <span>[{tag}]</span>
        </Fragment>
    );
}


function ScrambleTitle({ title, onRegisterScramble }) {
    const { ref: titleRef, scramble } = useDualLayerScramble({ duration: 0.5 });
    const hasTriggeredRef = useRef(false);

    useEffect(() => {
        onRegisterScramble(scramble);
    }, [scramble, onRegisterScramble]);

    useIdleGSAP(() => {
        if (titleRef.current) {
            hasTriggeredRef.current = false;
            ScrollTrigger.create({
                trigger: titleRef.current,
                start: "top 95%",
                onEnter: () => {
                    if (!hasTriggeredRef.current) {
                        hasTriggeredRef.current = true;
                        scramble();
                    }
                }
            });
        }
    }, [scramble]);

    return (
        <h3 ref={titleRef} className="text-accent-lg">
            {title}
        </h3>
    );
}


function MobileProjectCard(caseStudy, index) {
    return (
        <div key={caseStudy._id} className="flex flex-col">
            <Link 
                href={caseStudy.uri ?? "#"} 
                className="group relative block aspect-[16/10] overflow-hidden" 
                data-cursor-text="VIEW PROJECT"
            >
                {caseStudy.featuredMedia && (
                    <SanityMedia
                        media={caseStudy.featuredMedia}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        imageProps={index === 0 ? { priority: true } : undefined}
                    />
                )}
            </Link>
            <div className="mt-16 flex flex-col gap-8">
                <h3 className="text-h5">{caseStudy.title}</h3>
                {caseStudy.tags && caseStudy.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-8 text-accent-sm text-foreground-muted">
                        {caseStudy.tags.map(renderTag)}
                    </div>
                )}
            </div>
        </div>
    );
}

export function FeaturedWorkSectionClient({ section }) {
    const content = section.content ?? {};
    const { headline, text, viewAllButton, caseStudies } = content;

    const [activeIndex, setActiveIndex] = useState(0);
    const [indicatorRotation, setIndicatorRotation] = useState(0);

    const currentIndexRef = useRef(0);
    const isScrollingRef = useRef(false);

    const sectionRefs = useRef([]);
    const scrambleRefs = useRef([]);
    const mediaRefs = useRef([]);

    const lenis = useLenis();

    useEffect(() => {
        if (!caseStudies?.length) return;

        const observers = [];

        sectionRefs.current.forEach((el, index) => {
            if (!el) return;

            const observer = new IntersectionObserver((entries) => {
                if (isScrollingRef.current) return;

                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && currentIndexRef.current !== index) {
                        currentIndexRef.current = index;
                        setActiveIndex(index);
                    }
                });
            }, { threshold: 0.5, rootMargin: "-20% 0px -20% 0px" });

            observer.observe(el);
            observers.push(observer);
        });

        return () => {
            for (const observer of observers) {
                observer.disconnect();
            }
        };
    }, [caseStudies?.length]);

    useIdleGSAP(() => {
        if (!window.matchMedia("(max-width: 1023px)").matches) {
            for (const mediaEl of mediaRefs.current) {
                if (mediaEl) {
                    gsap.set(mediaEl, { scale: 1.3 });
                    gsap.fromTo(mediaEl,
                        { yPercent: -15 },
                        {
                            yPercent: 15,
                            ease: "none",
                            scrollTrigger: {
                                trigger: mediaEl.parentElement,
                                start: "top bottom",
                                end: "bottom top",
                                scrub: true,
                                invalidateOnRefresh: true
                            }
                        }
                    );
                }
            }
        }
    }, [caseStudies?.length]);

    if (!caseStudies?.length) {
        return null;
    }

    return (
    <Fragment>
        <div className="hidden py-128 lg:block">
            <div className="grid-container">
                <div className="grid-layout">
                    <div className="grid-span-3">
                        <div className="sticky top-header flex h-[calc(100vh-var(--site-header-height))] flex-col justify-between py-32 align-start">
                            <div>
                                {headline?.text && (
                                    <ScrollAnimatedHeadline
                                        headline={{ text: headline.text, level: headline.level ?? "h2" }}
                                        className="mb-24"
                                    />
                                )}
                                {text && (
                                    <p className="whitespace-pre-line text-body text-foreground-muted">
                                        {text}
                                    </p>
                                )}
                            </div>
                            <nav className="flex flex-col items-start gap-8">
                                {caseStudies.map((caseStudy, index) => (
                                    <button
                                        key={caseStudy._id}
                                        type="button"
                                        onClick={() => {
                                            const sectionEl = sectionRefs.current[index];
                                            if (!sectionEl || !lenis || currentIndexRef.current === index) return;

                                            isScrollingRef.current = true;
                                            setIndicatorRotation(increment);
                                            currentIndexRef.current = index;
                                            setActiveIndex(index);

                                            const rect = sectionEl.getBoundingClientRect();
                                            const targetScrollY = window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2;

                                            lenis.scrollTo(targetScrollY, {
                                                duration: 0.8,
                                                easing: easeOutCubic,
                                                onComplete: () => {
                                                    isScrollingRef.current = false;
                                                }
                                            });
                                        }}
                                        onMouseEnter={() => scrambleRefs.current[index]?.()}
                                        className="group relative flex cursor-pointer items-center gap-12"
                                        aria-label={`Go to ${caseStudy.title ?? `case study ${index + 1}`}`}
                                        aria-current={index === activeIndex ? "true" : undefined}
                                    >
                                        <div className={cx("relative aspect-[16/9] w-128 overflow-hidden transition-opacity duration-300", index === activeIndex ? "opacity-100" : "opacity-40")}>
                                            {caseStudy.thumbnail && (
                                                <SanityImage
                                                    image={caseStudy.thumbnail}
                                                    alt={caseStudy.title ?? "Case study thumbnail"}
                                                    className="h-full w-full object-cover"
                                                />
                                            )}
                                        </div>
                                        {index === activeIndex && (
                                            <FlipIndicator
                                                layoutId="featured-work-indicator"
                                                className="h-8 w-8 bg-brand"
                                                rotate={90 * indicatorRotation}
                                            />
                                        )}
                                    </button>
                                ))}
                            </nav>
                            {viewAllButton && (
                                <div>
                                    <SanityButton button={viewAllButton} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="grid-span-8 grid-start-5 flex flex-col gap-64 py-32">
                        {caseStudies.map((caseStudy, index) => (
                            <div
                                key={caseStudy._id}
                                ref={(el) => { sectionRefs.current[index] = el; }}
                                className="flex flex-col"
                            >
                                <Link
                                    href={caseStudy.uri ?? "#"}
                                    className="group relative block aspect-[16/10] overflow-hidden"
                                    data-cursor-text="VIEW PROJECT"
                                    onMouseEnter={() => scrambleRefs.current[index]?.()}
                                >
                                    {caseStudy.featuredMedia && (
                                        <div
                                            ref={(el) => { mediaRefs.current[index] = el; }}
                                            className="h-full w-full"
                                            style={{ willChange: "transform" }}
                                        >
                                            <SanityMedia
                                                media={caseStudy.featuredMedia}
                                                className="zoom-in-image h-full w-full object-cover"
                                                imageProps={index === 0 ? { priority: true } : undefined}
                                            />
                                        </div>
                                    )}
                                </Link>
                                <div className="mt-16 flex items-start justify-between gap-16">
                                    <ScrambleTitle
                                        title={caseStudy.title}
                                        onRegisterScramble={(scrambleFn) => { scrambleRefs.current[index] = scrambleFn; }}
                                    />
                                    {caseStudy.tags && caseStudy.tags.length > 0 && (
                                        <div className="flex items-center gap-8 text-body text-foreground-muted">
                                            {caseStudy.tags.map(renderUppercaseTag)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        <div className="grid-container py-32 lg:hidden">
            <div className="mb-32">
                {headline?.text && (
                    <ScrollAnimatedHeadline
                        headline={{ text: headline.text, level: headline.level ?? "h2" }}
                        className="mb-16"
                    />
                )}
                {text && (
                    <p className="whitespace-pre-line text-body text-foreground-muted">
                        {text}
                    </p>
                )}
            </div>
            <div className="flex flex-col gap-32">
                {caseStudies.map(MobileProjectCard)}
            </div>
            {viewAllButton && (
                <div className="mt-32">
                    <SanityButton button={viewAllButton} />
                </div>
            )}
        </div>
    </Fragment>
    );
}