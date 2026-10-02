'use client'
import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";

export function DemandFrameInvalidator({
  frameloop
}) {
  const invalidate =
    useThree((state) => state.invalidate);

  const hasTriggered =
    useRef(false);

  useEffect(() => {
    if (
      frameloop !== "demand" ||
      hasTriggered.current
    ) {
      return;
    }

    hasTriggered.current = true;

    if (
      typeof requestIdleCallback ===
      "function"
    ) {
      const id =
        requestIdleCallback(() => {
          invalidate();
        });

      return () => {
        cancelIdleCallback(id);
      };
    }

    const timeout =
      setTimeout(() => {
        invalidate();
      }, 0);

    return () => {
      clearTimeout(timeout);
    };
  }, [frameloop, invalidate]);

  return null;
}
