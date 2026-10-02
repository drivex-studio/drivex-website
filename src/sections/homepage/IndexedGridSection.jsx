import { IndexedGridSectionClient } from '@/sections/shared/IndexedGridSectionClient'

export function IndexedGridSection({ content }) {
  if (!content?.items?.length) return null

  return (
    <section
      data-theme={content.theme}
      data-page-builder-section="indexedGridSection"
      className="bg-background pt-64 pb-64 lg:pt-128 lg:pb-128"
    >
      <IndexedGridSectionClient
        headline={content.headline}
        text={content.text}
        label={content.label}
        items={content.items}
        variant={content.variant}
      />
    </section>
  )
}
