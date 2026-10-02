import { cx } from '@/libs/utils/className'
import { HeroSectionContent } from '@/sections/contents/HeroSectionContent'
import { HeroAsciiArt } from '@/sections/shared/HeroAsciiArt'
import { HeroScrollPush } from '@/sections/shared/HeroScrollPush'

const PADDING_TOP = { none: 'pt-0' }
const PADDING_BOTTOM = { none: 'pb-0' }

export function HeroSection({ content }) {
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
  } = content

  const asciiSrc = asciiImageUrl ?? asciiOriginalImageUrl
  const showAscii = variant === 'ascii' && Boolean(asciiSrc)

  return (
    <section
      data-theme={theme}
      data-page-builder-section="heroSection"
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