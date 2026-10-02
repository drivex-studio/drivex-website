// computeImageContentBounds.js

import { getProxyImageUrl } from "@/components/ascii/utils/proxyImage";

/**
 * fI -> computeImageContentBounds
 */
export async function computeImageContentBounds(
  imageSrc,
  revealOrigin = {
    x: 0.5,
    y: 0.5
  }
) {
  return new Promise((resolve) => {
    const image = new Image();

    image.crossOrigin = "anonymous";

    image.onload = () => {
      try {
        const canvas =
          document.createElement("canvas");

        const context =
          canvas.getContext("2d", {
            willReadFrequently: true
          });

        if (!context) {
          console.warn(
            "[ASCII] Could not get canvas context, using default bounds"
          );

          resolve(1);
          return;
        }

        const scale =
          Math.min(
            200 / image.width,
            200 / image.height,
            1
          );

        const width =
          Math.floor(
            image.width * scale
          );

        const height =
          Math.floor(
            image.height * scale
          );

        canvas.width = width;
        canvas.height = height;

        context.drawImage(
          image,
          0,
          0,
          width,
          height
        );

        const pixels =
          context.getImageData(
            0,
            0,
            width,
            height
          ).data;

        const originX =
          revealOrigin.x * width;

        const originY =
          (1 - revealOrigin.y) *
          height;

        const maxPossibleDistance =
          Math.max(
            Math.hypot(
              originX,
              originY
            ),
            Math.hypot(
              width - originX,
              originY
            ),
            Math.hypot(
              originX,
              height - originY
            ),
            Math.hypot(
              width - originX,
              height - originY
            )
          );

        let furthestContentPixel = 0;

        for (
          let y = 0;
          y < height;
          y++
        ) {
          for (
            let x = 0;
            x < width;
            x++
          ) {
            const index =
              (y * width + x) * 4;

            const r = pixels[index];
            const g = pixels[index + 1];
            const b = pixels[index + 2];
            const a =
              pixels[index + 3];

            const visible =
              a > 10 &&
              (
                r > 15 ||
                g > 15 ||
                b > 15
              );

            if (!visible) {
              continue;
            }

            const distance =
              Math.hypot(
                x - originX,
                y - originY
              );

            furthestContentPixel =
              Math.max(
                furthestContentPixel,
                distance
              );
          }
        }

        const normalizedBounds =
          Math.min(
            (
              furthestContentPixel /
              maxPossibleDistance
            ) * 1.05,
            1
          );

        resolve(
          normalizedBounds
        );
      } catch (error) {
        console.warn(
          "[ASCII] Error computing content bounds:",
          error
        );

        resolve(1);
      }
    };

    image.onerror = () => {
      console.warn(
        "[ASCII] Could not load image for bounds computation"
      );

      resolve(1);
    };

    image.src =
      getProxyImageUrl(imageSrc);
  });
}
