import { cx } from '@/libs/utils/className'
import { TabsClient } from '@/sections/shared/TabsClient'

// Same scale as TextSection. "xl" (pt-64 lg:pt-128) is confirmed from the live Tabs page.
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

export function TabsSection({ content }) {
  // TabsClient calls items.map / items[0], so never render it without items.
  if (!content?.items?.length) return null

  return (
    <section
      data-page-builder-section="tabsSection"
      data-theme={content.theme}
      className={cx(
        PADDING_TOP[content.paddingTop] ?? PADDING_TOP.xl,
        PADDING_BOTTOM[content.paddingBottom] ?? PADDING_BOTTOM.xl,
        'bg-background'
      )}
    >
      <div className="grid-container flex items-center lg:min-h-svh">
        <TabsClient items={content.items} sectionHeadline={content.sectionHeadline} />
      </div>
    </section>
  )
}
