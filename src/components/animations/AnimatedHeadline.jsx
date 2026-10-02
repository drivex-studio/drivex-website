'use client'

import React, { forwardRef, useRef, useState, useLayoutEffect, useCallback, useImperativeHandle, Fragment } from 'react'; 
import gsap from 'gsap'; 
import { useGSAP } from '@gsap/react'; 
import { ScrollTrigger } from 'gsap/ScrollTrigger'; 
import { useIdleGSAP } from '@/hooks/useIdleGSAP'; 
import { cx } from '@/libs/utils/className'

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TEXT_STYLES = {
  display: "text-display",
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
  h4: "text-h4",
  h5: "text-h5",
  h6: "text-h6"
};

const AnimatedHeadline = forwardRef(({
  children,
  as: Component = "h1",
  displayAs,
  className,
  skip,
  trigger = "manual",
  wrapperClassName
}, ref) => {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);
  const hasRevealed = useRef(false);
  const [lines, setLines] = useState(null);
  const isReducedMotion = skip ?? window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const wordNodes = containerRef.current.querySelectorAll("[data-word]");
    if (wordNodes.length === 0) return;

    let currentLines = [];
    let currentLineWords = [];
    let lastTop = -Infinity;
    let lastExplicitLine = -1;

    for (const node of wordNodes) {
      const top = node.getBoundingClientRect().top;
      const explicitLine = Number(node.dataset.explicitLine ?? -1);
      const hasExplicitLine = explicitLine !== lastExplicitLine && lastExplicitLine !== -1;

      if ((lastTop > -Infinity && top - lastTop > 2) || hasExplicitLine) {
        currentLines.push(currentLineWords.join(" "));
        currentLineWords = [];
      }
      currentLineWords.push(node.textContent || "");
      lastTop = top;
      lastExplicitLine = explicitLine;
    }

    if (currentLineWords.length > 0) {
      currentLines.push(currentLineWords.join(" "));
    }
    setLines(currentLines);
  }, []);

  useGSAP(() => {
    if (isReducedMotion || !containerRef.current || !lines) return;
    const container = containerRef.current;
    
    gsap.set(container.querySelectorAll("[data-line-inner]"), {
      opacity: 0
    });
    gsap.set(container.querySelectorAll("[data-brand-rect], [data-fg-rect]"), {
      scaleX: 0,
      transformOrigin: "left"
    });
  }, {
    dependencies: [isReducedMotion, lines]
  });

  useIdleGSAP(() => {
    if (trigger !== "scroll" || isReducedMotion || !lines) return;
    const triggerEl = wrapperRef.current || containerRef.current;
    
    if (triggerEl) {
      ScrollTrigger.create({
        trigger: triggerEl,
        start: "top bottom",
        once: true,
        onEnter: () => reveal()
      });
    }
  }, {
    dependencies: [trigger, isReducedMotion, lines]
  });

  const reveal = useCallback((delay = 0) => {
    if (hasRevealed.current || isReducedMotion || !containerRef.current) return;
    hasRevealed.current = true;
    
    const lineNodes = containerRef.current.querySelectorAll("[data-line]");
    for (let i = 0; i < lineNodes.length; i++) {
      const lineNode = lineNodes[i];
      if (!lineNode) continue;

      const lineDelay = delay + 0.15 * i;
      const inner = lineNode.querySelector("[data-line-inner]");
      const brandRect = lineNode.querySelector("[data-brand-rect]");
      const fgRect = lineNode.querySelector("[data-fg-rect]");

      if (!inner || !brandRect || !fgRect) continue;

      const rects = [brandRect, fgRect];
      const tl = gsap.timeline({
        delay: lineDelay
      });

      tl.to(brandRect, { scaleX: 1, duration: 0.45, ease: "power3.inOut" }, 0);
      tl.to(fgRect, { scaleX: 1, duration: 0.45, ease: "power3.inOut" }, 0.1);
      tl.set(inner, { opacity: 1 }, 0.5);
      tl.set(rects, { transformOrigin: "right" }, 0.5);
      tl.to(fgRect, { scaleX: 0, duration: 0.45, ease: "power3.inOut" }, 0.5);
      tl.to(brandRect, { scaleX: 0, duration: 0.45, ease: "power3.inOut" }, 0.6);
    }
  }, [isReducedMotion]);

  const reset = useCallback(() => {
    hasRevealed.current = false;
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    gsap.set(container.querySelectorAll("[data-line-inner]"), {
      opacity: 0
    });
    gsap.set(container.querySelectorAll("[data-brand-rect], [data-fg-rect]"), {
      scaleX: 0,
      transformOrigin: "left"
    });
  }, []);

  useImperativeHandle(ref, () => ({
    reveal,
    reset
  }), [reveal, reset]);

  const combinedClassName = cx(TEXT_STYLES[displayAs ?? Component], className);

  if (!lines) {
    const splitChildren = children.split("\n");
    const renderedContent = (
      <Component ref={containerRef} className={combinedClassName}>
        {splitChildren.map((lineText, lineIdx) => (
          <Fragment key={lineIdx}>
            {lineIdx > 0 && <br />}
            {lineText.split(/\s+/).filter(Boolean).map((word, wordIdx) => (
              <Fragment key={wordIdx}>
                {wordIdx > 0 && " "}
                <span data-word data-explicit-line={lineIdx}>
                  {word}
                </span>
              </Fragment>
            ))}
          </Fragment>
        ))}
      </Component>
    );

    return trigger === "scroll" ? (
      <div ref={wrapperRef} className={wrapperClassName}>
        {renderedContent}
      </div>
    ) : renderedContent;
  }

  const renderedLines = (
    <Component ref={containerRef} className={combinedClassName}>
      {lines.map((lineText, lineIdx) => (
        <Fragment key={lineIdx}>
          {lineIdx > 0 && <br />}
          <div data-line={lineIdx} className="relative inline-block">
            <span data-line-inner className="block whitespace-nowrap">
              {lineText}
            </span>
            {!isReducedMotion && (
              <Fragment>
                <div data-brand-rect className="absolute -inset-x-[0.1em] -inset-y-[0.1em] bg-brand" />
                <div data-fg-rect className="absolute -inset-x-[0.1em] -inset-y-[0.1em] bg-foreground" />
              </Fragment>
            )}
          </div>
        </Fragment>
      ))}
    </Component>
  );

  return trigger === "scroll" ? (
    <div ref={wrapperRef} className={wrapperClassName}>
      {renderedLines}
    </div>
  ) : renderedLines;
});

AnimatedHeadline.displayName = "AnimatedHeadline";

export { AnimatedHeadline };
