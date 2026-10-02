"use client";

import React, { useRef, useState, useCallback, useMemo } from 'react'; 
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger'; 
import { useIdleGSAP } from '@/hooks/useIdleGSAP'; 
import { ScrambleContext } from '@/contexts/ScrambleContext';

gsap.registerPlugin(ScrollTrigger);

export function ScrambleGroup(props) {
  const {
    children,
    stagger = 0.1,
    start = "top 80%",
    markers = false,
    manual = false,
    className
  } = props;

  const containerRef = useRef(null);
  const registryRef = useRef(new Map());
  const [hasTriggered, setHasTriggered] = useState(false);
  const isTriggeringRef = useRef(false);
  const scrollTriggerRef = useRef(null);

  const register = useCallback((id, callback) => {
    registryRef.current.set(id, callback);
  }, []);

  const unregister = useCallback((id) => {
    registryRef.current.delete(id);
  }, []);

  const triggerAll = useCallback((overrideStagger) => {
    if (isTriggeringRef.current) return;
    isTriggeringRef.current = true;

    const callbacks = Array.from(registryRef.current.values());
    const currentStagger = overrideStagger ?? stagger;

    callbacks.forEach((callback, index) => {
      gsap.delayedCall(index * currentStagger, () => {
        callback();
      });
    });

    setHasTriggered(true);
  }, [stagger]);

  useIdleGSAP(() => {
    if (manual || !containerRef.current) return;
    
    isTriggeringRef.current = false;

    const animation = gsap.to(containerRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: start,
        markers: markers,
        toggleActions: "play none none none"
      },
      onStart: () => {
        triggerAll();
      },
      duration: 0.001
    });

    scrollTriggerRef.current = animation.scrollTrigger ?? null;

    return () => {
      animation.kill();
      scrollTriggerRef.current?.kill();
    };
  }, {
    dependencies: [manual, start, markers, triggerAll]
  });

  const contextValue = useMemo(() => ({
    register,
    unregister,
    triggerAll,
    hasTriggered
  }), [register, unregister, triggerAll, hasTriggered]);

  return (
    <ScrambleContext.Provider value={contextValue}>
      <div ref={containerRef} className={className}>
        {children}
      </div>
    </ScrambleContext.Provider>
  );
}
