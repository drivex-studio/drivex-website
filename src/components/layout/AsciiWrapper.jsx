import React from "react";
import dynamic from "next/dynamic";

const AsciiTypewriter = dynamic(
  () => import("@/components/ascii/AsciiTypewriter").then((mod) => mod.AsciiTypewriter),
  { ssr: false }
);

export function AsciiWrapper(props) {
  const {
    imageSrc,
    color,
    colorDark,
    cellSize,
    alignX = "center",
    externalProgress,
    externalColorProgress,
    depthMapSrc,
    parallaxIntensity = 0.02,
    mouseRef,
    isHovering = false,
    isTouch = false,
    mobileFit,
    revealOriginX,
    revealOriginY,
    frameloop,
    dpr
  } = props;

  const hasExternalProgress = externalProgress !== undefined;
  const hasDepthMap = !!depthMapSrc;
  const enableDepthParallax = !isTouch && hasDepthMap;
  const enableGooeyReveal = !isTouch && hasDepthMap;

  const revealOriginProp = (revealOriginX != null && revealOriginY != null) 
    ? { revealOrigin: { x: revealOriginX, y: revealOriginY } } 
    : undefined;
    
  const frameloopProp = frameloop !== undefined ? { frameloop } : undefined;
  const dprProp = dpr !== undefined ? { dpr } : undefined;

  return (
    <AsciiTypewriter
      imageSrc={imageSrc}
      color={color}
      colorDark={colorDark}
      cellSize={cellSize}
      alignX={alignX}
      alignY="center"
      fit="contain"
      mobileFit={mobileFit}
      className="size-full"
      externalProgress={hasExternalProgress ? externalProgress : undefined}
      externalColorProgress={hasExternalProgress ? externalColorProgress : undefined}
      disableInternalAnimation={hasExternalProgress}
      enableDepthParallax={enableDepthParallax}
      depthMapSrc={depthMapSrc}
      parallaxIntensity={parallaxIntensity}
      mouseRef={mouseRef}
      enableGooeyReveal={enableGooeyReveal}
      isHovering={isHovering}
      gooeyRadius={0.035}
      gooeySoftness={0.04}
      gooeyNoiseIntensity={0.02}
      {...revealOriginProp}
      {...frameloopProp}
      {...dprProp}
      skipContentBounds={true}
    />
  );
}
