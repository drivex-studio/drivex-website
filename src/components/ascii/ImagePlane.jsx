'use client'
import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { TextureLoader } from "three";

import { getProxyImageUrl } from "@/components/ascii/utils/proxyImage";

export function ImagePlane({
  imageSrc,
  onLoad,

  alignX = "center",
  alignY = "bottom",

  fit = "cover",

  stretchX = 1,
  stretchY = 1,

  rotationY = 0,
  rotationX = 0
}) {
  const [texture, setTexture] = useState(null);

  const { viewport } = useThree();

  const meshRef = useRef(null);

  useEffect(() => {
    const loader = new TextureLoader();

    loader.setCrossOrigin("anonymous");

    loader.load(
      getProxyImageUrl(imageSrc),
      (texture) => {
        setTexture(texture);
        onLoad?.();
      },
      undefined,
      (error) => {
        console.error(
          "Failed to load texture:",
          error
        );
      }
    );
  }, [imageSrc, onLoad]);

  if (!texture) {
    return null;
  }

  const image = texture.image;

  const imageAspect =
    image.width / image.height;

  const viewportAspect =
    viewport.width / viewport.height;

  let planeWidth;
  let planeHeight;

  if (
    fit === "contain" &&
    imageAspect > viewportAspect
  ) {
    planeWidth = viewport.width;
    planeHeight =
      viewport.width / imageAspect;
  } else {
    planeHeight = viewport.height;
    planeWidth =
      viewport.height * imageAspect;
  }

  const width =
    planeWidth * stretchX;

  const height =
    planeHeight * stretchY;

  let offsetX = 0;

  const overflowX =
    width - viewport.width;

  if (alignX === "left") {
    offsetX = overflowX / 2;
  } else if (alignX === "right") {
    offsetX = -overflowX / 2;
  }

  let offsetY = 0;

  const overflowY =
    height - viewport.height;

  if (alignY === "bottom") {
    offsetY = overflowY / 2;
  } else if (alignY === "top") {
    offsetY = -overflowY / 2;
  }

  return (
    <mesh
      ref={meshRef}
      position={[offsetX, offsetY, 0]}
      rotation={[
        rotationX,
        rotationY,
        0
      ]}
    >
      <planeGeometry
        args={[width, height]}
      />

      <meshBasicMaterial
        map={texture}
        transparent
        alphaTest={0.01}
      />
    </mesh>
  );
}
