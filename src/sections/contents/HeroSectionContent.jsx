

'use client'

import React, { useRef, useMemo } from 'react'; 
import { gsap } from '@/libs/vendor'; 
import { useGSAP } from '@gsap/react'; 
import { cx } from '@/libs/utils/className'; 

import { AnimatedHeadline } from '@animations/AnimatedHeadline'; 
import { AnimatedSubtext } from '@animations/AnimatedSubtext'; 
import { ButtonGroup } from '@/components/ui/ButtonGroup'; 
import { useAsciiDelay } from '@/hooks/useAsciiDelay'; 

import { usePageEnter } from '@/hooks/usePageEnter'; 
import { usePageEnterContext } from '@/providers/PageEnterProvider'; 
import { SanityImage } from '@/components/sanity/SanityImage'; 
import { LOGO_HEIGHTS, getLogoSizeVars } from '@/sections/utils/logoSizeVars'; 
// import '@/styles/hero-section.css'; 


export function HeroSectionContent({
  className,
  headline,
  headlineLevel,
  headlineDisplay,
  subtext,
  ctas,
  trustedBy,
  children
}) {
  const containerRef = useRef(null);
  const subtextRef = useRef(null);
  const ctasRef = useRef(null);
  const trustedByTitleRef = useRef(null);
  const trustedByItemsRef = useRef([]);
  const hasRevealedRef = useRef(false);

  const { prefersReducedMotion } = usePageEnterContext();
  const headlineRef = useRef(null);
  const asciiDelay = useAsciiDelay();

  const { contextSafe } = useGSAP(() => {
    if (prefersReducedMotion) return;

    const elementsToHide = [
      ctasRef.current,
      trustedByTitleRef.current,
      ...trustedByItemsRef.current
    ].filter(Boolean);

    gsap.set(elementsToHide, { opacity: 0, y: 20 });
  }, { 
    scope: containerRef, 
    dependencies: [prefersReducedMotion] 
  });

  const revealContent = useMemo(() => contextSafe((delayOffset) => {
    if (hasRevealedRef.current) return;
    hasRevealedRef.current = true;

    const totalDelay = delayOffset + asciiDelay;

    headlineRef.current?.reveal(totalDelay);
    subtextRef.current?.reveal(totalDelay + 0.15);

    const tl = gsap.timeline({ delay: totalDelay + 0.2 });

    if (ctasRef.current) {
      tl.to(ctasRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.1);
    }

    if (trustedByTitleRef.current) {
      tl.to(trustedByTitleRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.2);
    }

    const validItems = trustedByItemsRef.current.filter(Boolean);

    if (validItems.length > 0) {
      tl.to(validItems, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.08,
        onComplete: () => {
          for (const item of validItems) {
            if (item) gsap.set(item, { clearProps: "y,opacity" });
          }
        }
      }, 0.3);
    }
  }), [contextSafe, asciiDelay]);

  usePageEnter(revealContent, { priority: 1, skip: prefersReducedMotion });

  return (
    <div ref={containerRef} className={cx(className)}>
      <div className="grid-span-12 lg:grid-span-8 flex flex-col justify-start gap-24 pt-24 lg:mt-auto lg:mb-auto lg:justify-center lg:gap-32 lg:pt-0">
        {headline && (
          <AnimatedHeadline
            ref={headlineRef}
            as={headlineLevel ?? "h1"}
            displayAs={headlineDisplay ?? undefined}
            className="text-foreground"
            skip={prefersReducedMotion}
          >
            {headline}
          </AnimatedHeadline>
        )}

        {subtext && (
          <AnimatedSubtext
            ref={subtextRef}
            className="max-w-xl text-body-sm text-foreground lg:text-body lg:text-foreground-muted"
            skip={prefersReducedMotion}
          >
            {subtext}
          </AnimatedSubtext>
        )}

        <div ref={ctasRef} className="pointer-events-auto">
          {ctas && <ButtonGroup buttonGroup={ctas} />}
        </div>
      </div>

      {children}

      {trustedBy?.items && trustedBy.items.length > 0 && (
        <div className="grid-span-12 lg:grid-span-7 pointer-events-auto mt-32 flex flex-col items-center gap-16 text-center lg:mt-0 lg:flex-row lg:items-center lg:text-left">
          {trustedBy.title && (
            <div ref={trustedByTitleRef} className="max-w-auto shrink-0 lg:max-w-240">
              <p className="text-accent-sm text-foreground-muted">{trustedBy.title}</p>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-8 lg:justify-start lg:gap-x-16">
            {trustedBy.items.map((item, index) => {
              if (item._type === "image" && item.image) {
                const variant = item.variant ?? "horizontal";
                const { desktop: desktopHeight } = LOGO_HEIGHTS[variant];

                return (
                  <span
                    ref={el => { trustedByItemsRef.current[index] = el; }}
                    style={getLogoSizeVars(variant)}
                    key={item._key}
                  >
                    <SanityImage
                      image={item.image}
                      alt={item.alt ?? "Client logo"}
                      height={desktopHeight}
                      priority={true}
                      className="[&_img]:!h-(--logo-h) [&_img]:!w-auto [&_img]:!object-contain sm:[&_img]:!h-(--logo-h-desktop) h-auto w-auto grayscale transition-all hover:grayscale-0"
                    />
                  </span>
                );
              }

              if (item._type === "svgItem" && item.svgCode) {
                const variant = item.variant ?? "horizontal";

                return (
                  <span
                    ref={el => { trustedByItemsRef.current[index] = el; }}
                    role="img"
                    aria-label={item.alt ?? "Client logo"}
                    style={getLogoSizeVars(variant)}
                    className="block h-(--logo-h) text-foreground-muted transition-colors hover:text-foreground sm:h-(--logo-h-desktop) [&_svg]:h-full [&_svg]:w-auto"
                    dangerouslySetInnerHTML={{ __html: item.svgCode }}
                    key={item._key}
                  />
                );
              }

              if (item._type === "textItem" && item.text) {
                return (
                  <span
                    ref={el => { trustedByItemsRef.current[index] = el; }}
                    className="text-accent-sm text-foreground-muted"
                    key={item._key}
                  >
                    {item.text}
                  </span>
                );
              }

              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

gsap.registerPlugin(useGSAP);