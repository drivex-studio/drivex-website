'use client'

import React, { useRef, useMemo } from 'react'; 
import { gsap } from '@/libs/vendor'; 
import { useGSAP } from '@gsap/react'; 
import { cx } from '@/libs/utils/className'; 
import { AnimatedHeadline } from '@/components/animations/AnimatedHeadline'; 
import { AnimatedSubtext } from '@/components/animations/AnimatedSubtext'; 
import { usePageEnter } from '@/hooks/usePageEnter'; 
import { usePageEnterContext } from '@/providers/PageEnterProvider'

gsap.registerPlugin(useGSAP);

export function HeroTextOnly({
  headline,
  headlineLevel,
  headlineDisplay,
  subtext,
  className
}) {
  const containerRef = useRef(null);
  const subtextRef = useRef(null);
  const hasRevealed = useRef(false);
  const { prefersReducedMotion } = usePageEnterContext();
  const headlineRef = useRef(null);

  const { contextSafe } = useGSAP(() => {}, {
    scope: containerRef,
    dependencies: [prefersReducedMotion]
  });

  const reveal = useMemo(() => contextSafe((baseDelay) => {
    if (hasRevealed.current) return;
    
    hasRevealed.current = true;
    const headlineDelay = baseDelay + 0.3;
    
    headlineRef.current?.reveal(headlineDelay);
    subtextRef.current?.reveal(headlineDelay + 0.15);
  }), [contextSafe]);

  usePageEnter(reveal, { priority: 1, skip: prefersReducedMotion });

  return (
    <div ref={containerRef} className={cx("grid-container", className)}>
      <div className="grid-layout items-center justify-center">
        <div className="grid-span-12 lg:grid-span-10 lg:grid-start-2 flex flex-col items-center gap-16 text-center lg:gap-24">
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
              className="max-w-2xl text-body text-foreground-muted"
              skip={prefersReducedMotion}
            >
              {subtext}
            </AnimatedSubtext>
          )}
        </div>
      </div>
    </div>
  );
}