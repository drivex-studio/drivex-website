'use client'

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { TextureLoader } from "three";

import { AsciiEffect } from "@/components/ascii/shaders/AsciiEffect";
import { getProxyImageUrl } from "@/components/ascii/utils/proxyImage";



export function AsciiEffectPass({
  characters = defaultChars,
  fontSize = 54,
  cellSize = 20,
  color = "#ff6b4a",
  invert = false,
  alphaThreshold = 0.1,
  respectAlpha = true,
  progress = 1,
  colorProgress = 1,
  randomness = 0.3,
  revealDirection = 1,
  revealEnd = 0.85,

  enableGooeyReveal = false,
  gooeyRadius = 0.15,
  gooeySoftness = 0.08,
  gooeyNoiseIntensity = 0.03,

  enableDepthParallax = false,
  parallaxIntensity = 0.02,
  depthMapSrc,

  colorDark,
  depthDetailMin,

  effectRef,

  mouseX = -1,
  mouseY = -1,
  mouseRef,

  isHovering = false,

  clickPoint,
  clickRadialInvert,
  impactProgress,

  revealOrigin = {
    x: 0.5,
    y: 0.5
  }
}) {
  const gooeyIntensity = useRef(0);

  const parallax = useRef({
    x: 0,
    y: 0
  });

  const hoverState = useRef(false);
  const scrambleCounter = useRef(0);

  const effect = useMemo(
    () =>
      new AsciiEffect({
        characters,
        fontSize,
        cellSize,
        color,
        invert,
        alphaThreshold,
        respectAlpha,
        progress,
        colorProgress,
        randomness,
        revealDirection,
        revealEnd,
        enableGooeyReveal,
        gooeyRadius,
        gooeySoftness,
        gooeyNoiseIntensity,
        enableDepthParallax,
        parallaxIntensity,
        colorDark,
        depthDetailMin,
        revealOrigin
      }),
    [
      characters,
      fontSize,
      cellSize,
      color,
      invert,
      alphaThreshold,
      respectAlpha,
      randomness,
      revealDirection,
      revealEnd,
      enableGooeyReveal,
      gooeyRadius,
      gooeySoftness,
      gooeyNoiseIntensity,
      enableDepthParallax,
      parallaxIntensity,
      colorDark,
      depthDetailMin
    ]
  );

  useEffect(() => {
    if (!depthMapSrc || !enableDepthParallax) {
      return;
    }

    const loader = new TextureLoader();

    loader.load(getProxyImageUrl(depthMapSrc), (texture) => {
      effect.setDepthMap(texture);
      effect.setEnableDepthParallax(true);
    });
  }, [depthMapSrc, enableDepthParallax, effect]);

  useFrame((state) => {
    const mx = mouseRef?.current?.x ?? mouseX;
    const my = mouseRef?.current?.y ?? mouseY;

    effect.setProgress(progress);
    effect.setColorProgress(colorProgress);

    effect.setClickPoint(
      clickPoint?.x ?? -1,
      clickPoint?.y ?? -1
    );

    effect.setRadialInvert(+!!clickRadialInvert);
    effect.setImpactProgress(impactProgress ?? 0);

    effect.setRevealOrigin(
      revealOrigin.x,
      revealOrigin.y
    );

    // depth parallax
    if (enableDepthParallax) {
      const targetX = isHovering
        ? -mx * parallaxIntensity
        : 0;

      const targetY = isHovering
        ? -my * parallaxIntensity * 0.5
        : 0;

      const lerp = isHovering ? 0.08 : 0.05;

      parallax.current.x +=
        (targetX - parallax.current.x) * lerp;

      parallax.current.y +=
        (targetY - parallax.current.y) * lerp;

      effect.setParallaxOffset(
        parallax.current.x,
        parallax.current.y
      );
    }

    // gooey reveal
    if (enableGooeyReveal) {
      effect.setMousePosition(
        (mx + 1) / 2,
        (my + 1) / 2
      );

      if (
        isHovering &&
        !hoverState.current
      ) {
        scrambleCounter.current += 1;
        effect.setScrambleSeed(
          scrambleCounter.current
        );
      }

      hoverState.current = isHovering;

      const target = Number(isHovering);

      gooeyIntensity.current +=
        (target - gooeyIntensity.current) *
        (isHovering ? 0.08 : 0.06);

      effect.setGooeyIntensity(
        gooeyIntensity.current
      );
    }
  });

  useEffect(() => {
    if (effectRef) {
      effectRef.current = effect;
    }

    return () => {
      if (effectRef) {
        effectRef.current = null;
      }
    };
  }, [effect, effectRef]);

return (
  <EffectComposer multisampling={0}>
    <primitive object={effect} />
  </EffectComposer>
);

}
