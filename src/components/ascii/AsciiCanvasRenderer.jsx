'use client'
import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import { Canvas } from "@react-three/fiber";

import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";

import { HoverImagePlane } from "@/components/ascii/HoverImagePlane";
import { AsciiEffectPass } from "@/components/ascii/AsciiEffectPass";
import { DemandFrameInvalidator } from "@/components/ascii/DemandFrameInvalidator";

const DEFAULT_CHARS =
  " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";

export function AsciiCanvasRenderer({
  imageSrc,
  className,

  characters = DEFAULT_CHARS,

  fontSize = 54,
  cellSize = 20,

  color = "#ff6b4a",

  invert = false,

  progress = 1,
  colorProgress = 1,

  randomness = 0.3,

  revealDirection = 1,
  revealEnd = 0.85,

  effectRef,

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

  enableGooeyReveal = false,
  gooeyRadius = 0.15,
  gooeySoftness = 0.08,
  gooeyNoiseIntensity = 0.03,

  isHovering = false,

  enableDepthParallax = false,
  depthMapSrc,
  parallaxIntensity = 0.02,

  colorDark,
  depthDetailMin,

  clickPoint,
  clickRadialInvert,
  impactProgress,

  revealOrigin = {
    x: 0.5,
    y: 0.5
  },

  frameloop = "always",

  debugLabel,

  dpr = [1, 1.5]
}) {
  const containerRef = useRef(null);

  const [responsiveCellSize, setResponsiveCellSize] =
    useState(cellSize);

  const [isVisible, setIsVisible] =
    useState(true);

  const isTouchDevice =
    useIsTouchDevice();

  const actualFit =
    isTouchDevice && mobileFit
      ? mobileFit
      : fit;

  const actualHoverIntensity =
    hoverIntensity ??
    (
      hoverMode === "headTurn"
        ? 0.04
        : 0.15
    );

  useEffect(() => {
    if (frameloop !== "always") {
      return;
    }

    const element =
      containerRef.current;

    if (!element) {
      return;
    }

    let hideTimer = null;

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (!entry) return;

          if (entry.isIntersecting) {
            if (hideTimer) {
              clearTimeout(hideTimer);
              hideTimer = null;
            }

            setIsVisible(true);
          } else {
            hideTimer = setTimeout(() => {
              setIsVisible(false);
            }, 500);
          }
        },
        {
          rootMargin:
            "200px 0px"
        }
      );

    observer.observe(element);

    return () => {
      observer.disconnect();

      if (hideTimer) {
        clearTimeout(hideTimer);
      }
    };
  }, [frameloop]);

  useEffect(() => {
    const container =
      containerRef.current;

    if (!container) {
      return;
    }

    const updateCellSize = () => {
      const largestDimension =
        Math.max(
          container.clientWidth,
          container.clientHeight
        );

      if (
        !Number.isFinite(
          largestDimension
        ) ||
        largestDimension <= 0
      ) {
        return;
      }

      const nextSize =
        cellSize *
        Math.max(
          0.5,
          largestDimension / 1920
        ) *
        1.35 *
        (
          Math.max(
            dpr[0],
            Math.min(
              window.devicePixelRatio || 1,
              dpr[1]
            )
          ) / 2
        );

      if (
        Number.isFinite(nextSize)
      ) {
        setResponsiveCellSize(
          nextSize
        );
      }
    };

    updateCellSize();

    const observer =
      new ResizeObserver(
        updateCellSize
      );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [cellSize, dpr]);

  const actualFrameloop =
    frameloop !== "always"
      ? frameloop
      : (
          isVisible
            ? "always"
            : "never"
        );

  const scaledCellSize =
    Math.max(
      1,
      responsiveCellSize * 1.6
    );

  return (
    <div
      ref={containerRef}
      className={
        `relative size-full ${className ?? ""}`
      }
    >
      <Canvas
        frameloop={actualFrameloop}
        className="opacity-100"
        dpr={dpr}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference:
            "low-power"
        }}
        camera={{
          position: [0,0,5],
          fov: 50
        }}
        style={{
          background:
            "transparent"
        }}
      >
        <DemandFrameInvalidator
          frameloop={frameloop}
        />

        <HoverImagePlane
          imageSrc={imageSrc}
          alignX={alignX}
          alignY={alignY}
          fit={actualFit}
          enableHover={enableHover}
          hoverMode={hoverMode}
          hoverIntensity={
            actualHoverIntensity
          }
          mouseX={mouseX}
          mouseY={mouseY}
          isHovering={
            isHovering
          }
        />

        <AsciiEffectPass
          characters={characters}
          fontSize={fontSize}
          cellSize={scaledCellSize}
          color={color}
          invert={invert}

          progress={progress}
          colorProgress={
            colorProgress
          }

          randomness={
            randomness
          }

          revealDirection={
            revealDirection
          }

          revealEnd={
            revealEnd
          }

          effectRef={
            effectRef
          }

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

          mouseX={mouseX}
          mouseY={mouseY}
          mouseRef={mouseRef}

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

          colorDark={colorDark}

          depthDetailMin={
            depthDetailMin
          }

          clickPoint={
            clickPoint
          }

          clickRadialInvert={
            clickRadialInvert
          }

          impactProgress={
            impactProgress
          }

          revealOrigin={
            revealOrigin
          }
        />
      </Canvas>
    </div>
  );
}
