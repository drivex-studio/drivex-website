import { cx } from '@/libs/utils/className'
import { HeroSectionContent } from '@/sections/contents/HeroSectionContent'
import { HeroAsciiArt } from '@/sections/shared/HeroAsciiArt'
import { HeroParallax } from '@/sections/shared/HeroParallax'
import { HeroScrollPush } from '@/sections/shared/HeroScrollPush'
import { HeroTextOnly } from '@/sections/shared/HeroTextOnly'

const PADDING_TOP = { none: 'pt-0' }
const PADDING_BOTTOM = { none: 'pb-0' }

const TEXT_ONLY_PT = {
  none: 'pt-0',
  sm: 'pt-24 lg:pt-48',
  md: 'pt-32 lg:pt-64',
  lg: 'pt-48 lg:pt-96',
  xl: 'pt-64 lg:pt-128',
  '2xl': 'pt-80 lg:pt-160',
  '3xl': 'pt-96 lg:pt-192',
}

const TEXT_ONLY_PB = {
  none: 'pb-0',
  sm: 'pb-24 lg:pb-48',
  md: 'pb-32 lg:pb-64',
  lg: 'pb-48 lg:pb-96',
  xl: 'pb-64 lg:pb-128',
  '2xl': 'pb-80 lg:pb-160',
  '3xl': 'pb-96 lg:pb-192',
}

export function HeroSection({ content, settings }) {
  if (!content) return null

  const {
    variant,
    theme,
    headline,
    headlineDisplay,
    subtext,
    ctas,
    trustedBy,
    paddingTop,
    paddingBottom,
    asciiImageUrl,
    asciiOriginalImageUrl,
    mobileImageUrl,
    depthMapUrl,
    asciiCellSize,
    asciiColor,
    asciiColorDark,
    asciiRevealOriginX,
    asciiRevealOriginY,
    parallaxIntensity,
    parallaxMedia,
    mobileImage,
    scrollText,
    showScrollText,
    useWatermark,
  } = content

  if (variant === 'textOnly') {
    return (
      <section
        data-theme={theme}
        data-page-builder-section="heroSection"
        data-selector={settings?.customSelector}
        className={cx(
          'relative bg-background',
          TEXT_ONLY_PT[paddingTop] ?? TEXT_ONLY_PT.xl,
          TEXT_ONLY_PB[paddingBottom] ?? TEXT_ONLY_PB.sm
        )}
      >
        <HeroTextOnly
          headline={headline?.text}
          headlineLevel={headline?.level}
          headlineDisplay={headlineDisplay}
          subtext={subtext}
        />
      </section>
    )
  }

  // Parallax hero: full-bleed image/video that scrolls slower than the page, optional
  // big scroll-in text ("BodyArmor") along the bottom. Same markup the reference renders.
  if (variant === 'parallax') {
    if (!parallaxMedia) return null

    return (
      <section
        data-theme={theme}
        data-page-builder-section="heroSection"
        data-selector={settings?.customSelector}
        className={cx(
          'relative overflow-hidden bg-background',
          PADDING_TOP[paddingTop] ?? PADDING_TOP.none,
          PADDING_BOTTOM[paddingBottom] ?? PADDING_BOTTOM.none
        )}
      >
        <HeroParallax
          media={parallaxMedia}
          mobileImage={mobileImage ?? undefined}
          headline={headline?.text}
          headlineLevel={headline?.level}
          headlineDisplay={headlineDisplay}
          subtext={subtext}
          ctas={ctas}
          scrollText={showScrollText === false ? undefined : scrollText ?? undefined}
          useWatermark={useWatermark ?? undefined}
        />
      </section>
    )
  }

  const asciiSrc = asciiImageUrl ?? asciiOriginalImageUrl
  const showAscii = variant === 'ascii' && Boolean(asciiSrc)

  return (
    <section
      data-theme={theme}
      data-page-builder-section="heroSection"
      data-selector={settings?.customSelector}
      className={cx(
        'relative min-h-svh overflow-hidden bg-background',
        PADDING_TOP[paddingTop] ?? PADDING_TOP.none,
        PADDING_BOTTOM[paddingBottom] ?? PADDING_BOTTOM.none
      )}
    >
      <HeroScrollPush className="grid-container relative min-h-svh pt-52">
        <div className="grid-layout min-h-[calc(100svh-52px)]">
          {/* Left column: headline, subtext, CTAs, trusted-by logos */}
          <HeroSectionContent
            className="grid-span-12 lg:grid-span-7 pointer-events-none relative z-10 flex grid-rows-[1fr_auto] flex-col items-start justify-between pb-16 lg:pb-32"
            headline={headline?.text}
            headlineLevel={headline?.level}
            headlineDisplay={headlineDisplay}
            subtext={subtext}
            ctas={ctas}
            trustedBy={trustedBy}
          />

          {/* Right column: ASCII / three.js canvas */}
          {showAscii && (
            <div className="lg:grid-span-5 absolute top-[35%] right-0 bottom-0 w-9/10 items-center justify-center overflow-hidden lg:relative lg:inset-auto lg:flex lg:w-auto">
              {/* HeroAsciiArt → AsciiTypewriter → AsciiCanvas already render:
                  absolute inset-0 > size-full cursor-pointer > relative size-full > canvas */}
              <HeroAsciiArt
                imageSrc={asciiSrc}
                mobileImageSrc={mobileImageUrl ?? undefined}
                depthMapSrc={depthMapUrl ?? undefined}
                cellSize={asciiCellSize ?? undefined}
                color={asciiColor ?? undefined}
                colorDark={asciiColorDark ?? undefined}
                revealOriginX={asciiRevealOriginX ?? undefined}
                revealOriginY={asciiRevealOriginY ?? undefined}
                parallaxIntensity={parallaxIntensity ?? undefined}
              />
            </div>
          )}
        </div>
      </HeroScrollPush>
    </section>
  )
}