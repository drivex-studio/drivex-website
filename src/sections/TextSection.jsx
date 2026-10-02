import { cx } from '@/libs/utils/className'
import { SanityRichText } from '@/components/sanity/SanityRichText'

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

export function TextSection({ content, settings }) {
  if (!content?.appRichText?.length) return null

  return (
    <section
      id={settings?.sectionId}
      data-theme={content.theme}
      data-page-builder-section="textSection"
      data-selector={settings?.customSelector}
      className={cx(
        'bg-background',
        PADDING_TOP[content.paddingTop] ?? PADDING_TOP['2xl'],
        PADDING_BOTTOM[content.paddingBottom] ?? PADDING_BOTTOM['2xl']
      )}
    >
      <div className="grid-container">
        <div className="grid-layout">
          <div className="grid-span-12">
            <SanityRichText value={content.appRichText} />
          </div>
        </div>
      </div>
    </section>
  )
}
