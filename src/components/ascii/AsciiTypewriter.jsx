'use client'
import {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";

import { AsciiCanvasRenderer } from "@/components/ascii/AsciiCanvasRenderer";
import { computeImageContentBounds } from "@/components/ascii/utils/computeImageContentBounds";

const DEFAULT_DURATION = 2000;

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function AsciiTypewriter({
  imageSrc,
  className,

  color = "#ff6b4a",

  cellSize,

  delay = 100,
  duration = DEFAULT_DURATION,
  colorDelay = 150,

  onComplete,

  alignX = "center",
  alignY = "bottom",

  fit = "cover",
  mobileFit,

  enableHover = false,
  hoverMode = "stretch",
  hoverIntensity,

  mouseX = 0,
  mouseY = 0,
  mouseRef,

  revealEnd = 0.85,
  randomness = 0.3,

  linear = false,

  enableGooeyReveal = false,
  gooeyRadius = 0.06,
  gooeySoftness = 0.08,
  gooeyNoiseIntensity = 0.03,

  isHovering = false,

  enableDepthParallax = false,
  depthMapSrc,
  parallaxIntensity = 0.02,

  externalProgress,
  externalColorProgress,
  disableInternalAnimation = false,

  colorDark,
  depthDetailMin,

  revealOrigin = {
    x: 0.5,
    y: 0.5
  },

  frameloop,
  debugLabel,
  dpr,

  skipContentBounds = false
}) {
  const effectRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [colorProgress, setColorProgress] = useState(0);

  const [reduceMotion, setReduceMotion] =
    useState(false);

  const [contentBoundsScale, setContentBoundsScale] =
    useState(1);

  const [clickPoint, setClickPoint] =
    useState(null);

  const [clickRadialInvert, setClickRadialInvert] =
    useState(null);

  const [rippleActive, setRippleActive] =
    useState(false);

  const [impactProgress, setImpactProgress] =
    useState(0);

  const animationCompletedRef =
    useRef(false);

  const clickAnimationRef =
    useRef(null);

  const impactAnimationRef =
    useRef(null);

  const revealedRef =
    useRef(false);

  const revealOriginRef =
    useRef(revealOrigin);

  revealOriginRef.current =
    revealOrigin;

  useEffect(() => {
    if (skipContentBounds) {
      return;
    }

    computeImageContentBounds(
      imageSrc,
      revealOrigin
    ).then((scale) => {
      setContentBoundsScale(scale);
    });
  }, [
    imageSrc,
    revealOrigin,
    skipContentBounds
  ]);

  useEffect(() => {
    const media =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    setReduceMotion(media.matches);

    const update = (event) => {
      setReduceMotion(event.matches);
    };

    media.addEventListener(
      "change",
      update
    );

    return () => {
      media.removeEventListener(
        "change",
        update
      );
    };
  }, []);

  const controlledAnimation =
    disableInternalAnimation &&
    externalProgress !== undefined;

  useEffect(() => {
    let frame;

    if (disableInternalAnimation) {
      animationCompletedRef.current = true;
      return;
    }

    if (reduceMotion) {
      setProgress(1);
      setColorProgress(1);

      animationCompletedRef.current = true;

      onComplete?.();

      return;
    }

    const startTime =
      performance.now();

    const update = (now) => {
      const elapsed =
        now - startTime - delay;

      if (elapsed < 0) {
        frame =
          requestAnimationFrame(
            update
          );
        return;
      }

      const t =
        Math.min(
          elapsed / duration,
          1
        );

      setProgress(
        linear
          ? t
          : easeOutCubic(t)
      );

      const colorElapsed =
        elapsed - colorDelay;

      if (colorElapsed > 0) {
        const colorT =
          Math.min(
            colorElapsed /
              duration,
            1
          );

        setColorProgress(
          linear
            ? colorT
            : easeOutCubic(colorT)
        );
      }

      const colorFinished =
        colorElapsed >=
        duration;

      if (
        t < 1 ||
        !colorFinished
      ) {
        frame =
          requestAnimationFrame(
            update
          );
      } else {
        animationCompletedRef.current =
          true;

        onComplete?.();
      }
    };

    frame =
      requestAnimationFrame(
        update
      );

    return () => {
      if (frame) {
        cancelAnimationFrame(
          frame
        );
      }
    };
  }, [
    delay,
    duration,
    colorDelay,
    linear,
    reduceMotion,
    onComplete,
    disableInternalAnimation
  ]);

  const triggerImpact =
    useRef(() => {});

  triggerImpact.current = () => {
    if (reduceMotion) {
      return;
    }

    if (
      impactAnimationRef.current
    ) {
      cancelAnimationFrame(
        impactAnimationRef.current
      );
    }

    setImpactProgress(0);

    const start =
      performance.now();

    const animate =
      (time) => {
        const t =
          Math.min(
            (time - start) /
              500,
            1
          );

        setImpactProgress(
          Math.sin(
            t * Math.PI * 0.5
          )
        );

        if (t < 1) {
          impactAnimationRef.current =
            requestAnimationFrame(
              animate
            );
        } else {
          impactAnimationRef.current =
            null;
        }
      };

    impactAnimationRef.current =
      requestAnimationFrame(
        animate
      );
  };

  const handleClick =
    useCallback(
      (event) => {
        if (
          !animationCompletedRef.current
        ) {
          return;
        }

        const rect =
          event.currentTarget.getBoundingClientRect();

        const x =
          (event.clientX -
            rect.left) /
          rect.width;

        const y =
          1 -
          (event.clientY -
            rect.top) /
          rect.height;

        setClickPoint({
          x,
          y
        });

        triggerImpact.current();

        setRippleActive(
          true
        );
      },
      []
    );

  const effectiveColorProgress =
    clickRadialInvert !== null
      ? clickRadialInvert
      : reduceMotion
      ? 1
      : controlledAnimation
      ? (
          externalColorProgress ??
          externalProgress
        )
      : colorProgress;

  return (
    <div
      onClick={handleClick}
      className="size-full cursor-pointer"
    >
      <AsciiCanvasRenderer
        imageSrc={imageSrc}
        className={className}
        color={color}
        cellSize={cellSize}
        progress={
          (
            reduceMotion
              ? 1
              : controlledAnimation
              ? externalProgress
              : progress
          ) *
          contentBoundsScale
        }
        colorProgress={
          effectiveColorProgress *
          contentBoundsScale
        }
        randomness={randomness}
        revealDirection={
          alignX === "right"
            ? -1
            : 1
        }
        revealEnd={revealEnd}
        effectRef={effectRef}
        alignX={alignX}
        alignY={alignY}
        fit={fit}
        mobileFit={mobileFit}
        enableHover={enableHover}
        hoverMode={hoverMode}
        hoverIntensity={
          hoverIntensity
        }
        mouseX={mouseX}
        mouseY={mouseY}
        mouseRef={mouseRef}
        enableGooeyReveal={
          enableGooeyReveal
        }
        gooeyRadius={
          gooeyRadius
        }
        gooeySoftness={
          gooeySoftness
        }
        gooeyNoiseIntensity={
          gooeyNoiseIntensity
        }
        isHovering={
          isHovering
        }
        enableDepthParallax={
          enableDepthParallax
        }
        depthMapSrc={
          depthMapSrc
        }
        parallaxIntensity={
          parallaxIntensity
        }
        clickPoint={
          clickPoint
        }
        clickRadialInvert={
          rippleActive
        }
        impactProgress={
          impactProgress
        }
        revealOrigin={
          revealOrigin
        }
        colorDark={colorDark}
        depthDetailMin={
          depthDetailMin
        }
        frameloop={frameloop}
        debugLabel={debugLabel}
        dpr={dpr}
      />
    </div>
  );
}
