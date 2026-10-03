import { SanityMedia } from '@/components/sanity/SanityMedia'

// Grid span/start (1-12) and gap-* classes already exist in main.css (see ColumnLayoutSectionClient).
export function GallerySection({ content }) {
  if (!content?.items?.length) return null

  return (
    <section
      data-page-builder-section="true"
      data-theme={content.theme}
      className="bg-background py-64 lg:py-96"
    >
      <div className="grid-container">
        <div className="grid-layout">
          <div className="grid-span-12">
            <div className={`grid grid-cols-12 gap-${content.gap ?? 16}`}>
              {content.items.map((item) => {
                if (!item.media) return null
                // Studio stores aspectRatio 0 for "auto"; SanityImage uses `??`, so 0 would
                // be treated as a real ratio. Turn it into undefined.
                const media = { ...item.media, aspectRatio: item.media.aspectRatio || undefined }

                return (
                  <div
                    key={item._key}
                    className={[
                      'grid-span-12',
                      item.columnSpan ? `lg:grid-span-${item.columnSpan}` : '',
                      item.columnStart ? `lg:grid-start-${item.columnStart}` : '',
                    ].join(' ')}
                  >
                    <div className="flex h-full flex-col gap-8">
                      <div className="min-h-0 flex-1">
                        <SanityMedia media={media} className="h-full w-full object-cover" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
