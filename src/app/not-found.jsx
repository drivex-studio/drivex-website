import { client } from '@/libs/sanity/client'
import { urlFor } from '@/components/sanity/Image'
import NotFoundPage from '@/features/notfond/NotFoundPage'

const NOT_FOUND_QUERY = `*[_type == "notFound"][0]{
  headline,
  description,
  asciiImage,
  asciiMobileImage,
  asciiDepthMap,
  asciiColor,
  asciiColorDark,
  asciiCellSize,
  asciiParallaxIntensity,
  asciiRevealOriginX,
  asciiRevealOriginY
}`

export default async function NotFound() {
  const data = await client.fetch(NOT_FOUND_QUERY)
  const props = data
    ? {
        headline: data.headline,
        description: data.description,
        imageSrc: data.asciiImage ? urlFor(data.asciiImage).url() : undefined,
        mobileImageSrc: data.asciiMobileImage ? urlFor(data.asciiMobileImage).url() : undefined,
        depthMapSrc: data.asciiDepthMap ? urlFor(data.asciiDepthMap).url() : undefined,
        color: data.asciiColor,
        colorDark: data.asciiColorDark,
        cellSize: data.asciiCellSize,
        parallaxIntensity: data.asciiParallaxIntensity,
        revealOriginX: data.asciiRevealOriginX,
        revealOriginY: data.asciiRevealOriginY
      }
    : {}

  return <NotFoundPage {...props} />
}
