import { AnimatedListSectionClient } from '@/sections/shared/AnimatedListSectionClient'

export function AnimatedListSection({ content }) {
  if (!content?.items?.length) return null

  return (
    <section
      data-theme={content.theme}
      data-page-builder-section="animatedListSection"
      className="bg-background pt-64 pb-64 lg:pt-128 lg:pb-128"
    >
      <AnimatedListSectionClient
        headline={content.headline}
        label={content.label}
        text={content.text}
        items={content.items}
        variant={content.variant}
        headlineDisplay={content.headlineDisplay}
        fixedMedia={content.fixedMedia}
      />
    </section>
  )
}
