'use client'

import React, { useRef, useEffect, useCallback } from 'react'
import { gsap, ScrambleTextPlugin, ScrollTrigger } from '@/libs/vendor'

const DEFAULT_CHARS = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

export default function useDualLayerScramble(defaultConfig) {
  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const originalTextRef = useRef("");
  const originalHTMLRef = useRef("");
  const originalDimensionsRef = useRef(null);
  const lineDataRef = useRef([]);
  const spanElementsRef = useRef([]);
  const isAnimatingRef = useRef(false);
  const isPreparedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const innerText = container.innerText ?? "";
    
    if (innerText.trim().length > 0) {
      originalTextRef.current = innerText;
      originalHTMLRef.current = container.innerHTML;
      originalDimensionsRef.current = {
        width: container.offsetWidth,
        height: container.offsetHeight
      };
    }
  }, []);

  const killTimeline = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
      isAnimatingRef.current = false;
    }
  }, []);

  const prepareText = useCallback(() => {
    if (!containerRef.current || isPreparedRef.current) return;
    
    const container = containerRef.current;
    if ((originalTextRef.current || container.innerText || "").trim().length === 0) return;
    
    if (!originalDimensionsRef.current) {
      originalDimensionsRef.current = {
        width: container.offsetWidth,
        height: container.offsetHeight
      };
    }

    const splitIntoLines = (element) => {
      const text = element.innerText || "";
      if (text.trim().length === 0) return [];
      if (text.includes("\n")) return text.split("\n").filter(line => line.length > 0);
      
      const textNode = element.firstChild;
      if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return [text];
      
      const range = document.createRange();
      const lines = [];
      let currentLine = "";
      let lastTop = null;
      const textLen = textNode.length;
      
      for (let i = 0; i < text.length && i < textLen; i++) {
        range.setStart(textNode, i);
        range.setEnd(textNode, i + 1);
        const rect = range.getBoundingClientRect();
        
        if (lastTop !== null && Math.abs(rect.top - lastTop) > 2) {
          if (currentLine.length > 0) lines.push(currentLine);
          currentLine = "";
        }
        currentLine += text[i];
        lastTop = rect.top;
      }
      
      if (currentLine.length > 0) lines.push(currentLine);
      return lines.length > 0 ? lines : [text];
    };

    const lines = splitIntoLines(container);
    
    const measureDiv = document.createElement("div");
    measureDiv.style.cssText = `
			position: absolute;
			visibility: hidden;
			pointer-events: none;
			white-space: nowrap;
		`;
    
    const computedStyle = window.getComputedStyle(container);
    measureDiv.style.font = computedStyle.font;
    measureDiv.style.fontSize = computedStyle.fontSize;
    measureDiv.style.fontFamily = computedStyle.fontFamily;
    measureDiv.style.fontWeight = computedStyle.fontWeight;
    measureDiv.style.letterSpacing = computedStyle.letterSpacing;
    measureDiv.style.textTransform = computedStyle.textTransform;
    
    document.body.appendChild(measureDiv);
    
    lineDataRef.current = lines.map(lineText => {
      measureDiv.textContent = lineText;
      return {
        text: lineText,
        width: measureDiv.offsetWidth,
        height: measureDiv.offsetHeight
      };
    });
    
    document.body.removeChild(measureDiv);

    const maxWidth = Math.max(...lineDataRef.current.map(data => data.width));
    const totalHeight = lineDataRef.current.reduce((sum, data) => sum + data.height, 0);
    const finalWidth = Math.max(originalDimensionsRef.current?.width ?? 0, maxWidth);
    const finalHeight = Math.max(originalDimensionsRef.current?.height ?? 0, totalHeight);

    isPreparedRef.current = true;
    
    gsap.set(container, {
      width: finalWidth,
      height: finalHeight,
      display: "inline-block",
      overflow: "hidden"
    });
    
    container.innerHTML = "";
    spanElementsRef.current = [];
    
    lineDataRef.current.forEach(data => {
      const span = document.createElement("span");
      span.style.cssText = `
				display: block;
				opacity: 0;
				width: ${data.width}px;
				height: ${data.height}px;
				overflow: hidden;
				white-space: nowrap;
			`;
      span.innerText = data.text;
      container.appendChild(span);
      spanElementsRef.current.push(span);
    });
    
    gsap.set(container, {
      opacity: 1
    });
  }, []);

  const scramble = useCallback((overrides) => {
    if (!containerRef.current) return null;
    if (isAnimatingRef.current) return timelineRef.current;
    
    prepareText();

    const config = {
      ...defaultConfig,
      ...overrides
    };
    
    const duration = config.duration ?? 1;
    const speed = config.speed ?? 1;
    const chars = config.chars ?? DEFAULT_CHARS;
    const firstColorClass = config.firstColorClass ?? "scramble-brand";
    const secondColorClass = config.secondColorClass ?? "scramble-foreground";
    const stagger = config.stagger ?? 0.08;
    
    const lineData = lineDataRef.current;
    const spans = spanElementsRef.current;

    if (lineData.length === 0 || spans.length === 0) return null;
    
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      spans.forEach((span, index) => {
        const data = lineData[index];
        if (data) {
          span.innerText = data.text;
        }
        span.style.opacity = "1";
        span.className = span.className.replace(/\bscramble-\w+\b/g, "");
      });
      config.onComplete?.();
      return null;
    }
    
    killTimeline();
    isAnimatingRef.current = true;
    
    timelineRef.current = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
        timelineRef.current = null;
        config.onComplete?.();
      }
    });

    spans.forEach((span, index) => {
      const data = lineData[index];
      if (!data) return;
      
      const originalText = data.text;
      const delay = index * stagger;
      
      const generateRandomText = (textStr, charSet = DEFAULT_CHARS) => {
        let randomStr = "";
        for (let i = 0; i < textStr.length; i++) {
          const char = textStr[i];
          if (char === " ") {
            randomStr += char;
          } else {
            randomStr += charSet[Math.floor(Math.random() * charSet.length)];
          }
        }
        return randomStr;
      };
      
      const randomText = generateRandomText(originalText, chars);
      const nonSpaceCount = originalText.replace(/\s/g, "").length;
      const blankText = originalText.replace(/[^\s]/g, " ");

      timelineRef.current?.add(() => {
        gsap.set(span, {
          opacity: 1
        });
        span.innerText = blankText;
      }, delay);

      timelineRef.current?.to(span, {
        duration: duration,
        scrambleText: {
          text: randomText,
          chars: chars,
          speed: speed,
          revealDelay: 0.1,
          oldClass: firstColorClass,
          newClass: firstColorClass
        },
        ease: "none"
      }, delay);

      timelineRef.current?.to(span, {
        duration: duration,
        scrambleText: {
          text: originalText,
          chars: chars,
          speed: speed,
          revealDelay: 0.1,
          oldClass: firstColorClass,
          newClass: secondColorClass
        },
        ease: "none"
      }, delay + (nonSpaceCount > 0 ? duration / nonSpaceCount : 0));
    });

    return timelineRef.current;
  }, [defaultConfig, killTimeline, prepareText]);

  const killAndReset = useCallback(() => {
    killTimeline();
    if (containerRef.current && isPreparedRef.current) {
      containerRef.current.innerHTML = originalHTMLRef.current || originalTextRef.current;
      gsap.set(containerRef.current, {
        opacity: 0,
        width: "auto",
        height: "auto",
        overflow: "visible"
      });
      spanElementsRef.current = [];
      lineDataRef.current = [];
      isPreparedRef.current = false;
    }
  }, [killTimeline]);

  useEffect(() => {
    return () => {
      killTimeline();
      spanElementsRef.current = [];
      lineDataRef.current = [];
      isPreparedRef.current = false;
    };
  }, [killTimeline]);

  return {
    ref: containerRef,
    scramble: scramble,
    kill: killAndReset,
    isAnimating: isAnimatingRef.current
  };
}