// MODULE: 409918

// NOTE: org-module id: 843476 -- react/jsx-runtime, no import needed (JSX syntax)
// NOTE: org-module id: 500932 -- react/compiler-runtime, no import needed (compiler cache removed)
// NOTE: org-module id: 181028
import { HIGH_RES_SOURCE_WIDTHS } from '@/libs/constants/config'
import { ExternalVideo } from '@/components/sanity/ExternalVideo'
// NOTE: org-module id: 919848
import { SanityImage } from '@/components/sanity/SanityImage'
// NOTE: org-module id: 700481
import { SanityVideo } from '@/components/sanity/SanityVideo'

export function SanityMedia(props) {
  const {
    media,
    loop,
    autoPlay,
    imageProps = {},
    videoProps = {},
    externalVideoProps = {},
    ...rest
  } = props

  if (!media) return null

  const {
    type,
    image,
    video,
    externalVideoUrl,
    videoOptions,
    highResolution,
    aspectRatio,
  } = media

  const containerProps = {
    aspectRatio,
    ...rest,
  }

  switch (type) {
    case 'image': {
      const builderOptions = highResolution
        ? { sourceWidths: HIGH_RES_SOURCE_WIDTHS }
        : undefined

      return (
        <SanityImage
          image={image}
          builderOptions={builderOptions}
          {...containerProps}
          {...imageProps}
        />
      )
    }
    case 'video': {
      return (
        <SanityVideo
          video={video}
          loop={loop}
          autoPlay={autoPlay}
          {...containerProps}
          {...videoOptions}
          {...videoProps}
        />
      )
    }
    case 'externalVideo': {
      const isLoop = loop ?? true
      const isAutoPlay = autoPlay === true || autoPlay === 'in-view' || autoPlay === undefined

      return (
        <ExternalVideo
          src={externalVideoUrl}
          loop={isLoop}
          autoPlay={isAutoPlay}
          muted={true}
          controls={false}
          {...containerProps}
          {...externalVideoProps}
        />
      )
    }
    default:
      console.warn(`Unsupported media type: ${type}`)
      return null
  }
}