'use client'
import { useState, useEffect } from 'react'; 
import { useGSAP } from '@gsap/react'; 
import { usePageTransition } from '@/hooks/usePageTransition'; 

export function useIdleGSAP(callback, options) {
  const { phase } = usePageTransition();
  const [isIdle, setIsIdle] = useState(phase === "idle");

  useEffect(() => {
    if (phase === "idle") {
      setIsIdle(true);
    } else if (phase === "holding") {
      setIsIdle(false);
    }
  }, [phase]);

  useGSAP(
    (e_ctx, i_safe) => {
      if (isIdle) {
        return callback(e_ctx, i_safe);
      }
    },
    {
      ...options,
      dependencies: [...(options?.dependencies ?? []), isIdle],
    }
  );
}