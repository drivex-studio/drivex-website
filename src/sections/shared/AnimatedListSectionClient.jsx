'use client'

import React, { useRef, useState, useLayoutEffect, Fragment } from 'react' 
import { motion, useScroll, useMotionValueEvent } from 'framer-motion' 
import { useLenis } from 'lenis/react' 
import { easings } from '@/libs/constants/easings' 
import { ScrollAnimatedHeadline } from '@/components/animations/ScrollAnimatedHeadline' 
import { SanityMedia } from '@/components/sanity/SanityMedia' 
import { SanityImage } from '@/components/sanity/SanityImage' 

const easeInOut = easings.power3InOut;
const easeBackInOut = easings.backInOutSubtle;

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function increment(prev) {
  return prev + 1;
}

export function AnimatedListSectionClient({
  headline,
  label,
  text,
  items,
  variant = "standard",
  headlineDisplay,
  fixedMedia
}) {
  const isImageLeft = variant === "imageLeft";
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const itemRefs = useRef([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [rotationCount, setRotationCount] = useState(0);
  const [indicatorY, setIndicatorY] = useState(0);

  const lenis = useLenis();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const activeItem = itemRefs.current[activeIndex];
      const firstItem = itemRefs.current[0];

      if (activeItem && firstItem) {
        const firstRect = firstItem.getBoundingClientRect();
        setIndicatorY(activeItem.getBoundingClientRect().top - firstRect.top);
      }
    };

    updateIndicator();
    const rafId = requestAnimationFrame(updateIndicator);
    
    return () => cancelAnimationFrame(rafId);
  }, [activeIndex]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const totalItems = items.length;
    
    const newIndex = progress < 0.16666666666666666
      ? 0
      : Math.min(
          Math.floor((progress - 0.16666666666666666) / 0.8333333333333334 * (totalItems - 1)) + 1,
          totalItems - 1
        );

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
      setRotationCount(increment);
    }
  });

  const scrollToItem = (index) => {
    if (!containerRef.current || !lenis) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top;
    const scrollableHeight = container.scrollHeight - window.innerHeight;
    const maxIndex = items.length - 1;

    
    const targetScroll = absoluteTop + (index === 0
      ? 0.08333333333333333
      : 0.16666666666666666 + (0.8333333333333334 / maxIndex) * (index - 0.5)
    ) * scrollableHeight;

    lenis.scrollTo(targetScroll, {
      duration: 0.2,
      easing: easeOutCubic
    });
  };

  const renderImageItem = (item) => (
    <div key={item._key} className="h-full w-full flex-shrink-0">
      {item.image && (
        <SanityImage
          image={item.image}
          alt={item.image?.alt ?? item.headline ?? ""}
          className="[&_img]:!h-full [&_img]:!w-full h-full w-full [&_img]:absolute [&_img]:inset-0 [&_img]:object-cover"
        />
      )}
    </div>
  );

  return (
    <Fragment>
      {}
      <div ref={containerRef} className="relative hidden min-h-[320vh] py-64 lg:block lg:py-128">
        <div className="sticky top-0 flex h-screen items-center">
          <div className="grid-container">
            <div className="grid-layout">
              {isImageLeft ? (
                <Fragment>
                  <div className="lg:grid-start-2 lg:grid-span-4 flex flex-col justify-between gap-32">
                    <div>
                      {headline?.text && (
                        <ScrollAnimatedHeadline
                          headline={{
                            text: headline.text,
                            level: headline.level ?? "h2"
                          }}
                          displayAs={headlineDisplay ?? "h2"}
                        />
                      )}
                      {text && (
                        <p className="mt-16 text-body text-foreground-muted">{text}</p>
                      )}
                      {label && (
                        <span className="section-label mt-16 block">{label}</span>
                      )}
                    </div>
                    {fixedMedia && (
                      <div
                        className="overflow-hidden"
                        style={{ aspectRatio: fixedMedia.aspectRatio ?? "4/5" }}
                      >
                        <SanityMedia
                          media={fixedMedia}
                          className="[&_img]:!h-full [&_img]:!w-full h-full w-full [&_img]:absolute [&_img]:inset-0 [&_img]:object-cover"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div ref={contentRef} className="lg:grid-start-7 lg:grid-span-5 flex flex-col justify-center">
                    <div className="relative space-y-48">
                      <motion.div
                        className="absolute top-8 left-[28px] z-10 h-12 w-12 bg-brand"
                        animate={{ y: indicatorY, rotate: 90 * rotationCount }}
                        transition={{ duration: 0.8, ease: easeBackInOut }}
                      />
                      {items.map((item, index) => {
                        const isActive = index === activeIndex;
                        return (
                          <motion.div
                            key={item._key}
                            ref={(el) => { itemRefs.current[index] = el; }}
                            data-active={isActive}
                            className="flex cursor-pointer items-start gap-16 pl-16"
                            onClick={() => scrollToItem(index)}
                            animate={{ opacity: isActive ? 1 : 0.4, x: isActive ? 48 : 0 }}
                            transition={{ duration: 0.8, ease: easeInOut }}
                          >
                            <span className="mt-4 font-mono text-body text-foreground-muted">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <div className="flex-1">
                              <h3 className="mb-8 text-h4">{item.headline ?? ""}</h3>
                              <p className="text-body text-foreground-muted">{item.text ?? ""}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </Fragment>
              ) : (
                <div className="grid-start-3 grid-span-8 grid-subgrid">
                  <div className="grid-span-8 mb-64 flex items-end justify-between">
                    <div>
                      {headline?.text && (
                        <ScrollAnimatedHeadline
                          headline={{
                            text: headline.text,
                            level: headline.level ?? "h2"
                          }}
                          displayAs={headlineDisplay ?? "h2"}
                        />
                      )}
                      {text && (
                        <p className="mt-16 text-body text-foreground-muted">{text}</p>
                      )}
                    </div>
                    {label && (
                      <span className="section-label">{label}</span>
                    )}
                  </div>
                  
                  <div className="grid-span-8 flex">
                    <div ref={contentRef} className="flex flex-col justify-center lg:flex-[1.1] lg:pr-[10%]">
                      <div className="relative space-y-48">
                        <motion.div
                          className="absolute top-8 left-[28px] z-10 h-12 w-12 bg-brand"
                          animate={{ y: indicatorY, rotate: 90 * rotationCount }}
                          transition={{ duration: 0.8, ease: easeBackInOut }}
                        />
                        {items.map((item, index) => {
                          const isActive = index === activeIndex;
                          return (
                            <motion.div
                              key={item._key}
                              ref={(el) => { itemRefs.current[index] = el; }}
                              data-active={isActive}
                              className="flex cursor-pointer items-start gap-16 pl-16"
                              onClick={() => scrollToItem(index)}
                              animate={{ opacity: isActive ? 1 : 0.4, x: isActive ? 48 : 0 }}
                              transition={{ duration: 0.8, ease: easeInOut }}
                            >
                              <span className="mt-4 font-mono text-body text-foreground-muted">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <div className="flex-1">
                                <h3 className="mb-8 text-h4">{item.headline ?? ""}</h3>
                                <p className="text-body text-foreground-muted">{item.text ?? ""}</p>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="relative aspect-[4/5] flex-1 overflow-hidden">
                      <motion.div
                        className="flex h-full flex-col"
                        animate={{ y: `${-(100 * activeIndex)}%` }}
                        transition={{ duration: 0.8, ease: easeInOut }}
                      >
                        {items.map(renderImageItem)}
                      </motion.div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="grid-container py-64 lg:hidden">
        <div className="mb-32">
          {headline?.text && (
            <ScrollAnimatedHeadline
              headline={{ text: headline.text, level: headline.level ?? "h2" }}
              displayAs={headlineDisplay ?? "h2"}
              className="mb-16"
            />
          )}
          {label && (
            <span className="section-label">{label}</span>
          )}
          {text && (
            <p className="mt-16 text-body text-foreground-muted">{text}</p>
          )}
        </div>

        {isImageLeft && fixedMedia && (
          <div
            className="mb-48 overflow-hidden"
            style={{ aspectRatio: fixedMedia.aspectRatio ?? "4/5" }}
          >
            <SanityMedia media={fixedMedia} className="h-full w-full" />
          </div>
        )}

        <div className="space-y-48">
          {items.map((item, index) => (
            <div key={item._key} className="space-y-16">
              <div className="flex gap-16">
                <div className="flex items-start gap-12">
                  <div className="mt-8 h-12 w-12 bg-brand" />
                  <span className="mt-4 font-mono text-body-sm text-foreground-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="mb-8 text-h4">{item.headline ?? ""}</h3>
                  <p className="text-body text-foreground-muted">{item.text ?? ""}</p>
                </div>
              </div>
              
              {!isImageLeft && item.image && (
                <div className="aspect-[4/5] overflow-hidden">
                  <SanityImage
                    image={item.image}
                    alt={item.image?.alt ?? item.headline ?? ""}
                    className="h-full w-full"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
}