import { cx } from '@/libs/utils/className'
import { SanityMedia } from '@/components/sanity/SanityMedia'
import { InnerParallax } from '@/components/animations/InnerParallax'

// Same scale as TextSection.
const PADDING_TOP = {
  none: 'pt-0',
  sm: 'pt-16 lg:pt-32',
  md: 'pt-32 lg:pt-64',
  lg: 'pt-48 lg:pt-96',
  xl: 'pt-64 lg:pt-128',
  '2xl': 'pt-80 lg:pt-160',
  '3xl': 'pt-96 lg:pt-192',
}

const PADDING_BOTTOM = {
  none: 'pb-0',
  sm: 'pb-16 lg:pb-32',
  md: 'pb-32 lg:pb-64',
  lg: 'pb-48 lg:pb-96',
  xl: 'pb-64 lg:pb-128',
  '2xl': 'pb-80 lg:pb-160',
  '3xl': 'pb-96 lg:pb-192',
}

export function MediaSection({ content }) {
  const media = content?.appMedia
  if (!media) return null

  // The ndjson stores videoOptions (autoPlay/loop/muted/controls) next to the media;
  // SanityMedia reads videoOptions itself for 'video' and sets sane defaults for externalVideo.
  const aspectRatio = media.aspectRatio || undefined

  return (
    <div
      data-theme={content.theme}
      data-page-builder-section="mediaSection"
      className={cx(
        'bg-background',
        PADDING_TOP[content.paddingTop] ?? PADDING_TOP.none,
        PADDING_BOTTOM[content.paddingBottom] ?? PADDING_BOTTOM.none
      )}
    >
      <InnerParallax overflow="60 lg:120" style={{ aspectRatio }}>
        <SanityMedia
          media={{ ...media, aspectRatio }}
          className="size-full"
          imageProps={{ sizes: '100vw' }}
        />
      </InnerParallax>
    </div>
  )
}
