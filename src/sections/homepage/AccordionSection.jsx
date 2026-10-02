import { AccordionClient } from '@/sections/shared/AccordionClient'
import { ScrollAnimatedHeadline } from '@/components/animations/ScrollAnimatedHeadline'

export function AccordionSection({ content }) {
  if (!content?.items?.length) return null

  return (
    <section
      data-page-builder-section="accordionSection"
      data-theme={content.theme}
      className="bg-background py-64 lg:py-96"
    >
      <div className="grid-container">
        <div className="grid-layout">
          <div className="grid-span-12 lg:grid-span-4 sticky top-0 z-10 -mx-(--site-grid-margin) bg-background px-(--site-grid-margin) pt-header pb-32 lg:top-header lg:z-auto lg:mx-0 lg:bg-transparent lg:px-0 lg:pt-32">
            <ScrollAnimatedHeadline headline={content.sectionHeadline} />
          </div>
          <div className="grid-span-12 lg:grid-span-6 lg:grid-start-6 mt-48 lg:mt-0">
            <AccordionClient items={content.items} />
          </div>
        </div>
      </div>
    </section>
  )
}
