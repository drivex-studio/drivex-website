'use client'
import { useCallback, useEffect, useRef, useState } from "react";
import { AsciiCanvasRenderer } from "@/components/ascii/AsciiCanvasRenderer";
import { computeImageContentBounds } from "@/components/ascii/utils/computeImageContentBounds";
import { cx } from "@/libs/utils/className";
import { ASCII_ANIMATION_DURATION } from "@/libs/constants/config";

const DEFAULT_DURATION = 1000 * ASCII_ANIMATION_DURATION;
const DEFAULT_REVEAL_ORIGIN = { x: 0.5, y: 0.5 };

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
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
  revealOrigin = DEFAULT_REVEAL_ORIGIN,
  frameloop,
  debugLabel,
  dpr,
  skipContentBounds = false
}) {
  const effectRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [colorProgress, setColorProgress] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [contentBoundsScale, setContentBoundsScale] = useState(1);

  // click toggle state
  const [colorOverride, setColorOverride] = useState(null);
  const [clickPoint, setClickPoint] = useState(null);
  const [rippleActive, setRippleActive] = useState(false);
  const [impactProgress, setImpactProgress] = useState(0);

  const revealedRef = useRef(false);
  const colorAnimRef = useRef(null);
  const impactAnimRef = useRef(null);
  const animationCompletedRef = useRef(false);
  const lastClickTimeRef = useRef(0);
  const revealOriginRef = useRef(revealOrigin);
  revealOriginRef.current = revealOrigin;

  const containerRef = useRef(null);
  const isInViewRef = useRef(false);

  useEffect(() => {
    if (skipContentBounds) return;

    computeImageContentBounds(imageSrc, revealOrigin).then((scale) => {
      setContentBoundsScale(scale);
    });
  }, [imageSrc, revealOrigin.x, revealOrigin.y, revealOrigin, skipContentBounds]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    setReduceMotion(media.matches);

    const update = (event) => setReduceMotion(event.matches);

    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  const controlledAnimation =
    disableInternalAnimation && externalProgress !== undefined;

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

    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime - delay;

      if (elapsed < 0) {
        frame = requestAnimationFrame(tick);
        return;
      }

      const t = Math.min(elapsed / duration, 1);

      setProgress(linear ? t : easeOutCubic(t));

      const colorElapsed = elapsed - colorDelay;

      if (colorElapsed > 0) {
        const colorT = Math.min(colorElapsed / duration, 1);

        setColorProgress(linear ? colorT : easeOutCubic(colorT));
      }

      const colorFinished = colorElapsed >= duration;

      if (t < 1 || !colorFinished) {
        frame = requestAnimationFrame(tick);
      } else {
        animationCompletedRef.current = true;
        onComplete?.();
      }
    };

    frame = requestAnimationFrame(tick);

    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, [delay, duration, colorDelay, linear, reduceMotion, onComplete, disableInternalAnimation]);

  // toggles the color reveal (click / "C" key)
  const toggleReveal = useRef(() => {});

  toggleReveal.current = (point, wait = 0) => {
    if (!animationCompletedRef.current || colorAnimRef.current !== null) return;

    const revealing = !revealedRef.current;

    revealedRef.current = revealing;

    const stamp = performance.now();

    lastClickTimeRef.current = stamp;

    setClickPoint(point);

    if (point) setRippleActive(revealing);

    if (reduceMotion) {
      setColorOverride(+!revealing);
      setClickPoint(null);
      setRippleActive(false);
      return;
    }

    const run = () => {
      const startedAt = performance.now();
      const from = +!!revealing;
      const to = +!revealing;

      const step = (now) => {
        const t = Math.min((now - startedAt) / duration, 1);

        setColorOverride(from + (to - from) * easeOutCubic(t));

        if (t < 1) {
          colorAnimRef.current = requestAnimationFrame(step);
        } else {
          colorAnimRef.current = null;

          if (lastClickTimeRef.current === stamp) {
            setClickPoint(null);
            setRippleActive(false);
          }
        }
      };

      colorAnimRef.current = requestAnimationFrame(step);
    };

    if (wait > 0) {
      setTimeout(run, wait);
    } else {
      run();
    }
  };

  const triggerImpact = useRef(() => {});

  triggerImpact.current = () => {
    if (reduceMotion) return;

    if (impactAnimRef.current !== null) {
      cancelAnimationFrame(impactAnimRef.current);
    }

    setImpactProgress(0);

    const startedAt = performance.now();

    const step = (now) => {
      const t = Math.min((now - startedAt) / 500, 1);

      setImpactProgress(Math.sin((t * Math.PI) / 2));

      impactAnimRef.current = t < 1 ? requestAnimationFrame(step) : null;
    };

    impactAnimRef.current = requestAnimationFrame(step);
  };

  // "C" key shortcut (only while the component is in view)
  useEffect(() => {
    const onKeyDown = (event) => {
      if (
        (event.key !== "c" && event.key !== "C") ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      ) {
        return;
      }

      const tag = event.target?.tagName;

      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        event.target?.isContentEditable
      ) {
        return;
      }

      if (isInViewRef.current) {
        lastClickTimeRef.current = performance.now();
        setClickPoint(revealOriginRef.current);
        triggerImpact.current();
        toggleReveal.current(revealOriginRef.current);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // cancel running animations on unmount
  useEffect(
    () => () => {
      if (colorAnimRef.current !== null) {
        cancelAnimationFrame(colorAnimRef.current);
        colorAnimRef.current = null;
      }

      if (impactAnimRef.current !== null) {
        cancelAnimationFrame(impactAnimRef.current);
        impactAnimRef.current = null;
      }
    },
    []
  );

  useEffect(() => {
    const element = containerRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) isInViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const handleClick = useCallback((event) => {
    if (!animationCompletedRef.current || colorAnimRef.current !== null) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = 1 - (event.clientY - rect.top) / rect.height;

    lastClickTimeRef.current = performance.now();

    setClickPoint({ x, y });
    triggerImpact.current();
    toggleReveal.current({ x, y });
  }, []);

  const effectiveColorProgress =
    colorOverride !== null
      ? colorOverride
      : reduceMotion
      ? 1
      : controlledAnimation
      ? externalColorProgress ?? externalProgress
      : colorProgress;

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="size-full cursor-pointer"
    >
      <AsciiCanvasRenderer
        imageSrc={imageSrc}
        className={cx("size-full", className)}
        color={color}
        {...(cellSize !== undefined && { cellSize })}
        progress={
          (reduceMotion ? 1 : controlledAnimation ? externalProgress : progress) *
          contentBoundsScale
        }
        colorProgress={effectiveColorProgress * contentBoundsScale}
        randomness={randomness}
        revealDirection={alignX === "right" ? -1 : 1}
        revealEnd={revealEnd}
        effectRef={effectRef}
        alignX={alignX}
        alignY={alignY}
        fit={fit}
        mobileFit={mobileFit}
        enableHover={enableHover}
        hoverMode={hoverMode}
        hoverIntensity={hoverIntensity}
        mouseX={mouseX}
        mouseY={mouseY}
        mouseRef={mouseRef}
        enableGooeyReveal={enableGooeyReveal}
        gooeyRadius={gooeyRadius}
        gooeySoftness={gooeySoftness}
        gooeyNoiseIntensity={gooeyNoiseIntensity}
        isHovering={isHovering}
        enableDepthParallax={enableDepthParallax}
        depthMapSrc={depthMapSrc}
        parallaxIntensity={parallaxIntensity}
        clickPoint={clickPoint}
        clickRadialInvert={rippleActive}
        impactProgress={impactProgress}
        revealOrigin={revealOrigin}
        {...(colorDark !== undefined && { colorDark })}
        {...(depthDetailMin !== undefined && { depthDetailMin })}
        {...(frameloop !== undefined && { frameloop })}
        {...(dpr !== undefined && { dpr })}
      />
    </div>
  );
}
