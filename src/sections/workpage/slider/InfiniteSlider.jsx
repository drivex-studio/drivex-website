'use client'
import React, { forwardRef, useRef, useState, useMemo, useEffect, useCallback, useImperativeHandle } from 'react'; 
import { useGSAP } from '@gsap/react'; 
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable'; 
import { InertiaPlugin } from 'gsap/InertiaPlugin'; 
import { animate } from 'framer-motion'; 
import { useMotionValue } from 'framer-motion'; 
import { useMotionValueEvent } from 'framer-motion'; 
import { easings } from '@/libs/constants/easings'; 
import { cx } from '@/libs/utils/className'; 
import { SliderItem } from '@/sections/workpage/slider/SliderItem';

gsap.registerPlugin(useGSAP, Draggable, InertiaPlugin);

const power4InOut = easings?.power4InOut || [0.77, 0, 0.175, 1]; 
export const InfiniteSlider = forwardRef(function InfiniteSlider({ items, onIndexChange, className, scrambleKey }, ref) {
  const containerRef = useRef(null);
  const dragProxyRef = useRef(null);
  const draggablesRef = useRef(null);
  const startDragX = useRef(0);
  const scrambleApisRef = useRef(new Map());
  const hasTriggeredScrambleRef = useRef(false);

  useEffect(() => {
    if (scrambleKey === undefined) return;
    const timeout = setTimeout(() => {
      Array.from(scrambleApisRef.current.values()).forEach((api, idx) => {
        setTimeout(() => api(), 80 * idx);
      });
      hasTriggeredScrambleRef.current = true;
    }, 100);
    return () => clearTimeout(timeout);
  }, [scrambleKey]);

  const [metrics, setMetrics] = useState({
    containerWidth: 0,
    slideWidth: 0,
    wrapWidth: 0,
    centerOffset: 0
  });

  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const dragDistance = useRef(0);
  const itemsCount = items.length;
  
  const rawX = useMotionValue(0);
  const springX = useMotionValue(0);
  
  const currentLogicalIndex = useRef(0);
  const metricsRef = useRef(metrics);
  useEffect(() => { metricsRef.current = metrics; }, [metrics]);

  const { extendedItems, cloneOffset } = useMemo(() => {
    if (itemsCount === 0) return { extendedItems: [], cloneOffset: 0 };
    return {
      extendedItems: [
        ...items.map((item, idx) => ({ ...item, _id: `clone-before-${item._id}`, originalIndex: idx, isClone: true })),
        ...items.map((item, idx) => ({ ...item, originalIndex: idx, isClone: false })),
        ...items.map((item, idx) => ({ ...item, _id: `clone-after-${item._id}`, originalIndex: idx, isClone: true }))
      ],
      cloneOffset: itemsCount
    };
  }, [items, itemsCount]);

  const totalWidth = extendedItems.length * metrics.wrapWidth;

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry && entry.contentRect.width > 0) {
        const width = entry.contentRect.width;
        const visibleSlides = window.matchMedia("(max-width: 767px)").matches ? 1.1 : 2;
        const slideW = (width - 16 * (Math.ceil(visibleSlides) - 1)) / visibleSlides;
        setMetrics({
          containerWidth: width,
          slideWidth: slideW,
          wrapWidth: slideW + 16,
          centerOffset: (width - slideW) / 2
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (metrics.wrapWidth === 0) return;
    const startX = -cloneOffset * metrics.wrapWidth;
    rawX.set(startX);
    springX.set(startX);
    if (dragProxyRef.current) gsap.set(dragProxyRef.current, { x: startX });
  }, [cloneOffset, metrics.wrapWidth, rawX, springX]);

  const normalizeIndex = useCallback((index) => ((index % itemsCount) + itemsCount) % itemsCount, [itemsCount]);

  useMotionValueEvent(springX, "change", (val) => {
    if (metrics.wrapWidth === 0) return;
    const idx = normalizeIndex(Math.round(-val / metrics.wrapWidth));
    if (idx !== currentLogicalIndex.current) {
      currentLogicalIndex.current = idx;
      onIndexChange(idx);
    }
  });

  const animateToX = useCallback((targetX) => {
    rawX.set(targetX);
    animate(springX, targetX, { duration: 0.8, ease: power4InOut });
    if (dragProxyRef.current) gsap.set(dragProxyRef.current, { x: targetX });
  }, [rawX, springX]);

  const goToNext = useCallback(() => {
    if (isDraggingRef.current || itemsCount === 0 || metrics.wrapWidth === 0) return;
    animateToX(rawX.get() - metrics.wrapWidth);
  }, [itemsCount, metrics.wrapWidth, rawX, animateToX]);

  const goToPrev = useCallback(() => {
    if (isDraggingRef.current || itemsCount === 0 || metrics.wrapWidth === 0) return;
    animateToX(rawX.get() + metrics.wrapWidth);
  }, [itemsCount, metrics.wrapWidth, rawX, animateToX]);

  const goToSlide = useCallback((targetIdx) => {
    if (isDraggingRef.current || itemsCount === 0 || metrics.wrapWidth === 0) return;
    const currentIdx = normalizeIndex(targetIdx);
    const currentX = rawX.get();
    let diff = (currentIdx - normalizeIndex(Math.round(-currentX / metrics.wrapWidth)) + itemsCount) % itemsCount;
    if (diff === 0) diff = itemsCount;
    animateToX(currentX - diff * metrics.wrapWidth);
  }, [itemsCount, normalizeIndex, animateToX, rawX, metrics.wrapWidth]);

  useImperativeHandle(ref, () => ({ goToSlide, goToNext, goToPrev }), [goToSlide, goToNext, goToPrev]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") goToPrev();
      else if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrev, goToNext]);

  useGSAP(() => {
    if (!dragProxyRef.current || !containerRef.current || metrics.wrapWidth === 0) return;
    const snapStep = metrics.wrapWidth;
    
    if (draggablesRef.current) {
      draggablesRef.current.forEach((d) => d.kill());
      draggablesRef.current = null;
    }

    const currentX = rawX.get();
    gsap.set(dragProxyRef.current, { x: currentX });

    draggablesRef.current = Draggable.create(dragProxyRef.current, {
      type: "x",
      trigger: containerRef.current,
      inertia: true,
      throwResistance: 1500,
      maxDuration: 1,
      minDuration: 0.2,
      overshootTolerance: 0,
      snap: { x: (val) => Math.round(val / snapStep) * snapStep },
      onPress: function() {
        hasDraggedRef.current = false;
        dragDistance.current = 0;
      },
      onDragStart: function() {
        isDraggingRef.current = true;
        hasDraggedRef.current = false;
        startDragX.current = this.x;
        dragDistance.current = 0;
      },
      onDrag: function() {
        const dist = Math.abs(this.x - startDragX.current);
        dragDistance.current = dist;
        if (dist > 10) hasDraggedRef.current = true;
        rawX.set(this.x);
        springX.set(this.x);
      },
      onThrowUpdate: function() {
        rawX.set(this.x);
        springX.set(this.x);
      },
      onDragEnd: function() {
        if (this.tween === undefined) {
          setTimeout(() => {
            isDraggingRef.current = false;
            setTimeout(() => { hasDraggedRef.current = false; }, 100);
          }, 10);
        }
      },
      onThrowComplete: function() {
        rawX.set(this.x);
        springX.set(this.x);
        isDraggingRef.current = false;
        setTimeout(() => { hasDraggedRef.current = false; }, 100);
      }
    });
    
    if (draggablesRef.current[0]) draggablesRef.current[0].update();
  }, { dependencies: [metrics.wrapWidth], scope: containerRef });

  const registerScramble = useCallback((idx, api) => {
    scrambleApisRef.current.set(idx, api);
  }, []);

  const isReady = itemsCount > 0 && metrics.containerWidth > 0;

  return (
    <div className={cx("relative", className)}>
      <div ref={dragProxyRef} className="pointer-events-none invisible absolute" style={{ width: 1, height: 1 }} />
      <div ref={containerRef} className="relative cursor-grab touch-pan-y overflow-x-clip active:cursor-grabbing">
        {isReady && (
          <React.Fragment>
            <div className="pointer-events-none invisible" style={{ width: metrics.slideWidth }}>
              <div className="relative w-full" style={{ paddingBottom: "66.67%" }} />
              <div className="mt-16 h-24" />
            </div>
            {extendedItems.map((item, index) => (
              <SliderItem
                key={item._id}
                item={item}
                index={index}
                springX={springX}
                slideWidth={metrics.slideWidth}
                wrapWidth={metrics.wrapWidth}
                centerOffset={metrics.centerOffset}
                totalWidth={totalWidth}
                containerWidth={metrics.containerWidth}
                onRegisterScramble={registerScramble}
                isDraggingRef={isDraggingRef}
                hasDraggedRef={hasDraggedRef}
              />
            ))}
          </React.Fragment>
        )}
      </div>
    </div>
  );
});